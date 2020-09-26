import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
})
export class SkillsPage implements OnInit {
  skillTags: Tag[];

  constructor(private tagService: TagService, private userService: UserService) { }

  ngOnInit() {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
    });  
  }
}
