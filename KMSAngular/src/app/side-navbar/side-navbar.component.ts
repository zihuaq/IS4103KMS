import { Component, Input, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent implements OnInit {
  loggedInUser: User;
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
  }
}
