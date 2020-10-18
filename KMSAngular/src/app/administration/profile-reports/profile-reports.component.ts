import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Report } from 'src/app/classes/report';
import { Tag } from 'src/app/classes/tag';
import { ReportService } from 'src/app/report.service';

@Component({
  selector: 'app-profile-reports',
  templateUrl: './profile-reports.component.html',
  styleUrls: ['./profile-reports.component.css']
})
export class ProfileReportsComponent implements OnInit {
  reports: Report[]
  selectedReport: Report;
  @ViewChild('verdictModal', {static:false}) verdictModal: ModalDirective;
  settingStatus = ['Keep Active', 'Deactivate'];
  mdlSampleIsOpen : boolean = false;
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getProfileReports().subscribe(
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
    this.selectedReport.resolved = !this.selectedReport.resolved
    this.selectedReport.verdictComments = verdictForm.value.verdict;
    let activeStatus: Boolean
    if (verdictForm.value.status == "Deactivate"){
      activeStatus = false;
    }
    else{
      activeStatus = true;
    }
    this.reportService.passProfileReportVerdict(this.selectedReport,activeStatus)
    .subscribe((response)=>{
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
