import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx'
import {firebase} from '@firebase/app';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
firebase.initializeApp(environment.firebase);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

    // AngularFireAuthModule,
    // AngularFireAnalyticsModule, todo
    HttpClientModule,
    AppRoutingModule,
    CdkStepperModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    EffectsModule.forRoot([]),
    // todo consider using store entities once communication with firebase is implemented
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // todo
    // FirebaseAnalytics,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseAuthentication,
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements  OnInit {
  constructor() {
  }
  ngOnInit(): void {
  }
}
