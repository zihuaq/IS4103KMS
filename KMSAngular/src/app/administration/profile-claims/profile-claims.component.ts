import { ClaimProfileRequest } from './../../classes/claim-profile-request';
import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-profile-claims',
  templateUrl: './profile-claims.component.html',
  styleUrls: ['./profile-claims.component.css'],
})
export class ProfileClaimsComponent implements OnInit {
  claims: Observable<ClaimProfileRequest[]>;
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.claims = this.profileService.getAllProfileClaims();
  }

  settleProfileClaim(claimId: string, accept: boolean) {
    this.profileService.settleProfileClaim(claimId, accept).subscribe(() => {
      this.claims = this.profileService.getAllProfileClaims();
      if (accept) {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Claim Settled',
          autohide: true,
          delay: 2500,
          body: 'Claim Approved',
        });
      } else {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Claim Settled',
          autohide: true,
          delay: 2500,
          body: 'Claim Rejected',
        });
      }
    });
  }
}
