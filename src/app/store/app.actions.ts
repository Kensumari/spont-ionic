import { createAction, props } from '@ngrx/store';


export const appActions = {
    setPlatforms: createAction(
        '[app] set platforms',
        props<{platforms: string[]}>()
    ),
}
