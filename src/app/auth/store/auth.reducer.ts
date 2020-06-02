import { Action, createReducer, on } from '@ngrx/store';
import { signUpRequest } from './auth.actions';

export interface UserState {
  phoneNumber: number;
  dateOfBirth: string;
  gender: string;
  userName: string;
}

export interface AuthState {
  user?: UserState;
}

export function authReducer(state: AuthState | undefined, action: Action) {
  return createReducer(
    undefined as AuthState | undefined,
    on(signUpRequest, (currState, { user }) => {
      return { ...currState, user: { ...user } };
    })
  )(state, action);
}
