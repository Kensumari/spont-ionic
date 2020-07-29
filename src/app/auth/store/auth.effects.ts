import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mapTo, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { authActions } from './auth.actions';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';

@Injectable()
export class AuthEffects {
    constructor(
        private readonly store: Store<AuthState>,
        private readonly actions$: Actions,
        private readonly firebaseAuth: FirebaseAuthentication,
    ) {
        // console.log(this.firebaseAuth.verifyPhoneNumber('123', 30000/*reCAPTCHAVerifier*/));
    }

    readonly _initiateSignInFlow$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.initiateSignInFlow),
            mergeMap(({phoneNumber/*, reCAPTCHAVerifier*/}) =>
                from(this.firebaseAuth.verifyPhoneNumber(phoneNumber.toString(), 30000/*reCAPTCHAVerifier*/)).pipe(
                    map((verificationId: AuthState['verificationId']) => authActions.verificationCodeSent({verificationId})),
                    catchError(error => of(authActions.failure({error: JSON.stringify(error)})))),
            )
        )
    );

    readonly _confirmVerificationCode$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.confirmVerificationCode),
            mergeMap(({verificationCode}) => this.store.select((state: AuthState) => ({
                verificationCode,
                verificationId: state.verificationId
            }))),
            mergeMap(({verificationCode, verificationId}) =>
                from(this.firebaseAuth.signInWithVerificationId(verificationId, verificationCode)).pipe(
                    catchError(AuthEffects.catchErrorHandler)),
            )
        )
    );

    readonly _signOut$ = createEffect(() =>
        this.actions$.pipe(
            ofType(authActions.signOut),
            mergeMap(() =>
                from(this.firebaseAuth.signOut()).pipe(
                    mapTo(authActions.signedOut()),
                    catchError(AuthEffects.catchErrorHandler)
                )
            )
        )
    );

    private static catchErrorHandler(error: any) {
        return of(authActions.failure({error: JSON.stringify(error)}));
    }

}

