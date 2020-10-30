import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

import { Activity } from 'src/app/classes/activity';
import { ActivityService } from 'src/app/activity.service';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { HrpService } from 'src/app/hrp.service';
import { MaterialResourcePosting } from '../../../classes/material-resource-posting';
import { MaterialResourcePostingService } from '../../../material-resource-posting.service';

declare var $: any;

@Component({
  selector: 'app-edit-activity-tab',
  templateUrl: './edit-activity-tab.component.html',
  styleUrls: ['./edit-activity-tab.component.css']
})
export class EditActivityTabComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  startDate: string;
  endDate: string;

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  events: CalendarEvent[] = [];

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-edit"><i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       console.log(event);
  //       $('#modal-edit-activity').modal('show');
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       $('#delete-activity-dialog').modal('show');
  //     },
  //   }
  // ];

  projectId: number;
  project: Project;
  newActivity: Activity;
  activityToEdit: Activity;
  activities: Activity[];
  minDate = new Date().toISOString().slice(0, 10);
  minEndDate = new Date().toISOString().slice(0, 10);
  ownerId: number;
  loggedInUser: User;
  hrpAvailable: HumanResourcePosting[];
  hrpAllocated: HumanResourcePosting[];

  obtainedResources: MaterialResourcePosting[];
  allocatedResources: MaterialResourcePosting[];
  mrpToAllocate: MaterialResourcePosting;
  quantityAllocated: number;
  availableQuantity: number;
  mrpToEdit: MaterialResourcePosting;
  newQuantityAllocated: number;

  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };

  constructor(private hrpService: HrpService,
    private sessionService: SessionService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    private mrpService: MaterialResourcePostingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) { 
      this.newActivity = new Activity();
      this.activityToEdit = new Activity();
      this.activityToEdit.joinedUsers = [];
      this.activities = [];
      this.project = new Project();
      this.hrpAllocated = [];
      this.hrpAvailable = [];
      this.obtainedResources = [];
      this.allocatedResources = [];
      this.mrpToEdit = new MaterialResourcePosting();
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.refreshActivities();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        this.newActivity = new Activity();
        this.newActivity.country = this.project.country;  
        this.ownerId = this.project.projectOwner.userId;  
      }
    );
  }

  refreshActivities() {
    this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
      response => {
        this.activities = response;
        this.activities.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        this.events = [];
        for (let activity of this.activities) {
          let event = {
            id: activity.activityId,
            start: new Date(this.formatDate(activity.startDate.toString())),
            end: new Date(this.formatDate(activity.endDate.toString())),
            title: activity.name,
          }
          this.events.push(event);
        }
        this.refresh.next();
      }
    );
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.newActivity.latitude = event.latLng.lat();
    this.newActivity.longitude = event.latLng.lng();
    this.activityToEdit.latitude = event.latLng.lat();
    this.activityToEdit.longitude = event.latLng.lng();
  }

  isAdmin(user: User): boolean {
    for(let member of this.project.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    this.refreshActivities();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.refreshActivities();
  }

  clickCreate() {
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        this.newActivity = new Activity();
        this.newActivity.country = this.project.country;
      }
    );
  }

  createActivity(newActivityForm: NgForm): void {
    this.newActivity.country = this.project.country;
    if (this.newActivity.startDate > this.newActivity.endDate) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: 'End Date cannot be earlier than Start Date',
      });
      return;
    }

    if (newActivityForm.valid) {
      console.log(this.newActivity.startDate);
      this.newActivity.startDate = new Date(this.newActivity.startDate);
      this.newActivity.endDate = new Date(this.newActivity.endDate);
      this.activityService.createNewActivity(this.newActivity, this.projectId).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'New Activity created successfully',
          });
          this.refreshActivities();
        }
      );
      $('#addActivityModalCloseBtn').click();
    }
    
  }

  dateToString(date: Date) {
    return this.datePipe.transform(date, "yyyy-MM-ddTHH:mm");
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  clickActivity(activityId: number) {
    this.activityService.getActivityById(activityId).subscribe(
      response => {
        this.activityToEdit = response;
        this.activityToEdit.startDate = new Date(this.formatDate(this.activityToEdit.startDate.toString()));
        this.startDate = this.dateToString(this.activityToEdit.startDate);
        this.activityToEdit.endDate = new Date(this.formatDate(this.activityToEdit.endDate.toString()));
        this.endDate = this.dateToString(this.activityToEdit.endDate);

        this.hrpService.availableHrp(this.projectId, this.dateToString(this.activityToEdit.startDate), this.dateToString(this.activityToEdit.startDate)).subscribe(
          response => {
            this.hrpAvailable = response;
          }
        );

        this.hrpService.getHrpByActivityId(activityId).subscribe(
          response => {
            this.hrpAllocated = response;
          }
        );
      }
    );
  }

  editActivity(updateActivityForm: NgForm) {
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
    if (updateActivityForm.valid) {
      this.activityToEdit.startDate = new Date(this.startDate);
      this.activityToEdit.endDate = new Date(this.endDate);
      this.activityService.updateActivity(this.activityToEdit).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Activity updated successfully',
          });
          this.refreshActivities();
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
      );
      $('#updateActivityModalCloseBtn').click();
    }
  }

  deleteActivity() {
    this.activityService.deleteActivity(this.activityToEdit.activityId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Activity deleted successfully',
        });
        this.refreshActivities();
        $('#updateActivityModalCloseBtn').click();
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
    );
  }

  removeMember(userId: number) {
    this.activityService.removeMemberFromActivity(this.activityToEdit.activityId, userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Memeber removed successfully',
        });
        this.activityService.getActivityById(this.activityToEdit.activityId).subscribe(
          response => {
            this.activityToEdit = response;
          }
        );
      }
    )
  }

  allocateHrpToActivity(hrpId: number) {
    this.activityService.addHrpToActivity(this.activityToEdit.activityId, hrpId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Hrp allocated to this activity successfully',
        });
        this.hrpService.availableHrp(this.projectId, this.dateToString(this.activityToEdit.startDate), this.dateToString(this.activityToEdit.startDate)).subscribe(
          response => {
            this.hrpAvailable = response;
          }
        );

        this.hrpService.getHrpByActivityId(this.activityToEdit.activityId).subscribe(
          response => {
            this.hrpAllocated = response;
          }
        );
      }
    )
  }

  removeHrpFromActivity(hrpId: number) {
    this.activityService.removeHrpFromActivity(this.activityToEdit.activityId, hrpId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Hrp removed from this activity successfully',
        });
        this.hrpService.availableHrp(this.projectId, this.dateToString(this.activityToEdit.startDate), this.dateToString(this.activityToEdit.startDate)).subscribe(
          response => {
            this.hrpAvailable = response;
          }
        );

        this.hrpService.getHrpByActivityId(this.activityToEdit.activityId).subscribe(
          response => {
            this.hrpAllocated = response;
          }
        );
      }
    )
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  clickAllocatedMrp(activity: Activity) {
    this.activityService.getActivityById(activity.activityId).subscribe(
      response => {
        this.activityToEdit = response;
      }
    );
    this.activityService.getAllocatedResources(activity.activityId).subscribe(
      response => {
        this.allocatedResources = response;
      }
    );
  }

  clickAllocate() {
    this.mrpService.getListOfObtainedMrp(this.projectId, this.activityToEdit.activityId).subscribe(
      response => {
        this.obtainedResources = response;
      }
    );
    $('#modal-material-allocation').hide();
  }

  clickSelectMrp(mrp: MaterialResourcePosting) {
    this.mrpToAllocate = mrp;
    this.availableQuantity = mrp.obtainedQuantity - mrp.allocatedQuantity;
  }

  cancelAllocate() {
    $('#modal-material-allocation').show();
    this.mrpToAllocate = null;
    this.availableQuantity = null;
    this.quantityAllocated = null;
  }

  back() {
    this.mrpToAllocate = null;
    this.availableQuantity = null;
    this.quantityAllocated = null;
  }

  confirmAllocation() {
    if(this.quantityAllocated == null){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to allocate',
        autohide: true,
        delay: 3200,
        body: 'Allocated quantity is required',
      });
    } else if(!(this.quantityAllocated > 0)){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to allocate',
        autohide: true,
        delay: 3200,
        body: 'Allocated quantity is invalid',
      });
    } else if(this.quantityAllocated > this.availableQuantity) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to allocate',
        autohide: true,
        delay: 4000,
        body: 'Allocated quantity cannot be more than available quantity',
      });
    } else {
      this.activityService.allocateResource(this.activityToEdit.activityId, this.mrpToAllocate.materialResourcePostingId, this.quantityAllocated).subscribe(
        response => {
          this.activityService.getAllocatedResources(this.activityToEdit.activityId).subscribe(
            response => {
              this.allocatedResources = response;
            }
          );
          this.activityService.getActivityById(this.activityToEdit.activityId).subscribe(
            response => {
              this.activityToEdit = response;
            }
          );

          $('#modal-material-allocation').show();
          $('#allocateModalCloseBtn').click();
          this.mrpToAllocate = null;
          this.availableQuantity = null;
          this.quantityAllocated = null;

          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 3200,
            body: 'Material resource is allocated successfully',
          });
        }
      )
    }
  }

  clickUpdateQuantity(mrp: MaterialResourcePosting) {
    $('#modal-material-allocation').hide();
    this.mrpToEdit = mrp;
    this.quantityAllocated = this.activityToEdit.allocatedQuantities[mrp.materialResourcePostingId];
    this.availableQuantity = mrp.obtainedQuantity - mrp.allocatedQuantity + this.quantityAllocated;
  }

  cancelEdit() {
    $('#modal-material-allocation').show();
    this.mrpToEdit = new MaterialResourcePosting();
    this.availableQuantity = null;
    this.quantityAllocated = null;
  }

  updateQuantity() {
    if(this.quantityAllocated == null){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to update quantity',
        autohide: true,
        delay: 3200,
        body: 'Allocated quantity is required',
      });
    } else if(!(this.quantityAllocated > 0)){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to update quantity',
        autohide: true,
        delay: 3200,
        body: 'Allocated quantity is invalid',
      });
    } else if(this.quantityAllocated > this.availableQuantity) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to update quantity',
        autohide: true,
        delay: 4000,
        body: 'Allocated quantity cannot be more than available quantity',
      });
    } else {
        this.activityService.updateAllocateQuantity(this.activityToEdit.activityId, this.mrpToEdit.materialResourcePostingId, this.quantityAllocated).subscribe(
          response => {
            this.activityService.getAllocatedResources(this.activityToEdit.activityId).subscribe(
              response => {
                this.allocatedResources = response;
                
              }
            );
            this.activityService.getActivityById(this.activityToEdit.activityId).subscribe(
              response => {
                this.activityToEdit = response;
              }
            );
            $('#modal-material-allocation').show();
            $('#updateQuantityModalCloseBtn').click();

            this.mrpToEdit = new MaterialResourcePosting();
            this.availableQuantity = null;
            this.quantityAllocated = null;

            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 3200,
              body: 'Allocated quantity is updated successfully',
            });
          }
        )
    }
  }

  clickRemoveAllocation(mrp: MaterialResourcePosting) {
    $('#modal-material-allocation').hide();
    this.mrpToEdit = mrp;
  }

  removeAllocation() {
    this.activityService.removeAllocation(this.activityToEdit.activityId, this.mrpToEdit.materialResourcePostingId).subscribe(
      response => {
        this.activityService.getAllocatedResources(this.activityToEdit.activityId).subscribe(
          response => {
            this.allocatedResources = response;
          }
        );

        //$('#modal-remove-allocation').hide();
        $('#removeAllocationModalCloseBtn').click();
        $('#modal-material-allocation').show();
        this.mrpToEdit = new MaterialResourcePosting();

        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 3200,
          body: 'Material resource allocation is removed successfully',
        });
      }
    )
  }

}
