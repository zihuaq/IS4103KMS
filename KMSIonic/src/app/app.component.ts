import { Component, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './classes/user';
import { ToastController } from '@ionic/angular';
import { FcmService } from './services/fcm.service';
import { DonateToPlatformModalPage } from './pages/donate-to-platform-modal/donate-to-platform-modal.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  haveMenu: boolean;
  selectedIndex = 0;
  loggedInUser: User;
  appPages = [
    {
      title: 'Home',
      url: '/index',
      icon: 'home'
    },
    {
      title: 'User Profile',
      url: '/user-profile',
      icon: 'person-circle'
    },
    {
      title: 'Search Users',
      url: '/search-users',
      icon: 'search'
    },
    {
      title: 'Search Profiles',
      url: '/search-profiles',
      icon: 'search'
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: 'notifications'
    },
    {
      title: 'SDG Info',
      url: '/sdg-info',
      icon: 'information-circle'
    },
    {
      title: 'Discover Group',
      url: '/view-all-group',
      icon: 'people'
    },
    {
      title: 'My Group',
      url: '/view-own-groups',
      icon: 'person'
    },
    {
      title: 'Discover Project',
      url: '/view-all-project',
      icon: 'search'
    },
    {
      title: 'My Project',
      url: '/view-own-projects',
      icon: 'person'
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: 'chatbubble'
    },
    {
      title: 'Log Out',
      url: '/logout',
      icon: 'log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public toastController: ToastController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // // subscribe to a topic
      // // this.fcm.subscribeToTopic('Deals');

      // // get FCM token
      // FCM.getToken().then(token => {
      //   console.log(token);
      // });

      // // ionic push notification example
      // FCM.onNotification().subscribe(data => {
      //   console.log(data);
      //   if (data.wasTapped) {
      //     console.log('Received in background');
      //   } else {
      //     console.log('Received in foreground');
      //   }
      // });      

      // // refresh the FCM token
      // FCM.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      // });

      // // unsubscribe from a topic
      // // this.fcm.unsubscribeFromTopic('offers');
      
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().then((user: User) => {
      this.loggedInUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.authService.authenticationState.next(false);
  }

  async presentDonateToPlatformModal() {
    const modal = await this.modalController.create({
      component: DonateToPlatformModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'donate-to-platform-modal',
      componentProps: {
        loggedInUser: this.loggedInUser
      }
    });
    modal.present();
  }
}
