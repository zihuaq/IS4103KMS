import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private firebase: FirebaseX,
    private afs: AngularFirestore,
    private platform: Platform) {}

    async getToken() {
      let token;
  
      if (this.platform.is('android')) {
        token = await this.firebase.getToken();
      }
  
      if (this.platform.is('ios')) {
        token = await this.firebase.getToken();
        await this.firebase.grantPermission();
      }
  
      this.saveToken(token);
    }
  
    private saveToken(token) {
      if (!token) return;
  
      const devicesRef = this.afs.collection('devices');
  
      const data = {
        token,
        userId: 'testUserId'
      };
  
      return devicesRef.doc(token).set(data);
    }
  
    onNotifications() {
      return this.firebase.onMessageReceived();
    }
}
