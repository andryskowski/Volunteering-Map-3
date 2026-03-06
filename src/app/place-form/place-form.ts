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
  latLng: { lat: number; lng: number } = { lat: 0, lng: 0 };
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
    private placeService: PlaceService
  ) {}

  ngOnInit(): void {
    this.placeForm = this.fb.group({
      placeName: [''],
      phone: [''],
      email: [''],
      webPage: [''],
      city: [''],
      street: [''],
      postalCode: [''],
      houseNo: [''],
      shortDescription: [''],
      category: ['inna'],
      logo: [''],
      district: ['inna'],
    });
  }

  async getPlaceCoordinates() {
    const city = this.placeForm.value.city;
    const street = this.placeForm.value.street;
    const houseNo = this.placeForm.value.houseNo;
    const postalCode = this.placeForm.value.postalCode;

    const URL = `https://www.mapquestapi.com/geocoding/v1/address?key=dYvAAN5PGJqo3AiKXCtuUoJpy7LUhwNs&inFormat=kvp&outFormat=json&location=${city}+${street}+${houseNo}+${postalCode}&thumbMaps=true&maxResults=1`;

    const apiRES = await fetch(URL).then((res) => res.json());
    const location = apiRES.results[0]?.locations[0];
    if (location) {
      this.smallMapOfPlace = location.mapUrl;
      this.latLng = location.latLng;
    }
  }

  handleSubmit(event: Event) {
  event.preventDefault();
  // const isValidated = validationPlaceForm(...);

  // if (isValidated === true) {
    this.getPlaceCoordinates();
    this.statusPlace = 'pending';
    this.showPopUp = true;
    this.showConfirmationModal = true;
  // }
}

  get infoAboutCurrentPlace() {
    return {
      ...this.placeForm.value,
      description: this.description,
      latLng: this.latLng,
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
    }
  });
}
}
