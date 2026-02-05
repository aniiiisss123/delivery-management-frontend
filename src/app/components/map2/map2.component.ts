import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css']
})
export class Map2Component implements AfterViewInit {
  selectedDepartureAddress: string | undefined;
  selectedDestinationAddress: string | undefined;
  map: L.Map | undefined;
  departureMarker: L.Marker | undefined;
  destinationMarker: L.Marker | undefined;
  currentAddressType: 'departure' | 'destination' | undefined;
  previousUrl: string | undefined;
  distance: number | undefined;
  departureCoordinates: L.LatLng | undefined;
  destinationCoordinates: L.LatLng | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.initializeMap();
    this.route.queryParams.subscribe(params => {
      this.previousUrl = params['previousUrl'];
    });
  }

  initializeMap() {
    this.map = L.map('map').setView([36.8065, 10.1815], 12); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.currentAddressType) {
        const latLng = e.latlng;
        this.addOrUpdateMarker(latLng, this.currentAddressType);
        this.reverseGeocode(latLng, this.currentAddressType);
      } else {
        console.error('Please select the address type to set.');
      }
    });
  }

  setAddressType(type: 'departure' | 'destination') {
    this.currentAddressType = type;
  }

  addOrUpdateMarker(latLng: L.LatLng, type: 'departure' | 'destination') {
    const defaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28]
    });

    if (type === 'departure') {
      if (this.departureMarker) {
        this.departureMarker.setLatLng(latLng);
      } else {
        this.departureMarker = L.marker(latLng, { icon: defaultIcon }).addTo(this.map!);
      }
      this.departureCoordinates = latLng;
    } else if (type === 'destination') {
      if (this.destinationMarker) {
        this.destinationMarker.setLatLng(latLng);
      } else {
        this.destinationMarker = L.marker(latLng, { icon: defaultIcon }).addTo(this.map!);
      }
      this.destinationCoordinates = latLng;
    }

    if (this.departureCoordinates && this.destinationCoordinates) {
      this.calculateDistance();
    }
  }

  reverseGeocode(latLng: L.LatLng, type: 'departure' | 'destination') {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          const selectedAddress = data.display_name;
          if (type === 'departure') {
            this.selectedDepartureAddress = selectedAddress;
          } else if (type === 'destination') {
            this.selectedDestinationAddress = selectedAddress;
          }
        } else {
          console.error('No address found for the coordinates');
        }
      })
      .catch(error => {
        console.error('Error reverse geocoding:', error);
      });
  }

  calculateDistance() {
    if (this.departureCoordinates && this.destinationCoordinates) {
      const R = 6371; 
      const dLat = this.deg2rad(this.destinationCoordinates.lat - this.departureCoordinates.lat);
      const dLon = this.deg2rad(this.destinationCoordinates.lng - this.departureCoordinates.lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(this.departureCoordinates.lat)) * Math.cos(this.deg2rad(this.destinationCoordinates.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.distance = R * c; 
    } else {
      console.error('Departure or destination coordinates are missing');
    }
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  confirmAddresses() {
    if (this.selectedDepartureAddress && this.selectedDestinationAddress) {
      this.router.navigate([this.previousUrl || '/expajout'], { 
        state: { 
          selectedDepartureAddress: this.selectedDepartureAddress, 
          selectedDestinationAddress: this.selectedDestinationAddress ,
          distance: this.distance
        } 
      });
    } else {
      console.error('Addresses are missing');
    }
  }
  navigateToHome() {
    this.router.navigateByUrl('/home');
  }
}
