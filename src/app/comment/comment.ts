import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService, Comment } from '../comment-service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Comments:</h2>

    <div *ngFor="let c of comments">
      <h4>{{ c.subject }} (User {{ c.userId }})</h4>
      <p>{{ c.message }}</p>
    </div>
  `,
})
export class CommentsComponent implements OnInit {
  @Input() placeId!: number;
  comments: Comment[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getCommentsByPlaceId(this.placeId).subscribe(data => {
      this.comments = Array.isArray(data) ? data : [data];
    });
  }

  refresh() {
    this.loadComments();
  }
}