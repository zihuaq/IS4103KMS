import { APP_INITIALIZER, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, SystemJsNgModuleLoader } from '@angular/core';
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
export class SkillsComponent implements OnInit, OnChanges {
  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  skillTags: Tag[];
  selectedTagNames: string[];
  selectedTags: Tag[] = [];
  showError: boolean = false;

  constructor(private tagService: TagService, private userService: UserService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.user = changes.user.currentValue;
    this.initialiseTags();
  }

  ngOnInit(): void {
    this.initialiseTags();   
  }

  submitSkills() {
    this.selectedTags = [];
    this.showError = false;
    this.selectedTagNames = $('.select2').val();
    this.skillTags.forEach(element => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    console.log(this.selectedTagNames);
    if (!this.isSelectedTagInProfile()) {
      this.userService.addSkillsToProfile(this.user.userId, this.selectedTags).subscribe(responsedata => {
        this.user.skills = responsedata;
      });
      this.userChanged.emit(this.user);
    } else {
      this.showError = true;
    }
  }

  deleteSkill(tagId: number) {
    this.userService.removeSkillFromProfile(this.user.userId, tagId).subscribe(responsedata => {
      this.user.skills = responsedata;
    });
    this.userChanged.emit(this.user);
  }

  closeAlert(){
    this.showError = false;
  }

  private initialiseTags(){
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
    });
    $('.select2').select2({
      data: this.skillTags,
      allowClear: true
    });
  }

  private isSelectedTagInProfile():boolean {
    for(var skill of this.user.skills){
      if (this.selectedTagNames.includes(skill.name)) {
        return true;
      }
    }
    return false;
  }
}