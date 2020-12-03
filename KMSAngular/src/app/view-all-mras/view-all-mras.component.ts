import { Component, OnInit } from '@angular/core';
import { MaterialResourceAvailable } from '../classes/material-resource-available';
import { Tag } from '../classes/tag';
import { MaterialResourceAvailableService } from '../mra.service';
import { TagService } from '../tag.service';

declare var $: any;

@Component({
  selector: 'app-view-all-mras',
  templateUrl: './view-all-mras.component.html',
  styleUrls: ['./view-all-mras.component.css']
})
export class ViewAllMrasComponent implements OnInit {

  mraList: MaterialResourceAvailable[];
  filteredMraList: MaterialResourceAvailable[];
  searchInput: string;

  tags: Tag[];

  constructor(private mraService: MaterialResourceAvailableService,
    private tagService: TagService) {
    this.mraList = [];
    this.filteredMraList = [];
    this.tags = [];
  }

  ngOnInit(): void {
    this.mraService.getAllMaterialResourceAvailable().subscribe(
      response => {
        this.mraList = response;
        this.filteredMraList = this.mraList;
      }
    )

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.tags = response;
        $('#mraTagSelect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#mraTagSelect2').on("change", () => {
          this.filter()
        });
      }
    );
  }

  filter() {
    this.filteredMraList = this.mraList;
    if (this.searchInput && this.searchInput != "") {
      this.filteredMraList = this.filteredMraList.filter(
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
    this.tagFilter();
  }

  tagFilter() {
    let selectedTagNames: string[] = $('#mraTagSelect2').val();
    if (selectedTagNames.length > 0) {
      this.filteredMraList = this.filteredMraList.filter((mra: MaterialResourceAvailable) => {
        var contain: boolean = false;
        for (let tag of mra.tags) {
          if (selectedTagNames.includes(tag.name)) {
            contain = true;
            break;
          }
        }
        return contain;
      })
      
    }
  }

}
