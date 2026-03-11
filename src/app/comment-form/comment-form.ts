import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService, Comment } from '../comment-service';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-card">
      <h3>Add a Comment</h3>

      <form (ngSubmit)="submitComment()" #commentForm="ngForm">
        <div class="form-group">
          <label for="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            [(ngModel)]="comment.subject"
            required
            #subject="ngModel"
            placeholder="Enter subject"
          />
          <small class="error" *ngIf="subject.invalid && subject.touched">
            Subject is required
          </small>
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            [(ngModel)]="comment.message"
            required
            #message="ngModel"
            placeholder="Write your comment..."
            rows="4"
          ></textarea>
          <small class="error" *ngIf="message.invalid && message.touched">
            Message is required
          </small>
        </div>

        <button type="submit" [disabled]="!commentForm.form.valid" class="submit-btn">
          Add Comment
        </button>
      </form>
    </div>

  `,
  styles: [
    `
      .form-card {
        max-width: 500px;
        margin: 20px 0;

        border-radius: 10px;
        background: #ffffff;
        font-family: Arial, sans-serif;
      }

      h3 {
        margin-bottom: 20px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
      }

      label {
        font-weight: 600;
        margin-bottom: 5px;
      }

      input,
      textarea {
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: border 0.2s;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: #1976d2;
      }

      textarea {
        resize: vertical;
      }

      .submit-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 6px;
        background: #1976d2;
        color: white;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      }

      .submit-btn:hover:not(:disabled) {
        background: #125aa3;
      }

      .submit-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .error {
        color: #d32f2f;
        font-size: 12px;
        margin-top: 3px;
      }
    `,
  ],
})
export class CommentFormComponent {
  @Input() placeId!: number;
  @Output() commentAdded = new EventEmitter<void>();
  userId: number | undefined;

  comment: Comment = {
    placeId: 0,
    userId: 0,
    subject: '',
    message: '',
  };

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?._id;
  }

  submitComment() {
    if (!this.placeId || !this.userId) return;

    this.comment.placeId = this.placeId;
    this.comment.userId = this.userId;

    this.commentService.addComment(this.comment).subscribe({
      next: () => {
        this.comment = {
          placeId: this.placeId,
          userId: this.userId,
          subject: '',
          message: '',
        };
        this.commentAdded.emit();
      },
      error: (err) => console.error('Error adding comment:', err),
    });
  }
}