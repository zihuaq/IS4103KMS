import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from "./../../services/authentication.service"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: User;
  loggedInUser: User;
  loggedInUserId: number;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        this.userService.getUser(profileid).subscribe((data: User) => {
          this.profile = data;
          this.loggedInUser = data;
          console.log(data);
        });
      } else {
        this.userService
          .getUser(this.loggedInUserId.toString())
          .subscribe((data: User) => {
            console.log(data)
            this.loggedInUser = data;
          });

        this.userService.getUser(profileid).subscribe((data: User) => {
          console.log(data)
          this.profile = data;
        });
      }
    });
  }
}
