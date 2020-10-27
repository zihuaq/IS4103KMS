import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Report } from 'src/app/classes/report';
import { ReportService } from 'src/app/report.service';

@Component({
  selector: 'app-post-report-item',
  templateUrl: './post-report-item.component.html',
  styleUrls: ['./post-report-item.component.css']
})
export class PostReportItemComponent implements OnInit {

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
