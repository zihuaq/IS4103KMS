import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  
  constructor() { }

  ngOnInit(): void {
  }

}
