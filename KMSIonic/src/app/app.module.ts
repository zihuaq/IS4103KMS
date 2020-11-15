import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AngularFireDatabase } from '@angular/fire/database';

const conifg = {
    apiKey: "AIzaSyBl7TP2OFBQJ4X2N9oRkUHTh33cK6y299c",
    authDomain: "is4103kms-4e0e3.firebaseapp.com",
    databaseURL: "https://is4103kms-4e0e3.firebaseio.com",
    projectId: "is4103kms-4e0e3",
    storageBucket: "is4103kms-4e0e3.appspot.com",
    messagingSenderId: "973751042539",
  }

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(conifg), 
    AngularFirestoreModule,    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileChooser,
    FirebaseX,
    AngularFireDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
