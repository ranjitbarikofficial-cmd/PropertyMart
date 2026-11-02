
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api/notification';

  constructor(private http: HttpClient) {}

  getNotifications(userId: number): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(
      `${this.apiUrl}/user/${userId}`,
      { withCredentials: true }
    );
  }

  getUnreadCount(userId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/unread/${userId}`,
      { withCredentials: true }
    );
  }

  markAsRead(notificationId: number, userId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/read/${notificationId}/${userId}`,
      {},
      { withCredentials: true }
    );
  }

  markAllAsRead(userId: number): Observable<{ updated: number }> {
    return this.http.put<{ updated: number }>(
      `${this.apiUrl}/read-all/${userId}`,
      {},
      { withCredentials: true }
    );
  }
}
