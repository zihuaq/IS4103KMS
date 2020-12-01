import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { review } from '../classes/review';
import { Report } from 'src/app/classes/report';
import { ReportType } from 'src/app/classes/report-type.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { ReportService } from 'src/app/report.service';
import { TagService } from 'src/app/tag.service';
import { SessionService } from '../session.service';

declare var $: any;

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  @Input() reviews: review[];
  selectedReview: review;
  @ViewChild('verdictModal', {static:false}) verdictModal: ModalDirective;
  loggedInUser: User;
  reportTags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  content: string;
  report: Report;

  constructor(private reportService: ReportService,
    private tagService: TagService,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.tagService.getAllReviewReportTags().subscribe((response) => {
      this.reportTags = response;
      console.log(this.reportTags);
      $('#reportselect2').select2({
        data: this.reportTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
  }

  onReviewSelected(reviewData: review){
    this.selectedReview = reviewData
    $('#modal-reportReview').modal('show');
  }

  onSubmit() {
    this.selectedTags = [];
    this.selectedTagNames = $('.select2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Report',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one concern',
      });
      return;
    }
    this.reportTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    this.report = new Report();
    this.report.reportType = ReportType.REVIEW;
    this.report.reportOwner = this.loggedInUser;
    this.report.reportedReview = this.selectedReview;
    this.report.reportContent = this.content;
    this.report.reportTags = this.selectedTags;
    this.report.resolved = false;
    console.log(this.report);
    this.reportService.reportReview(this.report).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Report is submitted successfully!',
      });
      $('#modal-reportReview').modal('hide');
    });
  }


}
