import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService, Comment } from '../comment-service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Comments:</h2>

    <div *ngFor="let c of comments$ | async">
      <div class="comment">
        <img [src]="avatarUrl" class="profilephoto-comment"/>
        <h4>{{ c.subject }} (User {{ c.userId }})</h4>
        <p>{{ c.message }}</p>
      </div>
    </div>
  `,
  styleUrl: './comment.scss'
})
export class CommentsComponent implements OnChanges {
  @Input() placeId!: number;
  comments$!: Observable<Comment[]>;
  avatarUrl: string | undefined;
  constructor(
    private commentService: CommentService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  loadComments() {
    this.comments$ = this.commentService.getCommentsByPlaceId(this.placeId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['placeId'] && this.placeId) {
      this.loadComments();
    }
    const currentUser = this.authService.getCurrentUser();
    this.avatarUrl = currentUser?.avatarUrl;
  }

  refresh() {
    this.loadComments();
  }
}
