import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService, Comment } from '../comment-service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Add a Comment</h3>
    <form (ngSubmit)="submitComment()" #commentForm="ngForm">
      <div>
        <label for="subject">Subject:</label>
        <input id="subject" name="subject" [(ngModel)]="comment.subject" required />
      </div>

      <div>
        <label for="message">Message:</label>
        <textarea id="message" name="message" [(ngModel)]="comment.message" required></textarea>
      </div>

      <div>
        <label for="userId">Your User ID:</label>
        <input id="userId" name="userId" type="number" [(ngModel)]="comment.userId" required />
      </div>

      <button type="submit" [disabled]="!commentForm.form.valid">Submit</button>
    </form>
  `
})
export class CommentFormComponent {
  @Input() placeId!: number;
  @Output() commentAdded = new EventEmitter<void>();

  comment: Comment = {
    placeId: 0,
    userId: 0,
    subject: '',
    message: ''
  };

  constructor(private commentService: CommentService) {}

  submitComment() {
    if (!this.placeId) return;

    this.comment.placeId = this.placeId;

    this.commentService.addComment(this.comment).subscribe({
      next: (newComment) => {
        console.log('Comment added:', newComment);
        this.comment = { placeId: this.placeId, userId: 0, subject: '', message: '' };
        this.commentAdded.emit();
      },
      error: (err) => console.error('Error adding comment:', err)
    });
  }
}