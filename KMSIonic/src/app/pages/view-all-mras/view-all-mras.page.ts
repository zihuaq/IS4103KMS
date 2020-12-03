import { Component, OnInit } from '@angular/core';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { MaterialResourceAvailableService } from 'src/app/services/material-resource-available.service';
import { TagService } from 'src/app/services/tag.service';
import { MaterialResourceAvailable } from '../../classes/material-resource-available';
import { Tag } from '../../classes/tag';

@Component({
  selector: 'app-view-all-mras',
  templateUrl: './view-all-mras.page.html',
  styleUrls: ['./view-all-mras.page.scss'],
})
export class ViewAllMrasPage implements OnInit {

  mraList: MaterialResourceAvailable[];
  filteredMraList: MaterialResourceAvailable[];
  searchInput: string;
  tags: Tag[];
  tagsSelected: string[];

  constructor(private mraService: MaterialResourceAvailableService,
    private tagService: TagService) {
    this.mraList = [];
    this.filteredMraList = [];
    this.tags = [];
    this.tagsSelected = [];
  }

  ngOnInit() {
    this.mraService.getAllMaterialResourceAvailable().subscribe(
      response => {
        this.mraList = response;
        this.filteredMraList = this.mraList;
      }
    )

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.tags = response;
      }
    );
  }

  filter() {
    this.filteredMraList = this.mraList;

    if (this.searchInput && this.searchInput != "") {
      this.filteredMraList = this.mraList.filter(
        (mra: MaterialResourceAvailable) => {
          var name = mra.materialResourceAvailableOwner.firstName + " " + mra.materialResourceAvailableOwner.lastName;
          if (mra.description) {
            return mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase()) || mra.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
        }
      )
    }

    if (this.tagsSelected.length != 0 && this.tagsSelected.length != 7) {
      this.filteredMraList = this.filteredMraList.filter(
        (mra: MaterialResourceAvailable) => {
          var contain: boolean = false;
          for (let tag of mra.tags) {
            if (this.tagsSelected.includes(tag.name)) {
              contain = true;
              break;
            }
          }
          return contain;
      });
    }
  }

}
