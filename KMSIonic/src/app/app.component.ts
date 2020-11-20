import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './classes/user';
import { ToastController } from '@ionic/angular';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  haveMenu: boolean;
  selectedIndex = 0;
  appPages = [
    {
      title: 'Home',
      url: '/index',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person-circle'
    },
    {
      title: 'Search Users',
      url: '/search-users',
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
      title: "Discover Group",
      url: "/view-all-group",
      icon: "people"
    },
    {
      title: "My Group",
      url: "/view-own-groups",
      icon: "person"
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

  async ngOnInit() {}

  logout() {
    this.authService.logout();
    this.authService.authenticationState.next(false);
  }
}
