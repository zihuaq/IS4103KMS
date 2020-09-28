import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.scss'],
})
export class MaterialResourceAvailableComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() userChanged = new EventEmitter<User>();
  
  constructor() { }

  ngOnInit() {}

}
