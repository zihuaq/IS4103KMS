import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { MrpService } from 'src/app/services/mrp.service';
import { TagService } from 'src/app/services/tag.service';
import { MaterialResourcePosting } from '../../classes/material-resource-posting';

@Component({
  selector: 'app-view-all-mrps',
  templateUrl: './view-all-mrps.page.html',
  styleUrls: ['./view-all-mrps.page.scss'],
})
export class ViewAllMrpsPage implements OnInit {

  mrpList: MaterialResourcePosting[];
  filteredMrpList: MaterialResourcePosting[];
  searchInput: string;
  tags: Tag[];
  tagsSelected: string[];

  constructor(private mrpService: MrpService,
    private tagService: TagService) {
    this.mrpList = [];
    this.filteredMrpList = [];
    this.tags = [];
    this.tagsSelected = [];
  }

  ngOnInit() {
    this.mrpService.getAllMaterialResourcePosting().subscribe(
      response => {
        this.mrpList = response;
        this.filteredMrpList = this.mrpList;
      }
    )

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.tags = response;
      }
    );
  }

  filter() {
    this.filteredMrpList = this.mrpList;

    if (this.searchInput && this.searchInput != "") {
      this.filteredMrpList = this.mrpList.filter(
        (mrp: MaterialResourcePosting) => {
          if (mrp.description) {
            return mrp.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.project.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return mrp.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.project.name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
        }
      )
    }

    if (this.tagsSelected.length != 0 && this.tagsSelected.length != 7) {
      this.filteredMrpList = this.filteredMrpList.filter(
        (mrp: MaterialResourcePosting) => {
          var contain: boolean = false;
          for (let tag of mrp.tags) {
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
