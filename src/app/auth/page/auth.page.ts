import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { CustomStepperComponent } from '../custom-stepper/custom-stepper.component';
// import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import {authActions} from '../store/auth.actions';
// import ConfirmationResult = firebase.auth.ConfirmationResult;

// todo: change the flow of this page to phone signup first and then collect additional information.
//  It's also probably a good idea to make the collection of additional information optional so as to reduce cognitive
//  load/barrier to entry for the user and make them feel more secure.
//  There currently is some unused code in this page since the additional information isn't being used.
// todo: add resend verification code
// todo: investigate viability of using sms auto detect on android
@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy, AfterViewInit {
    private readonly subscriptions: Subscription[] = [];

    @ViewChild(CustomStepperComponent, {static: true})
    private readonly customStepperComponent!: CustomStepperComponent;
    // private reCAPTCHAVerifier!: firebase.auth.RecaptchaVerifier;
    // private confirmationResult? : ConfirmationResult;
    readonly _allowedGenders = [Gender.Male, Gender.Female, Gender.Others];
    _phoneNumber?: number;
    _dateOfBirth?: string; // todo change data format to backend format
    _gender?: Gender;
    _userName?: string;
    _hasUserCanceledDatePicker?: boolean;
    _verificationCode?: string;

    next() {
        this.customStepperComponent.selectedIndex += 1;
    }

    constructor(
        private readonly store: Store,
        private readonly actions: Actions,
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.actions.pipe(ofType(authActions.verificationCodeSent)).subscribe(() => {
                // todo: handle only showing the sms input field once this closure gets reached
            }),
            this.actions.pipe(ofType(authActions.failure)).subscribe(({error}) => {
                // todo decide what happens with the user flow when sign up fails
                alert(error);
            }),
            this.actions.pipe(
                ofType(authActions.flowSuccessfullyFinished)
            ).subscribe(()=>alert("flow successfully finished"))
        );
    }

    ngAfterViewInit() {
        // this.reCAPTCHAVerifier = new firebase.auth.RecaptchaVerifier('reCAPTCHA-container', {
        //     'size': 'invisible'
        // });
    }

    initializeReCAPTCHAVerifier() {
        // this.reCAPTCHAVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        //     'size': 'invisible'
        // });
    }

    signIn() {
        // this if check should never be reached unless there is a bug with the form template, but it helps by smart casting
        if (this._phoneNumber === undefined)
            throw new Error();
        // console.log(this.reCAPTCHAVerifier)
        this.store.dispatch(
            authActions.initiateSignInFlow({
                phoneNumber: this._phoneNumber,
                // reCAPTCHAVerifier:this.reCAPTCHAVerifier,
                //     new firebase.auth.RecaptchaVerifier('sign-in-button', {
                //     'size': 'invisible'
                // }),
            })
        );
    }

    confirmVerificationCode() {
        // todo: this if check currently passes if user goes to sms verification code component before hitting sign in
        //   when refactoring this page, deal with this.
        if(/*this.confirmationResult === undefined || */this._verificationCode === undefined) {
            throw new Error();
        }
        this.store.dispatch(authActions.confirmVerificationCode({
            verificationCode: this._verificationCode,
            // confirmationResult: this.confirmationResult,
        }))
    }

    getCurrentDateInInternationalFormat() {
        return format(new Date(), 'yyyy-MM-dd');
    }

    onUserCanceledDatePicker() {
        this._hasUserCanceledDatePicker = true;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }
}

enum Gender {
    Male = 'male',
    Female = 'female',
    Others = 'others',
}
