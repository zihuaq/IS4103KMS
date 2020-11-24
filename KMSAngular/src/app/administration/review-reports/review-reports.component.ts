import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Report } from 'src/app/classes/report';
import { Tag } from 'src/app/classes/tag';
import { ReportService } from 'src/app/report.service';

@Component({
  selector: 'app-review-reports',
  templateUrl: './review-reports.component.html',
  styleUrls: ['./review-reports.component.css']
})
export class ReviewReportsComponent implements OnInit {

  reports: Report[]
  selectedReport: Report;
  @ViewChild('verdictModal', {static:false}) verdictModal: ModalDirective;
  settingStatus = ['Keep Review', 'Delete Review'];
  mdlSampleIsOpen : boolean = false;
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getReviewReports().subscribe(
      (response)=>{
        this.reports = response;
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  onPassVerdict(verdictForm: NgForm){
    console.log(verdictForm)
    //this.selectedReport.resolved = !this.selectedReport.resolved
    //this.selectedReport.verdictComments = verdictForm.value.verdict;
    let activeStatus: Boolean
    if (verdictForm.value.status == "Delete Review"){
      activeStatus = false;
    }
    else{
      activeStatus = true;
    }
    this.reportService.passReviewReportVerdict(this.selectedReport,activeStatus)
    .subscribe((response)=>{
      for (var i = this.reports.length - 1; i >=0; --i){
        if(this.reports[i].reportId == this.selectedReport.reportId){
          this.reports.splice(i,1);
        }
      }
      this.verdictModal.hide();
    })
  }

  onReportSelected(reportData: Report){
    this.selectedReport = reportData;
    console.log(this.selectedReport.reportId)
    this.verdictModal.show();
  }

  hideChildModal(){
    this.verdictModal.hide();
  }
}
