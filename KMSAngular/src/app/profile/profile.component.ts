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
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    let userid = this.activatedRoute.snapshot.params.userid;
    if (!userid) {
      userid = this.sessionService.getCurrentUser().userId;
    }
    console.log(userid);
    this.userService.getUser(userid).subscribe((data: User) => {
      this.profile = data;
    });
  }
}
