import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common'; 

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { HrpService } from 'src/app/hrp.service';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/tag.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/notification.service';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';


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
  currentUser: User;

  constructor(private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private hrpService: HrpService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private datePipe: DatePipe) { 
      this.projectToEdit = new Project();
      this.newHrp = new HumanResourcePosting();
      this.hrpToEdit = new HumanResourcePosting();
      this.hrpList = [];
    }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();

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
        this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
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
    this.hrpToEdit.latitude = event.latLng.lat();
    this.hrpToEdit.longitude = event.latLng.lng();
  }

  createHrp(hrpForm: NgForm) {
    this.selectedTagNames = $('#hrpselect2').val();
    this.tagIdsSelected = [];
    // if (this.selectedTagNames.length == 0) {
    //   $(document).Toasts('create', {
    //     class: 'bg-warning',
    //     title: 'Unable to submit skill tags',
    //     autohide: true,
    //     delay: 2500,
    //     body: 'Please select at least one skill tags',
    //   });
    //   return;
    // }
    if (this.selectedTagNames.length > 0) {
      this.tags.forEach((element) => {
        if (this.selectedTagNames.includes(element.name)) {
          this.tagIdsSelected.push(element.tagId);
        }
      });
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.tagIdsSelected.push(element.tagId);
      }
    });
    if (this.newHrp.startDate > this.newHrp.endDate) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: 'End Date cannot be earlier than Start Date',
      });
      return;
    }
    if (hrpForm.valid) {
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
          });
          let newNotification = new Notification();
          newNotification.msg = "A new Human Resource Posting has been added to " + this.projectToEdit.name;
          newNotification.projectId = this.projectId;
          newNotification.groupId = null;
          newNotification.projectTab = "hrp-tab";
          for (let member of this.projectToEdit.projectMembers) {
            if (member.userId != this.currentUser.userId) {
              this.notificationService.createNewNotification(newNotification, member.userId).subscribe();
            }
          }
          this.hrpService.getHrpByProject(this.projectId).subscribe(
            response => {
              this.hrpList = response;
              this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
            }
          );
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
    $('#editskillselect2').val(null).trigger("change");
    this.selectedTagNames = [];
    this.hrpService.getHrp(hrpId).subscribe(
      response => {
        this.hrpToEdit = response;
        for (let tag of this.hrpToEdit.tags) {
          this.selectedTagNames.push(tag.name);
        }
        $("#editskillselect2")
        .val($("#editskillselect2")
        .val()
        .concat(this.selectedTagNames));
        $("#editskillselect2")
        .trigger("change");

        this.hrpToEdit.startDate = new Date(this.formatDate(this.hrpToEdit.startDate.toString()));
        this.startDate = this.dateToString(this.hrpToEdit.startDate);
        this.hrpToEdit.endDate = new Date(this.formatDate(this.hrpToEdit.endDate.toString()));
        this.endDate = this.dateToString(this.hrpToEdit.endDate);
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
    // if (this.selectedTagNames.length == 0) {
    //   $(document).Toasts('create', {
    //     class: 'bg-warning',
    //     title: 'Unable to edit skills tags',
    //     autohide: true,
    //     delay: 2500,
    //     body: 'Please select at least one skills tags',
    //   });
    //   return;
    // }
    if (this.selectedTagNames.length > 0) {
      this.tags.forEach((element) => {
        if (this.selectedTagNames.includes(element.name)) {
          selectedTags.push(element);
        }
      });
    } 
    if (this.startDate > this.endDate) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: 'End Date cannot be earlier than Start Date',
      });
      return;
    }
    if (this.hrpToEdit.totalSlots < this.hrpToEdit.obtainedSlots) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit total slots',
        autohide: true,
        delay: 2500,
        body: 'Please enter a number larger than the position filled',
      });
      return;
    }
    if (editHrpForm.valid) {
      this.hrpToEdit.startDate = new Date(this.startDate);
      this.hrpToEdit.endDate = new Date(this.endDate);
      this.hrpToEdit.tags = selectedTags;
      this.hrpService.updateHrp(this.hrpToEdit).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Human resource posting updated successfully',
          });
          this.hrpService.getHrpByProject(this.projectId).subscribe(
            response => {
              this.hrpList = response;
              this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
            }
          );
        }
      );
      $('#editHrpModalCloseBtn').click();
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
            this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
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

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  dateToString(date: Date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }
  
  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }
}
