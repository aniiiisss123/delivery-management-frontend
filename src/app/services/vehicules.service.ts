import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from '../models/Vehicule';

@Injectable({
  providedIn: 'root'
})
export class VehiculesService {

  private baseUrl = 'http://localhost:9000/livraison';

  constructor(private http: HttpClient) { }

  addVehicule(vehicule: Vehicule): Observable<{ vehiculeId: number }> {
    return this.http.post<{ vehiculeId: number }>(`${this.baseUrl}/add`, vehicule);
  }

  getVehiculeByType(type: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.baseUrl}/type/${type}`);
  }

  getAllVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.baseUrl}/all`);
  }

  updateVehicule(vehiculeId: number, updatedVehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.baseUrl}/update/${vehiculeId}`, updatedVehicule);
  }

  assignVehicule(vehiculeId: number, username: string): Observable<void> {
    const params = new HttpParams().set('vehiculeId', vehiculeId.toString()).set('username', username);
    return this.http.put<void>(`${this.baseUrl}/assign`, null, { params });
  }
}
