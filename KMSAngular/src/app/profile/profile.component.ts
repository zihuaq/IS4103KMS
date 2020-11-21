import { UserService } from '../user.service';
import { forkJoin } from 'rxjs';
import { SessionService } from '../session.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Profile } from '../classes/profile';
import { User } from '../classes/user';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileid: string;
  loggedInUserId: number;
  profile: Profile;
  loggedInUser: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileid = this.activatedRoute.snapshot.params.id;
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.reloadData();
  }

  makeProfileClaim(id: String): void {
    this.profileService
      .makeProfileClaim(this.loggedInUser.userId.toString(), id)
      .subscribe(() => {
        this.reloadData();
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Claim request sent',
          autohide: true,
          delay: 2500,
          body: 'A Request to claim this profile is sent successfully',
        });
      });
  }

  canSendProfileClaimRequest() {
    if (
      this.profile.claimProfileRequestMade
        .map((claimProfileRequest) => {
          return claimProfileRequest.user.userId;
        })
        .includes(this.loggedInUser.userId)
    ) {
      return false;
    } else {
      return true;
    }
  }

  hasProfile() {
    if (this.profile.userEntity || this.loggedInUser.profile) {
      console.log(this.profile.userEntity);
      console.log(this.loggedInUser.profile);
      return true;
    } else {
      return false;
    }
  }

  reloadData() {
    forkJoin([
      this.userService.getUser(this.loggedInUserId.toString()),
      this.profileService.getProfile(this.profileid),
    ]).subscribe((result) => {
      this.loggedInUser = result[0];
      this.profile = result[1];
      console.log(this.profile);
      console.log(this.loggedInUser);
    });
  }
}
