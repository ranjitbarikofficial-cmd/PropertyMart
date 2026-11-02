import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Property { private apiUrl = 'http://localhost:8080/api/property';

  constructor(private http: HttpClient) {}

  getAllProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allproperty`);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/find/${id}`);
  }

  updateProperty(id: number, property: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

}

