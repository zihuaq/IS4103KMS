import { ApplicationRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { MaterialResourceAvailableService } from 'src/app/services/material-resource-available.service';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { User } from 'src/app/classes/user';
import { CameraPosition, GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, GoogleMapsMapTypeId, ILatLng, LatLng, Marker } from '@ionic-native/google-maps';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MraType } from 'src/app/enum/mra-type.enum';
import { ActivatedRoute } from '@angular/router';
import { MrpService } from 'src/app/services/mrp.service';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../../../services/authentication.service';

@Component({
  selector: 'app-add-mra',
  templateUrl: './add-mra.page.html',
  styleUrls: ['./add-mra.page.scss'],
})
export class AddMraPage implements OnInit {

  loggedInUser: User;
  mrpId: number;
  selectedMrp: MaterialResourcePosting;
  newMra: MaterialResourceAvailable;

  mapSubscription: Subscription;
  map: GoogleMap;
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(private toastController: ToastController,
    private mraService: MaterialResourceAvailableService,
    private platform: Platform,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private app: ApplicationRef,
    private mrpService: MrpService,
    private authenticationService: AuthenticationService) {
      this.newMra = new MaterialResourceAvailable();
      this.selectedMrp = new MaterialResourcePosting();
    }

    ngOnInit() {
      this.platform.ready().then(() => this.loadMap())
    }
  
    ionViewWillEnter() {
      this.mrpId = parseInt(this.activatedRoute.snapshot.paramMap.get("mrpId"));
      this.authenticationService.getCurrentUser().then(
        (user: User) => {
          this.loggedInUser = user;
          this.mrpService.getMrp(this.mrpId).subscribe(
            response => {
              this.selectedMrp = response;
              this.newMra.name = this.selectedMrp.name;
              this.newMra.units = this.selectedMrp.unit;
              this.newMra.tags = this.selectedMrp.tags;
            }
          );
        }
      );
    }
  
    loadMap() {
      console.log("load map")
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
  
    async createMra(mraForm: NgForm) {
      if (mraForm.value.resourceType != 'ONETIMEDONATION' && !(mraForm.value.price > 0)) {
        const toast = await this.toastController.create({
          message: "Please enter a valid price or select one-time donation",
          color: "warning",
          duration: 3000
        })
        toast.present();
        return;
      } 
      if (mraForm.valid) {
        this.newMra.materialResourceAvailableOwner = this.loggedInUser;
        this.newMra.price = mraForm.value.price ? mraForm.value.price : 0.0;
        this.newMra.units = this.newMra.type != MraType.ONETIMEDONATION ? this.newMra.units : null;
        this.mraService.createMaterialResourceAvailable(this.newMra).subscribe(
          async (response) => {
            console.log(this.newMra);
            this.dismiss();
            const toast = await this.toastController.create({
              message: "Material Resource is successfully created",
              color: "success",
              duration: 3000
            })
            toast.present();
        });
      }
    }

    dismiss() {
      this.location.back();
    }

}
