import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Profile } from '../classes/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: Profile;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    let profileid = this.activatedRoute.snapshot.params.id;
    this.profileService.getProfile(profileid).subscribe((data: Profile) => {
      this.profile = data;
      console.log(this.profile)
    });
  }
}
