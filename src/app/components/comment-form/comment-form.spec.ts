import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentFormComponent } from './comment-form';
import { CommentService } from '../../services/comment-service';
import { AuthService } from '../../services/auth-service';
import { of, throwError } from 'rxjs';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    commentServiceSpy = jasmine.createSpyObj('CommentService', ['addComment']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    authServiceSpy.getCurrentUser.and.returnValue({
      _id: 1,
      login: 'john',
      email: 'sth@test.com',
      role: 'moderator',
      createdAt: '2026-01-01T00:00:00Z',
    });

    await TestBed.configureTestingModule({
      imports: [CommentFormComponent],
      providers: [
        { provide: CommentService, useValue: commentServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
  });

  it('should set userId from AuthService on init', () => {
    expect(component.userId).toBe(1);
  });

  it('should NOT submit if placeId is missing', () => {
    component.placeId = 0;

    component.submitComment();

    expect(commentServiceSpy.addComment).not.toHaveBeenCalled();
  });

  it('should NOT submit if userId is missing', () => {
    component.placeId = 1;
    component.userId = undefined;

    component.submitComment();

    expect(commentServiceSpy.addComment).not.toHaveBeenCalled();
  });

  it('should submit comment and reset form', () => {
    commentServiceSpy.addComment.and.returnValue(
      of({
        placeId: 1,
        userId: 1,
        subject: 'Test',
        message: 'Hello',
      }),
    );

    component.placeId = 1;
    component.comment.subject = 'Test';
    component.comment.message = 'Hello';

    spyOn(component.commentAdded, 'emit');

    component.submitComment();

    expect(commentServiceSpy.addComment).toHaveBeenCalledWith({
      placeId: 1,
      userId: 1,
      subject: 'Test',
      message: 'Hello',
    });

    expect(component.comment.subject).toBe('');
    expect(component.comment.message).toBe('');
    expect(component.commentAdded.emit).toHaveBeenCalled();
  });

  it('should handle error when adding comment fails', () => {
    const consoleSpy = spyOn(console, 'error');

    commentServiceSpy.addComment.and.returnValue(throwError(() => new Error('fail')));

    component.placeId = 1;
    component.comment.subject = 'Test';
    component.comment.message = 'Hello';

    component.submitComment();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
