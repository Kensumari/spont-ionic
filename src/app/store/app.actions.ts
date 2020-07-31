import { createAction, props } from '@ngrx/store';
import { IonicPlatform } from '../shared/enums/ionic-platform.enum';


export const appActions = {
    setPlatforms: createAction(
        '[app] set platforms',
        props<{platforms: IonicPlatform[]}>()
    ),
    fail: createAction('[app] fail', props<{ error: string }>()),
}
