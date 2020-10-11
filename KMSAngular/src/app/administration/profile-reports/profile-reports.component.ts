import { Component, OnInit } from '@angular/core';
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

}
