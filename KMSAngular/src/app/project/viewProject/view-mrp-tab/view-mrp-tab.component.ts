import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
import { NgForm } from '@angular/forms';
import { MraType } from 'src/app/classes/mra-type.enum';

declare var $: any;

@Component({
  selector: 'app-view-mrp-tab',
  templateUrl: './view-mrp-tab.component.html',
  styleUrls: ['./view-mrp-tab.component.css']
})
export class ViewMrpTabComponent implements OnInit {

  isMember: boolean = false;
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

  newMra: MaterialResourceAvailable;
  mraTags: Tag[];
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };
  minDate = new Date().toISOString().slice(0, 10);
  startDate: string;
  endDate: string;

  mraToDonate: MaterialResourceAvailable;
  totalPledgedQuantity: number;

  constructor(private sessionService: SessionService,
    private mrpService: MaterialResourcePostingService,
    private projectService: ProjectService,
    private tagService: TagService,
    private mraService: MaterialResourceAvailableService,
    private fulfillmentService: FulfillmentService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
      this.newFulFillment = new Fulfillment();
      this.mraList = new Array();
      this.newMra = new MaterialResourceAvailable();
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        for (let member of this.project.projectMembers) {
          if (this.loggedInUser.userId == member.userId) {
            this.isMember = true;
          }
        }
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
        this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        if (this.mrpList.length > 0) {
          this.noMrp = false;
        }
      }
    );
    this.mraService.getMaterialResourceAvailable(this.loggedInUser.userId).subscribe(
      response => {
        this.mraList = response;
        console.log(this.mraList);
        if (this.mraList.length > 0) {
          this.noMra = false;
        }
      }
    );
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mraTags = response;
      $('#mraselect2').select2({
        data: this.mraTags.map((item) => {
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
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  clickFulfill(mrpToFulfill: MaterialResourcePosting) {
    this.mrpToFulfill = mrpToFulfill;
  }

  clickAddMra(){
    this.newMra = new MaterialResourceAvailable();
    this.newMra.name = this.mrpToFulfill.name;
    this.newMra.units = this.mrpToFulfill.unit;
    this.newMra.tags = this.mrpToFulfill.tags;
    $('#mraselect2').val(this.mrpToFulfill.tags.map((tag) => tag.name)).trigger('change');
    $('#modal-fulfill-posting').hide();
  }

  click(event: google.maps.MouseEvent) {
    this.newMra.latitude = event.latLng.lat().toString();
    this.newMra.longitude = event.latLng.lng().toString();
  }

  createMaterialResourceRequest(mraForm: NgForm) {
    if (mraForm.valid) {
      this.newMra.materialResourceAvailableOwner = this.loggedInUser;
      this.newMra.units = this.newMra.type != MraType.ONETIMEDONATION ? this.newMra.units : null;
      console.log(this.newMra)
      this.mraService.createMaterialResourceAvailable(this.newMra).subscribe(
        (response) => {
          this.mraService.getMaterialResourceAvailable(this.loggedInUser.userId).subscribe(
            response => {
              this.mraList = response;
              if (this.mraList.length > 0) {
                this.noMra = false;
              }
            }
          );
          $('#createMraModalCloseBtn').click();
          $('#modal-fulfill-posting').show();
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Material Resource Available is successfully created',
          })
        }
      );
    }
  }

  closeCreateMraForm() {
    $('#modal-fulfill-posting').show();
  }

  clickSelect(mraToDonate: MaterialResourceAvailable) {
    if (mraToDonate.units != this.mrpToFulfill.unit) { //different unit also can as price offered will be based on mrp's unit
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Incompatible Units',
        autohide: true,
        delay: 5000,
        body: 'Please change the units of the resource or create a new Material Resource Available',
      });
      return;
    }
    this.mraToDonate = mraToDonate;
  }

  cancel(){
    this.newFulFillment = new Fulfillment();
    this.mraToDonate = null;
    this.totalPledgedQuantity = null;
  }

  submit() {
    if(this.totalPledgedQuantity == null){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Donated quantity is required',
      });
    } else if(!(this.totalPledgedQuantity > 0)){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Donated quantity is invalid',
      });
    } else if(this.totalPledgedQuantity > this.mrpToFulfill.lackingQuantity){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Fulfill Posting',
        autohide: true,
        delay: 3200,
        body: 'Donated quantity cannot be more than required quantity',
      });
    } else {
      this.newFulFillment.totalPledgedQuantity = this.totalPledgedQuantity;
      this.fulfillmentService.createNewFulfillment(this.newFulFillment, this.loggedInUser.userId, this.mrpToFulfill.materialResourcePostingId, this.mraToDonate.mraId).subscribe(
        response => {
          this.mrpService.getMrpByProject(this.projectId).subscribe(
            response => {
              this.mrpList = response;
              this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
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
          );
          this.newFulFillment = new Fulfillment();
          this.mraToDonate = null;
          this.totalPledgedQuantity = null;
          $('#fulfillPostingModalCloseBtn').click();
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Fulfillment is successfully created',
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
