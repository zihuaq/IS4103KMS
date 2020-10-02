import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FulfillmentService } from 'src/app/fulfillment.service';
import { MaterialResourcePosting } from '../../../../classes/material-resource-posting';
import { Fulfillment } from '../../../../classes/fulfillment';
import { FulfillmentStatus } from 'src/app/classes/fulfillment-status.enum';

declare var $: any;

@Component({
  selector: 'app-manage-fulfillments',
  templateUrl: './manage-fulfillments.component.html',
  styleUrls: ['./manage-fulfillments.component.css']
})
export class ManageFulfillmentsComponent implements OnInit {

  @Input() mrp: MaterialResourcePosting;

  projectId: number;
  fulfillmentList: Fulfillment[];
  noFulfillments: boolean = true;
  fulfillmentToUpdate: Fulfillment;

  maxQuantity: number;
  quantityReceived: number;

  newTotalPledgedQuantity: number;

  constructor(private fulfillmentService: FulfillmentService,
    private activatedRoute: ActivatedRoute) {
      this.fulfillmentList = new Array();
      this.fulfillmentToUpdate = new Fulfillment;
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

  }

  clickFulfillment(mrp: MaterialResourcePosting){
    this.mrp = mrp;
    this.fulfillmentService.getFulfillmentsByMrp(this.mrp.materialResourcePostingId).subscribe(
      response => {
        this.fulfillmentList = response;
        console.log(this.fulfillmentList);
        this.fulfillmentList.forEach((element) => {
          if (element.status != FulfillmentStatus.REJECTED) {
            this.noFulfillments = false;
          }
        });
      }
    )
  }

  closeModal() {
    this.fulfillmentList = new Array();
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  clickReceive(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    this.maxQuantity = this.fulfillmentToUpdate.unreceivedQuantity;
    $('#modal-fulfillments').hide();
  }

  receiveFulfillment() {
    if (this.quantityReceived > this.maxQuantity) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Incorrect Quantity Received',
        autohide: true,
        delay: 3500,
        body: 'Quantity received cannot be more than quantity unreceived',
      });
    } else {
      this.fulfillmentToUpdate.receivedQuantity += this.quantityReceived;
      if (this.quantityReceived == this.fulfillmentToUpdate.unreceivedQuantity) { //fully received
        this.fulfillmentToUpdate.unreceivedQuantity = 0;
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else { //partially received
        this.fulfillmentToUpdate.unreceivedQuantity -= this.quantityReceived;
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.receiveResource(this.fulfillmentToUpdate).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Fulfillment is updated sucessfully',
          });
          this.fulfillmentService.getFulfillmentsByMrp(this.mrp.materialResourcePostingId).subscribe(
            response => {
              this.fulfillmentList = response;
              this.fulfillmentList.forEach((element) => {
                if (element.status != FulfillmentStatus.REJECTED) {
                  this.noFulfillments = false;
                }
              });
            }
          )
          $('#modal-fulfillments').show();
        }
      )
    }
  }

  clickUpdate(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
    $('#modal-fulfillments').hide();
  }

  updateQuantity() {
    if(this.newTotalPledgedQuantity < this.fulfillmentToUpdate.receivedQuantity) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be less than quantity received',
      });
    } else if(this.newTotalPledgedQuantity > this.mrp.lackingQuantity) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be more than quantity required',
      });
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      }
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Total pledged quantity of fulfillment is updated sucessfully',
          });
          this.fulfillmentService.getFulfillmentsByMrp(this.mrp.materialResourcePostingId).subscribe(
            response => {
              this.fulfillmentList = response;
              this.fulfillmentList.forEach((element) => {
                if (element.status != FulfillmentStatus.REJECTED) {
                  this.noFulfillments = false;
                }
              });
            }
          )
          $('#modal-fulfillments').show();
        }
      )
    }
  }

  clickReject(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    $('#modal-fulfillments').hide();
  }

  rejectFulfillment() {
    this.fulfillmentService.rejectFulfillment(this.fulfillmentToUpdate.fulfillmentId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Fulfillment is rejected sucessfully',
        });
        this.fulfillmentService.getFulfillmentsByMrp(this.mrp.materialResourcePostingId).subscribe(
          response => {
            this.fulfillmentList = response;
            this.fulfillmentList.forEach((element) => {
              if (element.status != FulfillmentStatus.REJECTED) {
                this.noFulfillments = false;
              }
            });
          }
        )
        $('#modal-fulfillments').show();
      }
    )
  }

  cancel() {
    $('#modal-fulfillments').show();
  }

}
