import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';

declare var $: any;


@Component({
  selector: 'app-report-profile',
  templateUrl: './report-profile.component.html',
  styleUrls: ['./report-profile.component.css']
})
export class ReportProfileComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  
  constructor() { }

  ngOnInit(): void {
  }
}
