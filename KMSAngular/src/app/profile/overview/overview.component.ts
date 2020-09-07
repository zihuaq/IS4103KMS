import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  profile: User;

  constructor() {}

  ngOnInit(): void {
    this.profile = new User(
      1,
      'Yi',
      'Ren',
      new Date(),
      'F',
      'yiren@gmail.com',
      'password',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      'Singapore',
      10,
      'user',
      new Date(),
      new Date(),
      [],
      []
    );
  }
}
