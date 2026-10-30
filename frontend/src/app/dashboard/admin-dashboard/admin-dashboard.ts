
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationItem, NotificationService } from '../../services/notification';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink,RouterLinkActive,DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  properties: any[] = [];
  auctions: any[] = [];
  sellers: any[] = [];

  loading = true;
  errorMessage = '';
  processingPropertyIds: number[] = [];
  processingSellerIds: number[] = [];

  
notifications: NotificationItem[] = [];
unreadCount = 0;
showNotifications = false;
private adminId: number | null = null;


  constructor(
    private http: HttpClient,private cdr:ChangeDetectorRef, private notificationService: NotificationService
    
  ) {}

 
ngOnInit(): void {
  this.loadDashboard();

  const loggedInUser = localStorage.getItem('loggedInUser');

  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      this.adminId = Number(user.id);

      if (Number.isFinite(this.adminId) && this.adminId > 0) {
        this.loadNotifications();
        this.loadUnreadCount();
      }
    } catch (error) {
      console.error('Unable to read logged-in user:', error);
    }
  }
}


loadDashboard(): void {
  this.loading = true;
  this.errorMessage = '';

  forkJoin({
    users: this.http.get<any[]>(
      'http://localhost:8080/api/user/alluser',
      { withCredentials: true }
    ),
    properties: this.http.get<any[]>(
      'http://localhost:8080/api/property/allproperty',
      { withCredentials: true }
    ),
    auctions: this.http.get<any[]>(
      'http://localhost:8080/api/auction/allauction',
      { withCredentials: true }
    ),
    sellers: this.http.get<any[]>(
      'http://localhost:8080/api/seller/allseller',
      { withCredentials: true }
    )
  }).subscribe({
    next: (data) => {
      this.users = data.users ?? [];
      this.properties = data.properties ?? [];
      this.auctions = data.auctions ?? [];
      this.sellers = data.sellers ?? [];
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading dashboard:', error);
      this.errorMessage = 'Unable to load all dashboard data.';
      this.loading = false;
    }
  });
}



  get totalUsers(): number {
    return this.users.length;
  }

  get totalSellers(): number {
    return this.users.filter(
      user => String(user.role).toUpperCase() === 'SELLER'
    ).length;
  }

  get totalProperties(): number {
    return this.properties.length;
  }

  get activeListings(): number {
    return this.properties.filter(
      property => String(property.status ?? '').toUpperCase() === 'ACTIVE'
    ).length;
  }

  get buyerCount(): number {
    return this.users.filter(
      user => String(user.role).toUpperCase() === 'BUYER'
    ).length;
  }

  get sellerUsers(): any[] {
    return this.users.filter(
      user => String(user.role).toUpperCase() === 'SELLER'
    );
  }

  get pendingProperties(): any[] {
    return this.properties.filter(
      property =>
        String(property.approvalStatus ?? '').toUpperCase() === 'PENDING'
    );
  }

  get pendingSellers(): any[] {
    return this.sellers.filter(
      seller =>
        String(seller.verificationStatus ?? '').toUpperCase() === 'PENDING'
    );
  }

  get totalPendingApprovals(): number {
    return this.pendingProperties.length + this.pendingSellers.length;
  }

  getPropertiesForSeller(seller: any): number {
    return this.properties.filter(
      property => property.seller?.user?.id === seller.id
    ).length;
  }

  getInitials(name: string): string {
    return (name || 'U')
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSellerName(seller: any): string {
    return seller.user?.name ?? seller.name ?? 'Unknown';
  }

  getSellerEmail(seller: any): string {
    return seller.user?.email ?? seller.email ?? '—';
  }

  getPropertyName(property: any): string {
    return property.title
      ?? property.propertyName
      ?? property.name
      ?? `Property #${property.id}`;
  }

  getPropertyLocation(property: any): string {
    return property.location
      ?? property.address
      ?? '—';
  }

  getPropertyPrice(property: any): string | number {
    return property.price
      ?? property.basePrice
      ?? property.expectedPrice
      ?? '—';
  }

  updatePropertyApproval(
    propertyId: number,
    approvalStatus: 'APPROVED' | 'REJECTED'
  ): void {
    if (this.processingPropertyIds.includes(propertyId)) {
      return;
    }

    this.processingPropertyIds = [...this.processingPropertyIds, propertyId];

    this.http.put<any>(
      `http://localhost:8080/api/property/approval/${propertyId}`,
      { approvalStatus },
      { withCredentials: true }
    ).subscribe({
      next: (updatedProperty) => {
        this.properties = this.properties.map(property =>
          property.id === propertyId
            ? {
                ...property,
                ...updatedProperty,
                approvalStatus
              }
            : property
        );

        this.processingPropertyIds =
          this.processingPropertyIds.filter(id => id !== propertyId);

        
      },
      error: (error) => {
        console.error('Error updating property approval:', error);
        this.errorMessage = 'Unable to update property approval. Please try again.';
        this.processingPropertyIds =
          this.processingPropertyIds.filter(id => id !== propertyId);
      
      }
    });
  }

  updateSellerVerification(
  sellerId: number,
  verificationStatus: 'APPROVED' | 'REJECTED'
): void {
  this.http.put(
    `http://localhost:8080/api/seller/verification/${sellerId}`,
    { verificationStatus },
    { withCredentials: true }
  ).subscribe({
    next: () => {
      this.sellers = this.sellers.map(seller =>
        Number(seller.id) === Number(sellerId)
          ? { ...seller, verificationStatus }
          : seller
      );
    },
    error: (error) => {
      console.error('Error updating seller verification:', error);
      this.errorMessage = 'Unable to update seller verification.';
    }
  });
}

  viewUser(userId: number): void {
    this.http.get(
      `http://localhost:8080/api/user/find/${userId}`,
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        console.log('User details:', data);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  viewSeller(sellerId: number): void {
    this.viewUser(sellerId);
  }

  get totalAuctions(): number {
    return this.auctions.length;
  }

  

updateUserApproval(
  userId: number,
  approvalStatus: 'APPROVED' | 'REJECTED'
): void {
  this.http.put(
    `http://localhost:8080/api/user/approval/${userId}`,
    { approvalStatus },
    { withCredentials: true }
  ).subscribe({
    next: () => {
      this.users = this.users.map(user =>
        Number(user.id) === Number(userId)
          ? { ...user, approvalStatus }
          : user
      );
    },
    error: (error) => {
      console.error('Error updating user approval:', error);
      this.errorMessage = 'Unable to update user approval.';
    }
  });
}

private dashboardRequestsCompleted = 0;

private checkLoadingComplete(): void {
  this.dashboardRequestsCompleted++;

  if (this.dashboardRequestsCompleted >= 2) {
    this.loading = false;
  }
}


loadNotifications(): void {
  if (this.adminId === null) {
    return;
  }

  this.notificationService.getNotifications(this.adminId).subscribe({
    next: (data) => {
      this.notifications = data ?? [];
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading notifications:', error);
    }
  });
}

loadUnreadCount(): void {
  if (this.adminId === null) {
    return;
  }

  this.notificationService.getUnreadCount(this.adminId).subscribe({
    next: (data) => {
      this.unreadCount = data.count;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading unread count:', error);
    }
  });
}

toggleNotifications(): void {
  this.showNotifications = !this.showNotifications;

  if (this.showNotifications) {
    this.loadNotifications();
    this.loadUnreadCount();
  }
}

markNotificationRead(notification: NotificationItem): void {
  if (this.adminId === null) {
    return;
  }

  if (notification.read) {
    return;
  }

  this.notificationService
    .markAsRead(notification.id, this.adminId)
    .subscribe({
      next: () => {
        this.notifications = this.notifications.map(item =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        );

        this.loadUnreadCount();
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
}

markAllNotificationsRead(): void {
  if (this.adminId === null) {
    return;
  }

  this.notificationService.markAllAsRead(this.adminId).subscribe({
    next: () => {
      this.notifications = this.notifications.map(item => ({
        ...item,
        read: true
      }));

      this.unreadCount = 0;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error marking all notifications as read:', error);
    }
  });
}



}
