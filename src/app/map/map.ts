import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { tileLayer, latLng, MapOptions } from 'leaflet';
import { LeafletDirective, LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MarkerComponent } from '../marker/marker';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, MarkerComponent],
  template: `
    <div leaflet [leafletOptions]="options" #leaflet style="height: 100vh;"></div>
    <app-marker #marker [position]="[51.765, 19.47]"></app-marker>
  `,
})
export class MapComponent implements AfterViewInit {
  @ViewChild(LeafletDirective) leaflet!: LeafletDirective;
  @ViewChild('marker') markerComponent!: MarkerComponent;

  options: MapOptions = {
    center: latLng(51.765, 19.47),
    zoom: 13,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
  };

  ngAfterViewInit() {
    const map = this.leaflet.map;
    if (this.markerComponent) {
      this.markerComponent.addToMap(map);
    }
  }
}