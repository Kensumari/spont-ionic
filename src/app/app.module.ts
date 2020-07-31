import { NgModule } from '@angular/core';
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
import { Actions, EffectsModule, ofType } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { appReducer } from './store/app.reducer';
import { initializeApp } from 'firebase/app';
import { appActions } from './store/app.actions';

initializeApp(environment.firebase);

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        // AngularFireAnalyticsModule, todo
        HttpClientModule,
        AppRoutingModule,
        CdkStepperModule,
        StoreModule.forRoot(
            {app: appReducer},
            {
                initialState: {app: {}},
                runtimeChecks: {
                    // keeping these 4 false as they interfere with passing firebase.auth.RecaptchaContainer and firebase.auth.ConfirmationResult through ngrx
                    // perhaps it's worth weighing the tradeoffs
                    // 1) making AuthPage impure (by introducing side effects) vs
                    // 2) having these useful checks turned off
                    // todo: if we start running into bugs due to mistakenly putting mutable state in the store, 1) is probably better.
                    // todo: test which of these falses are actually necessary
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                    strictStateSerializability: false,
                    strictActionSerializability: false,
                    strictActionWithinNgZone: false, // todo change back to true
                    strictActionTypeUniqueness: true,
                },
            }
        ),
        StoreDevtoolsModule.instrument({maxAge: 25}),
        EffectsModule.forRoot([]),
        // todo consider using store entities once communication with firebase is implemented
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        FirebaseAuthentication,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private readonly actions: Actions) {
        // todo: remove this before production
        this.actions.pipe(ofType(appActions.fail)).subscribe(({error}) => {
            console.log(JSON.stringify(error));
        })
        this.actions.subscribe(action => console.log(action.type))

    }
}
