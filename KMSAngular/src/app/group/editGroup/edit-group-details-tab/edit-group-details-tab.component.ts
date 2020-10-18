import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute} from '@angular/router';

import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/group.service';
// import { GroupType } from 'src/app/classes/group-type.enum';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/tag.service';

declare var $: any;

@Component({
  selector: 'app-edit-group-details-tab',
  templateUrl: './edit-group-details-tab.component.html',
  styleUrls: ['./edit-group-details-tab.component.css']
})
export class EditGroupDetailsTabComponent implements OnInit {

  @Input() groupToEdit: Group;
  @Output() groupChanged = new EventEmitter<Group>();
  groupId: number;
  tags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  infoMessage: string;
  errorMessage: string;
  // groupStatusList: GroupType[];

  constructor(public groupService: GroupService,
    private tagService: TagService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
      }
    )
    // this.groupService.getGroupStatusList().subscribe(
    //   response => {
    //     this.groupStatusList = response;
    //   }
    // )
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));
    this.selectedTagNames = [];
    this.groupService.getGroupById(this.groupId).subscribe(
      response => {
        this.groupToEdit = response;
        for (let tag of this.groupToEdit.sdgs) {
          this.selectedTagNames.push(tag.name);
        }
        $("#sdgselect2")
        .val($("#sdgselect2")
        .val()
        .concat( this.selectedTagNames));
        $("#sdgselect2")
        .trigger("change");
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
        $('#sdgselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
      }
    );
    this.groupToEdit = changes.groupToEdit.currentValue;
  }

  edit(editGroupForm: NgForm) {
    console.log("******** edit()");
    this.selectedTags = [];
    this.selectedTagNames = $('#sdgselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Sdg tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Sdg tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    if (editGroupForm.valid) {
      this.groupToEdit.sdgs = this.selectedTags;
      this.groupService.updateGroup(this.groupToEdit).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Group updated successfully',
          })
        },
        error => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      );
    }
  }

}
