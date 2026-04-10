import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceForm } from './place-form';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PlaceService } from '../../services/place-service';
import { of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

describe('PlaceForm', () => {
  let component: PlaceForm;
  let fixture: ComponentFixture<PlaceForm>;
  let placeServiceSpy: jasmine.SpyObj<PlaceService>;

  beforeEach(async () => {
    placeServiceSpy = jasmine.createSpyObj('PlaceService', ['postPlace']);

    await TestBed.configureTestingModule({
      imports: [PlaceForm, ReactiveFormsModule],
      providers: [
        { provide: PlaceService, useValue: placeServiceSpy },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustUrl: (v: string) => v } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form with all controls', () => {
    const controls = component.placeForm.controls;
    expect(controls['name']).toBeDefined();
    expect(controls['webPage']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['phone']).toBeDefined();
    expect(controls['city']).toBeDefined();
    expect(controls['street']).toBeDefined();
    expect(controls['houseNo']).toBeDefined();
    expect(controls['postalCode']).toBeDefined();
    expect(controls['district']).toBeDefined();
    expect(controls['img']).toBeDefined();
    expect(controls['category']).toBeDefined();
    expect(controls['shortDescription']).toBeDefined();
  });

  it('should mark form invalid if required fields are empty', () => {
    component.placeForm.controls['name'].setValue('');
    component.placeForm.controls['city'].setValue('');
    component.placeForm.controls['street'].setValue('');
    expect(component.placeForm.valid).toBeFalse();
  });

  it('should mark all fields as touched if form invalid', async () => {
    spyOn(component.placeForm, 'markAllAsTouched');
    component.placeForm.controls['name'].setValue('');
    await component.handleSubmit();
    expect(component.placeForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.showConfirmationModal).toBeFalse();
  });

  it('should set statusPlace, show modal and call getPlaceCoordinates when form valid', async () => {
    component.placeForm.controls['name'].setValue('Test Place');
    component.placeForm.controls['city'].setValue('City');
    component.placeForm.controls['street'].setValue('Street');
    component.placeForm.controls['houseNo'].setValue('1');
    component.placeForm.controls['postalCode'].setValue('12-345');
    component.placeForm.controls['district'].setValue('inna');
    component.placeForm.controls['category'].setValue('inna');
    component.placeForm.controls['shortDescription'].setValue('Short desc');

    spyOn(component, 'getPlaceCoordinates').and.returnValue(Promise.resolve());

    await component.handleSubmit();

    expect(component.statusPlace).toBe('pending');
    expect(component.showConfirmationModal).toBeTrue();
    expect(component.getPlaceCoordinates).toHaveBeenCalled();
  });

  it('should set lat, lng and smallMapOfPlace if fetch returns data', async () => {
    const mockData = [{ lat: '10', lon: '20', display_name: 'Mock Place' }];
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      } as any),
    );

    component.placeForm.controls['city'].setValue('City');
    component.placeForm.controls['street'].setValue('Street');
    component.placeForm.controls['houseNo'].setValue('1');
    component.placeForm.controls['postalCode'].setValue('12-345');

    await component.getPlaceCoordinates();

    expect(component.lat).toBe(10);
    expect(component.lng).toBe(20);
    expect(component.smallMapOfPlace).toBe('Mock Place');
  });

  it('should call placeService.postPlace and close modal on success', () => {
    placeServiceSpy.postPlace.and.returnValue(
      of({
        _id: 1,
        name: 'Place',
        img: 'https://www.google.com',
        city: 'Lodz',
        street: 'Piotrkowska',
        houseNo: '3',
        postalCode: '93 - 222',
        category: 'animals',
        district: 'other',
        date: new Date(),
        shortDescription: 'descriptin',
        lat: 0,
        lng: 0,
      }),
    );
    spyOn(component, 'closeModal');

    component.addPlace();

    expect(placeServiceSpy.postPlace).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should log error if placeService.postPlace fails', () => {
    placeServiceSpy.postPlace.and.returnValue(throwError(() => new Error('fail')));
    const consoleSpy = spyOn(console, 'error');

    component.addPlace();

    expect(consoleSpy).toHaveBeenCalledWith('Error adding place', jasmine.any(Error));
  });

  it('should set showConfirmationModal to false', () => {
    component.showConfirmationModal = true;
    component.closeModal();
    expect(component.showConfirmationModal).toBeFalse();
  });
});
