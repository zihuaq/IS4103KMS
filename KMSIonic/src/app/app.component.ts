import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './classes/user';

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
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async ngOnInit() {}

  logout() {
    this.authService.logout();
    this.authService.authenticationState.next(false);
  }
}
