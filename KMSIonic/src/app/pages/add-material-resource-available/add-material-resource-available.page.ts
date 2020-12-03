import { forkJoin, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Platform, ToastController } from '@ionic/angular';
import { MaterialResourceAvailableService } from './../../services/material-resource-available.service';
import { TagService } from './../../services/tag.service';
import { Tag } from './../../classes/tag';
import { MaterialResourceAvailable } from './../../classes/material-resource-available';
import { User } from './../../classes/user';
import {
  ApplicationRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
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
} from '@ionic-native/google-maps';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-material-resource-available',
  templateUrl: './add-material-resource-available.page.html',
  styleUrls: ['./add-material-resource-available.page.scss']
})
export class AddMaterialResourceAvailablePage implements OnInit {
  profile: User;
  mraTags: Tag[];
  filteredTags: Tag[] = [];
  hasSelected: boolean;
  newMra: MaterialResourceAvailable;
  minDate = new Date().toISOString().slice(0, 10);
  maxDate: string;
  hasExpiry = false;
  editingMra: MaterialResourceAvailable;
  map: GoogleMap;
  editingMraStartDate: string;
  editingMraEndDate: string;
  mapSubscription: Subscription;
  searchValue: string;
  chosenTags: Tag[] = [];
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(
    private tagService: TagService,
    private mraService: MaterialResourceAvailableService,
    private platform: Platform,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private app: ApplicationRef
  ) {}

  ngOnInit() {
    this.platform.ready();
  }

  ionViewWillEnter() {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.maxDate = date.toISOString().slice(0, 10);
    console.log('ionViewWillEnter');
    let mraid = this.activatedRoute.snapshot.params.mraId;
    this.authenticationService.getCurrentUser().then((user: User) => {
      if (mraid) {
        forkJoin([
          this.tagService.getAllMaterialResourceTags(),
          this.userService.getUser(user.userId.toString()),
          this.mraService.getMaterialResourceAvailableById(mraid)
        ]).subscribe(
          (result) => {
            this.mraTags = result[0];
            this.profile = result[1];
            this.editingMra = result[2];
            this.chosenTags = this.editingMra.tags;
            this.hasExpiry = this.editingMra.endDate == null ? false : true;
            this.editingMraStartDate = this.editingMra.startDate
              .toISOString()
              .slice(0, 10);
            this.editingMraEndDate = this.editingMra.endDate
              .toISOString()
              .slice(0, 10);
            this.app.tick();
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.loadMap();
          }
        );
      } else {
        forkJoin([
          this.tagService.getAllMaterialResourceTags(),
          this.userService.getUser(user.userId.toString())
        ]).subscribe(
          (result) => {
            this.mraTags = result[0];
            this.profile = result[1];
            this.editingMra = new MaterialResourceAvailable();
            this.app.tick();
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.loadMap();
          }
        );
      }
    });
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas');

    if (!this.editingMra.latitude) {
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
        this.editingMra.latitude = location.latLng.lat.toString();
        this.editingMra.longitude = location.latLng.lng.toString();
        this.app.tick();
      });
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(
          Number(this.editingMra.latitude),
          Number(this.editingMra.longitude)
        )
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
        this.editingMra.latitude = latLng.lat.toString();
        this.editingMra.longitude = latLng.lng.toString();
        this.app.tick();
      });
  }

  ionViewDidLeave() {
    this.mapSubscription.unsubscribe();
  }

  async createMaterialResourceRequest(mraForm: NgForm) {
    console.log('mra form' + mraForm.value);
    console.log('editing mra' + this.editingMra);
    console.log(this.editingMraStartDate);
    console.log(this.editingMraEndDate);
    console.log(this.profile);
    console.log('editing mra tags' + this.editingMra.tags);
    console.log('mraForm tags' + mraForm.value.mraTags);
    if (mraForm.valid) {
      if (this.chosenTags.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select at least one tag.',
          duration: 2000
        });
        toast.present();
      } else if (
        this.hasExpiry &&
        new Date(mraForm.value.startDate).toJSON().slice(0, 10) >
          new Date(mraForm.value.endDate).toJSON().slice(0, 10)
      ) {
        const toast = await this.toastController.create({
          message: 'End Date should not come before the Start Date.',
          duration: 2000
        });
        toast.present();
      } else {
        this.newMra = new MaterialResourceAvailable();
        this.newMra.mraId = this.editingMra.mraId;
        this.newMra.materialResourceAvailableOwner = this.profile;
        this.newMra.name = mraForm.value.mraName;
        this.newMra.quantity = mraForm.value.quantity;
        this.newMra.units = mraForm.value.units;
        this.newMra.description = mraForm.value.description;
        this.newMra.latitude = this.editingMra.latitude;
        this.newMra.longitude = this.editingMra.longitude;
        this.newMra.startDate = new Date(mraForm.value.startDate);
        this.newMra.endDate = new Date(mraForm.value.endDate);
        this.newMra.tags = this.chosenTags;
        if (!this.editingMra.mraId) {
          this.mraService
            .createMaterialResourceAvailable(this.newMra)
            .subscribe((responsedata) => {
              this.profile.mras = responsedata;
              this.router.navigate(['/user-profile']);
            });
        } else {
          this.mraService
            .updateMaterialResourceAvailable(this.newMra)
            .subscribe((responsedata) => {
              this.profile.mras = responsedata;
              this.router.navigate(['/user-profile']);
            });
        }
        mraForm.reset();
        this.chosenTags = [];
        this.searchValue = '';
        this.editingMra = new MaterialResourceAvailable();
        this.editingMraStartDate = null;
        this.editingMraEndDate = null;
        this.hasExpiry = false;
      }
    }
  }

  handleHasExpiryChange() {
    this.hasExpiry = !this.hasExpiry;
  }

  clear(mraForm: NgForm) {
    mraForm.reset();
    this.editingMra = new MaterialResourceAvailable();
    this.hasExpiry = false;
  }

  compareWith(mraTag1: Tag, mraTag2: Tag) {
    return mraTag1 && mraTag2
      ? mraTag1.name == mraTag2.name && mraTag1.tagType == mraTag2.tagType
      : mraTag1 === mraTag2;
  }

  filterList(evt) {
    this.searchValue = evt.srcElement.value;

    if (!this.searchValue) {
      this.filteredTags = this.mraTags;
    }

    this.filteredTags = this.mraTags.filter((tag) => {
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
