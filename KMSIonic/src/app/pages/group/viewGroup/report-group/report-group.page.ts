import { ReportType } from './../../../../enum/report-type.enum';
import { GroupService } from './../../../../services/group.service';
import { AuthenticationService } from './../../../../services/authentication.service';
import { TagService } from './../../../../services/tag.service';
import { ReportService } from 'src/app/services/report.service';
import { User } from './../../../../classes/user';
import { Report } from './../../../../classes/report';
import { Tag } from './../../../../classes/tag';
import { Group } from './../../../../classes/group';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-report-group',
  templateUrl: './report-group.page.html',
  styleUrls: ['./report-group.page.scss']
})
export class ReportGroupPage implements OnInit {
  groupId: number;
  group: Group;
  currentUserId: number;
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  chosenTags: Tag[] = [];
  searchValue: string;
  hasSelected: boolean;
  report: Report;
  loggedInUser: User;
  constructor(
    public modalCtrl: ModalController,
    param: NavParams,
    public toastController: ToastController,
    private groupService: GroupService,
    private reportService: ReportService,
    private tagService: TagService,
    private authenticationService: AuthenticationService
  ) {
    this.report = new Report();
    this.groupId = param.get('groupId');
  }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.currentUserId = user.userId;
      this.loggedInUser = user;
    });

    this.groupService.getGroupById(this.groupId).subscribe((response) => {
      this.group = response;
    });
  }

  ionViewWillEnter() {
    this.tagService.getAllGroupReportTags().subscribe((response) => {
      this.tags = response;
      this.filteredTags = this.tags;
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.tags;
    }

    this.filteredTags = this.tags.filter((tag) => {
      if (tag.name && this.searchValue) {
        return tag.name.toLowerCase().includes(this.searchValue.toLowerCase());
      }
    });
  }

  selectTag(tag: Tag) {
    this.hasSelected = false;
    this.chosenTags.forEach((element) => {
      if (element.name == tag.name) {
        this.hasSelected = true;
      }
    });
    if (!this.hasSelected) {
      this.chosenTags.push(tag);
      this.clearSearch();
    }
  }

  removeTag(tag: Tag) {
    this.chosenTags.forEach((element, index) => {
      if (element.name == tag.name) {
        this.chosenTags.splice(index, 1);
      }
    });
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredTags = [];
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  reportGroup(reportForm: NgForm) {
    if (reportForm.valid) {
      this.report.reportType = ReportType.GROUP;
      this.report.reportOwner = this.loggedInUser;
      this.report.reportedGroup = this.group;
      this.report.reportTags = this.chosenTags;
      this.report.resolved = false;
      this.reportService
        .reportGroup(this.report)
        .subscribe(async (response) => {
          const toast = await this.toastController.create({
            message: 'Group reported successfully.',
            duration: 2000
          });
          toast.present();
          this.modalCtrl.dismiss({
            dismissed: true
          });
        });
    }
  }
}
