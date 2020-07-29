import { createAction, props } from '@ngrx/store';
import { AuthState } from './auth.reducer';
// import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
// import * as firebase from 'firebase';
// import ConfirmationResult = firebase.auth.ConfirmationResult;

export const authActions = {
    initiateSignInFlow: createAction(
        '[auth] initiate sign in flow',
        props<{phoneNumber: number, /*reCAPTCHAVerifier: RecaptchaVerifier*/}>()
    ),
    verificationCodeSent: createAction('[auth] verification code sent',
        props<{verificationId: AuthState['verificationId']}>()),
    confirmVerificationCode: createAction(
        '[auth] confirm verification code',
        props<{verificationCode: string}>()),
    // todo, and think about separating into specific failures
    failure: createAction('[auth] failure',props<{ error: string }>()),
    // todo
    signOut: createAction('[auth] sign out'),
    // todo
    signedOut: createAction('[auth] signed out'),

}
