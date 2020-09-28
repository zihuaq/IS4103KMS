import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { HumanResourcePosting } from '../../classes/human-resource-posting';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';
import { HrpService } from '../../hrp.service';

declare var $: any;

@Component({
  selector: 'app-edit-hrp-tab',
  templateUrl: './edit-hrp-tab.component.html',
  styleUrls: ['./edit-hrp-tab.component.css']
})
export class EditHrpTabComponent implements OnInit {

  projectToEdit: Project;
  projectId: number;
  tags: Tag[];
  tagIdsSelected: number[];
  selectedTagNames: string[];
  newHrp: HumanResourcePosting;
  hrpToEdit: HumanResourcePosting;
  hrpList: HumanResourcePosting[];
  minDate = new Date().toISOString().slice(0, 10);
  minEndDate = new Date().toISOString().slice(0, 10);
  startDate: string;
  endDate: string;
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };

  constructor(private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private hrpService: HrpService) { 
      this.projectToEdit = new Project();
      this.newHrp = new HumanResourcePosting();
      this.hrpToEdit = new HumanResourcePosting();
      this.hrpList = [];
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
      }, 
      error => {
        this.router.navigate(["/error"]);
      }
    );

    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.tags = response;
        $('#hrpselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#editskillselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
      }
    );

    this.hrpService.getHrpByProject(this.projectId).subscribe(
      response => {
        this.hrpList = response;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSkillTags().subscribe((response) => {
      this.tags = response;
      $('#hrpselect2').select2({
        data: this.tags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
      $('#editskillselect2').select2({
        data: this.tags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
    this.newHrp = changes.profile.currentValue;
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.newHrp.latitude = event.latLng.lat();
    this.newHrp.longitude = event.latLng.lng();
  }

  createHrp(hrpForm: NgForm) {
    this.selectedTagNames = $('#hrpselect2').val();
    this.tagIdsSelected = [];
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit skill tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one skill tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.tagIdsSelected.push(element.tagId);
      }
    });

    if (hrpForm.valid) {
      this.newHrp.lackingSlots = this.newHrp.totalSlots;
      this.newHrp.obtainedSlots = 0;
      this.newHrp.startDate = new Date(this.newHrp.startDate);
      this.newHrp.endDate = new Date(this.newHrp.endDate);
      this.hrpService.createNewHrp(this.newHrp, this.projectId, this.tagIdsSelected).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Human Resource Posting created successfully',
          })
          this.hrpService.getHrpByProject(this.projectId).subscribe(
            response => {
              this.hrpList = response;
            }
          )
        },
        error => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: error,
          })
        }
      );
      $('#addHrpModalCloseBtn').click()

    }
  }

  clickHrp(hrpId: number) {
    this.selectedTagNames = [];
    this.hrpService.getHrp(hrpId).subscribe(
      response => {
        this.hrpToEdit = response;
        for (let tag of this.hrpToEdit.tags) {
          this.selectedTagNames.push(tag.name);
          console.log(tag.name);
        }
        $("#editskillselect2")
        .val($("#editskillselect2")
        .val()
        .concat(this.selectedTagNames));
        $("#editskillselect2")
        .trigger("change");

        this.startDate = this.hrpToEdit.startDate.toString().substring(0, 10);
        this.endDate = this.hrpToEdit.endDate.toString().substring(0, 10);
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        })
      }
    )
  }

  editHrp(editHrpForm: NgForm) {
    let selectedTags = [];
    this.selectedTagNames = $('#editskillselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit skills tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one skills tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });
    if (editHrpForm.valid) {
      this.hrpToEdit.startDate = new Date(this.startDate);
      this.hrpToEdit.endDate = new Date(this.endDate);
      this.hrpToEdit.tags = selectedTags;
      this.hrpService.updateHrp(this.hrpToEdit).subscribe(
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Human resource posting updated successfully',
        })
      )
    }
  }

  deleteHrp() {
    this.hrpService.deleteHrp(this.hrpToEdit.humanResourcePostingId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Human resource posting deleted successfully',
        });
        this.hrpService.getHrpByProject(this.projectId).subscribe(
          response => {
            this.hrpList = response;
          }
        );
        $("#edit-modal").modal("hide");

      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }
}
