import { UserType } from "./../../enum/user-type.enum"
import { UserService } from "./../../services/user.service"
import { Component, OnInit, ViewChild } from "@angular/core"
import { Location } from "@angular/common"
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
  allUsers: User[]
  filteredUsers: User[]
  preliminarySearchUser: User[]
  searchTerm: string
  constructor(private location: Location, private userService: UserService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    forkJoin([this.userService.getAllUsers()]).subscribe((result) => {
      this.allUsers = result[0]
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
      this.preliminarySearchUser = this.filteredUsers.slice(0, 6)
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
