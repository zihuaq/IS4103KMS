import { Component, OnInit } from '@angular/core';
import { Tag } from '../../classes/tag';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  tags: Tag[]
  constructor() { }

  ngOnInit(): void {
  }

}
