import { Component, inject } from '@angular/core';
import { tileLayer, latLng, MapOptions, marker, icon, Map } from 'leaflet';
import { PlaceService } from '../../services/place-service';
import { Place } from '../../models/place.model';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadPlaces } from '../../store/places/places.actions';
import { selectAllPlaces } from '../../store/places/places.selectors';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  template: `
    <div
      leaflet
      [leafletOptions]="options"
      (leafletMapReady)="onMapReady($event)"
      style="height: 100vh;"
    ></div>
  `,
})
export class MapComponent {
  pin1 = 'assets/gps1.svg'; // children
  pin2 = 'assets/gps2.svg'; // animals
  pin3 = 'assets/gps3.svg'; // invalids
  pin4 = 'assets/gps4.svg'; // addictions
  pin5 = 'assets/gps5.svg'; // retirees
  pin6 = 'assets/gps6.svg'; // others

  options: MapOptions = {
    center: latLng(51.7686, 19.4565),
    zoom: 14,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
  };

  places$!: Observable<Place[]>;
  private store = inject(Store);

  constructor(private placeService: PlaceService) {}

  ngOnInit() {
    this.store.dispatch(loadPlaces());
    this.places$ = this.store.select(selectAllPlaces);
  }

  getIconByCategory(category: string) {
    let iconUrl = this.pin6;

    switch (category) {
      case 'children':
        iconUrl = this.pin1;
        break;
      case 'animals':
        iconUrl = this.pin2;
        break;
      case 'invalids':
        iconUrl = this.pin3;
        break;
      case 'addictions':
        iconUrl = this.pin4;
        break;
      case 'retirees':
        iconUrl = this.pin5;
        break;
      default:
        iconUrl = this.pin6;
    }

    return icon({
      iconUrl: iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  onMapReady(map: Map) {
  this.places$.subscribe((places) => {
    places.forEach((p) => {
      if (p.lat != null && p.lng != null) {
        const m = marker([p.lat, p.lng], {
          icon: this.getIconByCategory(p.category),
        });

        m.bindPopup(`
          <div style="text-align:center;">
            <img src="${p.img}" style="max-width:100px;" />
            <div><b>${p.name}</b></div>
            <div>${p.street} ${p.houseNo}</div>
            <div>${p.city}</div>
            <div><a href="/place/${p._id}">Details</a></div>
          </div>
        `);

        m.addTo(map);
      }
    });
  });
}
}
