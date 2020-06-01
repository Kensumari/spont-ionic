import { createAction, props } from "@ngrx/store";
import { UserState } from './auth.reducer';

export const signUpRequest = createAction(
  "[auth] sign up request",
  props<{user: UserState}>()
);

export const signUpSuccess = createAction(
    "[auth] sign up success"
);

export const signUpFailure = createAction(
    "[auth] sign up failure",
    props<{error: string}>()
);
