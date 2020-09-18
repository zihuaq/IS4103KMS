import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { User } from '../classes/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-retrieve-all-users',
  templateUrl: './retrieve-all-users.component.html',
  styleUrls: ['./retrieve-all-users.component.css']
})
export class RetrieveAllUsersComponent implements OnInit {

  users: User[];

  constructor(
    private userService: UserService) { 
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      response => {
      this.users = response
      console.log(response)
      },
      error => {
        console.log(this.users);
      }
    );
  }

  refresh(): void {
    window.location.reload();
}

  deleteUser(userId: number){
     this.userService.deleteUser(userId).subscribe((
       response) => {
       this.users = response;
       console.log(response)
       window.location.reload();
     },
     error => {
      console.log(this.users);
      }
    );
   }
}
