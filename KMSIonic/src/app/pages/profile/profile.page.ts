import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from "./../../services/authentication.service";
import { forkJoin } from 'rxjs';

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
  }

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        forkJoin([
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid)
        ]).subscribe((result) => {
          this.profile = result[0];
          this.loggedInUser = result[0];
          this.profile.skills = result[1];
          this.profile.sdgs = result[2];
        });
      } else {
        forkJoin([
          this.userService.getUser(this.loggedInUserId.toString()),
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid)
        ]).subscribe((result) => {
          this.loggedInUser = result[0];
          this.profile = result[1];
          this.profile.skills = result[2];
          this.profile.sdgs = result[3];
        });
      }
    });
  }
}
