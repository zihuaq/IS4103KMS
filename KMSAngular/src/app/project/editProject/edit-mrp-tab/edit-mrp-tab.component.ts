import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { ProjectService } from 'src/app/project.service';
import { TagService } from '../../../tag.service';
import { MatchingService } from '../../../matching.service';
import { MaterialResourcePosting } from '../../../classes/material-resource-posting';
import { MaterialResourcePostingService } from '../../../material-resource-posting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FulfillmentService } from '../../../fulfillment.service';
import { Fulfillment } from '../../../classes/fulfillment';
import { FulfillmentStatus } from 'src/app/classes/fulfillment-status.enum';
import { filter } from 'rxjs/operators';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/notification.service';
import { MrpMatchesRsp } from 'src/app/models/MrpMatchesRsp';
import { MrpStatus } from 'src/app/classes/mrp-status.enum';
import { MraType } from 'src/app/classes/mra-type.enum';
import { Payment } from '../../../classes/payment';
import { PaymentService } from '../../../payment.service';
import * as moment from 'moment';
import { PaymentStatus } from 'src/app/classes/payment-status.enum';

declare var $: any;
declare let paypal: any;

@Component({
  selector: 'app-edit-mrp-tab',
  templateUrl: './edit-mrp-tab.component.html',
  styleUrls: ['./edit-mrp-tab.component.css']
})
export class EditMrpTabComponent implements OnInit {
  projectToEdit: Project;
  projectId: number;

  newMrp: MaterialResourcePosting;
  mrpToEdit: MaterialResourcePosting;
  mrpToDelete: MaterialResourcePosting;
  mrpList: MaterialResourcePosting[];
  noMrp: boolean = true;

  minDate = new Date().toISOString().slice(0, 10);
  editMrpStartDate: string;
  editMrpEndDate: string;

