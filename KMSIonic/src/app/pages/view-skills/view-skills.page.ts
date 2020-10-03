import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-skills',
  templateUrl: './view-skills.page.html',
  styleUrls: ['./view-skills.page.scss'],
})
export class ViewSkillsPage implements OnInit {
  profile: User;
  displayedSkills: Tag[];
  loggedInUser: User;
  loggedInUserId: number;
  isEdit: boolean;
  skillsToRemove: Tag[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        this.userService.getUser(profileid).subscribe((data: User) => {
          this.profile = data;
          this.loggedInUser = data;

          this.userService
            .getSkillsForProfile(this.profile.userId)
            .subscribe((skills) => {
              this.profile = { ...this.profile, skills };
              this.displayedSkills = skills;
            });
          console.log(data);
        });
      } else {
        this.userService
          .getUser(this.loggedInUserId.toString())
          .subscribe((data: User) => {
            console.log(data)
            this.loggedInUser = data;
          });

        this.userService.getUser(profileid).subscribe((data: User) => {
          console.log(data)
          this.profile = data;

          this.userService
            .getSkillsForProfile(this.profile.userId)
            .subscribe((skills) => {
              this.profile = { ...this.profile, skills };
              this.displayedSkills = skills;
            });
        });
      }
    });
  }

  onEdit() {
    this.isEdit = !this.isEdit
  }

  deleteTag(tag: Tag){
    this.displayedSkills = this.displayedSkills.filter(element => element.name != tag.name);
    this.skillsToRemove.push(tag);
  }

  onSave() {
    this.skillsToRemove.forEach((element) => {
      this.userService
      .removeSkillFromProfile(this.profile.userId, element.tagId)
      .subscribe((responsedata) => {
        this.profile.skills = responsedata;
        this.displayedSkills = responsedata;
      });
    });
    this.skillsToRemove = []
    this.isEdit = !this.isEdit;
  }
}
