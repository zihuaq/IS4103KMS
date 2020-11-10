import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { HrpService } from 'src/app/hrp.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/tag.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-view-hrp-tab',
  templateUrl: './view-hrp-tab.component.html',
  styleUrls: ['./view-hrp-tab.component.css']
})
export class ViewHrpTabComponent implements OnInit {

  projectId: number;
  project: Project;
  tags: Tag[];
  hrpList: HumanResourcePosting[];
  isMember: boolean = false;

  constructor(private sessionService: SessionService,
    private hrpService: HrpService,
    private projectService: ProjectService,
    private tagService: TagService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private datePipe: DatePipe) {
      this.project = new Project();
      this.tags = [];
      this.hrpList = [];
    }

  ngOnInit(): void {
    console.log('ngOnInit hrpTab')
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));

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

    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.tags = response;
      }
    );

    this.hrpService.getHrpByProject(this.projectId).subscribe(
      response => {
        for (let hrp of response) {
          this.hrpService.getHrp(hrp.humanResourcePostingId).subscribe(
            response => {
              this.hrpList.push(response);
              this.hrpList.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
            }
          );
        }
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
  }

  hasApplied(hrpId: number): boolean {;
    for (let hrp of this.hrpList) {
      if (hrp.humanResourcePostingId == hrpId) {
        for (let user of hrp.appliedUsers) {
          if (user.userId === this.sessionService.getCurrentUser().userId) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasFilled(hrpId: number): boolean {
    for (let hrp of this.hrpList) {
      if (hrp.humanResourcePostingId == hrpId) {
        if (hrp.totalSlots === hrp.obtainedSlots) {
          return true;
        }
      }
    }
    return false;
  }

  applyHrp(hrpId: number) {
    this.hrpService.joinHrp(hrpId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Joined',
        });
        this.hrpList = [];
        this.hrpService.getHrpByProject(this.projectId).subscribe(
          response => {
            for (let hrp of response) {
              this.hrpService.getHrp(hrp.humanResourcePostingId).subscribe(
                response => {
                  this.hrpList.push(response);
                  this.hrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
                }
              );
            }
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
        });
      }
    );
  }

  leaveHrp(hrpId: number) {
    this.hrpService.leaveHrp(hrpId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Left',
        });
        this.hrpList = [];
        this.hrpService.getHrpByProject(this.projectId).subscribe(
          response => {
            for (let hrp of response) {
              this.hrpService.getHrp(hrp.humanResourcePostingId).subscribe(
                response => {
                  this.hrpList.push(response);
                  this.hrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
                }
              );
            }
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
        });
      }
    );
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
