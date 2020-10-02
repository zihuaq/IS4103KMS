import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as convert from 'convert-units';

import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { User } from 'src/app/classes/user';

import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { TagService } from 'src/app/tag.service';
import { MaterialResourcePostingService } from '../../../material-resource-posting.service';
import { MaterialResourceAvailableService } from '../../../mra.service';
import { Fulfillment } from '../../../classes/fulfillment';
import { FulfillmentService } from '../../../fulfillment.service';

declare var $: any;

@Component({
  selector: 'app-view-mrp-tab',
  templateUrl: './view-mrp-tab.component.html',
  styleUrls: ['./view-mrp-tab.component.css']
})
export class ViewMrpTabComponent implements OnInit {

  projectId: number;
  project: Project;
  tags: Tag[];
  mrpList: MaterialResourcePosting[];
  noMrp: boolean = true;

  newFulFillment: Fulfillment;
  loggedInUser: User;
  mrpToFulfill: MaterialResourcePosting;
  mraList: MaterialResourceAvailable[];
  noMra: boolean = true;
  mraToDonate: MaterialResourceAvailable;
  isValid: boolean = false;

  standardConversion: number;
  maxQuantity: number;
  quantityToDonate: number;
  convertedQuantityToDonate: number;
  

  constructor(private sessionService: SessionService,
    private mrpService: MaterialResourcePostingService,
    private projectService: ProjectService,
    private tagService: TagService,
    private mraService: MaterialResourceAvailableService,
    private fulfillmentService: FulfillmentService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
      this.newFulFillment = new Fulfillment;
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }, 
      error => {
        this.router.navigate(["/error"]);
      }
    );

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.tags = response;
      }
    );

    this.mrpService.getMrpByProject(this.projectId).subscribe(
      response => {
        this.mrpList = response;
        if (this.mrpList.length > 0) {
          this.noMrp = false;
        }
      }
    );

    this.mraService.getMaterialResourceAvailable(this.loggedInUser.userId).subscribe(
      response => {
        this.mraList = response;
        if (this.mraList.length > 0) {
          this.noMra = false;
        }
      }
    )
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  clickFulfill(mrpToFulfill: MaterialResourcePosting) {
    this.mrpToFulfill = mrpToFulfill;
  }

  clickSelect(mraToDonate: MaterialResourceAvailable) {
    var mrpEndDate = new Date(
      parseInt(this.mrpToFulfill.endDate.toString().substring(0, 4)),
      parseInt(this.mrpToFulfill.endDate.toString().substring(5, 7)) - 1,
      parseInt(this.mrpToFulfill.endDate.toString().substring(8, 10)),
      parseInt(this.mrpToFulfill.endDate.toString().substring(11, 13)),
      parseInt(this.mrpToFulfill.endDate.toString().substring(14, 16)),
      parseInt(this.mrpToFulfill.endDate.toString().substring(17, 19))
    )
    try {
      if (mraToDonate.units != this.mrpToFulfill.unit) {
        this.standardConversion = convert(1).from(mraToDonate.units).to(this.mrpToFulfill.unit);
        this.maxQuantity = Math.min(mraToDonate.quantity, convert(this.mrpToFulfill.lackingQuantity).from(this.mrpToFulfill.unit).to(mraToDonate.units));
      } else {
        this.maxQuantity = Math.min(mraToDonate.quantity, this.mrpToFulfill.lackingQuantity);
      }
      if(mraToDonate.startDate != null && mraToDonate.endDate < mrpEndDate) {
          $(document).Toasts('create', {
            class: 'bg-warning',
            title: 'Expired Resource',
            autohide: true,
            delay: 5000,
            body: 'The resource donated will expire before the end date of Material Resource Posting',
          });
      } else {
        this.mraToDonate = mraToDonate;
      }
      
    } catch (Error) { 
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Incompatible Units',
        autohide: true,
        delay: 5000,
        body: 'Please change the units of your Material Resource Available to match the Material Resource Posting',
      });
    }
  }

  cancel(){
    this.mraToDonate = null;
    this.standardConversion = null;
  }

  onChange(quantity: number): void {  
    this.convertedQuantityToDonate = convert(quantity).from(this.mraToDonate.units).to(this.mrpToFulfill.unit);
  }

  submit() {
    if(this.convertedQuantityToDonate > this.mrpToFulfill.lackingQuantity){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Donated quantity cannot be more than required quantity',
      });
    } else if(this.quantityToDonate > this.mraToDonate.quantity) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 4000,
        body: 'Donated quantity cannot be more than the quantity stated in your Material Resource Available',
      });
    } else {
      this.newFulFillment.totalPledgedQuantity = this.convertedQuantityToDonate; //using mrp's units
      this.newFulFillment.mra = new MaterialResourceAvailable();
      this.newFulFillment.posting = new MaterialResourcePosting();
      this.newFulFillment.mra.quantity = this.mraToDonate.quantity - this.quantityToDonate;
      this.newFulFillment.posting.lackingQuantity = this.mrpToFulfill.lackingQuantity - this.convertedQuantityToDonate;
      this.newFulFillment.posting.obtainedQuantity = this.mrpToFulfill.obtainedQuantity + this.convertedQuantityToDonate;
      this.fulfillmentService.createNewFulfillment(this.newFulFillment, this.loggedInUser.userId, this.mrpToFulfill.materialResourcePostingId, this.mraToDonate.mraId).subscribe(
        response => {
          $('#modal-fulfill-posting').modal('hide');

          this.mrpService.getMrpByProject(this.projectId).subscribe(
            response => {
              this.mrpList = response;
              if (this.mrpList.length > 0) {
                this.noMrp = false;
              }
            }
          );
          
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Fulfill Posting is created successfully',
          })
        },
        error => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            title: 'Warning',
            autohide: true,
            delay: 4000,
            body: 'Unable to create Fulfill Posting',
          });
        }
      )
    }
  }

}
