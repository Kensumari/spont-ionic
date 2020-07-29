import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { appActions } from './store/app.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Auth',
      url: '/auth',
      icon: 'mail',
    },
    {
      title: 'Test1',
      url: '/test1',
      icon: 'mail',
    },
    {
      title: 'Test2',
      url: '/test2',
      icon: 'paper-plane',
    },
  ];

  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly store: Store,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.store.dispatch(appActions.setPlatforms({platforms: this.platform.platforms()}))
  }
}
