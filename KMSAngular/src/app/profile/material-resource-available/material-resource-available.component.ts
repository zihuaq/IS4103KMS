import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../classes/user';
import { TagService } from '../../tag.service';
import { Tag } from '../../classes/tag';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { MaterialResourceAvailableService } from 'src/app/mra.service';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';

declare var $: any;

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css'],
})
export class MaterialResourceAvailableComponent implements OnInit, OnChanges {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() userChanged = new EventEmitter<User>();
  mraTags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  newMra: MaterialResourceAvailable;
  minDate = new Date().toISOString().slice(0, 10);
  minEndDate = new Date().toISOString().slice(0, 10);
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };
  lat: string;
  lng: string;
  hasExpiry = false;
  editingMra: MaterialResourceAvailable;
  editingMraId: number;

  constructor(
    private tagService: TagService,
    private userService: UserService,
    private mraService: MaterialResourceAvailableService
  ) {}

  ngOnInit(): void {
    this.userService
      .getMaterialResourceAvailable(this.profile.userId)
      .subscribe((mras) => {
        this.profile = { ...this.profile, mras };
      });
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mraTags = response;
      $('#mraselect2').select2({
        data: this.mraTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
      $('#editmraselect2').select2({
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
    $('input[data-bootstrap-switch]').each(function () {
      $(this).bootstrapSwitch('state', $(this).prop('checked'));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mraTags = response;
      $('#mraselect2').select2({
        data: this.mraTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
      $('#editmraselect2').select2({
        data: this.mraTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
    this.profile = changes.profile.currentValue;
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.lat = event.latLng.lat().toString();
    this.lng = event.latLng.lng().toString();
  }

  createMaterialResourceRequest(mraForm: NgForm) {
    this.selectedTags = [];
    this.selectedTagNames = $('#mraselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Material Resource Available',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
      return;
    }
    this.mraTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    // if (mraForm.valid) {
    //   this.newMra = new MaterialResourceAvailable();
    //   this.newMra.materialResourceAvailableOwner = this.profile;
    //   this.newMra.name = mraForm.value.mraName;
    //   this.newMra.quantity = mraForm.value.quantity;
    //   this.newMra.units = mraForm.value.units;
    //   this.newMra.description = mraForm.value.description;
    //   this.newMra.latitude = this.lat;
    //   this.newMra.longitude = this.lng;
    //   if (this.hasExpiry) {
    //     if (new Date(mraForm.value.startDate).toJSON().slice(0, 10) > new Date(mraForm.value.endDate).toJSON().slice(0, 10)) {
    //       $(document).Toasts('create', {
    //         class: 'bg-warning',
    //         title: 'Unable to submit Material Resource Available',
    //         autohide: true,
    //         delay: 2500,
    //         body: 'End date should not come before the Start Date',
    //       });
    //       return;
    //     } else {
    //       this.newMra.startDate = new Date(mraForm.value.startDate);
    //       this.newMra.endDate = new Date(mraForm.value.endDate);
    //     }
    //   }
    //   this.newMra.tags = this.selectedTags;
    //   console.log(this.newMra);
    //   this.userService
    //     .createMaterialResourceAvailable(this.newMra)
    //     .subscribe((responsedata) => {
    //       this.profile.mras = responsedata;
    //     });

    //   $('#addMraModalCloseBtn').click();
    // }
    console.log();
  }

  editMaterialResourceRequest(mraForm: NgForm) {
    this.selectedTags = [];
    this.selectedTagNames = $('#editmraselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Material Resource Available',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Material Resource tags',
      });
      return;
    }
    this.mraTags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    // if (mraForm.valid) {
    //   this.newMra = new MaterialResourceAvailable();
    //   this.newMra.materialResourceAvailableOwner = this.profile;
    //   this.newMra.name = mraForm.value.mraName;
    //   this.newMra.quantity = mraForm.value.quantity;
    //   this.newMra.units = mraForm.value.units;
    //   this.newMra.description = mraForm.value.description;
    //   this.newMra.latitude = this.lat;
    //   this.newMra.longitude = this.lng;
    //   if (this.hasExpiry) {
    //     if (new Date(mraForm.value.startDate).toJSON().slice(0, 10) > new Date(mraForm.value.endDate).toJSON().slice(0, 10)) {
    //       $(document).Toasts('create', {
    //         class: 'bg-warning',
    //         title: 'Unable to edit Material Resource Available',
    //         autohide: true,
    //         delay: 2500,
    //         body: 'End date should not come before the Start Date',
    //       });
    //       return;
    //     } else {
    //       this.newMra.startDate = new Date(mraForm.value.startDate);
    //       this.newMra.endDate = new Date(mraForm.value.endDate);
    //     }
    //   }
    //   this.newMra.tags = this.selectedTags;
    //   this.newMra.mraId = this.editingMraId;
    //   console.log(this.newMra);
    //   this.mraService
    //     .updateMaterialResourceRequest(this.newMra)
    //     .subscribe((responsedata) => {
    //       this.profile.mras = responsedata;
    //     });

    //   $('#editMraModalCloseBtn').click();
    // }
  }

  deleteMra(mraId: number) {
    this.userService
      .deleteMaterialResourceAvailable(this.profile.userId, mraId)
      .subscribe((responsedata) => {
        this.profile.mras = responsedata;
      });
  }

  handleHasExpiryChange() {
    this.hasExpiry = !this.hasExpiry;
  }

  setEditingMra(mra: MaterialResourceAvailable) {
    this.mraService
      .getMaterialResourceAvailableById(mra.mraId)
      .subscribe((response) => {
        this.editingMraId = response.materialResourceAvailableOwner.userId;
      });
    this.editingMra = mra;
    console.log(this.editingMra);
    console.log(this.editingMraId);
  }
}
