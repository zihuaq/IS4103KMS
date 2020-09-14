import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';
import { User } from '../../classes/user';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  skillTags: Tag[];
  selectedTagNames: string[];
  selectedTags: Tag[] = [];

  constructor(private tagService: TagService, private userService: UserService) { }

  ngOnInit(): void {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
    });
    $('.select2').select2({
      data: this.skillTags,
      allowClear: true
    });
  }

  submitSkills() {
    this.selectedTagNames = $('.select2').val();
    this.skillTags.forEach(element => {
      if(this.selectedTagNames.includes(element.name)){
        this.selectedTags.push(element);
      }
    });
    this.userService.addSkillsToProfile(this.user.userId, this.selectedTags).subscribe(responsedata => {
      this.user.skills = responsedata;
    });
    
    this.userChanged.emit(this.user);
  }

  deleteSkill(tagId: number){
    this.userService.removeSkillFromProfile(this.user.userId, tagId).subscribe(responsedata => {
      this.user.skills = responsedata;
    });
    this.userChanged.emit(this.user);
  }
}