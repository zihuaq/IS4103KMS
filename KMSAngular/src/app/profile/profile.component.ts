import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    let userid = this.activatedRoute.snapshot.params.userid;
    console.log(userid);
    this.userService.getUser(userid).subscribe((data: User) => {
      this.profile = data;
      console.log(this.profile);
    });
  }
}
