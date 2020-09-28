import { Component, OnInit } from '@angular/core';
import { AffiliationRequest } from '../classes/affiliation-request';
import { FollowRequest } from '../classes/follow-request';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
})
export class TopNavbarComponent implements OnInit {
  loggedInUserId: number;
  followRequests: FollowRequest[];
  affiliationRequests: AffiliationRequest[];

  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.userService
      .getFollowRequestReceived(this.loggedInUserId)
      .subscribe((followRequests) => {
        this.followRequests = followRequests;
      });
    this.userService.getAffiliationRequestReceived(this.loggedInUserId)
      .subscribe((affiliationRequests) => {
        this.affiliationRequests = affiliationRequests;
      });
  }
}
