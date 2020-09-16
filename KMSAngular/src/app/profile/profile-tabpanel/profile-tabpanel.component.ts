import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-profile-tabpanel',
  templateUrl: './profile-tabpanel.component.html',
  styleUrls: ['./profile-tabpanel.component.css'],
})
export class ProfileTabpanelComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  @Output() userChanged = new EventEmitter<User>();

  constructor() {}

  ngOnInit(): void {
    console.log(this.profile.userId);
    console.log(this.loggedInUser.userId);
  }

  handleProfileChanged(event) {
    this.profile = event;
    this.profileChanged.emit(this.profile);
  }

  handleUserChanged(event) {
    this.loggedInUser = event;
    this.userChanged.emit(this.loggedInUser);
  }
}
