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
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { review } from 'src/app/classes/review';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';

declare var $: any;

@Component({
  selector: 'app-activity-tab',
  templateUrl: './activity-tab.component.html',
  styleUrls: ['./activity-tab.component.css']
})
export class ActivityTabComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('reviewModal', {static:false}) reviewModal: ModalDirective;

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
  allocatedResources: MaterialResourcePosting[];
  projectReviewForActivity: review[] = [];
  userReviewsForActivity: review[] = [];
  reviewsUnwrittenForUsers: User[] = [];
  loggedInUser: User;
  isOwner: boolean = false;
  isAdmin: boolean = false;
  showingReviewForm = 'User'
  starRating = 0;
  showReviewForm = ['User','Project']
  //selectedToUser: number = 0;

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
    this.allocatedResources = [];
    this.showingReviewForm = 'User'
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

    this.loggedInUser = this.sessionService.getCurrentUser();

    if (this.project.projectOwner.userId == this.loggedInUser.userId) {
      this.isOwner = true;
    }

    this.projectReviewForActivity = [];
    this.userReviewsForActivity = [];
    this.reviewsUnwrittenForUsers = [];

    this.isAdmin = this.isAdminCheck(this.loggedInUser)

    this.refreshActivities();
  }

  refreshActivities() {
    this.activityService.getActivitiesByProject(this.projectId, this.dateToString(this.viewDate)).subscribe(
      response => {
        this.activities = response;
        this.activities.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        this.events = [];
        for (let activity of this.activities) {
          let event = {
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

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
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

  clickAllocatedMrp(activity: Activity) {
    this.activityService.getActivityById(activity.activityId).subscribe(
      response => {
        this.activitySelected = response;
      }
    );
    this.activityService.getAllocatedResources(activity.activityId).subscribe(
      response => {
        this.allocatedResources = response;
      }
    );
  }

  isAdminCheck(user: User): boolean {
    for(let member of this.project.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  clickReview(activityId: number){

    this.activityService.getActivityById(activityId).subscribe(
      response => {
        this.activitySelected = response;
      }
    );


    this.activityService.getProjectReviewForActivity(activityId, this.sessionService.getCurrentUser().userId)
    .subscribe(
      response => {
        this.projectReviewForActivity = response;
        console.log(this.projectReviewForActivity)
    })
    this.activityService.getUserReviewsForActivity(activityId, this.sessionService.getCurrentUser().userId)
    .subscribe(
      response => {
        this.userReviewsForActivity = response;
        console.log(this.userReviewsForActivity)
    })

    if(this.hasJoined(activityId)){
      //is an admin or owner
      if(this.isAdminCheck(this.loggedInUser) || this.isOwner){
        for(let user of this.activitySelected.joinedUsers){
          let hasWritten = false;
          if (user.userId != this.loggedInUser.userId && !this.isAdminCheck(user)){
            console.log("current User is an admin")
            for(let reviewed of this.userReviewsForActivity){
              if(user.userId == reviewed.to.userId){
                console.log(user.userId + " : " + reviewed.to.userId)
                hasWritten = true;
                break
              }
            }
            if(hasWritten == false && user.userId != this.loggedInUser.userId){
              this.reviewsUnwrittenForUsers.push(user)
          }

          }
        }
      }

      //is not an admin or owner
      else{
        for(let user of this.activitySelected.joinedUsers){
          let hasWritten = false;
          if (user.userId != this.loggedInUser.userId && this.isAdminCheck(user)){
            console.log("current User is not admin")
            for(let reviewed of this.userReviewsForActivity){
              if(user.userId == reviewed.to.userId){
                console.log(user.userId + " : " + reviewed.to.userId)
                hasWritten = true;
                break
              }
            }
            if(hasWritten == false && user.userId != this.loggedInUser.userId){
              this.reviewsUnwrittenForUsers.push(user)
            }

          }
        }
      }


    }
    this.reviewModal.show();
  }

  hideReviewModal(){
    this.reviewModal.hide();
  }

  // toggleReviewForm(toggle:string){
  //   this.showReviewForm = toggle;
  // }


  createNewUserReview(createNewUserReviewForm: NgForm){
    console.log(createNewUserReviewForm);
    console.log(this.starRating)

    let newReview = new review();
    newReview.title = createNewUserReviewForm.value.title
    newReview.reviewField = createNewUserReviewForm.value.review
    newReview.rating = this.starRating

    this.activityService.createNewUserReview(newReview, this.loggedInUser.userId, createNewUserReviewForm.value.selectedToUser, this.activitySelected.activityId).
    subscribe(
      response => {
        console.log(response.reviewId)
        this.reviewModal.hide()
      }
    )

  }

  createNewProjectReview(createNewProjectReviewForm: NgForm){
    console.log(createNewProjectReviewForm);
    console.log(this.starRating)

    let newReview = new review();
    newReview.title = createNewProjectReviewForm.value.titleForProject
    newReview.reviewField = createNewProjectReviewForm.value.reviewForProject
    newReview.rating = this.starRating

    console.log(newReview.title + " " + newReview.rating + " " + newReview.reviewField)
    this.activityService.createNewProjectReview(newReview, this.loggedInUser.userId, this.projectId, this.activitySelected.activityId).
    subscribe(
      response => {
        console.log(response.newProjectReviewId)
        this.reviewModal.hide()
      }
    )
  }

}
