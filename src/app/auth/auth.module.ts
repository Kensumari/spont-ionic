import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { AuthPage } from "./auth.page";
import { CustomStepperComponent } from "./custom-stepper/custom-stepper.component";
import { CdkStepperModule } from '@angular/cdk/stepper';
import { SelectedDateIsOlderThanLegalAdultAgeDirective } from './selected-date-is-older-than-legal-adult-age.directive';

const routes: Routes = [
  {
    path: "",
    component: AuthPage,
    
  },
];

@NgModule({
  declarations: [AuthPage, CustomStepperComponent, SelectedDateIsOlderThanLegalAdultAgeDirective],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CdkStepperModule,
  ],
})
export class AuthModule {}