  mrpTags: Tag[];
  selectedTagIds: number[];
  selectedTagNames: string[];

  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };

  mrpToFulfill: MaterialResourcePosting;
  fulfillmentList: Fulfillment[];
  noFulfillments: boolean = true;
  fulfillmentToUpdate: Fulfillment;

  maxQuantity: number;
  quantityReceived: number;
  newTotalPledgedQuantity: number;

  filteredList: Fulfillment[];
  searchInput: string;
  pledged: boolean = false;
  accepted: boolean = false;
  partiallyfulfilled: boolean = false;
  fulfilled: boolean = false;
  ongoing: boolean = false;
  ended: boolean = false;

  mrpToRecommend: MaterialResourcePosting;
  mrpMatches: MrpMatchesRsp[];

  addScript: boolean = false;
  paymentAmount: number;
  newPayment: Payment;
  hasIsLast: boolean = false;
  outstandingAmount: number;
  currentAmount: number;
  earliestDate: Date;
  latestDate: Date;
  paymentIds: number[];

  constructor(public projectService: ProjectService,
    public materialResourcePostingService: MaterialResourcePostingService,
    private fulfillmentService: FulfillmentService,
    public tagService: TagService,
    public matchingService: MatchingService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private router: Router) {
    this.projectToEdit = new Project();
    this.newMrp = new MaterialResourcePosting();
    this.mrpToEdit = new MaterialResourcePosting;
    this.mrpToEdit.fulfillments = new Array();
    this.mrpToDelete = new MaterialResourcePosting;
    this.mrpList = [];
    this.fulfillmentList = [];
    this.mrpToFulfill = new MaterialResourcePosting;
    this.fulfillmentToUpdate = new Fulfillment;
    this.fulfillmentToUpdate.mra = new MaterialResourceAvailable;
    this.mrpToRecommend = new MaterialResourcePosting;
    this.mrpMatches = [];
    this.newPayment = new Payment;
  }

  ngOnInit(): void {
    /*
    $(document).ready(function() {
      $('#unitselect2').select2({
        placeholder: 'Select a Unit'
      });
    });
    */

    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
      },
      error => {
        this.router.navigate(["/error"]);
      }
    );

    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mrpTags = response;
      $('#mrpselect2').select2({
        data: this.mrpTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
      $('#editmrpselect2').select2({
        data: this.mrpTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
      response => {
        this.mrpList = response;
        this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        if (this.mrpList.length > 0) {
          this.noMrp = false;
        }
      }
    );

    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Buttons(this.paypalConfigUpdateFulfillment).render('#paypal-checkout-btn-update');
        paypal.Buttons(this.paypalConfigReceiveResource).render('#paypal-checkout-btn-receive');
        paypal.Buttons(this.paypalConfigMakePayment).render('#paypal-checkout-btn-recurring');
      })
    }
  }

  clickNewLocation(event: google.maps.MouseEvent) {
    this.newMrp.latitude = event.latLng.lat();
    this.newMrp.longitude = event.latLng.lng();
  }

  cancelStartDate(mrp: MaterialResourcePosting) {
    if (!mrp.materialResourcePostingId) {
      this.newMrp.startDate = undefined;
    } else {
      this.editMrpStartDate = undefined;
    }
  }

  cancelEndDate(mrp: MaterialResourcePosting) {
    if (!mrp.materialResourcePostingId) {
      this.newMrp.endDate = undefined;
    } else {
      this.editMrpEndDate = undefined;
    }
  }

  createMrp(createMrpForm: NgForm) {
    this.selectedTagIds = [];
    this.selectedTagNames = $('#mrpselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Material Resource Posting',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
      return;
    }
    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTagIds.push(element.tagId);
      }
    });

    if (createMrpForm.valid) {
      this.newMrp.startDate = new Date(this.newMrp.startDate);
      this.newMrp.endDate = this.newMrp.endDate ? new Date(this.newMrp.endDate) : null;
      console.log(this.newMrp);
      this.materialResourcePostingService.createNewMrp(this.newMrp, this.projectToEdit.projectId, this.selectedTagIds).subscribe(
        response => {
          this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
            response => {
              this.mrpList = response;
              this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
              if (this.mrpList.length > 0) {
                this.noMrp = false;
              }
            }
          )
          $('#createMrpModalCloseBtn').click();
          
          let currentUser = this.sessionService.getCurrentUser();
          let newNotification = new Notification();
          newNotification.msg = "A new Material Resource Posting has been added to " + this.projectToEdit.name;
          newNotification.projectId = this.projectId;
          newNotification.groupId = null;
          newNotification.tabName = "mrp-tab";
          for (let member of this.projectToEdit.projectMembers) {
            if (member.userId != currentUser.userId) {
              this.notificationService.createNewNotification(newNotification, member.userId).subscribe();
            }
          }

          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Material Resource Posting created successfully',
          })

          $('#mrpselect2').val(null).trigger('change');
          this.selectedTagIds = [];
          this.newMrp = new MaterialResourcePosting();
        });
    }
  }

  clickEditMrp(mrp: MaterialResourcePosting) {
    //check if have ONGOING fulfillments, if have cannot edit
    this.materialResourcePostingService.getMrp(mrp.materialResourcePostingId).subscribe(
      response => {
        this.mrpToEdit = response;

        this.fulfillmentService.getFulfillmentsByMrp(this.mrpToEdit.materialResourcePostingId).subscribe(
          response => {
            this.mrpToEdit.fulfillments = response;
            console.log(this.mrpToEdit.fulfillments.length);

            var invalid: boolean = false;
            this.mrpToEdit.fulfillments.map((fulfillment) => {
              if (fulfillment.status != FulfillmentStatus.REJECTED && fulfillment.status != FulfillmentStatus.FULFILLED) {
                invalid = true;
                return;
              }
            })
            if (invalid) {
              $(document).Toasts('create', {
                class: 'bg-warning',
                title: 'Warning',
                autohide: true,
                delay: 3500,
                body: 'Material Resource Posting cannot be edited as there are pending and/or ongoing fulfillments',
              });
            } else {
              $('#editmrpselect2').val(this.mrpToEdit.tags.map((tag) => tag.name)).trigger('change');
              this.editMrpStartDate = this.mrpToEdit.startDate.toString().substring(0, 10);
              this.editMrpEndDate = this.mrpToEdit.endDate ? this.mrpToEdit.endDate.toString().substring(0, 10) : undefined;
              $('#modal-edit-mrp').modal('show');
            }
          }
        )
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }

  clickEditLocation(event: google.maps.MouseEvent) {
    this.mrpToEdit.latitude = event.latLng.lat();
    this.mrpToEdit.longitude = event.latLng.lng();
  }

  editMrp(editMrpForm: NgForm) {
    let selectedTags = [];
    this.selectedTagNames = $('#editmrpselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Material Resource Posting',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
      return;
    }
    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });

    if (editMrpForm.valid) {
      this.mrpToEdit.startDate = new Date(this.editMrpStartDate);
      this.mrpToEdit.endDate = this.editMrpEndDate ? new Date(this.editMrpEndDate) : null;

      var totalPledgedQuantity: number = 0;
      this.mrpToEdit.fulfillments.forEach((fulfillment) => {
        if (fulfillment.status != FulfillmentStatus.REJECTED) {
          totalPledgedQuantity += fulfillment.totalPledgedQuantity;
        }
      });
      if (this.mrpToEdit.totalQuantity < totalPledgedQuantity) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Unable to edit Material Resource Posting',
          autohide: true,
          delay: 2500,
          body: 'Quantity required cannot be less than total pledged quantity',
        });
        return;
      }
      this.mrpToEdit.lackingQuantity = this.mrpToEdit.totalQuantity - totalPledgedQuantity;
      this.mrpToEdit.tags = selectedTags;
      console.log(this.mrpToEdit);
      this.materialResourcePostingService.updateMrp(this.mrpToEdit).subscribe(
        response => {
          this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
            response => {
              this.mrpList = response;
              this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
              if (this.mrpList.length > 0) {
                this.noMrp = false;
              }
            }
          )
          $('#editMrpModalCloseBtn').click();

          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Material Resource Posting updated successfully',
          })
        });
    }
  }

  cancel() {
    this.selectedTagIds = [];
    $('#mrpselect2').val(null).trigger('change');
    this.newMrp = new MaterialResourcePosting();
  }

  clickDeleteMrp(mrp: MaterialResourcePosting) {
    this.mrpToDelete = mrp;
    this.fulfillmentService.getFulfillmentsByMrp(this.mrpToDelete.materialResourcePostingId).subscribe(
      response => {
        this.mrpToDelete.fulfillments = response;
        
        if (this.mrpToDelete.fulfillments.length > 0) {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 3500,
            body: 'Material Resource Posting cannot be deleted as there are fulfillments', 
          });
        } else {
          $('#modal-confirm-delete-mrp').modal('show');
        }
      }
    )
  }

  deleteMrp() {
    this.materialResourcePostingService.deleteMrp(this.mrpToDelete.materialResourcePostingId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Material resource posting deleted successfully',
        });
        this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
          response => {
            this.mrpList = response;
          }
        );
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  clickFulfillment(mrp: MaterialResourcePosting) {
    this.mrpToFulfill = mrp;
    this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
  }

  refreshFulfillment(mrpId: number) {
    this.fulfillmentService.getFulfillmentsByMrp(mrpId).subscribe(
      response => {
        this.fulfillmentList = response;
        var list: Fulfillment[] = [];
        this.fulfillmentList.forEach(
          (fulfillment: Fulfillment) => {
            if (fulfillment.status != FulfillmentStatus.REJECTED) {
              list.push(fulfillment);
            }
          });
        this.fulfillmentList = list;
        this.filter();
      }
    )
  }

  clickRecommendation(mrp: MaterialResourcePosting) {
    this.mrpToRecommend = mrp;
    this.refreshRecommendations(this.mrpToRecommend.materialResourcePostingId);
  }

  refreshRecommendations(mrpId: number) {
    this.matchingService.getMatchesForMrp(mrpId).subscribe(
      response => {
        this.mrpMatches = response;
        this.mrpMatches.splice(10);
        console.log("Recommendations" + this.mrpMatches);
      }
    )
  }

  filter() {
    this.filteredList = this.fulfillmentList;
    if (this.searchInput && this.searchInput != "") {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
          var name = fulfillment.fulfillmentOwner.firstName + " " + fulfillment.fulfillmentOwner.lastName;
          if (fulfillment.mra.description) {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.mra.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
          
        }
      )
    }
    var statusSelected = [];
    if (this.pledged == true) {
      statusSelected.push(FulfillmentStatus.PLEDGED);
    }
    if (this.accepted == true) {
      statusSelected.push(FulfillmentStatus.ACCEPTED);
    }
    if (this.partiallyfulfilled == true) {
      statusSelected.push(FulfillmentStatus.PARTIALLYFULFILLED);
    }
    if (this.ongoing == true) {
      statusSelected.push(FulfillmentStatus.ONGOING);
    }
    if (this.ended == true) {
      statusSelected.push(FulfillmentStatus.ENDED);
    }
    if (this.fulfilled == true) {
      statusSelected.push(FulfillmentStatus.FULFILLED);
    }

    if (statusSelected.length != 0 && statusSelected.length != 6) {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
          return statusSelected.indexOf(fulfillment.status) > -1;
        });
    }
  }

  closeModal() {
    this.fulfillmentList = new Array();
    this.searchInput = undefined;
  }

  get fulfillmentStatus(): typeof FulfillmentStatus {
    return FulfillmentStatus;
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script'); //<script src=""></script>
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement); 
    })
  }

  paypalConfigReceiveResource = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      console.log("receiveResource");
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.paymentAmount
          },
          description: 'Payment for ' + this.mrpToFulfill.name
        }]
      });
      
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        this.newPayment = new Payment();
        this.newPayment.dueDate = null;
        this.newPayment.previousDueDate = null;
        this.newPayment.paypalOrderId = details.id;
        this.newPayment.amount = this.paymentAmount;
        this.newPayment.status = PaymentStatus.COMPLETED;
        this.newPayment.isLast = true;

        console.log(this.newPayment);
        this.fulfillmentToUpdate.receivedQuantity += this.quantityReceived;
        this.fulfillmentToUpdate.unreceivedQuantity = 0;
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
        this.fulfillmentService.receiveResource(this.fulfillmentToUpdate, this.newPayment).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 3000,
              body: 'Payment for ' + this.mrpToFulfill.name + ' is successful',
            });
            this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
            this.quantityReceived = null;
            $('#modal-fulfillments').show();
            $('#receiveModalCloseBtn').click();
            $('#receiveResourcePaymentModalCloseBtn').click();
          }
        )
      });
    },

    onError: (err) => {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Payment Unsuccessful',
        autohide: true,
        delay: 4000,
        body: 'An error occurred during payment',
      });
      $('#modal-receive').modal('show');
      console.log(err);
    }
  };

  clickReceive(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    this.maxQuantity = this.fulfillmentToUpdate.unreceivedQuantity;
    $('#modal-fulfillments').hide();
  }

  receiveFulfillment() {
    if (this.quantityReceived == null) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Quantity received is required',
      });
    } else if (!(this.quantityReceived > 0)) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Quantity received is invalid',
      });
    } else if (this.quantityReceived > this.maxQuantity) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Incorrect Quantity Received',
        autohide: true,
        delay: 3500,
        body: 'Quantity received cannot be more than quantity unreceived',
      });
    } else {
      if (this.quantityReceived == this.fulfillmentToUpdate.unreceivedQuantity && this.fulfillmentToUpdate.mra.type == MraType.ONETIMEPAYMENT) { //payment made
        this.paymentAmount = this.fulfillmentToUpdate.priceOffered * this.fulfillmentToUpdate.totalPledgedQuantity;
        $('#modal-receive').modal('hide');
        $('#modal-receive-resource-payment').modal('show');
      } else { //no payment made
        this.fulfillmentToUpdate.receivedQuantity += this.quantityReceived;
        if (this.quantityReceived == this.fulfillmentToUpdate.unreceivedQuantity) { //fully received
          this.fulfillmentToUpdate.unreceivedQuantity = 0;
          this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
        } else { //partially received
          this.fulfillmentToUpdate.unreceivedQuantity -= this.quantityReceived;
          this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
        }
        console.log(this.fulfillmentToUpdate);
        this.fulfillmentService.receiveResource(this.fulfillmentToUpdate, null).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Fulfillment is updated successfully',
            });
            this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
            this.quantityReceived = null;
            $('#modal-fulfillments').show();
            $('#receiveModalCloseBtn').click();
          }
        )
      }
      
    }
  }

  paypalConfigUpdateFulfillment = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      console.log("updateFulfillment");
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.paymentAmount
          },
          description: 'Payment for ' + this.mrpToFulfill.name
        }]
      });
      
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        this.newPayment = new Payment();
        this.newPayment.dueDate = null;
        this.newPayment.previousDueDate = null;
        this.newPayment.paypalOrderId = details.id;
        this.newPayment.amount = this.paymentAmount;
        this.newPayment.status = PaymentStatus.COMPLETED;
        this.newPayment.isLast = true;

        console.log(this.newPayment);
        this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
        this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate, this.newPayment).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 3000,
              body: 'Payment for ' + this.mrpToFulfill.name + ' is successful',
            });
            this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
            $('#modal-fulfillments').show();
            $('#updateModalCloseBtn').click();
            $('#updateFulfillmentPaymentModalCloseBtn').click();
          }
        )
      });
    },

    onError: (err) => {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Payment Unsuccessful',
        autohide: true,
        delay: 4000,
        body: 'An error occurred during payment',
      });
      $('#modal-update').modal('show');
      console.log(err);
    }
  };

  clickUpdate(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    this.maxQuantity = this.fulfillmentToUpdate.totalPledgedQuantity + this.mrpToFulfill.lackingQuantity;
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
    $('#modal-fulfillments').hide();
  }

  updateQuantity() {
    if (this.newTotalPledgedQuantity == null) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3200,
        body: 'Total pledged quantity is required',
      });
    } else if (!(this.newTotalPledgedQuantity > 0)) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3200,
        body: 'Total pledged quantity is invalid',
      });
    } else if (this.newTotalPledgedQuantity < this.fulfillmentToUpdate.receivedQuantity) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be less than quantity received',
      });
    } else if (this.newTotalPledgedQuantity > (this.mrpToFulfill.lackingQuantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be more than quantity required',
      });
    } else {
      if (this.newTotalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity && this.fulfillmentToUpdate.mra.type == MraType.ONETIMEPAYMENT) { //payment made
        this.paymentAmount = this.fulfillmentToUpdate.priceOffered * this.newTotalPledgedQuantity;

        $('#modal-update').modal('hide');
        $('#modal-update-fulfillment-payment').modal('show');
      } else { //no payment made
        this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
        if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
          this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
        } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED && this.fulfillmentToUpdate.totalPledgedQuantity > this.fulfillmentToUpdate.receivedQuantity) {
          this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
        }
        this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate, null).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Total pledged quantity of fulfillment is updated successfully',
            });
            this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
            $('#modal-fulfillments').show();
            $('#updateModalCloseBtn').click();
          }
        )
      }
    }
  }

  closeReceivePayment() {
    $('#modal-receive').modal('show');
  }

  closeUpdatePayment() {
    $('#modal-update').modal('show');
  }

  clickAccept(fulfillment: Fulfillment) {
    if ((!moment(new Date()).isBefore(this.mrpToFulfill.startDate.toString().slice(0,15)))) { //if not before start date
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid',
        autohide: true,
        delay: 4000,
        body: 'Fulfillment cannot be accepted as posting has started',
      });
      return;
    }
    this.paymentService.getListOfOutstandingPaymentsByProject(this.projectId).subscribe(
      response => {
        if (response.length > 0) { //has outstanding payments
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Outstanding Payments',
            autohide: true,
            delay: 4000,
            body: 'Please complete all outstanding payments before accepting new fulfillments',
          });
          return;
        }
        this.fulfillmentToUpdate = fulfillment;
        $('#modal-fulfillments').hide();
        $('#modal-accept').modal('show');
      }
    )
  }

  acceptFulfillment() {
    this.fulfillmentService.acceptFulfillment(this.fulfillmentToUpdate.fulfillmentId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Fulfillment is accepted successfully',
        });
        this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
        $('#modal-fulfillments').show();
      }
    )
  }

  clickRejectEnd(fulfillment: Fulfillment) {
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
          body: 'Fulfillment is rejected successfully',
        });
        this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
        $('#modal-fulfillments').show();
        this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
          response => {
            this.mrpList = response;
            this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
            if (this.mrpList.length > 0) {
              this.noMrp = false;
            }
          }
        )
      }
    )
  }

  endSubscription() {
    this.fulfillmentService.endSubscription(this.fulfillmentToUpdate.fulfillmentId).subscribe(
      (response) => {
        var payment: Payment = response;
        var dueDate = payment.dueDate.toString();
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Subscription Ended Successfully',
          autohide: true,
          delay: 4000,
          body: 'Remember to pay by ' + moment(dueDate.slice(0, dueDate.indexOf("["))).format("MMM D, YYYY") + '!',
        });
        this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
        $('#modal-fulfillments').show();
      }
    )
  }

  clickMakePayment(fulfillment: Fulfillment) {
    this.paymentService.getListOfNotCompletedPaymentsByFulfillmentNewestToOldest(fulfillment.fulfillmentId).subscribe(
      response => {
        var paymentList: Payment[] = response;
        if (paymentList.length > 0) {
          this.hasIsLast = false;
          this.outstandingAmount = 0.0;
          this.currentAmount = 0.0;
          this.earliestDate = undefined;
          this.latestDate = undefined;
          this.paymentIds = [];

          paymentList.forEach((payment, index) => {
            this.paymentIds.push(payment.paymentId);
            if (payment.isLast) {
              this.hasIsLast = true;
            }
            if (payment.status == PaymentStatus.OUTSTANDING) { //outstanding payments
              this.outstandingAmount += payment.amount;
            } else { //current notdue payment
              this.currentAmount = payment.amount;
            }
            if (index == 0) { //latest date
              this.latestDate = payment.dueDate;
            } else if (paymentList.length > 1 && index == paymentList.length - 1) { //earliest date if more than one payment
              this.earliestDate = payment.dueDate;
            }
          })
          this.fulfillmentToUpdate = fulfillment;
          $('#modal-fulfillments').hide();
          $('#modal-make-payment').modal('show');
        } else {
          $(document).Toasts('create', {
            title: 'No Payment',
            autohide: true,
            delay: 3000,
            body: 'No payment needs to be made',
          });
        }
      }
    )
  }

  paypalConfigMakePayment = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      console.log("makePayment");
      var description: string;
      var lastDate = this.latestDate.toString();
      if (this.earliestDate) {
        var firstDate = this.earliestDate.toString();
        description = "Payment (" + moment(firstDate.slice(0, firstDate.indexOf("["))).format("MMM D, YYYY") + " to " 
          + moment(lastDate.slice(0, lastDate.indexOf("["))).format("MMM D, YYYY")
          + ") for " + this.mrpToFulfill.name;
      } else {
        description = "Payment (" + moment(lastDate.slice(0, lastDate.indexOf("["))).format("MMM D, YYYY")
          + ") for " + this.mrpToFulfill.name;
      }
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.roundToTwoDecimal(this.outstandingAmount * 1.05 + this.currentAmount) 
          },
          description: description
        }]
      });
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        if (this.hasIsLast) { //if has last payment
          this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
        }
        this.paymentService.makePayment(this.fulfillmentToUpdate, this.paymentIds, details.id).subscribe(
          response => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 4000,
              body: 'Payment for ' + this.mrpToFulfill.name + ' is successful',
            });
            this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
            $('#modal-fulfillments').show();
            $('#makePaymentModalCloseBtn').click();
          }
        )
      });
    },

    onError: (err) => {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Payment Unsuccessful',
        autohide: true,
        delay: 4000,
        body: 'An error occurred during payment',
      });
      console.log(err);
    }
  };

  get mraType(): typeof MraType {
    return MraType;
  }

  close() {
    $('#modal-fulfillments').show();
  }

  roundToTwoDecimal(amount) {
    return Math.round(amount * 100)/100;
  }

}
