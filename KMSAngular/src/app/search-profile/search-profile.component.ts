import { ProfileService } from '../profile.service';
import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Profile } from '../classes/profile';
import { TagService } from '../tag.service';
import { Tag } from '../classes/tag';

@Component({
  selector: 'app-search-profile',
  templateUrl: './search-profile.component.html',
  styleUrls: ['./search-profile.component.css'],
})
export class SearchProfileComponent implements OnInit {
  filteredProfiles: Profile[];
  allProfiles: Profile[];
  sdgTags: Tag[];
  selectedsdgTags: Tag[];
  selectedsdgTargetsTags: Tag[];
  searchString: string = '';
  constructor(
    private tagService: TagService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.profileService.getAllProfiles(),
      this.tagService.getAllSDGTags(),
    ]).subscribe((result) => {
      this.allProfiles = result[0];
      this.sdgTags = result[1];
    });
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.updateFilteredProfilesAccordingToRefineOptions();
  }

  updateFilteredProfilesAccordingToRefineOptions() {
    this.filteredProfiles = [];
    if (
      this.selectedsdgTags.length > 0 ||
      this.selectedsdgTargetsTags.length > 0
    ) {
      this.allProfiles.forEach((profile) => {
        let numSDGMatch = 0;
        let numSDGTargetMatch = 0;
        profile.sdgs.forEach((sdg) => {
          if (this.selectedsdgTags.some((tag) => tag.tagId == sdg.tagId)) {
            numSDGMatch++;
          }
        });
        profile.sdgTargets.forEach((sdgTarget) => {
          if (
            this.selectedsdgTargetsTags.some(
              (tag) => tag.tagId == sdgTarget.tagId
            )
          ) {
            numSDGTargetMatch++;
          }
        });
        if (
          numSDGTargetMatch == this.selectedsdgTargetsTags.length &&
          numSDGMatch == this.selectedsdgTags.length &&
          !this.filteredProfiles.some(
            (filteredProfile) => filteredProfile.id == profile.id
          )
        ) {
          if (this.profileMatchSearchString(profile)) {
            this.filteredProfiles.push(profile);
          }
        }
      });
    } else {
      this.allProfiles.forEach((profile) => {
        if (this.profileMatchSearchString(profile)) {
          this.filteredProfiles.push(profile);
        }
      });
    }
  }

  profileMatchSearchString(profile: Profile) {
    if (
      !profile.name.toLowerCase().includes(this.searchString.toLowerCase()) &&
      !profile.organization.toLowerCase().includes(this.searchString.toLowerCase())
    ) {
      return false;
    }
    return true;
  }
}
