import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Livraison } from '../models/Livraison';
import { PropositionLivreur } from '../models/PropositionLivreur'; 
import { map } from 'rxjs/operators'; 


@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private baseUrl = 'http://localhost:9000/livraison';
  private propositionsUrl = '/api/propositions/getAllPropositions'; 



  constructor(private http: HttpClient) { }

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.baseUrl}/getAllLivraisons`);
  }

  getLivraisonByNumero(numero: string): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.baseUrl}/getLivraisonByNumero/${numero}`);
  }

  getLivraisonByStatut(statut: string): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.baseUrl}/getLivraisonByStatut/${statut}`);
  }

  deleteLivraison(livraisonId: number): Observable<any> {
    const url = `${this.baseUrl}/deleteLivraison/${livraisonId}`;
    return this.http.delete(url);
  }
  

  addLivraison(livraison: Livraison, username: string): Observable<number> {
    return this.http.post<{ message: string, livraisonId: number }>(`${this.baseUrl}/addLivraison?username=${username}`, livraison)
      .pipe(
        map(response => response.livraisonId) 
      );
  }
  getPropositionsByLivraisonId(livraisonId: number): Observable<PropositionLivreur[]> {
    return this.http.get<PropositionLivreur[]>(`${this.baseUrl}/getPropositionsByLivraisonId/${livraisonId}`);
  }
  getLivraisonByUserUserId(userId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.baseUrl}/getLivraisonByUserUserId/${userId}`);
  }
  acceptProposition(livraisonId: number, propoistionId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/acceptProposition?livrasionId=${livraisonId}&propoistionId=${propoistionId}`, {});
  }
  getLivraisonsByLivreurId(livreurId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getlivraisonbylivreurId/${livreurId}`);
  }
  accepterLivraison(livreurId: number, livraisonId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/acceptLivreur/${livreurId}/${livraisonId}`, {});
  }
  
  
  confirmerLivraison(livraisonId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirmer/${livraisonId}`, {});
  }

  annulerLivraison(livraisonId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/annuler/${livraisonId}`, {});
  }
  updateLivraison(livraisonId: number, updatedLivraison: Livraison): Observable<Livraison> {
    const url = `${this.baseUrl}/updateLivraison/${livraisonId}`;
    return this.http.put<Livraison>(url, updatedLivraison);
  }
  
  addPropositions(numero: string): Observable<string> {
    const url = `${this.baseUrl}/addPropositions/${numero}`;
    return this.http.post<string>(url, {});
  }

  deletePropositionsByLivraison(livraisonId: number): Observable<string> {
    const url = `${this.baseUrl}/deletePropositionsByLivraison/${livraisonId}`;
    return this.http.delete<string>(url);
  }
  countLivraisonsByStatus(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/countLivraisonsByStatus`);
  }
  getLivraisonsByMonth(): Observable<any[]> {
    const url = `${this.baseUrl}/countLivraisonsByMonth`;
    return this.http.get<any[]>(url);
  }
}