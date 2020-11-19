import { UserService } from '../user.service';
import { forkJoin } from 'rxjs';
import { SessionService } from '../session.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Profile } from '../classes/profile';
import { User } from '../classes/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  loggedInUser: User;
  canSend: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    let profileid = this.activatedRoute.snapshot.params.id;
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    forkJoin([
      this.userService.getUser(loggedInUserId.toString()),
      this.profileService.getProfile(profileid),
    ]).subscribe((result) => {
      this.loggedInUser = result[0];
      this.profile = result[1];
      this.checkCanSendProfileClaimRequest();
    });
  }

  makeProfileClaim(id: String): void {
    this.profileService
      .makeProfileClaim(this.loggedInUser.userId.toString(), id)
      .subscribe(() => {
        this.checkCanSendProfileClaimRequest();
      });
  }

  checkCanSendProfileClaimRequest() {
    if (this.profile.userEntity) {
      this.canSend = false;
    } else if (
      this.profile.claimProfileRequestMade
        .map((claimProfileRequest) => {
          return claimProfileRequest.user.userId;
        })
        .includes(this.loggedInUser.userId)
    ) {
      this.canSend = false;
    } else {
      this.canSend = true;
    }
  }
}
