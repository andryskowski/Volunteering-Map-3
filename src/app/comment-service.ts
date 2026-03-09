import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  placeId: number;
  userId: number;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl);
  }

  getCommentsByPlaceId(placeId: number): Observable<Comment[]> {
    const params = new HttpParams().set('placeId', placeId.toString());
    return this.http.get<Comment[]>(this.baseUrl, { params });
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${id}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    if (!comment.id) throw new Error('Comment ID is required for update');
    return this.http.put<Comment>(`${this.baseUrl}/${comment.id}`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}