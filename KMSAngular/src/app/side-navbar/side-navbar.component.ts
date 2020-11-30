import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { NgForm } from '@angular/forms';
import { TagType } from '../classes/tag-type.enum';
import { TagService } from '../tag.service';
import { TagRequest } from '../classes/tag-request';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
})
export class SideNavbarComponent implements OnInit {
  loggedInUser: User;
  TagType = TagType;
  tagRequest: TagRequest;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    public tagService: TagService
  ) {
    this.tagRequest = new TagRequest();
  }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
  }

  logout() {
    this.userService.logout();
  }

  submitTagRequest(tagForm: NgForm) {
    console.log("Submit tag request")
    tagForm.reset();
    this.tagRequest = new TagRequest();
  }

  clear(tagForm: NgForm) {
    tagForm.reset();
    this.tagRequest = new TagRequest();
  }
}
