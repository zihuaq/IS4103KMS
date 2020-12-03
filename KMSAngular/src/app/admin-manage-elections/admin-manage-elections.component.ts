import { Component, OnInit } from '@angular/core';
import { ElectionService } from 'src/app/election.service'
import { Election } from 'src/app/classes/election';
import { User } from 'src/app/classes/user';
import { NgForm } from '@angular/forms';
import { SessionService } from '../session.service';

declare var $: any;

@Component({
  selector: 'app-admin-manage-elections',
  templateUrl: './admin-manage-elections.component.html',
  styleUrls: ['./admin-manage-elections.component.css']
})
export class AdminManageElectionsComponent implements OnInit {

  hasActiveElection: Boolean;
  activeElection: Election;
  loggedInUser: User;

  constructor(public electionService: ElectionService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.updateElection();
  }

  startElection(electionForm: NgForm) {
    if (electionForm.valid) {
      let election = new Election();
      election.name = electionForm.value.name;
      election.description = electionForm.value.description;
      election.numSlots = electionForm.value.numSlots;
      election.minRepPointsRequired = electionForm.value.minRepPoints;
      election.startDate = new Date();
      election.electionOwner = this.loggedInUser;
      election.isActive = true
      this.electionService.createElection(election).subscribe(
        (response) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Election Created!',
          });
          this.updateElection();
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      );
      $('#startElectionModalCloseBtn').click();
    }
  }

  clear(electionForm: NgForm) {
    electionForm.reset();
  }

  private updateElection(){
    this.activeElection = null;
    this.electionService.getHasActiveElection().subscribe(
      (result) => {
        this.hasActiveElection = result;
        if (this.hasActiveElection) {
          this.electionService.getActiveElection().subscribe(
            (result) => {
              this.activeElection = result;
            }
          )
        }
      }
    )
  }
}
