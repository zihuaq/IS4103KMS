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

  projectId: number;
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
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
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
    console.log("ngOnInit: create hrp")
    this.platform.ready().then(() => this.loadMap())
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter: create hrp")
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.tagService.getAllSkillTags().subscribe(
      (response) => {
        this.tags = response; 
        console.log(this.tags)
      },
    );
  }

  // ionViewDidLeave() {
  //   this.mapSubscription.unsubscribe()
  // }

  loadMap() {
    console.log("load map")
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

  dismiss() {
    this.location.back();
  }

  async createHrp(hrpForm: NgForm) {
    let tagIds: number[] = [];
    if (hrpForm.valid) {
      if (new Date(this.startDate).toJSON().slice(0,10) > new Date(this.endDate).toJSON().slice(0,10)) {
        const toast = await this.toastController.create({
          message: "End Date should not come before the Start Date.",
          duration: 2000
        })
        toast.present();
        return;
      } else {
        this.newHrp.startDate = new Date(this.startDate);
        this.newHrp.endDate = new Date(this.endDate);
        for (let tag of this.chosenTags) {
          tagIds.push(tag.tagId);
        }
        this.hrpService.createNewHrp(this.newHrp, this.projectId, tagIds).subscribe(
          async response => {
            const toast = await this.toastController.create({
              message: "Hrp created successfully.",
              duration: 2000
            })
            toast.present();
            this.router.navigate(["tab-panel/" + this.projectId]);
          }
        )
      }

    }
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
