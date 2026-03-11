import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Place } from '../models/place.model';
import { map, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class PlaceService {
  private places: Place[] = [];
  private apiUrl = 'http://localhost:8080/places';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (!token) console.warn('No JWT token available!');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  loadPlaces(): Observable<Place[]> {
    if (this.places.length) return of(this.places);

    return this.http.get<Place[]>(this.apiUrl, this.getAuthHeaders()).pipe(
      tap((data) => {
        this.places = data;
      }),
    );
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  postPlace(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place, this.getAuthHeaders()).pipe(
      tap((newPlace) => {
        this.places.push(newPlace);
      }),
    );
  }

  updatePlace(id: number, data: any): Observable<Place> {
    return this.http
      .put<{ success: boolean; place: Place; message: string }>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map((res) => res.place),
      );
  }

  deletePlace(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
