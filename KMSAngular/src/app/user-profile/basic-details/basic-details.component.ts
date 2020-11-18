import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { UserService } from 'src/app/user.service';
import { User } from '../../classes/user';
import { UserType } from '../../classes/user-type.enum';

declare var window: any;
declare var $: any;

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit, OnChanges {
  @Input() profile: User;
  userSdgs: Tag[];
  UserType = UserType;
  profileUrl: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const parsedUrl = new URL(window.location.href);
    this.profileUrl =
      parsedUrl.origin + '/userProfile/shared/' + this.profile.userId;
    this.userSdgs = this.profile.sdgs;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.userService
      .getSDGsForProfile(this.profile.userId)
      .subscribe((sdgs) => {
        this.userSdgs = sdgs;
      });
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
