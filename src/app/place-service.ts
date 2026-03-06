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

    return this.http.get<Place[]>('http://localhost:8080/places').pipe(
      tap((data) => {
        this.places = data;
        console.log(this.places);
      }),
    );
  }

  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`http://localhost:8080/places/${id}`);
  }

  postPlace(place: Place): Observable<Place> {
    return this.http.post<Place>('http://localhost:8080/places', place).pipe(
      tap((newPlace) => {
        this.places.push(newPlace);
      }),
    );
  }
}
