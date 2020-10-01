import { FollowRequest } from "./../../classes/follow-request"
import { AccountPrivacySettingEnum } from "./../../enum/account-privacy-setting.enum"
import { AuthenticationService } from "./../../services/authentication.service"
import { UserType } from "./../../enum/user-type.enum"
import { UserService } from "./../../services/user.service"
import { User } from "./../../classes/user"
import { Component, OnInit, ViewChild } from "@angular/core"
import { IonSearchbar } from "@ionic/angular"
import { Location } from "@angular/common"
import { forkJoin } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"

@Component({
  selector: "app-view-users",
  templateUrl: "./view-users.page.html",
  styleUrls: ["./view-users.page.scss"]
})
export class ViewUsersPage implements OnInit {
  @ViewChild("searchBar") searchBar: IonSearchbar
  users: User[]
  filteredUsers: User[]
  searchTerm: string
  query: string
  loggedInUserId: number
  loggedInUserFollowing: User[]
  loggedInUserFollowRequestMade: FollowRequest[]
  user: User
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    let userId = this.activatedRoute.snapshot.params.userid
    this.query = this.activatedRoute.snapshot.url[0]?.path
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (this.query == "followers") {
        forkJoin([
          this.userService.getFollowers(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId)
        ]).subscribe((result) => {
          this.users = result[0]
          this.filteredUsers = this.users
          this.loggedInUserFollowing = result[1]
          this.loggedInUserFollowRequestMade = result[2]
          this.user = result[3]
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
              AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(["/index"])
          }
        })
      } else if (this.query == "following") {
        forkJoin([
          this.userService.getFollowing(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId)
        ]).subscribe((result) => {
          this.users = result[0]
          this.filteredUsers = this.users
          this.loggedInUserFollowing = result[1]
          this.loggedInUserFollowRequestMade = result[2]
          this.user = result[3]
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
              AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(["/index"])
          }
        })
      } else if (this.query == "affiliated") {
        forkJoin([
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getAffiliatedUsers(parseInt(userId)),
          this.userService.getUser(userId)
        ]).subscribe((result) => {
          this.loggedInUserFollowing = result[0]
          this.loggedInUserFollowRequestMade = result[1]
          this.users = result[2]
          this.filteredUsers = this.users
          this.user = result[3]
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
              AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(["/index"])
          }
        })
      }
    })
  }

  setFilteredItems(searchTerm) {
    if (searchTerm && searchTerm != "") {
      this.filteredUsers = this.users.filter((user) => {
        if (
          user.userType == UserType.INDIVIDUAL ||
          user.userType == UserType.ADMIN
        ) {
          return (
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        } else if (user.userType == UserType.INSTITUTE) {
          return user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        }
      })
    } else {
      this.filteredUsers = this.users
    }
  }

  goBack() {
    this.location.back()
  }

  follow(userId: number, event) {
    event.stopPropagation()
    this.userService
      .followUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe((followRequest: FollowRequest) => {
        if (followRequest) {
          console.log(followRequest)
        }
        this.updateLoginUserAndUser(userId)
      })
  }

  unfollow(userId: number, event) {
    event.stopPropagation()
    this.userService
      .unfollowUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe(() => {
        this.updateLoginUserAndUser(userId)
      })
  }

  checkLoginUserHasFollowed(userId: number) {
    return this.loggedInUserFollowing
      .map((user) => user.userId)
      .includes(userId)
  }

  checkLoginUserHaveSentFollowReq(userId: number) {
    return this.loggedInUserFollowRequestMade
      .map((f) => f.to.userId)
      .includes(userId)
  }

  goToProfile(user: User) {
    this.router.navigate(["/profile/" + user.userId])
  }

  private updateLoginUserAndUser(userId: number) {
    forkJoin([
      this.userService.getFollowers(userId),
      this.userService.getFollowing(userId),
      this.userService.getFollowers(this.loggedInUserId),
      this.userService.getFollowing(this.loggedInUserId),
      this.userService.getFollowRequestMade(this.loggedInUserId)
    ]).subscribe((result) => {
      this.loggedInUserFollowing = result[3]
      this.loggedInUserFollowRequestMade = result[4]
      let userUpdated = false
      let loggedInUserUpdated = false
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followers = result[0]
          user.following = result[1]
          userUpdated = true
        }
        if (user.userId == this.loggedInUserId) {
          user.followers = result[2]
          user.following = result[3]
          loggedInUserUpdated = true
        }
        if (userUpdated && loggedInUserUpdated) {
          return
        }
      }
    })
  }
}
