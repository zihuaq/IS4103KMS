import { Component, OnInit } from '@angular/core';
import { MaterialResourcePosting } from '../classes/material-resource-posting';
import { MrpStatus } from '../classes/mrp-status.enum';
import { Tag } from '../classes/tag';
import { MaterialResourcePostingService } from '../material-resource-posting.service';
import { TagService } from '../tag.service';

declare var $: any;

@Component({
  selector: 'app-view-all-mrps',
  templateUrl: './view-all-mrps.component.html',
  styleUrls: ['./view-all-mrps.component.css']
})
export class ViewAllMrpsComponent implements OnInit {

  mrpList: MaterialResourcePosting[];
  filteredMrpList: MaterialResourcePosting[];
  searchInput: string;

  tags: Tag[];

  constructor(private mrpService: MaterialResourcePostingService,
    private tagService: TagService) {
    this.mrpList = [];
    this.filteredMrpList = [];
    this.tags = [];
  }

  ngOnInit(): void {
    this.mrpService.getAllMaterialResourcePosting().subscribe(
      response => {
        this.mrpList = response.filter((mrp: MaterialResourcePosting) => {
          if (mrp.status == MrpStatus.OPEN) {
            return true;
          } else {
            return false;
          }
        });
        this.filteredMrpList = this.mrpList;
      }
    )

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.tags = response;
        $('#mrpTagSelect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#mrpTagSelect2').on("change", () => {
          this.filter()
        });
      }
    );
  }

  filter() {
    this.filteredMrpList = this.mrpList;
    if (this.searchInput && this.searchInput != "") {
      this.filteredMrpList = this.filteredMrpList.filter(
        (mrp: MaterialResourcePosting) => {
          if (mrp.description) {
            return mrp.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.project.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return mrp.name.toLowerCase().includes(this.searchInput.toLowerCase()) || mrp.project.name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
        }
      )
    }
    this.tagFilter();
  }

  tagFilter() {
    let selectedTagNames: string[] = $('#mrpTagSelect2').val();
    if (selectedTagNames.length > 0) {
      this.filteredMrpList = this.filteredMrpList.filter((mrp: MaterialResourcePosting) => {
        var contain: boolean = false;
        for (let tag of mrp.tags) {
          if (selectedTagNames.includes(tag.name)) {
            contain = true;
            break;
          }
        }
        return contain;
      })
      
    }
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

}
