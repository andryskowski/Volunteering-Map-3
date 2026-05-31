import { createAction, props } from '@ngrx/store';
import { Place } from '../../models/place.model';

export const loadPlaces = createAction(
  '[Places] Load Places'
);

export const loadPlacesSuccess = createAction(
  '[Places API] Load Places Success',
  props<{ places: Place[] }>()
);

export const loadPlacesFailure = createAction(
  '[Places API] Load Places Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[Places] Update Filters',
  props<{
    district: string;
    category: string;
    search: string;
    sort: string;
  }>()
);