import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  // modules: QuillModules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link', 'image', 'video'],
  //     [{ color: ['#FF0000', '#001F3F', '#0074D9', '#7FDBFF',
  //                 '#39CCCC', '#3D9970', '#2ECC40', '#01FF70',
  //                 '#FFDC00', '#FF851B', '#FF4136', '#85144B',
  //                 '#F012BE', '#B10DC9', '#111111', '#AAAAAA'] }],
  //   ]
  // };

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private placeService: PlaceService,
  ) {}

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      webPage: [''],
      city: [''],
      street: [''],
      postalCode: [''],
      houseNo: [''],
      shortDescription: [''],
      category: ['inna'],
      img: [''],
      district: ['inna'],
    });
  }

  async getPlaceCoordinates() {
    const { city, street, houseNo, postalCode } = this.placeForm.value;

    const address = `${street} ${houseNo}, ${city} ${postalCode}`;

    const URL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    const res = await fetch(URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    console.log(data, 'data');

    if (data.length > 0) {
      this.lat = parseFloat(data[0].lat);
      this.lng = parseFloat(data[0].lon);
      console.log(this.lat, this.lng, 'LATLNG');

      this.smallMapOfPlace = data[0].display_name;
    }
  }
  
  async handleSubmit() {
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
}
