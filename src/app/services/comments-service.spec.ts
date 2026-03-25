import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CommentService } from './comment-service';
import { AuthService } from './auth-service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'fake-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      providers: [
        CommentService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should get all comments', () => {
    service.getAllComments().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/comments');
    expect(req.request.method).toBe('GET');

    req.flush([
      { id: 1, placeId: 1, subject: 'Test', message: 'Hello' },
      { id: 2, placeId: 2, subject: 'Test2', message: 'Hello2' },
    ]);
  });

  it('should get comments by placeId', () => {
    const placeId = 5;

    service.getCommentsByPlaceId(placeId).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/comments?placeId=5');

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush([]);
  });

  it('should get comment by id', () => {
    const id = 1;

    service.getCommentById(id).subscribe();

    const req = httpMock.expectOne(`http://localhost:8080/comments/${id}`);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ id, placeId: 1, subject: 'test', message: 'msg' });
  });

  it('should add a comment', () => {
    const newComment = {
      placeId: 1,
      subject: 'Hello',
      message: 'World',
    };

    service.addComment(newComment).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/comments');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newComment);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ ...newComment, id: 1 });
  });

  it('should update a comment', () => {
    const id = 2;
    const updateData = { subject: 'Updated' };

    service.updateComment(id, updateData).subscribe();

    const req = httpMock.expectOne(`http://localhost:8080/comments/${id}`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ id, placeId: 1, subject: 'Updated', message: 'msg' });
  });

  it('should delete a comment', () => {
    const id = 3;

    service.deleteComment(id).subscribe();

    const req = httpMock.expectOne(`http://localhost:8080/comments/${id}`);

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(null);
  });
});
