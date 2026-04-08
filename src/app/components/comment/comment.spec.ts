import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comment';
import { CommentService } from '../../services/comment-service';
import { UserService } from '../../services/user-service';
import { of } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockComments = [
    { id: 1, userId: 1, subject: 'Test', message: 'Hello', placeId: 1 },
    { id: 2, userId: 2, subject: 'Test2', message: 'Hi', placeId: 1 },
  ];

  const mockUsers = [
    { _id: 1, login: 'john', avatarUrl: 'avatar1.png', email: 'sth@test.com', role: 'moderator', createdAt: '2026-01-01T00:00:00Z' },
    { _id: 2, login: 'kate', avatarUrl: 'avatar2.png', email: 'sth@test.com', role: 'moderator', createdAt: '2026-01-01T00:00:00Z' },
  ];

  beforeEach(async () => {
    commentServiceSpy = jasmine.createSpyObj('CommentService', ['getCommentsByPlaceId']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [CommentsComponent, RouterTestingModule],
      providers: [
        { provide: CommentService, useValue: commentServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
  });

  it('should load comments with user login and avatar', (done) => {
    commentServiceSpy.getCommentsByPlaceId.and.returnValue(of(mockComments));
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));

    component.placeId = 123;
    component.loadComments();

    component.commentsWithLogin$.subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result[0].userLogin).toBe('john');
      expect(result[0].avatarUrl).toBe('avatar1.png');
      expect(result[1].userLogin).toBe('kate');
      done();
    });
  });

  it('should call loadComments when placeId changes', () => {
    const spy = spyOn(component, 'loadComments');

    component.placeId = 123;

    component.ngOnChanges({
      placeId: new SimpleChange(null, 123, true),
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should call loadComments on refresh', () => {
    const spy = spyOn(component, 'loadComments');

    component.refresh();

    expect(spy).toHaveBeenCalled();
  });

  it('should set default avatar on error', () => {
    const img = document.createElement('img');
    const event = { target: img } as unknown as Event;

    component.onAvatarError(event);

    expect(img.src).toBe(component.defaultAvatar);
  });
});