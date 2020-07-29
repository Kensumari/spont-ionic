import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AuthPage } from './page/auth.page';
import { CustomStepperComponent } from './custom-stepper/custom-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { SelectedDateIsOlderThanLegalAdultAgeDirective } from './selected-date-is-older-than-legal-adult-age.directive';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth.effects';
import { AngularFireModule } from '@angular/fire';
// import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth.reducer';
import { AngularFireAuthModule } from '@angular/fire/auth';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  },
];

@NgModule({
  declarations: [
    AuthPage,
    CustomStepperComponent,
    SelectedDateIsOlderThanLegalAdultAgeDirective,
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
    StoreModule.forFeature('auth', authReducer)
  ],
  providers: [
    FirebaseAuthentication,
  ]
})
export class AuthModule {}
