import { AffiliationRequest } from "./../../classes/affiliation-request"
import { User } from "./../../classes/user"
import { FollowRequest } from "./../../classes/follow-request"
import { AuthenticationService } from "src/app/services/authentication.service"
import { UserService } from "./../../services/user.service"
import { Notification } from './../../classes/notification'
import { NotificationService } from './../../services/notification.service'
import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"]
})
export class NotificationsPage implements OnInit {
  loggedInUserId: number
  followRequests: FollowRequest[]
  preliminaryFollowRequests: FollowRequest[]
  affiliationRequests: AffiliationRequest[]
  preliminaryAffiliationRequests: AffiliationRequest[]
  notifications: Notification[]

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user) => {
      this.loggedInUserId = user.userId
      this.userService
        .getFollowRequestReceived(this.loggedInUserId)
        .subscribe((followRequests) => {
          this.followRequests = followRequests
          this.preliminaryFollowRequests = this.followRequests.slice(0, 3)
        })
      this.userService
        .getAffiliationRequestReceived(this.loggedInUserId)
        .subscribe((affiliationRequests) => {
          this.affiliationRequests = affiliationRequests
          this.preliminaryAffiliationRequests = this.affiliationRequests.slice(
            0,
            3
          )
        })

      this.notificationService.getNotification(this.loggedInUserId).subscribe(
        response => {
          this.notifications = response
        }
      )
    })
    
  }

  goToProfile(user: User) {
    this.router.navigate(['/user-profile/' + user.userId]);
  }

  acceptFollow(toUserid: number, fromUserid: number, event) {
    event.stopPropagation()
    this.userService.acceptFollow(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getFollowRequestReceived(this.loggedInUserId)
        .subscribe((followRequests) => {
          this.followRequests = followRequests
          this.preliminaryFollowRequests = this.followRequests.slice(0, 3)
        })
    })
  }

  rejectFollow(toUserid: number, fromUserid: number, event) {
    event.stopPropagation()
    this.userService.rejectFollow(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getFollowRequestReceived(this.loggedInUserId)
        .subscribe((followRequests) => {
          this.followRequests = followRequests
          this.preliminaryFollowRequests = this.followRequests.slice(0, 3)
        })
    })
  }

  acceptAffiliation(toUserid: number, fromUserid: number, event) {
    event.stopPropagation()
    this.userService.acceptAffiliation(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getAffiliationRequestReceived(this.loggedInUserId)
        .subscribe((affiliationRequests) => {
          this.affiliationRequests = affiliationRequests
          this.preliminaryAffiliationRequests = this.affiliationRequests.slice(
            0,
            3
          )
        })
    })
  }

  rejectAffiliation(toUserid: number, fromUserid: number, event) {
    event.stopPropagation()
    this.userService.rejectAffiliation(toUserid, fromUserid).subscribe(() => {
      this.userService
        .getAffiliationRequestReceived(this.loggedInUserId)
        .subscribe((affiliationRequests) => {
          this.affiliationRequests = affiliationRequests
          this.preliminaryAffiliationRequests = this.affiliationRequests.slice(
            0,
            3
          )
        })
    })
  }

  clickNotification(notification: Notification) {
    if (notification.groupId == null && notification.projectId == null) {
      this.router.navigate(['/chat']);
    }
    
    if (notification.projectId != null) {
      this.router.navigate(['project-details/' + notification.projectId + "/" + notification.tabName]);    
    }

    if (notification.groupId != null) {
      this.router.navigate(['group-details/' + notification.groupId]);
    }

    this.notificationService.deleteNotification(notification.notificationId).subscribe(
      response => {
        this.notificationService.getNotification(this.loggedInUserId).subscribe(
          response => {
            this.notifications = response
          }
        )
      }
    );
  }
}
