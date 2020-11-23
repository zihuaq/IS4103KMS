import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Report } from 'src/app/classes/report';
import { ReportService } from 'src/app/report.service';

@Component({
  selector: 'app-review-report-item',
  templateUrl: './review-report-item.component.html',
  styleUrls: ['./review-report-item.component.css']
})
export class ReviewReportItemComponent implements OnInit {

  @Input() report: Report;
  @Output() reportSelected = new EventEmitter<Report>();

  constructor(private reportService: ReportService) {

  }

  ngOnInit(): void {
  }

  onSelectReport(){
    this.reportSelected.emit(this.report);
  }

}
