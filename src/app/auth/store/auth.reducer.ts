import { Action, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import * as firebase from 'firebase/app';
import ConfirmationResult = firebase.auth.ConfirmationResult;
import { User } from 'firebase';

export const authFeatureKey = 'auth';

export type AuthState = {
  verificationId?: string,
  confirmationResult?: ConfirmationResult,
  user?: User
};

export function authReducer(state: AuthState, action: Action) {
  return createReducer<AuthState>(
    {},
    on(
      authActions.cordova.verificationCodeSent,
      (currState, { verificationId }) => ({ ...currState, verificationId })
    ),
    on(
      authActions.web.verificationCodeSent,
      (currState, { confirmationResult }) => ({ ...currState, confirmationResult })
    ),
    on(
      authActions.updateUserInfo,
      (currState, { user }) => ({
        ...currState,
        user: user === null ? undefined : user,
        verificationId: undefined,
        confirmationResult: undefined
      })
    )
  )(state, action);
}
