import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-hrp-details',
  templateUrl: './edit-hrp-details.page.html',
  styleUrls: ['./edit-hrp-details.page.scss'],
})
export class EditHrpDetailsPage implements OnInit {

  @Input() hrpId: number;

  constructor() { }

  ngOnInit() {
    console.log("ngOnInit HrpId: " + this.hrpId);
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter HrpId: " + this.hrpId);
  }

}
