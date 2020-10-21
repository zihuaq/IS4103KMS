import { ReportType } from 'src/app/enum/report-type.enum';
import { TagService } from 'src/app/services/tag.service';
import { ReportService } from 'src/app/services/report.service';
import { Report } from './../../classes/report';
import { Tag } from './../../classes/tag';
import { User } from './../../classes/user';
import { PostComment } from './../../classes/post-comment';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report-comment-modal',
  templateUrl: './report-comment-modal.page.html',
  styleUrls: ['./report-comment-modal.page.scss']
})
export class ReportCommentModalPage implements OnInit {
  @Input() comment: PostComment;
  @Input() loggedInUser: User;
  reportTags: Tag[];
  selectedTags: Tag[] = [];
  content: string;
  constructor(
    private modalController: ModalController,
    private reportService: ReportService,
    private toastController: ToastController,
    private tagService: TagService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.tagService.getAllCommentReportTags().subscribe((result) => {
      this.reportTags = result;
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  select(tag: Tag) {
    this.selectedTags.push(tag);
  }

  unselect(tag: Tag) {
    this.selectedTags.forEach((element, index) => {
      if (element == tag) {
        this.selectedTags.splice(index, 1);
      }
    });
  }

  selected(tag: Tag) {
    return (
      this.selectedTags.filter((selectedTag) => {
        return tag == selectedTag;
      }).length > 0
    );
  }

  async report() {
    if (this.selectedTags.length == 0) {
      const toast = await this.toastController.create({
        message: 'Please select at least one concern.',
        duration: 2000,
        color: 'red'
      });
      toast.present();
    } else {
      let report = new Report();
      report.reportType = ReportType.COMMENT;
      report.reportOwner = this.loggedInUser;
      report.reportedComment = this.comment;
      report.reportContent = this.content;
      report.reportTags = this.selectedTags;
      this.reportService.reportComment(report).subscribe(async () => {
        const toast = await this.toastController.create({
          message: 'Report created successfully',
          duration: 2000
        });
        toast.present();
        this.dismiss();
      });
    }
  }
}
