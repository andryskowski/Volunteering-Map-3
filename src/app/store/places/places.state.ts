import { Place } from "../../models/place.model";

export interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;

  filters: {
    district: string;
    category: string | null;
    search: string;
    sort: string;
  };
}

export const initialState: PlacesState = {
  places: [],
  loading: false,
  error: null,

  filters: {
    search: '',
    category: null,
    district: '',
    sort: ''
  },
};