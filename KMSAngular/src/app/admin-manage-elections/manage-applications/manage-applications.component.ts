import { Component, OnInit } from '@angular/core';
import { Election } from 'src/app/classes/election';
import { ElectionApplication } from 'src/app/classes/election-application';
import { User } from 'src/app/classes/user';
import { ElectionService } from 'src/app/election.service';
import { SessionService } from 'src/app/session.service';

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

  onRejectApplication(){

  }

  onEndorseApplication(){
    
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
