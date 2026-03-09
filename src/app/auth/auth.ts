import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./auth.scss']
})
export class Auth {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, confirmPassword } = this.authForm.value;

    if (!this.isLoginMode) {
      if (password !== confirmPassword) {
        alert("Passwords must match!");
        return;
      }
      console.log("Register:", { email, password });
    } else {
      console.log("Login:", { email, password });
    }

    this.authForm.reset();
  }
}