import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit, OnChanges {
  profile: User;
  constructor() {}
  ngOnChanges(): void {
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
      "individual",
      new Date(),
      new Date(),
      [],
      []
    );
  }
}
