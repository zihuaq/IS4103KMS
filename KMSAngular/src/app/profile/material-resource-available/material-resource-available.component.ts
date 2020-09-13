import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css']
})
export class MaterialResourceAvailableComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
