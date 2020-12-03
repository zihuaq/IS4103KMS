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
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { Project } from 'src/app/classes/project'; 
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-create-mrp',
  templateUrl: './create-mrp.page.html',
  styleUrls: ['./create-mrp.page.scss']
})
export class CreateMrpPage implements OnInit {
  currentUser: User;
  projectId: number;
  project: Project;
  newMrp: MaterialResourcePosting;
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
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private platform: Platform,
    private app: ApplicationRef
  ) {
    this.newMrp = new MaterialResourcePosting();
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
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );
    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.tags = response;
      console.log(this.tags);
    });
    this.projectService.getProjectById(this.projectId).subscribe((response) => {
      this.project = response;
    });
    this.authenticationService.getCurrentUser().then((user) => {
      this.currentUser = user;
    });
  }

  loadMap() {
    console.log('load map');
    this.map = GoogleMaps.create('map_canvas');

    if (!this.newMrp.latitude) {
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
        this.newMrp.latitude = location.latLng.lat;
        this.newMrp.longitude = location.latLng.lng;
        this.app.tick();
      });
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(this.newMrp.latitude, this.newMrp.longitude)
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
        this.newMrp.latitude = latLng.lat;
        this.newMrp.longitude = latLng.lng;
        this.app.tick();
      });
  }

  dismiss() {
    this.location.back();
  }

  async createMrp(mrpForm: NgForm) {
    let tagIds: number[] = [];
    if (!mrpForm.valid) {
      const toast = await this.toastController.create({
        message: 'Please fill in required fields marked with *',
        duration: 2000
      });
      toast.present();
      return;
    }
    // if (this.chosenTags.length == 0) {
    //   const toast = await this.toastController.create({
    //     message: "Please select at least one Material Resource tags",
    //     duration: 2000
    //   })
    //   toast.present();
    //   return;
    // }
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
    for (let tag of this.chosenTags) {
      tagIds.push(tag.tagId);
    }
    this.newMrp.startDate = new Date(this.startDate);
    this.newMrp.endDate = new Date(this.endDate);

    this.mrpService
      .createNewMrp(this.newMrp, this.projectId, tagIds)
      .subscribe(async (response) => {
        let newNotification = new Notification();
        newNotification.msg =
          'A new Material Resource Posting has been added to ' +
          this.project.name;
        newNotification.projectId = this.projectId;
        newNotification.groupId = null;
        newNotification.tabName = 'mrp-tab';
        for (let member of this.project.projectMembers) {
          if (member.userId != this.currentUser.userId) {
            this.notificationService
              .createNewNotification(newNotification, member.userId)
              .subscribe();
          }
        }
        const toast = await this.toastController.create({
          message: 'Mrp created successfully.',
          duration: 2000
        });
        toast.present();
        this.router.navigate(['tab-panel/' + this.projectId]);
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
