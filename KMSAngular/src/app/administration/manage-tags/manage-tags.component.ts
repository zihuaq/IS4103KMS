import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Tag } from 'src/app/classes/tag';
import { TagType } from 'src/app/classes/tag-type.enum';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { TagService } from 'src/app/tag.service';

declare var $: any;

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.css']
})
export class ManageTagsComponent implements OnInit {
  loggedInUser: User;
  TagType = TagType;

  allTags: Tag[] = [];
  filteredTags: Tag[];
  searchInput: string;

  skill: boolean = false;
  sdg: boolean = false;
  materialResource: boolean = false;
  reportProfile: boolean = false;
  reportGroup: boolean = false;
  reportProject: boolean = false;
  reportPost: boolean = false;
  reportComment: boolean = false;

  tagToEdit: Tag;

  constructor(public tagService: TagService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.filter();
  }

  setEditTag(tag: Tag) {
    this.tagToEdit = tag;
  }

  saveEditingTag() {

  }

  addTag(tagForm: NgForm) {
    console.log("Add Tag method")
    if (tagForm.valid) {
      console.log("valid")
      let newTag = new Tag();
      newTag.name = tagForm.value.name;
      newTag.tagType = tagForm.value.tagType;
      this.tagService.createNewTag(newTag).subscribe(
        (response) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Tag Created!',
          });
          this.filter();
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      )
      tagForm.reset();
    }
  }

  filter() {
    forkJoin([
      this.tagService.getAllSkillTags(),
      this.tagService.getAllSDGTags(),
      this.tagService.getAllMaterialResourceTags(),
      this.tagService.getAllProfileReportTags(),
      this.tagService.getAllGroupReportTags(),
      this.tagService.getAllProjectReportTags(),
      this.tagService.getAllPostReportTags(),
      this.tagService.getAllCommentReportTags()
    ]).subscribe((result) => {
      this.allTags = this.allTags.concat(result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7])
      this.filteredTags = this.allTags;
      if (this.searchInput && this.searchInput != "") {
        this.filteredTags = this.allTags.filter(
          (tag: Tag) => {
            return tag.name.toLowerCase().includes(this.searchInput.toLowerCase())
          }
        )
      }
      var statusSelected = [];
      if (this.skill == true) {
        statusSelected.push(TagType.SKILL);
      }
      if (this.sdg == true) {
        statusSelected.push(TagType.SDG);
      }
      if (this.materialResource == true) {
        statusSelected.push(TagType.MATERIALRESOURCE);
      }
      if (this.reportProfile == true) {
        statusSelected.push(TagType.REPORTPROFILE);
      }
      if (this.reportGroup == true) {
        statusSelected.push(TagType.REPORTGROUP);
      }
      if (this.reportProject == true) {
        statusSelected.push(TagType.REPORTPROJECT);
      }
      if (this.reportPost == true) {
        statusSelected.push(TagType.REPORTPOST);
      }
      if (this.reportComment == true) {
        statusSelected.push(TagType.REPORTCOMMENT);
      }

      console.log("Status selected: " + statusSelected);
      if (statusSelected.length != 0) {
        this.filteredTags = this.filteredTags.filter(
          (tag: Tag) => {
            console.log("index: " + statusSelected.indexOf(tag.tagType))
            return statusSelected.indexOf(tag.tagType) > -1;
          });
      }
    });
  }
}
