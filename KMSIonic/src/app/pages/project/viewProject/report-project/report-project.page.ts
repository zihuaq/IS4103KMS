import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { NgForm } from "@angular/forms";

import { Project } from 'src/app/classes/project';
import { Report } from 'src/app/classes/report';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';

import { ProjectService } from 'src/app/services/project.service';
import { ReportService } from 'src/app/services/report.service';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReportType } from 'src/app/enum/report-type.enum';

@Component({
  selector: 'app-report-project',
  templateUrl: './report-project.page.html',
  styleUrls: ['./report-project.page.scss'],
})
export class ReportProjectPage implements OnInit {

  projectId: number;
  project: Project;
  currentUserId: number;
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  chosenTags: Tag[] = [];
  searchValue: string;
  hasSelected: boolean;
  report: Report;
  loggedInUser: User;

  constructor(public modalCtrl: ModalController,
    param: NavParams,
    public toastController: ToastController,
    private projectService: ProjectService,
    private reportService: ReportService,
    private tagService: TagService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute) {
      this.report = new Report();
      this.projectId = param.get('projectId');
     }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
        this.loggedInUser = user;
      }
    );

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }
    )
  }

  ionViewWillEnter() {
    this.tagService.getAllProjectReportTags().subscribe((response) => {
      this.tags = response;
      this.filteredTags = this.tags;
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value

    if (!this.searchValue) {
      this.filteredTags = this.tags
    }

    this.filteredTags = this.tags.filter((tag) => {
      if (tag.name && this.searchValue) {
        return tag.name.toLowerCase().includes(this.searchValue.toLowerCase())
      }
    })
  }

  selectTag(tag: Tag) {
    this.hasSelected = false
    this.chosenTags.forEach((element) => {
      if (element.name == tag.name) {
        this.hasSelected = true
      }
    })
    if (!this.hasSelected) {
      this.chosenTags.push(tag)
      this.clearSearch()
    }
  }

  removeTag(tag: Tag) {
    this.chosenTags.forEach((element, index) => {
      if (element.name == tag.name) {
        this.chosenTags.splice(index, 1)
      }
    })
  }

  clearSearch() {
    this.searchValue = ""
    this.filteredTags = []
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  reportProject(reportForm: NgForm) {
    if (reportForm.valid) {
      this.report.reportType = ReportType.PROJECT;
      this.report.reportOwner = this.loggedInUser;
      this.report.reportedProject = this.project;
      this.report.reportTags = this.chosenTags;
      this.report.resolved = false;
      this.reportService.reportProject(this.report).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Project reported successfully.',
            duration: 2000
          });
          toast.present();
          this.modalCtrl.dismiss({
            'dismissed': true
          });
        }
      )
    }
    

  }

}
