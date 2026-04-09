import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsPanel } from './comments-panel';
import { CommentService } from '../../services/comment-service';
import { ModalService } from '../../services/modal-service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('CommentsPanel', () => {
  let component: CommentsPanel;
  let fixture: ComponentFixture<CommentsPanel>;

  let commentServiceMock: jasmine.SpyObj<CommentService>;
  let modalServiceMock: any;

  beforeEach(async () => {
    commentServiceMock = jasmine.createSpyObj('CommentService', [
      'getAllComments',
      'deleteComment',
      'updateComment',
    ]);

    modalServiceMock = {
      modalState$: new BehaviorSubject({ visible: true }),
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      imports: [CommentsPanel],
      providers: [
        { provide: CommentService, useValue: commentServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsPanel);
    component = fixture.componentInstance;

    component.toast = jasmine.createSpyObj('ToastComponent', ['show']);
  });

  it('should fetch comments on init', () => {
    const mockComments = [{ id: 1, subject: 'test', message: 'msg', placeId: 1, userId: 1 }];
    commentServiceMock.getAllComments.and.returnValue(of(mockComments));

    fixture.detectChanges();

    expect(commentServiceMock.getAllComments).toHaveBeenCalled();
    expect(component.comments.length).toBe(1);
    expect(component.commentsForPanel[0]._id).toBe(1);
  });

  it('should refetch comments when modal closes', () => {
    commentServiceMock.getAllComments.and.returnValue(of([]));

    fixture.detectChanges();

    modalServiceMock.modalState$.next({ visible: false });

    expect(commentServiceMock.getAllComments).toHaveBeenCalledTimes(2);
  });

  it('should map comments correctly on success', () => {
    const mockComments = [{ id: 5, subject: 'A', message: 'B', placeId: 1, userId: 1 }];

    commentServiceMock.getAllComments.and.returnValue(of(mockComments));

    component.fetchComments();

    expect(component.comments).toEqual(mockComments);
    expect(component.commentsForPanel).toEqual([{ ...mockComments[0], _id: 5 }]);
  });

  it('should handle error on fetchComments', () => {
    spyOn(console, 'error');

    commentServiceMock.getAllComments.and.returnValue(throwError(() => new Error('fail')));

    component.fetchComments();

    expect(component.comments).toEqual([]);
    expect(component.commentsForPanel).toEqual([]);
    expect(component.toast.show).toHaveBeenCalledWith('Failed to fetch comments', 'error');
  });

  it('should call deleteComment and show success toast', fakeAsync(() => {
    commentServiceMock.deleteComment.and.returnValue(of(undefined));

    spyOn(component, 'fetchComments').and.stub();

    component.deleteCommentFn(1).subscribe();

    tick();

    expect(component.toast.show).toHaveBeenCalledWith('Comment deleted successfully', 'success');

    expect(component.fetchComments).toHaveBeenCalled();
  }));

  it('should show error toast on delete failure', fakeAsync(() => {
    commentServiceMock.deleteComment.and.returnValue(throwError(() => new Error('fail')));

    commentServiceMock.getAllComments.and.returnValue(of([]));

    spyOn(component, 'fetchComments').and.stub();

    component.deleteCommentFn(1).subscribe({
      error: () => {
        expect(component.toast.show).toHaveBeenCalledWith('Failed to delete comment', 'error');
      },
    });

    tick();
  }));

  it('should open modal with correct config', () => {
    const comment = { id: 1, subject: 'A', message: 'B' };

    component.editCommentFn(comment as any);

    expect(modalServiceMock.open).toHaveBeenCalled();

    const args = modalServiceMock.open.calls.mostRecent().args;

    expect(args[0]).toBe('Edit Comment');
    expect(args[2].entity).toEqual(comment);
    expect(args[2].fields.length).toBe(2);
  });

  it('should call updateComment on submitFn', fakeAsync(() => {
    const comment = { id: 1, subject: 'A', message: 'B' };
    const updated = { subject: 'X' };

    commentServiceMock.updateComment.and.returnValue(
      of({ id: 1, subject: 'Test', message: 'Hello', userId: 1, placeId: 1 }),
    );

    commentServiceMock.getAllComments.and.returnValue(of([]));

    spyOn(component, 'fetchComments').and.stub();

    component.editCommentFn(comment as any);

    const submitFn = modalServiceMock.open.calls.mostRecent().args[2].submitFn;

    submitFn(updated).subscribe();

    tick();

    expect(commentServiceMock.updateComment).toHaveBeenCalledWith(1, updated);
    expect(component.fetchComments).toHaveBeenCalled();
    expect(component.toast.show).toHaveBeenCalledWith('Comment updated successfully', 'success');
  }));
});
