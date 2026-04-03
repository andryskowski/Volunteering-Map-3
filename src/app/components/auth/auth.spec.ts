import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { ModalService } from '../../services/modal-service';
import { Router } from '@angular/router';

describe('Auth Component', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  let authServiceMock: any;
  let modalServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login'),
      register: jasmine.createSpy('register'),
    };

    modalServiceMock = {
      open: jasmine.createSpy('open'),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Auth],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should toggle mode to register and add validators', () => {
    component.isLoginMode = true;

    component.toggleMode();

    expect(component.isLoginMode).toBeFalse();

    const email = component.authForm.get('email');
    const confirm = component.authForm.get('confirmPassword');

    email?.setValue('');
    confirm?.setValue('');

    expect(email?.valid).toBeFalse();
    expect(confirm?.valid).toBeFalse();
  });

  it('should toggle mode back to login and remove validators', () => {
    component.isLoginMode = false;

    component.toggleMode();

    expect(component.isLoginMode).toBeTrue();

    const email = component.authForm.get('email');
    const confirm = component.authForm.get('confirmPassword');

    email?.setValue('');
    confirm?.setValue('');

    expect(email?.valid).toBeTrue();
    expect(confirm?.valid).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.authForm.setValue({
      login: '',
      password: '',
      confirmPassword: '',
      email: '',
      avatarUrl: '',
    });

    component.onSubmit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

it('should call login on valid form and handle success', () => {
    authServiceMock.login.and.returnValue(of({}));

    component.authForm.setValue({
      login: 'test',
      password: '123456',
      confirmPassword: '',
      email: '',
      avatarUrl: '',
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test', '123456');
    expect(modalServiceMock.open).toHaveBeenCalledWith('Success', 'Login successful');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/map']);
  });


  it('should handle login error', () => {
    authServiceMock.login.and.returnValue(throwError(() => ({ message: 'Bad credentials' })));

    component.authForm.setValue({
      login: 'test',
      password: '123456',
      confirmPassword: '',
      email: '',
      avatarUrl: '',
    });

    component.onSubmit();

    expect(modalServiceMock.open).toHaveBeenCalledWith('Error', 'Bad credentials');
  });

  it('should show error when passwords do not match', () => {
    component.toggleMode();

    component.authForm.setValue({
      login: 'test',
      password: '123456',
      confirmPassword: 'different',
      email: 'test@test.com',
      avatarUrl: '',
    });

    component.onSubmit();

    expect(authServiceMock.register).not.toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalledWith('Error', 'Passwords must match!');
  });

  it('should call register and handle success', () => {
    component.toggleMode();

    authServiceMock.register.and.returnValue(of({}));

    component.authForm.setValue({
      login: 'test',
      password: '123456',
      confirmPassword: '123456',
      email: 'test@test.com',
      avatarUrl: 'avatar.png',
    });

    component.authForm.updateValueAndValidity();

    expect(component.authForm.valid).toBeTrue();
    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'test',
      '123456',
      'test@test.com',
      'avatar.png',
    );
  });

  it('should handle register error', () => {
    component.toggleMode();

    authServiceMock.register.and.returnValue(throwError(() => ({ error: 'User exists' })));

    component.authForm.setValue({
      login: 'test',
      password: '123456',
      confirmPassword: '123456',
      email: 'test@test.com',
      avatarUrl: '',
    });

    component.onSubmit();

    expect(modalServiceMock.open).toHaveBeenCalledWith('Error', 'Registration failed: User exists');
  });
});
