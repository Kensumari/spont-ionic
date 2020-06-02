import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { signUpRequest, signUpFailure, signUpSuccess } from './auth.actions';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  readonly _signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUpRequest),
      mergeMap((action) =>
        this.authService.signUp(action.user).pipe(
          mapTo(signUpSuccess()),
          catchError((error) =>
            of(signUpFailure({ error: JSON.stringify(error) }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}
}
