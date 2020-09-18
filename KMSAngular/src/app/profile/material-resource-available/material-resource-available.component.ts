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

  constructor(
    private tagService: TagService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService
      .getMaterialResourceAvailable(this.profile.userId)
      .subscribe((mras) => {
        this.profile = { ...this.profile, mras };
      });
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mraTags = response;
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
    });
    this.profile = changes.profile.currentValue;
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
    this.lat = event.latLng.lat().toString();
    this.lng = event.latLng.lng().toString();
  }

  createMaterialResourceRequest(mraForm: NgForm) {
    if (mraForm.valid) {
      this.newMra = new MaterialResourceAvailable();
      this.newMra.materialResourceAvailableOwner = this.profile;
      this.newMra.name = mraForm.value.mraName;
      this.newMra.quantity = mraForm.value.quantity;
      this.newMra.description = mraForm.value.description;
      this.newMra.latitude = this.lat;
      this.newMra.longitude = this.lng;
      this.newMra.startDate = new Date(mraForm.value.startDate);
      this.newMra.endDate = new Date(mraForm.value.endDate);
      console.log(this.newMra);
      this.userService
        .createMaterialResourceAvailable(this.newMra)
        .subscribe((responsedata) => {
          this.profile.mras = responsedata;
        });

      $('#addMraModalCloseBtn').click();
    }
  }

  deleteMra(mraId: number) {
    this.userService
      .deleteMaterialResourceAvailable(this.profile.userId, mraId)
      .subscribe((responsedata) => {
        this.profile.mras = responsedata;
      });
  }
}
