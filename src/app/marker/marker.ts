import { Component, Input } from '@angular/core';
import { Marker, marker, icon, LatLngExpression, Map } from 'leaflet';

@Component({
  selector: 'app-marker',
  standalone: true,
  template: '',
})
export class MarkerComponent {
  @Input() position: LatLngExpression = [51.765, 19.47];
  @Input() popupText: string = 'Marker example';

  addToMap(map: Map) {
    const myMarker: Marker = marker(this.position, {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      }),
    });

    myMarker.bindPopup(this.popupText);

    myMarker.addTo(map);
  }
}