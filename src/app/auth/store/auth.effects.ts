import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, first, map, mapTo, /*mapTo*/ mergeMap, switchMap } from 'rxjs/operators';
import { from, of, throwError } from 'rxjs';
import { authActions } from './auth.actions';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { SpontState } from '../../store/app.reducer';
import { selectArgumentNeededToCompleteSignIn } from './auth.selectors';
import { appActions } from '../../store/app.actions';
import { User } from 'firebase';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly store: Store<SpontState>,
    private readonly actions$: Actions,
    private readonly cordovaFireAuth: FirebaseAuthentication,
    private readonly webBrowserFireAuth: AngularFireAuth
  ) {
  }

  readonly _sendVerificationCodeOnCordova$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.cordova.sendVerificationCode),
    mergeMap(({ phoneNumber }) =>
      from(this.cordovaFireAuth.verifyPhoneNumber(phoneNumber.toString(), 30000)).pipe(
        map((verificationId: string) => authActions.cordova.verificationCodeSent({ verificationId }))
      )
    ),
    catchError(error => of(authActions.failure({ error: JSON.stringify(error) })))
    )
  );

  readonly _sendVerificationCodeOnWeb$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.web.sendVerificationCode),
    mergeMap(({ phoneNumber, recaptchaVerifier }) =>
      from(this.webBrowserFireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)).pipe(
        map(confirmationResult => authActions.web.verificationCodeSent({ confirmationResult }))
      )),
    catchError(error => of(authActions.failure({ error: JSON.stringify(error) })))
    )
  );

  readonly _confirmVerificationCode$ = createEffect(() =>
    this.actions$.pipe(ofType(authActions.confirmVerificationCode)).pipe(
      switchMap(({ verificationCode }) =>
        this.store.select(selectArgumentNeededToCompleteSignIn).pipe(
          first(),
          map(argumentNeededToCompleteSignIn => ({
            argumentNeededToCompleteSignIn,
            verificationCode
          })))),
      mergeMap(({ verificationCode, argumentNeededToCompleteSignIn }) =>
           argumentNeededToCompleteSignIn === undefined ?
            throwError('argumentNeededToCompleteSignIn should be defined') :
            typeof argumentNeededToCompleteSignIn === 'string' ?
              from(this.cordovaFireAuth.signInWithVerificationId(
                argumentNeededToCompleteSignIn,
                verificationCode.toString()
              )) :
              from(argumentNeededToCompleteSignIn.confirm(verificationCode.toString()))

      ),
      mapTo(authActions.verificationCodeConfirmed()),
      catchError(AuthEffects.catchErrorHandler)
    )
  );

  readonly _cordovaAuthStateChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.cordova.authStateChanged),
      switchMap(() => from((this.cordovaFireAuth as any).getCurrentUser() as Promise<null | User>)),
      map(user => authActions.updateUserInfo({ user })),
      catchError(AuthEffects.catchErrorHandler)
    )
  );

  // todo: verify if signing out via cordova plugin is necessary, or if signing out with angular fire already does it properly.
  readonly _signOut$ = createEffect(() => this.actions$.pipe(
    ofType(authActions.signOut),
    mergeMap(() => from(this.cordovaFireAuth.signOut())),
    catchError(AuthEffects.catchErrorHandler)
  ));

  private static catchErrorHandler(error: any) {
    return of(appActions.fail({ error: JSON.stringify(error) }));
  }

}

