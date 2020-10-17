import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../classes/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: User;
  loggedInUser: User;
  shared: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.shared = this.activatedRoute.snapshot.url[1]?.path == 'shared';
    let profileid = this.activatedRoute.snapshot.params.userid;
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    if (!profileid || profileid == loggedInUserId) {
      profileid = loggedInUserId;
      this.userService.getUser(profileid).subscribe((data: User) => {
        this.profile = data;
        this.loggedInUser = data;
        console.log(data);
      });
    } else {
      this.userService
        .getUser(loggedInUserId.toString())
        .subscribe((data: User) => {
          console.log(data);
          this.loggedInUser = data;
        });

      this.userService.getUser(profileid).subscribe((data: User) => {
        console.log(data);
        this.profile = data;
      });
    }
  }
}
