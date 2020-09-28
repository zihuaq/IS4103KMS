import { UserType } from "./../../enum/user-type.enum"
import { AuthenticationService } from "./../../services/authentication.service"
import { UserService } from "./../../services/user.service"
import { Component, OnInit, ViewChild } from "@angular/core"
import { Location } from "@angular/common"
import { Platform } from "@ionic/angular"
import { IonSearchbar } from "@ionic/angular"
import { forkJoin } from "rxjs"
import { User } from "../../classes/user"

@Component({
  selector: "app-search-users",
  templateUrl: "./search-users.page.html",
  styleUrls: ["./search-users.page.scss"]
})
export class SearchUsersPage implements OnInit {
  @ViewChild("searchBar") searchBar: IonSearchbar
  loggedInUserId: number
  allUsers: User[]
  filteredUsers: User[]
  preliminarySearchUser: User[]
  searchTerm: string
  constructor(
    private location: Location,
    private platform: Platform,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      forkJoin([
        this.userService.getAllUsers()
        // this.userService.getFollowing(this.loggedInUserId),
        // this.userService.getFollowRequestMade(this.loggedInUserId)
      ]).subscribe((result) => {
        this.allUsers = result[0]
        this.filteredUsers = this.allUsers
        this.preliminarySearchUser = this.filteredUsers.slice(0, 6)
        // this.loggedInUserFollowing = result[1]
        // this.loggedInUserFollowRequestMade = result[2]
      })
    })
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus()
    }, 150)
  }

  goBack() {
    this.location.back()
  }

  setFilteredItems(searchTerm) {
    console.log(searchTerm)

    if (searchTerm && searchTerm != "") {
      this.filteredUsers = this.allUsers.filter((user) => {
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
      this.filteredUsers = this.allUsers
    }
    this.preliminarySearchUser = this.filteredUsers.slice(0, 6)
  }
}
