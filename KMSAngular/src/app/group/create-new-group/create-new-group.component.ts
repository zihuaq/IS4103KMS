import { Component, OnInit, SimpleChanges } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Group } from '../../classes/group';
import { GroupService } from '../../group.service';
import { SessionService } from '../../session.service';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';

declare var $: any;

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.component.html',
  styleUrls: ['./create-new-group.component.css']
})
export class CreateNewGroupComponent implements OnInit {

  newGroup: Group;
  ownerId: number;
  infoMessage: string;
  errorMessage: string;
  tags: Tag[];
  groupCreated = false;
  groupCreationError = false;
  tagIdsSelected: number[];
  selectedTagNames: string[];
  selectedProfilePicture: string | ArrayBuffer;
  selectedProfilePictureName: string;
  successMessage = "Group created"

  constructor(public groupService: GroupService,
    private tagService: TagService,
    private sessionService: SessionService,
    private router: Router) {
      this.newGroup = new Group();
  }

  ngOnInit(): void {
    this.checkAccessRight();

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

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSDGTags().subscribe((response) => {
      this.tags = response;
      $('#sdgselect2').select2({
        data: this.tags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
    this.newGroup = changes.profile.currentValue;
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProfilePicture = e.target.result;
        console.log(this.selectedProfilePicture);
      };
      this.selectedProfilePictureName = event.target.files[0].name;
      console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedProfilePicture = undefined;
    }
  }

  removePicture() {
    this.selectedProfilePicture = undefined;
  }

  create(createGroupForm: NgForm) {
    this.ownerId = this.sessionService.getCurrentUser().userId;
    this.selectedTagNames = $('#sdgselect2').val();
    this.tagIdsSelected = [];
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit SDG tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one SDG tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.tagIdsSelected.push(element.tagId);
      }
    });

    if (createGroupForm.valid) {
      //this.newGroup.dateCreated = new Date();
      this.newGroup.isActive = true;
      this.newGroup.profilePicture = this.selectedProfilePicture;
      this.groupService.createNewGroup(this.newGroup, this.ownerId, this.tagIdsSelected).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Group created successfully',
          })
          this.router.navigate(["/groupDetails/" + response.groupId]);
          this.groupCreated = true;
          this.groupCreationError = false;
        },
        error => {
          this.infoMessage = null;
          this.errorMessage = error;
          this.groupCreationError = true;
          this.groupCreated = false;
        }
      );
    }
  }

  checkAccessRight() {
    console.log(this.sessionService.getIsLogin);
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
