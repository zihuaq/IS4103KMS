import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { ReportService } from 'src/app/services/report.service';
import { TagService } from 'src/app/services/tag.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs';
import { Report } from 'src/app/classes/report';
import { ReportType } from 'src/app/enum/report-type.enum';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report-profile',
  templateUrl: './report-profile.component.html',
  styleUrls: ['./report-profile.component.scss'],
})
export class ReportProfileComponent implements OnInit {
  @Input() profileId: number;
  @Input() loggedInUserId: number;
  profile: User;
  loggedInUser: User;
  reportTags: Tag[];
  content: string = "";
  filteredTags: Tag[] = [];
  chosenTags: Tag[] = [];
  searchValue: string;
  hasSelected: boolean;
  report: Report;

  constructor(private tagService: TagService, private reportService: ReportService,
    private userService: UserService, private toastController: ToastController, public modalController: ModalController) { }

  ngOnInit() {
    forkJoin([
      this.userService.getUser(this.profileId.toString()),
      this.userService.getUser(this.loggedInUserId.toString()),
      this.tagService.getAllReportTags()
    ]).subscribe((result) => {
      this.profile = result[0];
      this.loggedInUser = result[1];
      this.reportTags = result[2];
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.reportTags;
    }

    this.filteredTags = this.reportTags.filter(tag => {
      if (tag.name && this.searchValue) {
        return (tag.name.toLowerCase().includes(this.searchValue.toLowerCase()));
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
        this.chosenTags.splice(index, 1)
      }
    });
  }

  clearSearch() {
    this.searchValue = "";
    this.filteredTags = [];
  }

  async onSubmit() {
    if (this.chosenTags.length == 0) {
      const toast = await this.toastController.create({
        message: "Please select at least one concern.",
        duration: 2000,
        color: "red"
      });
      toast.present();
    } else {
      this.report = new Report();
      this.report.reportType = ReportType.PROFILE;
      this.report.reportOwner = this.loggedInUser;
      this.report.reportedUser = this.profile;
      this.report.reportContent = this.content;
      this.report.reportTags = this.chosenTags;
      this.reportService.createReport(this.report).subscribe(async () => {
        const toast = await this.toastController.create({
          message: "Report created successfully",
          duration: 2000,
        });
        toast.present();
        this.dismissModal();
      });
    }
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
