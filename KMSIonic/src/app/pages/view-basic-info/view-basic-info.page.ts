import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs';
import { UserType } from 'src/app/enum/user-type.enum';


@Component({
  selector: 'app-view-basic-info',
  templateUrl: './view-basic-info.page.html',
  styleUrls: ['./view-basic-info.page.scss'],
})
export class ViewBasicInfoPage implements OnInit {
  profile: User;
  loggedInUser: User;
  loggedInUserId: number;
  UserType = UserType;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        this.userService.getUser(profileid).subscribe((data) => {
          this.profile = data;
          this.loggedInUser = data;
        })
      } else {
        forkJoin([
          this.userService.getUser(this.loggedInUserId.toString()),
          this.userService.getUser(profileid)
        ]).subscribe((result) => {
          this.loggedInUser = result[0];
          this.profile = result[1];
        });
      }
    });
  }
}
