import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  seeAll: boolean = false;
  profileIsLoggedInUser = false;
  top3Skills: Tag[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.profileIsLoggedInUser = this.profile.userId == this.loggedInUser.userId
    this.userService
      .getSkillsForProfile(this.profile.userId)
      .subscribe((skills) => {
        this.profile = { ...this.profile, skills };
        this.top3Skills = this.profile.skills.slice(0, 3)
      });
  }

  toggleSeeAll() {
    this.seeAll = !this.seeAll
  }
}
