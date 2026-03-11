import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PlaceService } from '../place-service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.html',
  styleUrls: ['./place-form.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PlaceForm implements OnInit {
  placeForm!: FormGroup;

  description: string = '';
  smallMapOfPlace: string = 'Nie znaleziono lub wprowadzono nieprawidłowy adres';
  lat: number = 0;
  lng: number = 0;
  statusPlace: string = 'draft';

  showPopUp: boolean = false;
  showConfirmationModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],

      webPage: ['', [Validators.pattern(/https?:\/\/.+/)]],

      email: ['', [Validators.email]],

      phone: ['', [Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],

      city: ['', Validators.required],

      street: ['', Validators.required],

      houseNo: ['', Validators.required],

      postalCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],

      district: ['inna', Validators.required],

      img: ['', [Validators.pattern(/https?:\/\/.+/)]],

      category: ['inna', Validators.required],

      shortDescription: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  async getPlaceCoordinates() {
    const { city, street, houseNo, postalCode } = this.placeForm.value;

    const address = `${street} ${houseNo}, ${city} ${postalCode}`;

    const URL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    const res = await fetch(URL, {
      headers: { Accept: 'application/json' },
    });

    const data = await res.json();

    if (data.length > 0) {
      this.lat = parseFloat(data[0].lat);
      this.lng = parseFloat(data[0].lon);
      this.smallMapOfPlace = data[0].display_name;
    }
  }

  async handleSubmit() {
    if (this.placeForm.invalid) {
      this.placeForm.markAllAsTouched();
      return;
    }

    this.statusPlace = 'pending';
    this.showConfirmationModal = true;

    await this.getPlaceCoordinates();
  }

  get infoAboutCurrentPlace() {
    return {
      ...this.placeForm.value,
      description: this.description,
      lat: this.lat,
      lng: this.lng,
      smallMapOfPlace: this.smallMapOfPlace,
      statusPlace: this.statusPlace,
    };
  }

  closeModal() {
    this.showConfirmationModal = false;
  }

  addPlace() {
    const place = this.infoAboutCurrentPlace;

    this.placeService.postPlace(place).subscribe({
      next: (res) => {
        console.log('Place added', res);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error adding place', err);
      },
    });
  }

  get f() {
    return this.placeForm.controls;
  }
}