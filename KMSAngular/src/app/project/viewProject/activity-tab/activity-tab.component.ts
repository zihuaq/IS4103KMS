import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

import { Activity } from 'src/app/classes/activity';
import { ActivityService } from 'src/app/activity.service';
import { SessionService } from 'src/app/session.service';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { User } from 'src/app/classes/user';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { HrpService } from 'src/app/hrp.service';

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
  isMember: boolean = false;
  project: Project;
  activitySelected: Activity;
  contributors: User[];

  constructor(private projectService: ProjectService,
    private activityService: ActivityService,
    private sessionService: SessionService,
    private hrpService: HrpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe) {
    this.activities = [];
    this.activitySelected = new Activity();
    this.activitySelected.joinedUsers = [];
    this.contributors = [];
   }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        for (let member of this.project.projectMembers) {
          if (this.sessionService.getCurrentUser().userId == member.userId) {
            this.isMember = true;
          }
        }
      }, 
      error => {
        this.router.navigate(["/error"]);
      }
    );

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
    // this.clickActivity(activityId);

    // for (let user of this.contributors) {
    //   if (user.userId === this.sessionService.getCurrentUser().userId) {
    //     return true;
    //   }
    // }
    // return false;
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

  clickActivity(activityId: number) {
    this.activityService.getActivityById(activityId).subscribe(
      response => {
        this.activitySelected = response;
      }
    );
    
    this.contributors = [];
    this.hrpService.getHrpByActivityId(activityId).subscribe(
      response => {
        let hrps = response;
        for (let hrp of hrps) {
          for (let user of hrp.appliedUsers) {
            this.contributors.push(user);
          }
        }
      }
    );
  }

  inContributors(userId: number): boolean {
    for (let user of this.contributors) {
      if (user.userId == userId) {
        return true;
      }
    }
    return false;
  }

}
