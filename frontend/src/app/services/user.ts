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

  getAllUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/alluser`, {
      withCredentials: true
    });
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/find/${id}`, {
      withCredentials: true
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      withCredentials: true
    });
  }
}