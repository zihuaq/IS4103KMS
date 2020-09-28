import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  
  constructor() { }

  ngOnInit() {}

}
