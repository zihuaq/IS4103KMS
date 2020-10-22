import { ReportService } from './../../services/report.service';
import { ReportType } from './../../enum/report-type.enum';
import { Report } from './../../classes/report';
import { Tag } from './../../classes/tag';
import { TagService } from './../../services/tag.service';
import { User } from './../../classes/user';
import { Post } from './../../classes/post';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report-post-modal',
  templateUrl: './report-post-modal.page.html',
  styleUrls: ['./report-post-modal.page.scss']
})
export class ReportPostModalPage implements OnInit {
  @Input() post: Post;
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
    this.tagService.getAllPostReportTags().subscribe((result) => {
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
      report.reportType = ReportType.POST;
      report.reportOwner = this.loggedInUser;
      report.reportedPost = this.post;
      report.reportContent = this.content;
      report.reportTags = this.selectedTags;
      this.reportService.reportPost(report).subscribe(async () => {
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
