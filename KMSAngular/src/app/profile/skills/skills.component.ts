import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  skillTags: Tag[];
  selectedTagNames: string[];
  selectedTags: Tag[] = [];
  showError: boolean = false;

  constructor(
    private tagService: TagService,
    private userService: UserService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.profile = changes.profile.currentValue;
    this.initialiseTags();
  }

  ngOnInit(): void {
    this.initialiseTags();
    this.userService
      .getSkillsForProfile(this.profile.userId)
      .subscribe((skills) => {
        this.profile = { ...this.profile, skills };
      });
  }

  submitSkills() {
    this.selectedTags = [];
    this.showError = false;
    console.log($('#skillselect2').val());
    this.selectedTagNames = $('#skillselect2').val();
    this.skillTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    console.log(this.selectedTagNames);
    if (!this.isSelectedTagInProfile()) {
      this.userService
        .addSkillsToProfile(this.profile.userId, this.selectedTags)
        .subscribe((responsedata) => {
          this.profile.skills = responsedata;
        });
    } else {
      this.showError = true;
    }
  }

  deleteSkill(tagId: number) {
    this.userService
      .removeSkillFromProfile(this.profile.userId, tagId)
      .subscribe((responsedata) => {
        this.profile.skills = responsedata;
      });
  }

  closeAlert() {
    this.showError = false;
  }

  private initialiseTags() {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.skillTags = response;
      $('#skillselect2').select2({
        data: this.skillTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
  }

  private isSelectedTagInProfile(): boolean {
    for (var skill of this.profile.skills) {
      if (this.selectedTagNames.includes(skill.name)) {
        return true;
      }
    }
    return false;
  }
}
