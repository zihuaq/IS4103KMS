import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AccountPrivacySettingEnum } from 'src/app/classes/privacy-settings.enum';
import { review } from 'src/app/classes/review';
import { UserType } from 'src/app/classes/user-type.enum';
import { UserService } from 'src/app/user.service';
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
  AccountPrivacySettingEnum = AccountPrivacySettingEnum;
  UserType = UserType;
  loggedInUserIsFollowerOfProfile: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getFollowing(this.loggedInUser.userId).subscribe((data) =>
      this.loggedInUserIsFollowerOfProfile =
      data.map((user) => user.userId).includes(this.profile.userId)
    );
  }

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
