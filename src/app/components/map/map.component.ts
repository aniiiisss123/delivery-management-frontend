import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @Output() addressSelected = new EventEmitter<string>();
  map: L.Map | undefined;
  marker: L.Marker | undefined;
  selectedAddress: string | undefined;
  previousUrl: string | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.previousUrl = this.route.snapshot.queryParams['previousUrl'] || null;
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([36.8065, 10.1815], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latLng = e.latlng;
      this.clearMarker();
      this.addMarker(latLng);
      this.reverseGeocode(latLng);
    });
  }

  clearMarker() {
    if (this.marker) {
      this.marker.remove();
      this.marker = undefined;
    }
  }

  addMarker(latLng: L.LatLng) {
    const defaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28]
    });

    this.marker = L.marker(latLng, { icon: defaultIcon }).addTo(this.map!);
  }

  reverseGeocode(latLng: L.LatLng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`;
    this.http.get<any>(url).subscribe(
      data => {
        if (data && data.display_name) {
          this.selectedAddress = data.display_name;
          if (this.marker) {
            this.marker.bindPopup(this.selectedAddress ?? '').openPopup();
          }
        } else {
          console.error('No address found for the coordinates');
        }
      },
      error => {
        console.error('Error reverse geocoding:', error);
      }
    );
  }

  confirmAddress() {
    if (this.selectedAddress) {
      this.addressSelected.emit(this.selectedAddress);
      if (this.previousUrl) {
        this.router.navigate([this.previousUrl], { queryParams: { selectedAddress: this.selectedAddress } });
      } else {
        console.error('Previous URL is not defined');
      }
    } else {
      console.error('No address selected');
    }
  }
}
