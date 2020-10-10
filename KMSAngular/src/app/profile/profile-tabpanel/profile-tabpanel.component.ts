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
  @Input() shared: boolean;
  @Output() profileChanged = new EventEmitter<User>();
  @Output() userChanged = new EventEmitter<User>();

  constructor() {}

  ngOnInit(): void {}

  handleProfileChanged(event) {
    this.profile = event;
    this.profileChanged.emit(this.profile);
  }

  handleUserChanged(event) {
    this.loggedInUser = event;
    this.userChanged.emit(this.loggedInUser);
    this.profile = event;
    this.profileChanged.emit(this.profile);
  }
}
