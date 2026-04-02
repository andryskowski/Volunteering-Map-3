import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService, User } from './user-service';
import { AuthService } from './auth-service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'fake-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all users', () => {
    const mockUsers: User[] = [
      { _id: 1, login: 'user1', email: 'a@a.com', role: 'admin', createdAt: '2026-01-01T00:00:00Z' },
      { _id: 2, login: 'user2', email: 'b@b.com', role: 'user', createdAt: '2026-01-02T00:00:00Z' },
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8080/users');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockUsers);
  });

  it('should fetch user by id', () => {
    const mockUser: User = { _id: 1, login: 'user1', email: 'a@a.com', role: 'admin', createdAt: '2026-01-01T00:00:00Z' };
    const id = 1;

    service.getUserById(id).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:8080/users/${id}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockUser);
  });

  it('should delete user by id', () => {
    const id = 1;

    service.deleteUser(id).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:8080/users/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });

  it('should update user data', () => {
    const id = 1;
    const updatedData: Partial<User> = { login: 'newLogin' };
    const mockResponse: User = {
      _id: id,
      login: 'newLogin',
      email: 'a@a.com',
      role: 'admin',
      createdAt: '2026-01-01T00:00:00Z'
    };

    service.updateUser(id, updatedData).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/users/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockResponse);
  });
});