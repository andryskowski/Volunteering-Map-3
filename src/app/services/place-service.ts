import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Place } from '../models/place.model';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class PlaceService {

  private readonly apiUrl = 'http://localhost:8080/places';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();

    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  loadPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(
      this.apiUrl,
      this.getAuthHeaders()
    );
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<Place>(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  postPlace(place: Place): Observable<Place> {
    return this.http.post<Place>(
      this.apiUrl,
      place,
      this.getAuthHeaders()
    );
  }

  updatePlace(id: number, data: Partial<Place>): Observable<Place> {
    return this.http
      .put<{ success: boolean; place: Place }>(
        `${this.apiUrl}/${id}`,
        data,
        this.getAuthHeaders()
      )
      .pipe(
        map(res => res.place)
      );
  }

  deletePlace(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }
}