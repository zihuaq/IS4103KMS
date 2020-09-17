import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {

  }

  logout(){
    this.userService.logout();
  }

}
