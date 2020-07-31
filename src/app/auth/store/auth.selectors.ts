import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthState } from './auth.reducer';
import { selectIsAppRunningOnCordova } from '../../store/app.selectors';

export const selectFeatureAuth = createFeatureSelector<AuthState>(authFeatureKey);

export const selectArgumentNeededToCompleteSignIn = createSelector(
    selectIsAppRunningOnCordova,
    selectFeatureAuth,
    (isAppRunningOnCordova, {confirmationResult, verificationId}) =>
        isAppRunningOnCordova ? verificationId : confirmationResult,
)

export const selectUser = createSelector(selectFeatureAuth, ({user}) => user)
