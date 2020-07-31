import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { CustomStepperComponent } from '../custom-stepper/custom-stepper.component';
import { Subscription } from 'rxjs';
import { authActions } from '../store/auth.actions';
import { IonViewDidEnter } from '../../shared/interfaces/ionic-lifecycle.interface';
import { auth } from 'firebase/app';
import { selectIsAppRunningOnCordova } from '../../store/app.selectors';
import { SpontState } from '../../store/app.reducer';
import { first } from 'rxjs/operators';

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
export class AuthPage implements OnInit, OnDestroy, IonViewDidEnter {
    private readonly subscriptions: Subscription[] = [];
    @ViewChild(CustomStepperComponent, {static: true})
    private readonly customStepperComponent!: CustomStepperComponent;
    private recaptchaVerifier!: auth.RecaptchaVerifier;
    readonly allowedGenders = [Gender.Male, Gender.Female, Gender.Others];
    phoneNumber?: string;
    dateOfBirth?: string; // todo change data format to backend format
    gender?: Gender;
    userName?: string;
    hasUserCanceledDatePicker?: boolean;
    verificationCode?: number;

    next() {
        this.customStepperComponent.selectedIndex += 1;
    }

    constructor(
        private readonly store: Store<SpontState>,
        private readonly actions: Actions,
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.actions.pipe(ofType(authActions.web.verificationCodeSent, authActions.cordova.verificationCodeSent)).subscribe(() => {
                // todo: handle only showing the sms input field once this closure gets reached
            }),
        );
    }

    ionViewDidEnter() {
        // todo: don't render recaptcha div if on cordova.
        this.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });
    }

    async sendVerificationCode() {
        // this if check should never be reached unless there is a bug with the form template, but it helps by smart casting
        if (this.phoneNumber === undefined)
            throw new Error();
        this.store.dispatch(
            await this.store.select(selectIsAppRunningOnCordova).pipe(first()).toPromise() ?
                authActions.cordova.sendVerificationCode({phoneNumber: this.phoneNumber as string}) :
                authActions.web.sendVerificationCode({
                    phoneNumber: this.phoneNumber as string,
                    recaptchaVerifier: this.recaptchaVerifier
                })
        );
    }

    confirmVerificationCode() {
        // todo: this if check currently passes if user goes to sms verification code component before hitting sign in
        //   when refactoring this page, deal with this.
        if (this.verificationCode === undefined)
            throw new Error();
        this.store.dispatch(authActions.confirmVerificationCode({verificationCode: this.verificationCode}))
    }

    getCurrentDateInInternationalFormat() {
        return format(new Date(), 'yyyy-MM-dd');
    }

    onUserCanceledDatePicker() {
        this.hasUserCanceledDatePicker = true;
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
