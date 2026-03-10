import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Place } from '../models/place.model';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private places: Place[] = [];
  private apiUrl = 'http://localhost:8080/places';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (!token) console.warn('No JWT token available!');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  loadPlaces(): Observable<Place[]> {
    if (this.places.length) return of(this.places);

    return this.http.get<Place[]>(this.apiUrl, this.getAuthHeaders()).pipe(
      tap((data) => { this.places = data; })
    );
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  postPlace(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place, this.getAuthHeaders()).pipe(
      tap((newPlace) => { this.places.push(newPlace); })
    );
  }

  updatePlace(id: number, updatedData: Partial<Place>): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/${id}`, updatedData, this.getAuthHeaders()).pipe(
      tap((updatedPlace) => {
        const index = this.places.findIndex(p => p._id === id);
        if (index > -1) this.places[index] = updatedPlace;
      })
    );
  }

  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      tap(() => { this.places = this.places.filter(p => p._id !== id); })
    );
  }
}