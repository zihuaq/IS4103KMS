import { Component, OnInit } from '@angular/core';
import { Election } from 'src/app/classes/election';
import { ElectionApplication } from 'src/app/classes/election-application';
import { User } from 'src/app/classes/user';
import { ElectionService } from 'src/app/election.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.css']
})
export class ManageApplicationsComponent implements OnInit {

  electionApplications: ElectionApplication[];
  applicationToHandle: ElectionApplication;
  activeElection: Election;
  loggedInUser: User;

  constructor(public electionService: ElectionService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.electionService.getActiveElection().subscribe(
      (result) => {
        this.activeElection = result;
        this.updateApplications();
      }
    )
  }

  onRejectApplication() {
    this.electionService.rejectElectionApplication(this.applicationToHandle.id).subscribe(
      (result) => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Application Rejected!',
        });
        this.updateApplications();
      },
      (error) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }

  onEndorseApplication() {
    this.electionService.endorseElectionApplication(this.applicationToHandle.id, this.loggedInUser.userId).subscribe(
      (result) => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Application Endorsed!',
        });
        this.updateApplications();
      },
      (error) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }

  setApplicationToHandle(application: ElectionApplication) {
    this.applicationToHandle = application;
  }

  updateApplications() {
    this.electionService.getElectionApplicationsForElection(this.activeElection.id).subscribe(
      (result) => {
        this.electionApplications = result;
      });
  }
}
