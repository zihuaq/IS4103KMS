import { UserType } from "./../../../enum/user-type.enum"
import { FollowRequest } from "./../../../classes/follow-request"
import { UserService } from "./../../../services/user.service"
import { AuthenticationService } from "./../../../services/authentication.service"
import { User } from "./../../../classes/user"
import { Component, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { forkJoin } from "rxjs"
import { IonSearchbar } from "@ionic/angular"

@Component({
  selector: "app-detailed-search",
  templateUrl: "./detailed-search.page.html",
  styleUrls: ["./detailed-search.page.scss"]
})
export class DetailedSearchPage implements OnInit {
  @ViewChild("searchBar") searchBar: IonSearchbar
  searchTerm: string
  allUsers: User[]
  filteredUsers: User[]
  loggedInUserId: number
  loggedInUserFollowing: User[]
  loggedInUserFollowRequestMade: FollowRequest[]
  constructor(
    private router: Router,
    private location: Location,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchTerm = this.activatedRoute.snapshot.paramMap.get("searchTerm")
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      forkJoin([
        this.userService.getAllUsers(),
        this.userService.getFollowing(this.loggedInUserId),
        this.userService.getFollowRequestMade(this.loggedInUserId)
      ]).subscribe((result) => {
        this.allUsers = result[0]
        this.loggedInUserFollowing = result[1]
        this.loggedInUserFollowRequestMade = result[2]
        if (this.searchTerm && this.searchTerm != "") {
          this.filteredUsers = this.allUsers.filter((user) => {
            if (
              user.userType == UserType.INDIVIDUAL ||
              user.userType == UserType.ADMIN
            ) {
              return (
                user.firstName
                  .toLowerCase()
                  .includes(this.searchTerm.toLowerCase()) ||
                user.lastName
                  .toLowerCase()
                  .includes(this.searchTerm.toLowerCase())
              )
            } else if (user.userType == UserType.INSTITUTE) {
              return user.firstName
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase())
            }
          })
        } else {
          this.filteredUsers = this.allUsers
        }
      })
    })
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.value = this.searchTerm
    }, 150)
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
    this.router.navigate(['/user-profile/' + user.userId]);
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
