import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'src/app/classes/group';
import { Report } from 'src/app/classes/report';
import { ReportType } from 'src/app/classes/report-type.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { ReportService } from 'src/app/report.service';
import { TagService } from 'src/app/tag.service';

declare var $: any;

@Component({
  selector: 'app-report-group',
  templateUrl: './report-group.component.html',
  styleUrls: ['./report-group.component.css']
})
export class ReportGroupComponent implements OnInit {

  @Input() loggedInUser: User;
  @Input() groupToReport: Group;
  reportTags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  content: string;
  report: Report;

  constructor(private reportService: ReportService,
    private tagService: TagService) { }

  ngOnInit(): void {
    this.tagService.getAllReportTags().subscribe((response) => {
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

  onSelect() {
    $('#modal-reportGroup').modal('show');
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
    this.report.reportType = ReportType.PROJECT;
    this.report.reportOwner = this.loggedInUser;
    this.report.reportedGroup = this.groupToReport;
    this.report.reportContent = this.content;
    this.report.reportTags = this.selectedTags;
    this.report.resolved = false;
    console.log(this.report);
    this.reportService.reportGroup(this.report).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Report is submitted successfully!'
      });
      $('#modal-reportGroup').modal('hide');
    });
  }

}
