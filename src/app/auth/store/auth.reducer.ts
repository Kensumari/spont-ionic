import { Action, createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
  verificationId: string
}

export function authReducer(state: AuthState | undefined, action: Action) {
  return createReducer(
    undefined as AuthState | undefined,
    on(authActions.verificationCodeSent, (currState, { verificationId }) => {
      return { ...currState, verificationId };
    })
  )(state, action);
}
