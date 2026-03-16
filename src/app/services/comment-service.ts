import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';

export interface Comment {
  id?: number;
  placeId: number;
  userId?: number;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8080/comments';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No JWT token available!');
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl, this.getAuthHeaders());
  }

  getCommentsByPlaceId(placeId: number): Observable<Comment[]> {
    const params = new HttpParams().set('placeId', placeId.toString());
    return this.http.get<Comment[]>(this.baseUrl, { ...this.getAuthHeaders(), params });
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment, this.getAuthHeaders());
  }

  updateComment(id: number, data: Partial<Comment>): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
