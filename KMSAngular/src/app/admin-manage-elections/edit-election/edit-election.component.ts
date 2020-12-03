import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Election } from 'src/app/classes/election';
import { User } from 'src/app/classes/user';
import { ElectionService } from 'src/app/election.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-edit-election',
  templateUrl: './edit-election.component.html',
  styleUrls: ['./edit-election.component.css']
})
export class EditElectionComponent implements OnInit {

  activeElection: Election;
  loggedInUser: User;

  constructor(public electionService: ElectionService, private sessionService: SessionService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.updateElection();
  }

  editElection(electionForm: NgForm) {
    if (electionForm.valid) {
      this.electionService.updateElection(this.activeElection).subscribe(
        (response) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Election Updated!',
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
    }
  }

  endElection() {
    this.electionService.endElection(this.activeElection).subscribe(
      (response) => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Election Ended!',
        });
        this.router.navigate(["/admin-manage-elections"]);
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
  }

  private updateElection() {
    this.electionService.getActiveElection().subscribe(
      (result) => {
        this.activeElection = result;
      }
    )
  }
}
