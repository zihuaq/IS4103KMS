import { ProfileService } from '../profile.service';
import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Profile } from '../classes/profile';
import { TagService } from '../tag.service';
import { Tag } from '../classes/tag';

declare var $: any;

@Component({
  selector: 'app-search-profile',
  templateUrl: './search-profile.component.html',
  styleUrls: ['./search-profile.component.css'],
})
export class SearchProfileComponent implements OnInit {
  filteredProfiles: Profile[];
  allProfiles: Profile[];
  sdgTags: Tag[];
  sdgTargetsTags: Tag[];
  selectedSdgTags: Tag[];
  selectedSdgTargetsTags: Tag[];
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
      this.filteredProfiles = this.allProfiles;
      this.sdgTags = result[1];
      this.sdgTargetsTags = []; // TODO: change this after targets populated
      this.initialiseSelect2();
    });
  }

  initialiseSelect2() {
    $('#searchsdgselect2').select2({
      data: this.sdgTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#searchsdgTargetselect2').select2({
      data: this.sdgTargetsTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#searchsdgselect2').on('change', () => {
      this.sdgChanged();
    });
    $('#searchsdgTargetselect2').on('change', () => {
      this.sdgTargetsChanged();
    });
  }

  sdgChanged() {
    let selectedTagNames = $('#searchsdgselect2').val();
    this.selectedSdgTargetsTags = [];
    this.sdgTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        this.selectedSdgTags.push(element);
      }
    });
    this.updateFilteredProfilesAccordingToRefineOptions();
  }

  sdgTargetsChanged() {
    let selectedTagNames = $('#searchsdgTargetselect2').val();
    this.selectedSdgTargetsTags = [];
    this.sdgTargetsTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        this.selectedSdgTargetsTags.push(element);
      }
    });
    this.updateFilteredProfilesAccordingToRefineOptions();
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.updateFilteredProfilesAccordingToRefineOptions();
  }

  updateFilteredProfilesAccordingToRefineOptions() {
    this.filteredProfiles = [];
    if (
      this.selectedSdgTags.length > 0 ||
      this.selectedSdgTargetsTags.length > 0
    ) {
      this.allProfiles.forEach((profile) => {
        let numSDGMatch = 0;
        let numSDGTargetMatch = 0;
        profile.sdgs.forEach((sdg) => {
          if (this.selectedSdgTags.some((tag) => tag.tagId == sdg.tagId)) {
            numSDGMatch++;
          }
        });
        profile.sdgTargets.forEach((sdgTarget) => {
          if (
            this.selectedSdgTargetsTags.some(
              (tag) => tag.tagId == sdgTarget.tagId
            )
          ) {
            numSDGTargetMatch++;
          }
        });
        if (
          numSDGTargetMatch == this.selectedSdgTargetsTags.length &&
          numSDGMatch == this.selectedSdgTags.length &&
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
      !profile.organization
        .toLowerCase()
        .includes(this.searchString.toLowerCase())
    ) {
      return false;
    }
    return true;
  }
}
