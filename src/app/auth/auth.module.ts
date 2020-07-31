import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AuthPage } from './page/auth.page';
import { CustomStepperComponent } from './custom-stepper/custom-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { SelectedDateIsOlderThanLegalAdultAgeDirective } from './directives/selected-date-is-older-than-legal-adult-age.directive';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth.effects';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Store, StoreModule } from '@ngrx/store';
import { authFeatureKey, authReducer } from './store/auth.reducer';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { authActions } from './store/auth.actions';
import { Subscription } from 'rxjs';
import { selectIsAppRunningOnCordova } from '../store/app.selectors';
import { mergeMap } from 'rxjs/operators';
import { SpontState } from '../store/app.reducer';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  declarations: [
    AuthPage,
    CustomStepperComponent,
    SelectedDateIsOlderThanLegalAdultAgeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CdkStepperModule,
    EffectsModule.forFeature([AuthEffects]),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    StoreModule.forFeature(authFeatureKey, authReducer, { initialState: {} })
  ],
  providers: [
    FirebaseAuthentication
  ]
})
export class AuthModule implements OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly ngFireAuth: AngularFireAuth,
              private readonly cordovaFireAuth: FirebaseAuthentication,
              private readonly store: Store<SpontState>,
  ) {
    this.subscriptions.push(
      this.store.select(selectIsAppRunningOnCordova).pipe(
        mergeMap(isAppRunningOnCordova => isAppRunningOnCordova ?
          this.cordovaFireAuth.onAuthStateChanged() :
          this.ngFireAuth.user
        )
      ).subscribe(user => this.store.dispatch(authActions.updateUserInfo({ user }))),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
