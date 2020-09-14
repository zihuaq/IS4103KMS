import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-profile-tabpanel',
  templateUrl: './profile-tabpanel.component.html',
  styleUrls: ['./profile-tabpanel.component.css']
})
export class ProfileTabpanelComponent implements OnInit {
  @Input() user: User;
  
  constructor() { }

  ngOnInit(): void {
  }

}
