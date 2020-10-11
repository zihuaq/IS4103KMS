import { Component, Input, OnInit } from '@angular/core';
import { Report } from 'src/app/classes/report';

@Component({
  selector: 'app-profile-report-item',
  templateUrl: './profile-report-item.component.html',
  styleUrls: ['./profile-report-item.component.css']
})
export class ProfileReportItemComponent implements OnInit {

  @Input() report: Report;

  constructor() { }

  ngOnInit(): void {
  }

}
