import { AuthenticationService } from './../../services/authentication.service';
import { User } from './../../classes/user';
import { TagService } from './../../services/tag.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { TagRequest } from './../../classes/tag-request';
import { TagType } from './../../enum/tag-type.enum';

@Component({
  selector: 'app-make-tag-request',
  templateUrl: './make-tag-request.page.html',
  styleUrls: ['./make-tag-request.page.scss']
})
export class MakeTagRequestPage implements OnInit {
  loggedInUser: User;
  TagType = TagType;
  constructor(
    private tagService: TagService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUser = user;
    });
  }

  submitTagRequest(tagForm: NgForm) {
    console.log('Submit tag request');
    if (tagForm.valid) {
      let tagRequest = new TagRequest();
      tagRequest.requestedName = tagForm.value.name;
      tagRequest.requestedTagType = tagForm.value.tagType;
      tagRequest.requestOwner = this.loggedInUser;
      this.tagService.createTagRequest(tagRequest).subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Tag Request Made!',
            duration: 2000
          });
          toast.present();
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
      tagForm.reset();
    }
  }

  clear(tagForm: NgForm) {
    tagForm.reset();
  }
}
