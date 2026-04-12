import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { ReactiveFormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';
import { environment } from '../../../../config/env';

describe('Contact Component', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Contact],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;

    component.currentUser = {
      userInfo: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    fixture.detectChanges();
  });

  it('should create form with initial values', () => {
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm.value.name).toBe('John Doe');
    expect(component.contactForm.value.email).toBe('john@example.com');
  });

  it('should be invalid when required fields are empty', () => {
    component.contactForm.setValue({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    expect(component.contactForm.invalid).toBeTrue();
  });

  it('should validate email format', () => {
    component.contactForm.patchValue({
      email: 'invalid-email',
    });

    expect(component.contactForm.get('email')?.invalid).toBeTrue();
  });

  it('should be valid when all fields are correct', () => {
    component.contactForm.setValue({
      name: 'John',
      email: 'john@test.com',
      subject: 'Hello',
      message: 'Test message',
    });

    expect(component.contactForm.valid).toBeTrue();
  });

  it('should not call emailjs when form is invalid', () => {
    spyOn(console, 'log');
    const sendSpy = spyOn(emailjs, 'sendForm');

    component.contactForm.setValue({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    component.sendEmail();

    expect(console.log).toHaveBeenCalledWith('invalid form');
    expect(sendSpy).not.toHaveBeenCalled();
  });

it('should call emailjs.sendForm and reset form on success', async () => {
  const sendSpy = spyOn(emailjs, 'sendForm').and.returnValue(
    Promise.resolve({
      status: 200,
      text: 'OK',
    })
  );

  spyOn(window, 'alert');

  component.contactForm.setValue({
    name: 'John',
    email: 'john@test.com',
    subject: 'Hello',
    message: 'Test message',
  });

  fixture.detectChanges();

  await component.sendEmail();

  expect(sendSpy).toHaveBeenCalled();

  const args = sendSpy.calls.mostRecent().args;

  expect(args[0]).toBe(environment.emailjsServiceId);
  expect(args[1]).toBe(environment.emailjsTemplateId);
  expect((args[2] as HTMLFormElement).id).toBe('contactForm');
  expect(args[3]).toBe(environment.emailjsUserId);

  expect(window.alert).toHaveBeenCalledWith('Message sent successfully!');

  expect(component.contactForm.value).toEqual({
    name: component.currentUser?.userInfo?.name || '',
    email: component.currentUser?.userInfo?.email || '',
    subject: '',
    message: '',
  });
});

  it('should handle error when emailjs fails', async () => {
    const mockForm = document.createElement('form');
    mockForm.id = 'contactForm';
    document.body.appendChild(mockForm);

    const error = 'error!';
    spyOn(emailjs, 'sendForm').and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    component.contactForm.setValue({
      name: 'John',
      email: 'john@test.com',
      subject: 'Hello',
      message: 'Test message',
    });

    await component.sendEmail();

    expect(console.error).toHaveBeenCalledWith(error);
  });
});
