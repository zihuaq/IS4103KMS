import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

import { Activity } from 'src/app/classes/activity';
import { ActivityService } from 'src/app/activity.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-activity-tab',
  templateUrl: './activity-tab.component.html',
  styleUrls: ['./activity-tab.component.css']
})
export class ActivityTabComponent implements OnInit {
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
  activities: Activity[];

  constructor(private activityService: ActivityService,
    private sessionService: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) {
    this.activities = [];
   }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.refreshActivities();
  }

  refreshActivities() {
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

  dateToString(date: Date) {
    return this.datePipe.transform(date, "yyyy-MM-dd");
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  hasJoined(activityId: number): boolean {
    for (let activity of this.activities) {
      if (activity.activityId === activityId) {
        for (let user of activity.joinedUsers) {
          if (user.userId === this.sessionService.getCurrentUser().userId) {
            return true;
          }
        }       
      }
    }
    return false;
  }

  joinActivity(activityId: number) {
    this.activityService.addMemberToActivity(activityId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Joined',
        });
        this.refreshActivities();
      }
    )
  }

  leaveActivity(activityId: number) {
    this.activityService.removeMemberFromActivity(activityId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Left',
        });
        this.refreshActivities();
      }
    )
  }

}
