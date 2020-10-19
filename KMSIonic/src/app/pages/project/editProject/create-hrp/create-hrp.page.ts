import { Component, OnInit, Input, ApplicationRef, ElementRef, ViewChild} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
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
} from "@ionic-native/google-maps/ngx"

import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { HrpService } from 'src/app/services/hrp.service';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-create-hrp',
  templateUrl: './create-hrp.page.html',
  styleUrls: ['./create-hrp.page.scss'],
})
export class CreateHrpPage implements OnInit {

  @Input() projectId: number;
  newHrp: HumanResourcePosting;
  tags: Tag[];
  filteredTags: Tag[];
  chosenTags: Tag[];
  startDate: string;
  endDate: string;
  searchValue: string;
  hasSelected: boolean;
  minDate = new Date().toISOString().slice(0, 10);
  mapSubscription: Subscription;
  map: GoogleMap;
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef;
  
  constructor(public modalCtrl: ModalController,
    private hrpService: HrpService,
    private tagService: TagService,
    private platform: Platform,
    private app: ApplicationRef) 
  { 
    this.newHrp = new HumanResourcePosting();
    this.tags = [];
    this.filteredTags = [];
    this.chosenTags = [];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => this.loadMap());
    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.tags = response;
        this.app.tick();
      },
      // () => {
      //   this.loadMap();
      // }
    );
    
  }

  ionViewDidLeave() {
    this.mapSubscription.unsubscribe()
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas")

    if (!this.newHrp.latitude) {
      this.map.getMyLocation().then((location) => {
        let marker: Marker = this.map.addMarkerSync({
          position: location.latLng
        })

        let position: CameraPosition<ILatLng> = {
          target: marker.getPosition(),
          zoom: 16
        }

        this.map.setOptions({
          mapType: GoogleMapsMapTypeId.HYBRID,
          camera: position
        })
        this.newHrp.latitude = location.latLng.lat
        this.newHrp.longitude = location.latLng.lng
        this.app.tick()
      })
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(
          this.newHrp.latitude,
          this.newHrp.longitude
        )
      })

      let position: CameraPosition<ILatLng> = {
        target: marker.getPosition(),
        zoom: 16
      }

      this.map.setOptions({
        mapType: GoogleMapsMapTypeId.HYBRID,
        camera: position
      })
    }
    this.mapSubscription = this.map
      .on(GoogleMapsEvent.MAP_CLICK)
      .subscribe((params: any[]) => {
        let latLng: LatLng = params[0]
        this.map.clear()
        this.map.addMarkerSync({
          position: latLng,
          animation: GoogleMapsAnimation.DROP
        })
        this.newHrp.latitude = latLng.lat
        this.newHrp.longitude = latLng.lng
        this.app.tick()
      })
  }

  refresh() {
    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.tags = response;
        this.app.tick()
      },
      () => {
        this.loadMap();
      }
    );
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  createHrp(hrpForm: NgForm) {

  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value

    if (!this.searchValue) {
      this.filteredTags = this.tags
    }

    this.filteredTags = this.tags.filter((tag) => {
      if (tag.name && this.searchValue) {
        return tag.name.toLowerCase().includes(this.searchValue.toLowerCase())
      }
    })
  }

  selectTag(tag: Tag) {
    this.hasSelected = false
    this.chosenTags.forEach((element) => {
      if (element.name == tag.name) {
        this.hasSelected = true
      }
    })
    if (!this.hasSelected) {
      this.chosenTags.push(tag)
      this.clearSearch()
    }
  }

  removeTag(tag: Tag) {
    this.chosenTags.forEach((element, index) => {
      if (element.name == tag.name) {
        this.chosenTags.splice(index, 1)
      }
    })
  }

  clearSearch() {
    this.searchValue = ""
    this.filteredTags = []
  }

}
