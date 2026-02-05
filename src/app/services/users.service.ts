import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:9000/livraison';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllUsers`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/getUserByUsername/${username}`);
  }

  getUserByTypeUser(type: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getUserByRole/${type}`);
  }

  addUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-user`, user);
  }

  deleteUser(userId: number): Observable<string> {
    const url = `${this.baseUrl}/deleteUser?id=${userId}`;
    return this.http.delete<string>(url);
  }
  updateUser(updatedUser: User): Observable<User> {
    const updateUrl = `${this.baseUrl}/updateUser/${updatedUser.userId}`;
    return this.http.put<User>(updateUrl, updatedUser);
  }
  getUserByUserId(userId: number): Observable<User> {
    const url = `${this.baseUrl}/getUserByUserId/${userId}`;
    return this.http.get<User>(url);
  }
  countUsersByProfile(type: string): Observable<number> {
    const url = `${this.baseUrl}/countUsersByProfile/${type}`;
    return this.http.get<number>(url);
  }
}
