import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-sdgs',
  templateUrl: './view-sdgs.page.html',
  styleUrls: ['./view-sdgs.page.scss'],
})
export class ViewSdgsPage implements OnInit {
  profile: User;
  displayedSdgs: Tag[];
  loggedInUser: User;
  loggedInUserId: number;
  isEdit: boolean;
  sdgsToRemove: Tag[] = [];

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
            .getSDGsForProfile(this.profile.userId)
            .subscribe((sdgs) => {
              this.profile = { ...this.profile, sdgs };
              this.displayedSdgs = sdgs;
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
            .getSDGsForProfile(this.profile.userId)
            .subscribe((sdgs) => {
              this.profile = { ...this.profile, sdgs };
              this.displayedSdgs = sdgs;
            });
        });
      }
    });
  }

  onEdit() {
    this.isEdit = !this.isEdit
  }

  deleteTag(tag: Tag){
    this.displayedSdgs = this.displayedSdgs.filter(element => element.name != tag.name);
    this.sdgsToRemove.push(tag);
  }

  onSave() {
    this.sdgsToRemove.forEach((element) => {
      this.userService
      .removeSkillFromProfile(this.profile.userId, element.tagId)
      .subscribe((responsedata) => {
        this.profile.skills = responsedata;
        this.displayedSdgs = responsedata;
      });
    });
    this.sdgsToRemove = []
    this.isEdit = !this.isEdit;
  }
}
