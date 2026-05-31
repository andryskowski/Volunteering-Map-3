import { createReducer, on } from '@ngrx/store';

import { loadPlaces, loadPlacesFailure, loadPlacesSuccess, updateFilters } from './places.actions';
import { initialState } from './places.state';

export const placesReducer = createReducer(
  initialState,

  on(loadPlaces, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadPlacesSuccess, (state, { places }) => ({
    ...state,
    places,
    loading: false,
  })),

  on(loadPlacesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateFilters, (state, { district, category, search, sort }) => ({
    ...state,
    filters: {
      district,
      category,
      search,
      sort,
    },
  })),
);
