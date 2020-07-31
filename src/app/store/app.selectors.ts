import { createSelector } from '@ngrx/store';
import { SpontState } from './app.reducer';
import { IonicPlatform } from '../shared/enums/ionic-platform.enum';

export const selectIsAppRunningOnCordova = createSelector(
    (state: SpontState) => state.app.platforms!,
    platforms => platforms.includes(IonicPlatform.CORDOVA)
)
