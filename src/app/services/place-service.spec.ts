import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PlaceService } from './place-service';
import { AuthService } from './auth-service';
import { Place } from '../models/place.model';

describe('PlaceService', () => {
  let service: PlaceService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'fake-token';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      providers: [
        PlaceService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(PlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should get all places', () => {
    service.loadPlaces().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/places');
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get place by id', () => {
    const id = 1;

    service.getPlaceById(id).subscribe();

    const req = httpMock.expectOne(`http://localhost:8080/places/${id}`);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({
      _id: 1,
      name: 'Place',
      img: 'https://www.google.com',
      city: 'Lodz',
      street: 'Piotrkowska',
      houseNo: 3,
      postalCode: 93 - 222,
      category: 'animals',
      district: 'other',
      date: new Date(),
      shortDescription: 'descriptin',
      lat: 0,
      lng: 0,
    });
  });

  it('should update a place and return the Place object', () => {
    const id = 42;
    const updateData = { name: 'New Place Name', city: 'Warsaw' };

    const mockResponse = {
      success: true,
      place: {
        _id: id,
        name: 'New Place Name',
        img: 'image.jpg',
        city: 'Warsaw',
        street: 'Main Street',
        houseNo: '12A',
        postalCode: '00-001',
        category: 'restaurant',
        district: 'Central',
        date: new Date(),
        shortDescription: 'Nice place',
        lat: 52.2297,
        lng: 21.0122,
      },
      message: 'Place updated successfully',
    };

    service.updatePlace(id, updateData).subscribe((place) => {
      expect(place).toEqual(mockResponse.place);
      expect(place._id).toBe(id);
      expect(place.name).toBe('New Place Name');
    });

    const req = httpMock.expectOne(`http://localhost:8080/places/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

    req.flush(mockResponse);
  });

  it('should delete a place and return success message', () => {
    const id = 42;

    const mockResponse = {
      success: true,
      message: 'Place deleted successfully',
    };

    service.deletePlace(id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.success).toBeTrue();
      expect(res.message).toBe('Place deleted successfully');
    });

    const req = httpMock.expectOne(`http://localhost:8080/places/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toBeNull();

    req.flush(mockResponse);
  });

  it('should post a place, return the new Place, and add it to places array', () => {
    const newPlace: Place = {
      _id: 100,
      name: 'New Place Name',
      img: 'image.jpg',
      city: 'Warsaw',
      street: 'Main Street',
      houseNo: '12A',
      postalCode: '00-001',
      category: 'restaurant',
      district: 'Central',
      date: new Date(),
      shortDescription: 'Nice place',
      lat: 52.2297,
      lng: 21.0122,
    };

    service['places'] = [];

    service.postPlace(newPlace).subscribe((returnedPlace) => {
      expect(returnedPlace).toEqual(newPlace);
      expect(service['places']).toContain(newPlace);
    });

    const req = httpMock.expectOne('http://localhost:8080/places');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlace);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(newPlace);
  });
});
