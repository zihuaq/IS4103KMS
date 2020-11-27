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
import { MaterialResourceAvailableService } from 'src/app/mra.service';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { MraType } from 'src/app/classes/mra-type.enum';

declare var $: any;

@Component({
  selector: 'app-material-resource-available',
  templateUrl: './material-resource-available.component.html',
  styleUrls: ['./material-resource-available.component.css'],
})
export class MaterialResourceAvailableComponent implements OnInit, OnChanges {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Input() shared: boolean;
  @Output() userChanged = new EventEmitter<User>();
  mraTags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  newMra: MaterialResourceAvailable;
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
  };
  editingMra: MaterialResourceAvailable;

  constructor(
    private tagService: TagService,
    private mraService: MaterialResourceAvailableService
  ) {}

  ngOnInit(): void {
    this.editingMra = new MaterialResourceAvailable();
    this.mraService
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
    });
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
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
    });
    this.profile = changes.profile.currentValue;
  }

  click(event: google.maps.MouseEvent) {
    this.editingMra.latitude = event.latLng.lat().toString();
    this.editingMra.longitude = event.latLng.lng().toString();
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
    if (mraForm.valid) {
      this.newMra = new MaterialResourceAvailable();
      this.newMra.mraId = this.editingMra.mraId;
      this.newMra.materialResourceAvailableOwner = this.profile;
      this.newMra.name = mraForm.value.mraName;
      this.newMra.description = mraForm.value.description;
      this.newMra.type = mraForm.value.resourceType as MraType;
      this.newMra.price = mraForm.value.price ? mraForm.value.price : 0.0;
      this.newMra.units = mraForm.value.units ? mraForm.value.units : null;
      this.newMra.latitude = this.editingMra.latitude;
      this.newMra.longitude = this.editingMra.longitude;
      this.newMra.tags = this.selectedTags;
      console.log(this.newMra);
      if (!this.editingMra.mraId) {
        this.mraService
          .createMaterialResourceAvailable(this.newMra)
          .subscribe((responsedata) => {
            this.profile.mras = responsedata;
          });
      } else {
        this.mraService
          .updateMaterialResourceAvailable(this.newMra)
          .subscribe((responsedata) => {
            this.profile.mras = responsedata;
          });
      }
      $('#addMraModalCloseBtn').click();
      mraForm.reset();
      this.selectedTags = [];
      $('#mraselect2').val(null).trigger('change');
      this.editingMra = new MaterialResourceAvailable();
    }
  }

  deleteMra(mraId: number) {
    this.mraService
      .deleteMaterialResourceAvailable(this.profile.userId, mraId)
      .subscribe((responsedata) => {
        this.profile.mras = responsedata;
      });
  }

  editMra(mra: MaterialResourceAvailable) {
    this.selectedTags = mra.tags;
    $('#mraselect2')
      .val(mra.tags.map((tag) => tag.name))
      .trigger('change');
    this.editingMra = mra;
  }

  clear(mraForm: NgForm) {
    mraForm.reset();
    this.selectedTags = [];
    $('#mraselect2').val(null).trigger('change');
    this.editingMra = new MaterialResourceAvailable();
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }
}
