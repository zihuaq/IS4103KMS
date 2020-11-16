import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { ModalController, IonSearchbar } from '@ionic/angular';

import { User } from '../../../classes/user';
import { UserType } from "../../../enum/user-type.enum"
import { UserService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  @ViewChild("searchBar") searchBar: IonSearchbar
  currentUser: User;
  allUsers: User[];
  filteredUsers: User[];
  hasLoad = false;

  constructor(public modalCtrl: ModalController,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,) { 
    this.allUsers = [];
    this.filteredUsers = [];
    this.currentUser = new User();
  }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUser = user;
      }
    );

    this.userService.getAllUsers().subscribe(
      response => {
        this.allUsers = response;
        this.filteredUsers = this.allUsers;
        this.hasLoad = true;
      }
    )
  }

  viewChat(user: User) {
    this.router.navigate(['messages/' + user.userId + "_" + user.firstName + " " + user.lastName]);
    this.modalCtrl.dismiss({
      'dismissed': true
    });
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
  }

}
