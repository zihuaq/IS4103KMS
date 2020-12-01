import { Component, OnInit } from '@angular/core';
import { AffiliationRequest } from '../classes/affiliation-request';
import { FollowRequest } from '../classes/follow-request';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { Notification } from '../classes/notification';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
})
export class TopNavbarComponent implements OnInit {
  loggedInUserId: number;
  followRequests: FollowRequest[];
  affiliationRequests: AffiliationRequest[];
  notifications: Notification[];

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { 
    this.followRequests = [];
    this.affiliationRequests = [];
    this.notifications = [];
  }

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

    this.notificationService.getNotification(this.loggedInUserId)
    .subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  clickNotification(notification: Notification) {
    if (notification.groupId == null && notification.projectId == null) {
      this.router.navigate(['/chat']);
    }
    
    if (notification.projectId != null) {
      this.router.navigate(['projectDetails/' + notification.projectId + "/" + notification.tabName]);
    }

    if (notification.groupId != null) {
      this.router.navigate(['groupDetails/' + notification.groupId + "/" + notification.tabName]);
    }

    this.notificationService.deleteNotification(notification.notificationId).subscribe();
  }

  refreshNotification() {
    this.notificationService.getNotification(this.loggedInUserId)
    .subscribe((notifications) => {
      this.notifications = notifications;
    });
  }
}
