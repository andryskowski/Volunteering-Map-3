import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlacesState } from './places.state';

export const selectPlacesState = createFeatureSelector<PlacesState>('places');

export const selectAllPlaces = createSelector(selectPlacesState, (state) => state.places);

export const selectFilters = createSelector(selectPlacesState, (state) => state.filters);

export const selectFilteredPlaces = createSelector(
  selectAllPlaces,
  selectFilters,
  (places, filters) => {
    let result = places.filter((place) => {
      const matchesSearch =
        !filters.search || place.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category || place.category === filters.category;

      const matchesDistrict = !filters.district || place.district === filters.district;

      return matchesSearch && matchesCategory && matchesDistrict;
    });

    if (filters.sort === 'newest') {
      result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (filters.sort === 'oldest') {
      result = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return result;
  },
);

export const selectLoading = createSelector(selectPlacesState, (state) => state.loading);
