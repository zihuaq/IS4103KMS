import { Component, OnInit, ApplicationRef, ElementRef, ViewChild } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  CameraPosition,
  GoogleMap,
  GoogleMaps,
  GoogleMapsAnimation,
  GoogleMapsEvent,
  GoogleMapsMapTypeId,
  ILatLng,
  LatLng,
  Marker
} from "@ionic-native/google-maps"

import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { MrpService } from 'src/app/services/mrp.service'; 
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-edit-mrp-details',
  templateUrl: './edit-mrp-details.page.html',
  styleUrls: ['./edit-mrp-details.page.scss']
})
export class EditMrpDetailsPage implements OnInit {
  mrpId: number;
  mrpToEdit: MaterialResourcePosting;
  tags: Tag[];
  filteredTags: Tag[];
  chosenTags: Tag[];
  startDate: string;
  endDate: string;
  searchValue: string;
  hasSelected: boolean;
  minDate = new Date().toISOString().slice(0, 10);
  maxDate: string;
  mapSubscription: Subscription;
  map: GoogleMap;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(
    public modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private mrpService: MrpService,
    private tagService: TagService,
    private platform: Platform,
    private app: ApplicationRef
  ) {
    this.mrpToEdit = new MaterialResourcePosting();
    this.tags = [];
    this.filteredTags = [];
    this.chosenTags = [];
  }

  ngOnInit() {
    this.platform.ready().then(() => this.loadMap());
  }

  ionViewWillEnter() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.maxDate = date.toISOString().slice(0, 10);
    this.mrpId = parseInt(this.activatedRoute.snapshot.paramMap.get('mrpId'));
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.tags = response;
      console.log(this.tags);
    });
    this.mrpService.getMrp(this.mrpId).subscribe((response) => {
      this.mrpToEdit = response;
      this.startDate = this.formatDate(this.mrpToEdit.startDate.toString());
      this.endDate = this.formatDate(this.mrpToEdit.endDate.toString());
      this.chosenTags = this.mrpToEdit.tags;
    });
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf('['));
    return str;
  }

  loadMap() {
    console.log('load map');
    this.map = GoogleMaps.create('map_canvas');

    if (!this.mrpToEdit.latitude) {
      this.map.getMyLocation().then((location) => {
        let marker: Marker = this.map.addMarkerSync({
          position: location.latLng
        });

        let position: CameraPosition<ILatLng> = {
          target: marker.getPosition(),
          zoom: 16
        };

        this.map.setOptions({
          mapType: GoogleMapsMapTypeId.HYBRID,
          camera: position
        });
        this.mrpToEdit.latitude = location.latLng.lat;
        this.mrpToEdit.longitude = location.latLng.lng;
        this.app.tick();
      });
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(this.mrpToEdit.latitude, this.mrpToEdit.longitude)
      });

      let position: CameraPosition<ILatLng> = {
        target: marker.getPosition(),
        zoom: 16
      };

      this.map.setOptions({
        mapType: GoogleMapsMapTypeId.HYBRID,
        camera: position
      });
    }
    this.mapSubscription = this.map
      .on(GoogleMapsEvent.MAP_CLICK)
      .subscribe((params: any[]) => {
        let latLng: LatLng = params[0];
        this.map.clear();
        this.map.addMarkerSync({
          position: latLng,
          animation: GoogleMapsAnimation.DROP
        });
        this.mrpToEdit.latitude = latLng.lat;
        this.mrpToEdit.longitude = latLng.lng;
        this.app.tick();
      });
  }

  dismiss() {
    this.location.back();
  }

  async editMrp(mrpForm: NgForm) {
    if (
      new Date(this.startDate).toJSON().slice(0, 10) >
      new Date(this.endDate).toJSON().slice(0, 10)
    ) {
      const toast = await this.toastController.create({
        message: 'End Date should not come before the Start Date.',
        duration: 2000
      });
      toast.present();
      return;
    }

    this.mrpToEdit.tags = this.chosenTags;
    this.mrpToEdit.startDate = new Date(this.startDate);
    this.mrpToEdit.endDate = new Date(this.endDate);

    var totalPledgedQuantity: number = 0;
    this.mrpToEdit.fulfillments.forEach((element) => {
      totalPledgedQuantity += element.totalPledgedQuantity;
    });
    if (this.mrpToEdit.totalQuantity < totalPledgedQuantity) {
      const toast = await this.toastController.create({
        message:
          'Quantity required cannot be less than total pledged quantity.',
        duration: 2000
      });
      toast.present();
      return;
    }

    this.mrpService.updateMrp(this.mrpToEdit).subscribe(async (response) => {
      const toast = await this.toastController.create({
        message: 'Mrp updated successfully.',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['tab-panel/' + this.mrpToEdit.project.projectId]);
    });
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.tags;
    }

    this.filteredTags = this.tags.filter((tag) => {
      if (tag.name && this.searchValue) {
        return tag.name.toLowerCase().includes(this.searchValue.toLowerCase());
      }
    });
  }

  selectTag(tag: Tag) {
    this.hasSelected = false;
    this.chosenTags.forEach((element) => {
      if (element.name == tag.name) {
        this.hasSelected = true;
      }
    });
    if (!this.hasSelected) {
      this.chosenTags.push(tag);
      this.clearSearch();
    }
  }

  removeTag(tag: Tag) {
    this.chosenTags.forEach((element, index) => {
      if (element.name == tag.name) {
        this.chosenTags.splice(index, 1);
      }
    });
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredTags = [];
  }
}
