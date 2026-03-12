import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./contact.scss'],
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  currentUser: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: [this.currentUser?.userInfo?.name || '', Validators.required],
      email: [this.currentUser?.userInfo?.email || '', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  sendEmail() {
    if (this.contactForm.invalid) {
      console.log('invalid form');
      return;
    }

    const form = document.getElementById('contactForm') as HTMLFormElement;

    emailjs
      .sendForm('service_7dq1qe3', 'template_s3vzm0j', form, 'user_sUt0KQRlhNXDQuf9BzGLr')
      .then(
        () => alert('Message sent successfully!'),
        (err) => console.error(err),
      );

    this.contactForm.reset({
      name: this.currentUser?.userInfo?.name || '',
      email: this.currentUser?.userInfo?.email || '',
      subject: '',
      message: '',
    });
  }
}
