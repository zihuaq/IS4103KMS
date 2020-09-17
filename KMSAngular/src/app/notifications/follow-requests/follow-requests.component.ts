import { Component, OnInit } from '@angular/core';
import { FollowRequest } from 'src/app/classes/follow-request';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-follow-requests',
  templateUrl: './follow-requests.component.html',
  styleUrls: ['./follow-requests.component.css'],
})
export class FollowRequestsComponent implements OnInit {
  loggedInUserId: number;
  followRequests: FollowRequest[];
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.userService
      .getFollowRequests(this.loggedInUserId)
      .subscribe((followRequests) => {
        this.followRequests = followRequests;
      });
  }

  acceptFollow(toUserid: number, fromUserid: number) {
    this.userService.acceptFollow(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getFollowRequests(this.loggedInUserId)
        .subscribe((followRequests) => {
          this.followRequests = followRequests;
        });
    });
  }

  rejectFollow(toUserid: number, fromUserid: number) {
    this.userService.rejectFollow(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getFollowRequests(this.loggedInUserId)
        .subscribe((followRequests) => {
          this.followRequests = followRequests;
        });
    });
  }
}
