import { ProfileService } from './../../services/profile.service';
import { Profile } from './../../classes/profile';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search-profiles',
  templateUrl: './search-profiles.page.html',
  styleUrls: ['./search-profiles.page.scss']
})
export class SearchProfilesPage implements OnInit {
  @ViewChild('searchBar') searchBar: IonSearchbar;
  allProfiles: Profile[];
  filteredProfiles: Profile[];
  constructor(private profileService: ProfileService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.profileService.getAllProfiles().subscribe((response) => {
      this.allProfiles = response;
      this.filteredProfiles = this.allProfiles;
    });
  }

  setFilteredItems(event) {
    let searchTerm = event.srcElement.value;
    console.log(searchTerm);

    if (searchTerm && searchTerm != '') {
      this.filteredProfiles = this.allProfiles.filter((profile) => {
        return (
          profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.organization.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } else {
      this.filteredProfiles = this.allProfiles;
    }
  }
}
