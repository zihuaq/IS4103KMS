import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { TagService } from 'src/app/tag.service';
import { ReportService } from 'src/app/report.service';
import { Report } from 'src/app/classes/report';
import { ReportType } from 'src/app/classes/report-type.enum';

declare var $: any;


@Component({
  selector: 'app-report-profile',
  templateUrl: './report-profile.component.html',
  styleUrls: ['./report-profile.component.css']
})
export class ReportProfileComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  reportTags: Tag[];
  content: string;
  selectedTags: Tag[];
  selectedTagNames: string[];
  report: Report;

  constructor(private tagService: TagService, private reportService: ReportService) { }

  ngOnInit(): void {
    this.tagService.getAllReportTags().subscribe((response) => {
      this.reportTags = response;
      console.log(this.reportTags);
      $('.select2').select2({
        data: this.reportTags,
        allowClear: true,
      });
    });
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
    this.report.reportType = ReportType.PROFILE;
    this.report.reportOwner = this.loggedInUser;
    this.report.reportedUser = this.profile;
    this.report.reportContent = this.content;
    this.report.reportTags = this.selectedTags;
    console.log(this.report);
    this.reportService.createReport(this.report).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Report Submitted Successfully',
        autohide: true,
        delay: 2500,
      });
      $('#modal-default').modal('hide');
    });
  }
}
