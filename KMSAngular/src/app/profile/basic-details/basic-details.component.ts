import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../classes/user';
import { UserType } from '../../classes/user-type.enum';

declare var window: any;
declare var $: any;

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  @Input() profile: User;
  UserType = UserType;
  profileUrl: string;

  constructor() {}

  ngOnInit(): void {
    const parsedUrl = new URL(window.location.href);
    this.profileUrl = parsedUrl.origin + '/profile/' + this.profile.userId;
    console.log(this.profileUrl); // this will print http://example.com or http://localhost:4200
  }

  copyProfileUrl() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.profileUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    $(document).Toasts('create', {
      class: 'bg-success',
      title: 'Copy Profile',
      autohide: true,
      delay: 2500,
      body: 'Copied profile to clipboard',
    });
  }
}
