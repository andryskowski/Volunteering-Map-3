import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../modal-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./auth.scss'],
})
export class Auth {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router,
  ) {
    this.authForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      email: [''],
      avatarUrl: [''],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('email')?.clearValidators();
    } else {
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    }
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
    this.authForm.get('email')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { login, password, confirmPassword, email, avatarUrl } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(login, password).subscribe({
        next: (res) => {
          console.log('Login successful, token:', res.token);
          // this.modalService.open('Success', 'Login successful');
          this.authForm.reset();
          this.router.navigate(['/map']);
        },
        error: (err) => {
          console.error('Login failed:', err.message);
          this.modalService.open('Error', err.message);
        },
      });
    } else {
      if (password !== confirmPassword) {
        this.modalService.open('Error', 'Passwords must match!');
        return;
      }

      this.authService.register(login, password, email, avatarUrl).subscribe({
        next: (res) => {
          console.log('Registered successfully, token:', res.token);
          this.modalService.open('Success', 'Registration successful!');
          this.authForm.reset();
          this.isLoginMode = true;
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.modalService.open('Error', 'Registration failed: ' + (err.error || err.message));
        },
      });
    }
  }
}
