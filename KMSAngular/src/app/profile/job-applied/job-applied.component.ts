import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { HrpService } from 'src/app/hrp.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-job-applied',
  templateUrl: './job-applied.component.html',
  styleUrls: ['./job-applied.component.css']
})
export class JobAppliedComponent implements OnInit {

  userId : number;
  user: User;
  hrpList: HumanResourcePosting[];
  
  constructor(private sessionService: SessionService,
    private userService: UserService,
    private hrpService: HrpService,
    private activatedRoute: ActivatedRoute) { 
      this.user = new User();
      this.hrpList = [];
    }

  ngOnInit(): void {
    this.userId = this.sessionService.getCurrentUser().userId;
    this.userService.getUser(this.userId.toString()).subscribe(
      response => {
        this.user = response;
        this.hrpList = this.user.hrpApplied;
        this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
      }
    );
  }

  leaveHrp(hrpId: number) {
    this.hrpService.leaveHrp(hrpId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Left',
        });
        this.hrpList = [];
        this.userService.getUser(this.userId.toString()).subscribe(
          response => {
            this.user = response;
            this.hrpList = this.user.hrpApplied;
          }
        );
      },
      error => {
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
