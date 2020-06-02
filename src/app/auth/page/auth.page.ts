import { Component, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import {
  signUpRequest,
  signUpFailure,
  signUpSuccess,
} from '../store/auth.actions';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { CustomStepperComponent } from '../custom-stepper/custom-stepper.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild(CustomStepperComponent, { static: true })
  customStepperComponent!: CustomStepperComponent;
  _phoneNumber?: number;
  _dateOfBirth?: string; // todo change data format to backend format
  _gender?: Gender;
  _userName?: string;
  _hasUserCanceledDatePicker?: boolean;
  readonly _allowedGenders = [Gender.Male, Gender.Female, Gender.Others];

  next() {
    this.customStepperComponent.selectedIndex += 1;
  }
  constructor(
    private readonly store: Store,
    private readonly actions: Actions
  ) {}

  ngOnInit() {
    this.store.dispatch(
      signUpRequest({
        user: {
          phoneNumber: 1,
          dateOfBirth: 'asd',
          userName: 'asd',
          gender: 'asd',
        },
      })
    );
    this.actions.pipe(ofType(signUpSuccess)).subscribe(() => {
      // todo decide what happens with the user flow when sign up is successful
      console.log('success');
    });
    this.actions.pipe(ofType(signUpFailure)).subscribe(({ error }) => {
      // todo decide what happens with the user flow when sign up fails
      console.log(error);
    });
  }

  signUp() {
    if (
      this._phoneNumber === undefined ||
      this._dateOfBirth === undefined ||
      this._userName === undefined ||
      this._gender === undefined
    ) {
      // this should never be reached unless there is a bug with the form,
      // but the if check helps by smart casting
      throw new Error();
    }
    this.store.dispatch(
      signUpRequest({
        user: {
          phoneNumber: this._phoneNumber,
          dateOfBirth: this._dateOfBirth,
          userName: this._userName,
          gender: this._gender,
        },
      })
    );
  }

  getCurrentDateInInternationalFormat() {
    return format(new Date(), 'yyyy-MM-dd');
  }

  onUserCanceledDatePicker() {
    this._hasUserCanceledDatePicker = true;
  }
}

enum Gender {
  Male = 'male',
  Female = 'female',
  Others = 'others',
}
