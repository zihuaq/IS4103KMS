import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { ModalController } from '@ionic/angular';

import { User } from '../../../classes/user';
import { UserService } from '../../../services/user.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  currentUser: User;
  users: User[];
  hasLoad = false;

  constructor(public modalCtrl: ModalController,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,) { 
    this.users = [];
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
        this.users = response;
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

}
