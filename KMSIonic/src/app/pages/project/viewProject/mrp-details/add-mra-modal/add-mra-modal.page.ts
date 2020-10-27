import { Component, ElementRef, Input, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { CameraPosition, GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, GoogleMapsMapTypeId, ILatLng, LatLng, Marker } from '@ionic-native/google-maps';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { User } from 'src/app/classes/user';
import { MaterialResourceAvailableService } from 'src/app/services/material-resource-available.service';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-mra-modal',
  templateUrl: './add-mra-modal.page.html',
  styleUrls: ['./add-mra-modal.page.scss'],
})
export class AddMraModalPage implements OnInit {

  @Input() loggedInUser: User;
  @Input() selectedMrp: MaterialResourcePosting;

  newMra: MaterialResourceAvailable;
  hasExpiry: boolean = false;
  minDate = new Date().toISOString().slice(0, 10);
  startDate: string;
  endDate: string;

  mapSubscription: Subscription;
  map: GoogleMap;
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private mraService: MaterialResourceAvailableService,
    private platform: Platform,
    private app: ApplicationRef) {
      this.newMra = new MaterialResourceAvailable();
     }

  ngOnInit() {
    this.platform.ready().then(() => this.loadMap())
  }

  ionViewWillEnter() {
    this.newMra.name = this.selectedMrp.name;
    this.newMra.units = this.selectedMrp.unit;
    this.newMra.tags = this.selectedMrp.tags;
  }

  loadMap() {
    this.map = GoogleMaps.create("map_canvas")

    if (!this.newMra.latitude) {
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
        this.newMra.latitude = location.latLng.lat.toString()
        this.newMra.longitude = location.latLng.lng.toString()
        this.app.tick()
      })
    } else {
      let marker: Marker = this.map.addMarkerSync({
        position: new LatLng(
          Number(this.newMra.latitude),
          Number(this.newMra.longitude)
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
        this.newMra.latitude = latLng.lat.toString()
        this.newMra.longitude = latLng.lng.toString()
        this.app.tick()
      })
  }

  ionViewDidLeave() {
    this.mapSubscription.unsubscribe()
  }

  handleHasExpiryChange() {
    this.hasExpiry = !this.hasExpiry;
  }

  async createMra(mraForm: NgForm) {
    if (!mraForm.valid) {
      console.log(this.newMra);
      const toast = await this.toastController.create({
        message: "Please fill in required fields marked with *",
        color: "danger",
        duration: 3000
      })
      toast.present();
      return;
    } else if (mraForm.valid) {
      if (this.newMra.quantity == 0) {
        const toast = await this.toastController.create({
          message: "Please fill in a valid quantity",
          color: "danger",
          duration: 2000
        })
        toast.present();
        return;
      }
      if (this.hasExpiry) {
        if (new Date(this.startDate) > new Date(this.endDate)) {
          const toast = await this.toastController.create({
            message: "End date should not come before the Start Date",
            color: "danger",
            duration: 3000
          })
          toast.present();
          return;
        } else {
          this.newMra.startDate = new Date(this.startDate);
          this.newMra.endDate = new Date(this.endDate);
        }
      }
      this.newMra.materialResourceAvailableOwner = this.loggedInUser;
      this.mraService.createMaterialResourceAvailable(this.newMra).subscribe((
        response) => {
          console.log(this.newMra);
          this.dismiss();
      });
      const toast = await this.toastController.create({
        message: "Material Resource is successfully created",
        duration: 3000
      })
      toast.present();
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
