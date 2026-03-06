import { Component } from '@angular/core';
import { tileLayer, latLng, MapOptions, marker, icon, Map } from 'leaflet';
import { PlaceService } from '../place-service';
import { Place } from '../../models/place.model';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
  options: MapOptions = {
    center: latLng(51.7686, 19.4565),
    zoom: 14,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
  };

  constructor(private placeService: PlaceService) {}

  onMapReady(map: Map) {
    this.placeService.loadPlaces().subscribe((places: Place[]) => {
      places.forEach((p) => {
        if (p.lat != null && p.lng != null) {
          const m = marker([p.lat, p.lng], {
            icon: icon({
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            }),
          });

          m.bindPopup(`
  <div style="text-align:center;">
    <img src="${p.img}" alt="${p.name}" style="max-width:100px; border-radius:8px; margin-bottom:8px;" />
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
