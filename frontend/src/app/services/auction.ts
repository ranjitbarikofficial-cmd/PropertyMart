import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auction {

  private apiUrl = 'http://localhost:8080/api/auction';

  constructor(private http: HttpClient) {}

  getAllAuctions(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/allauction`, {
    withCredentials: true
  });
}
getAuctionById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/find/${id}`, {
    withCredentials: true
  });
}

placeBid(auctionId: number, amount: number): Observable<any> {
  return this.http.post<any>(
    `http://localhost:8080/api/bid/place?auctionId=${auctionId}&amount=${amount}`,
    {},
    {
      withCredentials: true
    }
  );
}

getHighestBid(auctionId: number): Observable<number> {
  return this.http.get<number>(
    `http://localhost:8080/api/bid/highest/${auctionId}`,
    {
      withCredentials: true
    }
  );
}


getAuctionBySellerUserId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/user/${userId}`,
    {
      withCredentials: true
    }
  );
}
}
