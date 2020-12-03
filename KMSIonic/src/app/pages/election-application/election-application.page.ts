import { UserType } from './../../enum/user-type.enum';
import { AuthenticationService } from './../../services/authentication.service';
import { User } from './../../classes/user';
import { ElectionService } from './../../services/election.service';
import { Election } from './../../classes/election';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { ElectionApplication } from './../../classes/election-application';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-election-application',
  templateUrl: './election-application.page.html',
  styleUrls: ['./election-application.page.scss']
})
export class ElectionApplicationPage implements OnInit {
  electionToApply: Election;
  loggedInUser: User;
  constructor(
    private electionService: ElectionService,
    private location: Location,
    private authenticationService: AuthenticationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.electionToApply = <Election>this.location.getState();
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUser = user;
    });
  }

  clear(electionForm: NgForm) {
    electionForm.reset();
  }

  async applyForElection(electionForm: NgForm) {
    if (electionForm.valid) {
      if (
        this.electionToApply.minRepPointsRequired <=
          this.loggedInUser.reputationPoints &&
        this.loggedInUser.userType == UserType.INDIVIDUAL
      ) {
        let electionApplciation = new ElectionApplication();
        electionApplciation.reasons = electionForm.value.reason;
        electionApplciation.contributions = electionForm.value.contributions;
        electionApplciation.additionalComments = electionForm.value.notes;
        electionApplciation.applicationDate = new Date();
        electionApplciation.applicationOwner = this.loggedInUser;
        electionApplciation.election = this.electionToApply;

        this.electionService
          .createElectionApplication(electionApplciation)
          .subscribe(
            async (response) => {
              const toast = await this.toastController.create({
                message: 'Application Submitted!',
                duration: 2000
              });
              toast.present();
              electionForm.reset();
            },
            async (error) => {
              const toast = await this.toastController.create({
                message: error,
                duration: 2000
              });
              toast.present();
              electionForm.reset();
            }
          );
      } else if (this.loggedInUser.userType == UserType.ADMIN) {
        const toast = await this.toastController.create({
          message: 'Admins cannot participate in an election for new admins',
          duration: 2000
        });
        toast.present();
        electionForm.reset();
      } else if (this.loggedInUser.userType == UserType.INSTITUTE) {
        const toast = await this.toastController.create({
          message:
            'Institute Accounts cannot participate in an election for new admins',
          duration: 2000
        });
        toast.present();
        electionForm.reset();
      } else {
        const toast = await this.toastController.create({
          message: 'Insufficient Reputation Points',
          duration: 2000
        });
        toast.present();
        electionForm.reset();
      }
    }
  }
}
