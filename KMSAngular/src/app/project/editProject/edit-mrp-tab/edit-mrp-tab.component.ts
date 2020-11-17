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

declare var $: any;

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
  rejected: boolean = false;

  mrpToRecommend: MaterialResourcePosting;
  mraRecommendations: MaterialResourceAvailable[];

  constructor(public projectService: ProjectService,
    public materialResourcePostingService: MaterialResourcePostingService,
    private fulfillmentService: FulfillmentService,
    public tagService: TagService,
    public matchingService: MatchingService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private notificationService: NotificationService,
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
    this.mrpToRecommend = new MaterialResourcePosting;
    this.mraRecommendations = [];
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
  }

  clickNewLocation(event: google.maps.MouseEvent) {
    console.log(event);
    this.newMrp.latitude = event.latLng.lat();
    this.newMrp.longitude = event.latLng.lng();
  }


  createMrp(createMrpForm: NgForm) {
    this.selectedTagIds = [];
    this.selectedTagNames = $('#mrpselect2').val();
    if (!createMrpForm.valid) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Material Resource Posting',
        autohide: true,
        delay: 3000,
        body: 'Please fill in required fields marked with *',
      });
    }
    /*
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Material Resource Posting',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
    }
    */
    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTagIds.push(element.tagId);
      }
    });

    if (createMrpForm.valid) {
      console.log(this.newMrp);
      if (this.newMrp.startDate > this.newMrp.endDate) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: 'End Date cannot be earlier than Start Date',
        });
        return;
      } else {
        this.newMrp.startDate = new Date(this.newMrp.startDate);
        this.newMrp.endDate = new Date(this.newMrp.endDate);
      }
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
          $('#modal-create-mrp').modal('hide');
          
          let currentUser = this.sessionService.getCurrentUser();
          let newNotification = new Notification();
          newNotification.msg = "A new Material Resource Posting has been added to " + this.projectToEdit.name;
          newNotification.projectId = this.projectId;
          newNotification.groupId = null;
          newNotification.projectTab = "mrp-tab";
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
    this.materialResourcePostingService.getMrp(mrp.materialResourcePostingId).subscribe(
      response => {
        this.mrpToEdit = response;

        $('#editmrpselect2').val(this.mrpToEdit.tags.map((tag) => tag.name)).trigger('change');
        this.editMrpStartDate = this.mrpToEdit.startDate.toString().substring(0, 10);
        this.editMrpEndDate = this.mrpToEdit.endDate.toString().substring(0, 10);

        this.fulfillmentService.getFulfillmentsByMrp(this.mrpToEdit.materialResourcePostingId).subscribe(
          response => {
            this.mrpToEdit.fulfillments = response;
            console.log(this.mrpToEdit.fulfillments.length);
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
        })
      }
    )
  }

  clickEditLocation(event: google.maps.MouseEvent) {
    console.log(event);
    this.mrpToEdit.latitude = event.latLng.lat();
    this.mrpToEdit.longitude = event.latLng.lng();
  }

  editMrp(editMrpForm: NgForm) {
    let selectedTags = [];
    this.selectedTagNames = $('#editmrpselect2').val();
    if (!editMrpForm.valid) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Material Resource Posting',
        autohide: true,
        delay: 3000,
        body: 'Please fill in required fields marked with *',
      });
    }
    /*
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Material Resource Posting',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
    }
    */
    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });

    if (editMrpForm.valid) {
      if (this.editMrpStartDate > this.editMrpEndDate) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: 'End Date cannot be earlier than Start Date',
        });
        return;
      } else {
        this.mrpToEdit.startDate = new Date(this.editMrpStartDate);
        this.mrpToEdit.endDate = new Date(this.editMrpEndDate);
      }

      var totalPledgedQuantity: number = 0;
      this.mrpToEdit.fulfillments.forEach((element) => {
        totalPledgedQuantity += element.totalPledgedQuantity;
      });
      if (this.mrpToEdit.totalQuantity < totalPledgedQuantity) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: 'Quantity required cannot be less than total pledged quantity',
        });
        return;
      } else {
        this.mrpToEdit.lackingQuantity = this.mrpToEdit.totalQuantity - totalPledgedQuantity;
      }
      this.mrpToEdit.tags = selectedTags;
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
          $('#modal-edit-mrp').modal('hide');

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

        var unreceivedQuantity: number = 0;
        this.mrpToDelete.fulfillments.forEach((element) => {
          unreceivedQuantity += element.unreceivedQuantity;
        });

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
        this.mraRecommendations = response;
        this.mraRecommendations.splice(10);
        console.log("Recommendations" + this.mraRecommendations);
      }
    )
  }

  filter() {
    this.filteredList = this.fulfillmentList;
    if (this.searchInput && this.searchInput != "") {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
          var name = fulfillment.fulfillmentOwner.firstName + " " + fulfillment.fulfillmentOwner.lastName;
          return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.mra.description.toLowerCase().includes(this.searchInput.toLowerCase())
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
    if (this.fulfilled == true) {
      statusSelected.push(FulfillmentStatus.FULFILLED);
    }

    if (statusSelected.length != 0 && statusSelected.length != 4) {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
          return statusSelected.indexOf(fulfillment.status) > -1;
        });
    }
  }

  closeModal() {
    this.fulfillmentList = new Array();
  }

  get fulfillmentStatus(): typeof FulfillmentStatus {
    return FulfillmentStatus;
  }

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
          this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
          this.quantityReceived = null;
          $('#modal-fulfillments').show();
          $('#receiveModalCloseBtn').click();
        }
      )
    }
  }

  clickUpdate(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    this.maxQuantity = Math.max((this.fulfillmentToUpdate.totalPledgedQuantity + this.mrpToFulfill.lackingQuantity), (this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.mra.quantity));
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
    } else if (this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.mra.quantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be more than available quantity of user',
      });
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED && this.fulfillmentToUpdate.totalPledgedQuantity > this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate).subscribe(
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

  clickAcceptReject(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    $('#modal-fulfillments').hide();
  }

  acceptFulfillment() {
    this.fulfillmentService.acceptFulfillment(this.fulfillmentToUpdate.fulfillmentId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Fulfillment is accepted sucessfully',
        });
        this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
        $('#modal-fulfillments').show();
      }
    )
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
        this.refreshFulfillment(this.mrpToFulfill.materialResourcePostingId);
        $('#modal-fulfillments').show();
      }
    )
  }

  close() {
    $('#modal-fulfillments').show();
  }

}
