import { Action, createReducer, on } from '@ngrx/store';
import { appActions } from './app.actions';
import { IonicPlatform } from '../shared/enums/ionic-platform.enum';
import { AuthState } from '../auth/store/auth.reducer';

// prefixed name with 'Spont' because @capacitor/core already has an 'AppState' interface
export type SpontState = { app: AppRootState, auth: AuthState };

export type AppRootState = { platforms?: IonicPlatform[] };

export function appReducer(state: AppRootState | undefined, action: Action) {
    return createReducer<AppRootState>(
        {},
        on(appActions.setPlatforms, (currState, {platforms}) => {
            return {...currState, platforms};
        })
    )(state, action);
}
