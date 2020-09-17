import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

  allUsers: User[];
  filteredUsers: User[];
  searchString: string;
  loggedInUser: User;

  constructor(private userService: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((response) => {
      this.allUsers = response;
      this.filteredUsers = this.allUsers;
    });
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.userService.getUser(loggedInUserId.toString()).subscribe((data: User) => {
      this.loggedInUser = data;
    });
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.filteredUsers = [];
    for (var user of this.allUsers) {
      if (user.firstName.includes(this.searchString) || user.lastName.includes(this.searchString)) {
        this.filteredUsers.push(user);
      }
    }
  }
}
