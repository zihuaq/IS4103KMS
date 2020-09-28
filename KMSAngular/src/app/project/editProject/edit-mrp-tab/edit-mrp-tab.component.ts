import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from 'src/app/classes/project';
import { Tag } from 'src/app/classes/tag';
import { ProjectService } from 'src/app/project.service';
import { TagService } from '../../../tag.service';
import { MaterialResourcePosting } from '../../../classes/material-resource-posting';
import { MaterialResourcePostingService } from '../../../material-resource-posting.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(public projectService: ProjectService,
    public materialResourcePostingService: MaterialResourcePostingService,
    public tagService: TagService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.projectToEdit = new Project();
      this.newMrp = new MaterialResourcePosting();
      this.newMrp.latitude = 35.929673;
      this.newMrp.longitude = -78.948237;
      this.mrpToEdit = new MaterialResourcePosting;
      this.mrpList = [];
    }

  ngOnInit(): void {
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
    this.newMrp.lackingQuantity = this.newMrp.totalQuantity;
    this.newMrp.obtainedQuantity = 0;
    this.newMrp.startDate = new Date(createMrpForm.value.startDate);
    this.newMrp.endDate = new Date(createMrpForm.value.endDate);

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
      console.log(this.newMrp);
      this.materialResourcePostingService.createNewMrp(this.newMrp, this.projectToEdit.projectId, this.selectedTagIds).subscribe(
        response => {
          this.materialResourcePostingService.getMrpByProject(this.projectId).subscribe(
            response => {
              this.mrpList = response;
            }
          )
          $('#modal-create-mrp').modal('hide');
          
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
    this.mrpToEdit = mrp;
    $('#editmrpselect2').val(mrp.tags.map((tag) => tag.name)).trigger('change');
    console.log(this.mrpToEdit.startDate);
    console.log(this.mrpToEdit.endDate);
    this.editMrpStartDate = this.mrpToEdit.startDate.toString().substring(0, 10);
    this.editMrpEndDate = this.mrpToEdit.endDate.toString().substring(0, 10);
    console.log(this.editMrpStartDate);
    console.log(this.editMrpEndDate);

  }

  clickEditLocation(event: google.maps.MouseEvent) {
    console.log(event);
    this.mrpToEdit.latitude = event.latLng.lat();
    this.mrpToEdit.longitude = event.latLng.lng();
  }

  editMrp(editMrpForm: NgForm) {
    let selectedTags = [];
    this.selectedTagNames = $('#editmrpselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit skills tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one skills tags',
      });
    }

    this.mrpTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });

    if (editMrpForm.valid) {
      this.mrpToEdit.startDate = new Date(editMrpForm.value.startDate);
      this.mrpToEdit.endDate = new Date(editMrpForm.value.endDate);
      this.mrpToEdit.lackingQuantity = this.mrpToEdit.totalQuantity - this.mrpToEdit.obtainedQuantity;
      this.mrpToEdit.tags = selectedTags;
      this.materialResourcePostingService.updateMrp(this.mrpToEdit).subscribe(
        response => {
          $('#modal-edit-mrp').modal('hide');
          console.log(this.mrpToEdit.startDate);
          console.log(this.mrpToEdit.endDate);
          
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

}
