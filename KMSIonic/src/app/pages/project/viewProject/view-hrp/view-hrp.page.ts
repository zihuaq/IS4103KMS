import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Tag } from 'src/app/classes/tag';
import { Project } from 'src/app/classes/project';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { TagService } from 'src/app/services/tag.service';
import { HrpService } from 'src/app/services/hrp.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-view-hrp',
  templateUrl: './view-hrp.page.html',
  styleUrls: ['./view-hrp.page.scss'],
})
export class ViewHrpPage implements OnInit {

  projectId: number;
  project: Project;
  tags: Tag[];
  hrpList: HumanResourcePosting[];
  isMember: boolean = false;
  currentUserId: number;

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private tagService: TagService,
    private hrpService: HrpService,
    private authenticationService: AuthenticationService,
    private location: Location) {
      this.project = new Project();
      this.tags = [];
      this.hrpList = [];
     }

  ngOnInit() {
    console.log('ngOnInit ')
    this.refreshProject();
  }

  refreshProject() {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
        console.log(this.currentUserId);
        
        this.projectService.getProjectById(this.projectId).subscribe(
          response => {
            this.project = response;
            for (let member of this.project.projectMembers) {
              if (this.currentUserId == member.userId) {
                this.isMember = true;
              }
            }
          },
          error => {

          }
        );
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
            }
          );
        }
      },
      error => {

      }
    );

  }

  viewHrpDetails(event, hrp) {
    this.router.navigate(["hrp-details/" + hrp.humanResourcePostingId]);
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  hasApplied(hrpId: number): boolean {;
    for (let hrp of this.hrpList) {
      if (hrp.humanResourcePostingId == hrpId) {
        for (let user of hrp.appliedUsers) {
          if (user.userId === this.currentUserId) {
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

  

}
