import { AffiliationRequest } from "./../../classes/affiliation-request"
import { User } from "./../../classes/user"
import { FollowRequest } from "./../../classes/follow-request"
import { AuthenticationService } from "src/app/services/authentication.service"
import { UserService } from "./../../services/user.service"
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
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
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
    })
  }

  goToProfile(user: User) {
    this.router.navigate(["/profile/" + user.userId])
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
}
