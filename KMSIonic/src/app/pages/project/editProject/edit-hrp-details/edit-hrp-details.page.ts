import { Component, OnInit, ApplicationRef, ElementRef, ViewChild } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { formatDate, Location } from "@angular/common";
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
  selector: 'app-edit-hrp-details',
  templateUrl: './edit-hrp-details.page.html',
  styleUrls: ['./edit-hrp-details.page.scss'],
})
export class EditHrpDetailsPage implements OnInit {

  hrpId: number;
  hrpToEdit: HumanResourcePosting;
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

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private location: Location,
    private hrpService: HrpService,
    private tagService: TagService,
    private platform: Platform,
    private app: ApplicationRef) {
      this.hrpToEdit = new HumanResourcePosting;
      this.tags = [];
      this.filteredTags = [];
      this.chosenTags = [];
     }

  ngOnInit() {
    this.platform.ready().then(() => this.loadMap())
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter HrpId: " + this.hrpId);
    this.hrpId = parseInt(this.activatedRoute.snapshot.paramMap.get("hrpId"));
    this.tagService.getAllSkillTags().subscribe(
      (response) => {
        this.tags = response; 
        console.log(this.tags)
      },
    );

    this.hrpService.getHrp(this.hrpId).subscribe(
      response => {
        this.hrpToEdit = response;
        this.startDate = this.formatDate(this.hrpToEdit.startDate.toString());
        this.endDate = this.formatDate(this.hrpToEdit.endDate.toString());
        this.chosenTags = this.hrpToEdit.tags;
      }
    );
  }

  loadMap() {
    console.log("load map")
    this.map = GoogleMaps.create("map_canvas")

    if (!this.hrpToEdit.latitude) {
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
        this.hrpToEdit.latitude = location.latLng.lat
        this.hrpToEdit.longitude = location.latLng.lng
        this.app.tick()
      })
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(
          this.hrpToEdit.latitude,
          this.hrpToEdit.longitude
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
        this.hrpToEdit.latitude = latLng.lat
        this.hrpToEdit.longitude = latLng.lng
        this.app.tick()
      })
  }

  async editHrp(hrpForm: NgForm) {
    if (hrpForm.valid) {
      let selectedTags = [];
      if (this.chosenTags.length > 0) {
        for (let tag of this.chosenTags) {
          selectedTags.push(tag);
        }
      } 
      if (new Date(this.startDate).toJSON().slice(0,10) > new Date(this.endDate).toJSON().slice(0,10)) {
        const toast = await this.toastController.create({
          message: "End Date should not come before the Start Date.",
          duration: 2000
        })
        toast.present();
        return;
      }

      if (this.hrpToEdit.totalSlots < this.hrpToEdit.obtainedSlots) {
        const toast = await this.toastController.create({
          message: "Please enter a number larger than the position filled.",
          duration: 2000
        })
        toast.present();
        return;
      }

      this.hrpToEdit.tags = selectedTags;
      this.hrpToEdit.startDate = new Date(this.startDate);
      this.hrpToEdit.endDate = new Date(this.endDate);
      this.hrpService.updateHrp(this.hrpToEdit).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: "Hrp updated successfully.",
            duration: 2000
          })
          toast.present();
          this.router.navigate(["tab-panel/" + this.hrpToEdit.project.projectId]);
        }
      );
    }
    

  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  dismiss() {
    this.location.back();
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
