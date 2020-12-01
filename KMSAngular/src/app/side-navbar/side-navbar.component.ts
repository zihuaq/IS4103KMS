import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { NgForm } from '@angular/forms';
import { TagType } from '../classes/tag-type.enum';
import { TagService } from '../tag.service';
import { TagRequest } from '../classes/tag-request';

declare var $: any;

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent implements OnInit {
  loggedInUser: User;
  TagType = TagType;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    public tagService: TagService
  ) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
  }

  logout() {
    this.userService.logout();
  }

  submitTagRequest(tagForm: NgForm) {
    console.log("Submit tag request")
    if (tagForm.valid) {
      let tagRequest = new TagRequest();
      tagRequest.requestedName = tagForm.value.name;
      tagRequest.requestedTagType = tagForm.value.tagType;
      tagRequest.requestOwner = this.loggedInUser;
      this.tagService.createTagRequest(tagRequest).subscribe(
        (response) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Tag Request Made!',
          });
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      );
      $('#makeTagReqModalCloseBtn').click();
    }
  }

  clear(tagForm: NgForm) {
    tagForm.reset();
  }
}
