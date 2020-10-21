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
  selector: 'app-hrp-details',
  templateUrl: './hrp-details.page.html',
  styleUrls: ['./hrp-details.page.scss'],
})
export class HrpDetailsPage implements OnInit {

  projectId: number;
  project: Project;
  tags: Tag[];
  isMember: boolean = false;
  currentUserId: number;
  hrpId: number;
  hrp: HumanResourcePosting;
  startDate: string;
  endDate: string;

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
      this.hrp = new HumanResourcePosting();
      this.hrp.appliedUsers = [];
      this.hrp.tags = [];
     }

  ngOnInit() {
    this.refreshHrp();
  }

  ionViewWillEnter() {
    this.refreshHrp();
  }

  refreshHrp() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );

    this.hrpId = parseInt(this.activatedRoute.snapshot.paramMap.get("hrpId"));
    
    this.hrpService.getHrp(this.hrpId).subscribe(
      response => {
        this.hrp = response;
        this.startDate = this.formatDate(this.hrp.startDate.toString());
        this.endDate = this.formatDate(this.hrp.endDate.toString());
      }
    )

  }

  hasApplied(): boolean {;
    for (let user of this.hrp.appliedUsers) {
      if (user.userId === this.currentUserId) {
        return true;
      }
    }
    return false;
  }

  hasFilled(): boolean {
    if (this.hrp.totalSlots === this.hrp.obtainedSlots) {
      return true;
    }
    return false;
  }

  applyHrp() {
    this.hrpService.joinHrp(this.hrpId, this.currentUserId).subscribe(
      async res => {
        const toast = await this.toastController.create({
          message: 'Joined.',
          duration: 2000
        });
        toast.present();
        this.hrpService.getHrp(this.hrpId).subscribe(
          response => {
            this.hrp = response;
          }
        );
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  leaveHrp() {
    this.hrpService.leaveHrp(this.hrpId, this.currentUserId).subscribe(
      async res => {
        const toast = await this.toastController.create({
          message: 'Left.',
          duration: 2000
        });
        toast.present();
        this.hrpService.getHrp(this.hrpId).subscribe(
          response => {
            this.hrp = response;
          }
        );
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }
}
