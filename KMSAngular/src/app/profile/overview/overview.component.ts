import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  @Output() userChanged = new EventEmitter<User>();

  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.loggedInUser = this.sessionService.getCurrentUser();
    // this.userService
    //   .getUser(this.loggedInUser.userId.toString())
    //   .subscribe((data: User) => {
    //     this.loggedInUser = data;
    //     console.log(this.loggedInUser);
    //     return this.loggedInUser.following
    //       .map((user) => user.userId)
    //       .includes(this.profile.userId);
    //   });
    // console.log(this.loggedInUser.userId);
  }

  checkfollowing() {
    return this.loggedInUser.following
      .map((user) => user.userId)
      .includes(this.profile.userId);
  }

  follow() {
    this.userService
      .followUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.userService
          .getUser(this.profile.userId.toString())
          .subscribe((data: User) => {
            this.profile = data;
            this.profileChanged.emit(this.profile);
          });
        this.userService
          .getUser(this.loggedInUser.userId.toString())
          .subscribe((data: User) => {
            this.loggedInUser = data;
            this.userChanged.emit(this.loggedInUser);
          });
      });
  }

  unfollow() {
    this.userService
      .unfollowUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.userService
          .getUser(this.profile.userId.toString())
          .subscribe((data: User) => {
            this.profile = data;
            this.profileChanged.emit(this.profile);
          });
        this.userService
          .getUser(this.loggedInUser.userId.toString())
          .subscribe((data: User) => {
            this.loggedInUser = data;
            this.userChanged.emit(this.loggedInUser);
          });
      });
  }
}
