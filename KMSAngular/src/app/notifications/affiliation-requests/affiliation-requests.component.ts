import { Component, OnInit } from '@angular/core';
import { AffiliationRequest } from 'src/app/classes/affiliation-request';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-affiliation-requests',
  templateUrl: './affiliation-requests.component.html',
  styleUrls: ['./affiliation-requests.component.css']
})
export class AffiliationRequestsComponent implements OnInit {
  loggedInUserId: number;
  affiliationRequests: AffiliationRequest[];

  constructor(private sessionService: SessionService, private userService: UserService) {
    this.affiliationRequests = [];
   }

  ngOnInit(): void {
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.userService
      .getAffiliationRequestReceived(this.loggedInUserId)
      .subscribe((affiliationRequests) => {
        this.affiliationRequests = affiliationRequests;
      });
  }

  acceptAffiliation(toUserid: number, fromUserid: number) {
    this.userService.acceptAffiliation(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getAffiliationRequestReceived(this.loggedInUserId)
        .subscribe((affiliationRequests) => {
          this.affiliationRequests = affiliationRequests;
        });
    });
  }

  rejectAffiliation(toUserid: number, fromUserid: number) {
    this.userService.rejectAffiliation(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getAffiliationRequestReceived(this.loggedInUserId)
        .subscribe((affiliationRequests) => {
          this.affiliationRequests = affiliationRequests;
        });
    });
  }
}
