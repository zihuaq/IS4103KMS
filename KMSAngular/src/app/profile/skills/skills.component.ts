import { Component, OnInit } from '@angular/core';
import { Tag } from '../../classes/tag';
import {TagService} from '../../tag.service'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  tags: Tag[]
  constructor(private tagService: TagService) { }

  ngOnInit(): void {
  }
}
