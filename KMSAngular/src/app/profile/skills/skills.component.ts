import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';
import { User } from '../../classes/user';

declare var $: any;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  @Input() user: User;
  skillTags: Tag[];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
    });
    $('.select2').select2();
  }
}
