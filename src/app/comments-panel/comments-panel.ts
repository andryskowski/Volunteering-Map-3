import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentService } from '../comment-service';
import { EntityPanelComponent, DeletableEntity } from '../entity-panel/entity-panel';
import { BehaviorSubject, finalize } from 'rxjs';
import { ModalService } from '../modal-service';
import { EditEntityFormComponent, FieldConfig } from '../edit-entity-form/edit-entity-form';

@Component({
  selector: 'app-comments-panel',
  standalone: true,
  imports: [CommonModule, EntityPanelComponent],
  template: `
    <app-entity-panel
      [title]="'Comments'"
      [entities]="commentsForPanel"
      [columns]="['subject','message','userId','placeId']"
      [deleteFn]="deleteCommentFn"
      [editFn]="editCommentFn"
      [loading$]="loading$"
    >
    </app-entity-panel>
  `
})
export class CommentsPanel implements OnInit {
  comments: Comment[] = [];
  commentsForPanel: DeletableEntity[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private commentService: CommentService,
              private modalService: ModalService) {}

  ngOnInit() {
    this.fetchComments();

    this.modalService.modalState$.subscribe(state => {
      if (!state.visible) {
        this.fetchComments();
      }
    });
  }

  fetchComments() {
    this.loadingSubject.next(true);
    this.commentService.getAllComments()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: comments => {
          this.comments = comments;
          this.commentsForPanel = comments.map(c => ({ ...c, _id: c.id ?? 0 }));
        },
        error: err => {
          console.error(err);
          this.comments = [];
          this.commentsForPanel = [];
        }
      });
  }

  deleteCommentFn = (id: string | number) => {
    return this.commentService.deleteComment(Number(id)).pipe(
      finalize(() => this.fetchComments())
    );
  };

  editCommentFn = (comment: Comment) => {
    const fields: FieldConfig[] = [
      { name: 'subject', label: 'Subject' },
      { name: 'message', label: 'Message', type: 'textarea' }
    ];

    this.modalService.open(
      'Edit Comment',
      EditEntityFormComponent,
      {
        entity: comment,
        fields,
        submitFn: (updatedComment: any) =>
          this.commentService.updateComment(comment.id!, updatedComment)
      }
    );
  };
}