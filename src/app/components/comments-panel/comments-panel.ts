import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentService } from '../../services/comment-service';
import { EntityPanelComponent, DeletableEntity } from '../entity-panel/entity-panel';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { ModalService } from '../../services/modal-service';
import { EditEntityFormComponent, FieldConfig } from '../edit-entity-form/edit-entity-form';
import { ToastComponent } from '../toast/toast';

@Component({
  selector: 'app-comments-panel',
  standalone: true,
  imports: [CommonModule, EntityPanelComponent, ToastComponent],
  template: `
    <app-toast></app-toast>

    <app-entity-panel
      [title]="'Comments'"
      [entities]="commentsForPanel"
      [columns]="['subject', 'message', 'userId', 'placeId']"
      [deleteFn]="deleteCommentFn"
      [editFn]="editCommentFn"
      [loading$]="loading$"
    >
    </app-entity-panel>
  `,
})
export class CommentsPanel implements OnInit {
  comments: Comment[] = [];
  commentsForPanel: DeletableEntity[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  @ViewChild(ToastComponent) toast!: ToastComponent;

  constructor(
    private commentService: CommentService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.fetchComments();

    this.modalService.modalState$.subscribe((state) => {
      if (!state.visible) {
        this.fetchComments();
      }
    });
  }

  fetchComments() {
    this.loadingSubject.next(true);
    this.commentService
      .getAllComments()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.commentsForPanel = comments.map((c) => ({ ...c, _id: c.id ?? 0 }));
        },
        error: (err) => {
          console.error(err);
          this.comments = [];
          this.commentsForPanel = [];
          if (this.toast) {
            this.toast.show('Failed to fetch comments', 'error');
          }
        },
      });
  }

  deleteCommentFn = (id: string | number) => {
    return this.commentService.deleteComment(Number(id)).pipe(
      finalize(() => this.fetchComments()),
      tap({
        next: () => this.toast?.show('Comment deleted successfully', 'success'),
        error: () => this.toast?.show('Failed to delete comment', 'error'),
      }),
    );
  };

  editCommentFn = (comment: Comment) => {
    const fields: FieldConfig[] = [
      { name: 'subject', label: 'Subject' },
      { name: 'message', label: 'Message', type: 'textarea' },
    ];

    this.modalService.open('Edit Comment', EditEntityFormComponent, {
      entity: comment,
      fields,
      submitFn: (updatedComment: any) => {
        return this.commentService.updateComment(comment.id!, updatedComment).pipe(
          finalize(() => {
            this.fetchComments();
            this.toast.show('Comment updated successfully', 'success');
          }),
        );
      },
    });
  };
}
