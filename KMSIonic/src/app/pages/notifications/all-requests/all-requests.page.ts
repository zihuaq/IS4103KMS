import { AffiliationRequest } from "./../../../classes/affiliation-request"
import { User } from "./../../../classes/user"
import { FollowRequest } from "./../../../classes/follow-request"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { UserService } from "./../../../services/user.service"
import { AuthenticationService } from "./../../../services/authentication.service"
@Component({
  selector: "app-all-requests",
  templateUrl: "./all-requests.page.html",
  styleUrls: ["./all-requests.page.scss"]
})
export class AllRequestsPage implements OnInit {
  loggedInUserId: number
  followRequests: FollowRequest[]
  affiliationRequests: AffiliationRequest[]
  requestType: string //all-follow, all-affiliation
  constructor(
    private router: Router,
    private location: Location,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestType = this.activatedRoute.snapshot.url[0].path
    this.authenticationService.getCurrentUser().then((user) => {
      this.loggedInUserId = user.userId
      if (this.requestType == "all-follow") {
        this.userService
          .getFollowRequestReceived(this.loggedInUserId)
          .subscribe((followRequests) => {
            console.log(followRequests)
            this.followRequests = followRequests
          })
      } else if (this.requestType == "all-affiliation") {
        this.userService
          .getAffiliationRequestReceived(this.loggedInUserId)
          .subscribe((affiliationRequests) => {
            this.affiliationRequests = affiliationRequests
          })
      }
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
        })
    })
  }
}
