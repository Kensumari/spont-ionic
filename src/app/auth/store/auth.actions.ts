import { createAction, props } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import RecaptchaVerifier = firebase.auth.RecaptchaVerifier;
import * as firebase from 'firebase/app';
import { User } from 'firebase';


// actions that are in neither the web nor cordova nested objects can be used for both.
// for actions that are requesting something, use an imperative verb (e.g sendVerificationCode)
// for actions that not requesting something, but are indicating some event,
//   start with a noun and indicate what happened with a verb in past tense, and in passive form.
//   (e.g. verificationCodeSent)
export const authActions = {
  cordova: {
    sendVerificationCode: createAction(
      '[auth] [cordova] send verification code',
      props<{ phoneNumber: string }>()
    ),
    verificationCodeSent: createAction('[auth] [cordova] verification code sent',
      props<{ verificationId: AuthState['verificationId'] }>()),
    authStateChanged: createAction('[auth] [cordova] auth state changed')
  },
  web: {
    sendVerificationCode: createAction(
      '[auth] [web] send verification code',
      props<{ phoneNumber: string, recaptchaVerifier: RecaptchaVerifier }>()
    ),
    verificationCodeSent: createAction('[auth] [web] verification code sent',
      props<{ confirmationResult: AuthState['confirmationResult'] }>())
  },
  confirmVerificationCode: createAction(
    '[auth] confirm verification code',
    props<{ verificationCode: string | number }>()
  ),
  verificationCodeConfirmed: createAction('[auth] verification code confirmed'),
  updateUserInfo: createAction('[auth] update user info', props<{ user: User | null }>()),
  // todo: handle the different kinds of failures at each stage
  failure: createAction('[auth] failure', props<{ error: string }>()),
  // todo
  signOut: createAction('[auth] sign out')
};
