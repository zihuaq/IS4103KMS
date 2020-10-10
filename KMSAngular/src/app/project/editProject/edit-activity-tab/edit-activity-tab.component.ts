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

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  events: CalendarEvent[] = [];

  projectId: number;
  project: Project;
  newActivity: Activity;
  activities: Activity[];
  minDate = new Date().toISOString().slice(0, 10);
  minEndDate = new Date().toISOString().slice(0, 10);

  constructor(private activityService: ActivityService,
    private projectService: ProjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) { 
      this.newActivity = new Activity();
      this.activities = [];
      this.project = new Project();
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
      response => {
        this.activities = response;
        for (let activity of this.activities) {
          let event = {
            start: startOfDay(new Date(this.formatDate(activity.startDate.toString()))),
            end: endOfDay(new Date(this.formatDate(activity.endDate.toString()))),
            title: activity.name,
            allDay: true
          }
          this.events.push(event);
        }
        console.log(this.events);
        this.refresh.next();
      }
    );

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        this.newActivity = new Activity();
        this.newActivity.country = this.project.country;
      }
    );
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
    this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
      response => {
        this.activities = response;
        this.events = [];
        for (let activity of this.activities) {
          let event = {
            start: startOfDay(new Date(this.formatDate(activity.startDate.toString()))),
            end: endOfDay(new Date(this.formatDate(activity.endDate.toString()))),
            title: activity.name,
            allDay: true
          }
          this.events.push(event);
        }
        this.refresh.next();
      }
    );
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
      response => {
        this.activities = response;
        this.events = [];
        for (let activity of this.activities) {
          let event = {
            start: startOfDay(new Date(this.formatDate(activity.startDate.toString()))),
            end: endOfDay(new Date(this.formatDate(activity.endDate.toString()))),
            title: activity.name,
            allDay: true
          }
          this.events.push(event);
        }
        this.refresh.next();
      }
    );
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
          this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
            response => {
              this.activities = response;
              this.events = [];
              for (let activity of this.activities) {
                let event = {
                  start: startOfDay(new Date(this.formatDate(activity.startDate.toString()))),
                  end: endOfDay(new Date(this.formatDate(activity.endDate.toString()))),
                  title: activity.name,
                  allDay: true
                }
                this.events.push(event);
              }
              this.refresh.next();
            }
          );
        }
      );
      $('#addActivityModalCloseBtn').click()
    }
    
  }

  deleteActivity(eventToDelete: CalendarEvent) {

  }

  dateToString(date: Date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

}
