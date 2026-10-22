
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Bid {
  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:8080/api/bid';

  getBidByAuctionId(auctionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/findbyauctionid/${auctionId}`,
      { withCredentials: true }
    );
  }

  getBidByBuyerId(buyerId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/findbybuyerid/${buyerId}`,
      { withCredentials: true }
    );
  }
}
