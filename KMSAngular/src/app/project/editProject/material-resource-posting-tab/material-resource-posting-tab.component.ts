import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { TagService } from 'src/app/tag.service';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { MaterialResourcePostingService } from 'src/app/material-resource-posting.service';

declare var $: any;

@Component({
  selector: 'app-material-resource-posting-tab',
  templateUrl: './material-resource-posting-tab.component.html',
  styleUrls: ['./material-resource-posting-tab.component.css']
})
export class MaterialResourcePostingTabComponent implements OnInit {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();

  newMrp: MaterialResourcePosting;

  minDate = new Date().toISOString().slice(0, 10);

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
  selectedLatitude: number;
  selectedLongitude: number;

  constructor(public projectService: ProjectService,
    public materialResourcePostingService: MaterialResourcePostingService,
    public tagService: TagService) {
      this.newMrp = new MaterialResourcePosting();
    }

  ngOnInit(): void {
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mrpTags = response;
      $('#mrpselect2').select2({
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
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.selectedLatitude = event.latLng.lat();
    this.selectedLongitude = event.latLng.lng();
  }

  createMaterialResourcePosting(createMrpForm: NgForm) {
    this.newMrp.name = createMrpForm.value.mrpName;
    this.newMrp.totalQuantity = createMrpForm.value.quantity;
    this.newMrp.lackingQuantity = createMrpForm.value.quantity;
    this.newMrp.obtainedQuantity = 0;
    this.newMrp.unit = createMrpForm.value.unit;
    this.newMrp.description = createMrpForm.value.description;
    this.newMrp.latitude = this.selectedLatitude;
    this.newMrp.longitude = this.selectedLongitude;
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
    }
    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTagIds.push(element.tagId);
      }
    });

    if (createMrpForm.valid) {
      if (new Date(createMrpForm.value.startDate).toJSON().slice(0, 10) > new Date(createMrpForm.value.endDate).toJSON().slice(0, 10)) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Unable to submit Material Resource Available',
          autohide: true,
          delay: 2500,
          body: 'End date should not come before the Start Date',
        });
      } else {
        this.newMrp.startDate = new Date(createMrpForm.value.startDate);
        this.newMrp.endDate = new Date(createMrpForm.value.endDate);
      }

      console.log(this.newMrp);
      this.materialResourcePostingService.createNewMrp(this.newMrp, this.projectToEdit.projectId, this.selectedTagIds).subscribe(
        response => {
          $('#modal-create-mrp').modal('hide');
          
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Material Resource Posting created successfully',
          })
        });  
    }
  }

}
