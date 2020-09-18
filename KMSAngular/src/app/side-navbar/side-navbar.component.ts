import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../classes/user';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent implements OnInit {
  loggedInUser: User;

  constructor(private userService: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
  }

  logout(){
    this.userService.logout();
  }
}
