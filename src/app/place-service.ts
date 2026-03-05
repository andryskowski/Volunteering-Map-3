import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../models/place.model';
import { Observable, of, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private places: Place[] = [];

  constructor(private http: HttpClient) {}

  loadPlaces(): Observable<Place[]> {
    if (this.places.length) return of(this.places);

    return this.http
      .get<Place[]>('/assets/data/places.json')
      .pipe(tap((data) => (this.places = data)));
  }

  getPlaceById(id: string): Observable<Place | undefined> {
    return this.loadPlaces().pipe(
      map((p) => {
        console.log('ID from route:', id);
        console.log('All places:', p);
        return p.find((pl) => pl._id === id);
      }),
    );
  }
}
