import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../classes/user';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() user: User;
  
  constructor() { }

  ngOnInit(): void {
  }

}
