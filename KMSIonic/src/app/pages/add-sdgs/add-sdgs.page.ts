import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TagService } from 'src/app/services/tag.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-sdgs',
  templateUrl: './add-sdgs.page.html',
  styleUrls: ['./add-sdgs.page.scss']
})
export class AddSdgsPage implements OnInit {
  sdgTags: Tag[];
  filteredTags: Tag[];
  chosenTags: Tag[] = [];
  searchValue: string;
  hasSelected: boolean;
  loggedInUser: User;

  constructor(
    private tagService: TagService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastController: ToastController,
    private location: Location
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.tagService.getAllSDGTags().subscribe((response) => {
      this.sdgTags = response;
      this.authenticationService.getCurrentUser().then((user: User) => {
        this.loggedInUser = user;
        this.userService
          .getSDGsForProfile(this.loggedInUser.userId)
          .subscribe((sdgs) => {
            this.loggedInUser = { ...this.loggedInUser, sdgs };
            this.sdgTags = this.sdgTags.filter(
              (tag) => !this.loggedInUser.sdgs.includes(tag)
            );
          });
      });
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.sdgTags;
    }

    this.filteredTags = this.sdgTags.filter((tag) => {
      if (tag.name && this.searchValue) {
        return tag.name.toLowerCase().includes(this.searchValue.toLowerCase());
      }
    });
  }

  selectTag(tag: Tag) {
    this.hasSelected = false;
    this.chosenTags.forEach((element) => {
      if (element.name == tag.name) {
        this.hasSelected = true;
      }
    });
    if (!this.hasSelected) {
      this.chosenTags.push(tag);
      this.clearSearch();
    }
  }

  removeTag(tag: Tag) {
    this.chosenTags.forEach((element, index) => {
      if (element.name == tag.name) {
        this.chosenTags.splice(index, 1);
      }
    });
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredTags = [];
  }

  save() {
    this.userService
      .addSDGsToProfile(this.loggedInUser.userId, this.chosenTags)
      .subscribe(
        (responsedata) => {
          this.loggedInUser.sdgs = responsedata;
          this.location.back();
        },
        async (err: any) => {
          const toast = await this.toastController.create({
            message: err,
            duration: 2000
          });
          toast.present();
          this.chosenTags = [];
        }
      );
  }
}
