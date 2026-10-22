import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  updateUser(id: number, user: any) {
    return this.http.put(`${this.apiUrl}/update/${id}`, user, {
      withCredentials: true
    });
  }
}