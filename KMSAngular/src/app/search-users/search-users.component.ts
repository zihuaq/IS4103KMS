import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((response) => {
      this.allUsers = response;
      this.filteredUsers = this.allUsers;
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
