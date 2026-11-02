
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  DatePipe,
  isPlatformBrowser
} from '@angular/common';

import { HttpClient } from '@angular/common/http';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { forkJoin } from 'rxjs';

import {
  NotificationItem,
  NotificationService
} from '../../services/notification';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    DatePipe
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  adminName = 'Admin';
  adminInitials = 'AD';

  users: any[] = [];
  filteredUsers: any[] = [];
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

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);

        if (user.name) {
          this.adminName = user.name;
          this.adminInitials = this.getInitials(user.name);
        }

        this.adminId = Number(user.id);

        if (
          Number.isFinite(this.adminId) &&
          this.adminId > 0
        ) {
          this.loadNotifications();
          this.loadUnreadCount();
        }

      } catch (error) {
        console.error('Error reading admin data:', error);
      }
    }

    this.loadDashboard();
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
        this.users = data.users || [];
        this.filteredUsers = this.users;

        this.properties = data.properties || [];
        this.auctions = data.auctions || [];
        this.sellers = data.sellers || [];

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Dashboard loading error:', error);

        this.errorMessage = 'Failed to load dashboard data.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get totalSellers(): number {
    return this.users.filter(
      user => user.role?.toUpperCase() === 'SELLER'
    ).length;
  }

  get totalProperties(): number {
    return this.properties.length;
  }

  get activeListings(): number {
    return this.properties.filter(
      property => property.status?.toUpperCase() === 'ACTIVE'
    ).length;
  }

  get activePropertiesCount(): number {
    return this.properties.filter(
      property => property.status?.toUpperCase() === 'AVAILABLE'
    ).length;
  }

  get activeAuctionsCount(): number {
    return this.auctions.filter(
      auction => auction.status?.toUpperCase() === 'ACTIVE'
    ).length;
  }

  get buyerCount(): number {
    return this.users.filter(
      user => user.role?.toUpperCase() === 'BUYER'
    ).length;
  }

  get sellerUsers(): any[] {
    return this.users.filter(
      user => user.role?.toUpperCase() === 'SELLER'
    );
  }

  get pendingProperties(): any[] {
    return this.properties.filter(
      property =>
        property.approvalStatus?.toUpperCase() === 'PENDING'
    );
  }

  get pendingSellers(): any[] {
    return this.sellers.filter(
      seller =>
        seller.verificationStatus?.toUpperCase() === 'PENDING'
    );
  }

  get totalPendingApprovals(): number {
    return this.pendingProperties.length + this.pendingSellers.length;
  }

  get totalAuctions(): number {
    return this.auctions.length;
  }

  getPropertiesForSeller(seller: any): number {
    const sellerUserId = seller.user?.id ?? seller.userId;

    return this.properties.filter(
      property => property.seller?.user?.id === sellerUserId
    ).length;
  }

  getSellerPropertyCount(sellerId: number): number {
    return this.properties.filter(
      property =>
        property.seller?.id === sellerId ||
        property.seller?.user?.id === sellerId
    ).length;
  }

  getInitials(name: string): string {
    if (!name) {
      return 'U';
    }

    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSellerName(seller: any): string {
    return seller?.user?.name || seller?.name || 'Unknown Seller';
  }

  getSellerEmail(seller: any): string {
    return seller?.user?.email || seller?.email || 'No email';
  }

  getPropertyName(property: any): string {
    return property?.title || 'Untitled Property';
  }

  getPropertyLocation(property: any): string {
    return property?.location || 'Location unavailable';
  }

  getPropertyPrice(property: any): number {
    return property?.basePrice || 0;
  }

  searchGlobal(query: string): void {
    const q = (query || '').toLowerCase().trim();

    if (!q) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      (user.name || '').toLowerCase().includes(q) ||
      (user.email || '').toLowerCase().includes(q) ||
      (user.role || '').toLowerCase().includes(q)
    );
  }

  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.http.delete(
      `http://localhost:8080/api/user/delete/${userId}`,
{ withCredentials: true }
).subscribe({
  next: () => {
    this.users = this.users.filter(
      user => user.id !== userId
    );

    this.filteredUsers = this.filteredUsers.filter(
      user => user.id !== userId
    );

    this.cdr.detectChanges();
  },

  error: () => {
    alert(
      'Could not delete user. They may have active properties or bids.'
    );
  }
});
}

updatePropertyApproval(
  propertyId: number,
  approvalStatus: string
): void {
  if (this.processingPropertyIds.includes(propertyId)) {
  return;
}

this.processingPropertyIds.push(propertyId);

this.http.put(
  `http://localhost:8080/api/property/approval/${propertyId}`,
  { approvalStatus },
  { withCredentials: true }
).subscribe({
  next: () => {
    this.properties = this.properties.map(property =>
      property.id === propertyId
        ? { ...property, approvalStatus }
        : property
    );

    this.processingPropertyIds =
      this.processingPropertyIds.filter(id => id !== propertyId);

    this.cdr.detectChanges();
  },

  error: error => {
    console.error('Property approval error:', error);

    this.processingPropertyIds =
      this.processingPropertyIds.filter(id => id !== propertyId);

    this.cdr.detectChanges();
  }
});
}

updateSellerVerification(
  sellerId: number,
  verificationStatus: string
): void {
  if (this.processingSellerIds.includes(sellerId)) {
  return;
}

this.processingSellerIds.push(sellerId);

this.http.put(
  `http://localhost:8080/api/seller/verification/${sellerId}`,
  { verificationStatus },
  { withCredentials: true }
).subscribe({
  next: () => {
    this.sellers = this.sellers.map(seller =>
      seller.id === sellerId
        ? { ...seller, verificationStatus }
        : seller
    );

    this.processingSellerIds =
      this.processingSellerIds.filter(id => id !== sellerId);

    this.cdr.detectChanges();
  },

  error: error => {
    console.error('Seller verification error:', error);

    this.processingSellerIds =
      this.processingSellerIds.filter(id => id !== sellerId);

    this.cdr.detectChanges();
  }
});
}

viewUser(userId: number): void {
  this.http.get(
    `http://localhost:8080/api/user/find/${userId}`,
    { withCredentials: true }
  ).subscribe({
    next: data => {
      console.log('User details:', data);
    },

    error: error => {
      console.error('Unable to load user:', error);
    }
  });
}

viewSeller(sellerId: number): void {
  this.http.get(
    `http://localhost:8080/api/seller/find/${sellerId}`,
    { withCredentials: true }
  ).subscribe({
    next: data => {
      console.log('Seller details:', data);
    },

    error: error => {
      console.error('Unable to load seller:', error);
    }
  });
}

updateUserApproval(
  userId: number,
  approvalStatus: string
): void {
  this.http.put(
    `http://localhost:8080/api/user/approval/${userId}`,
    { approvalStatus },
    { withCredentials: true }
  ).subscribe({
    next: () => {
      this.users = this.users.map(user =>
        user.id === userId
          ? { ...user, approvalStatus }
          : user
      );

      this.filteredUsers = this.filteredUsers.map(user =>
        user.id === userId
          ? { ...user, approvalStatus }
          : user
      );

      this.cdr.detectChanges();
    },

    error: error => {
      console.error('User approval error:', error);
    }
  });
}

  loadNotifications(): void {
    if (!this.adminId) {
      return;
    }

    this.notificationService.getNotifications(
      this.adminId
    ).subscribe({
      next: notifications => {
        this.notifications = notifications || [];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Notification loading error:', error);
      }
    });
  }

  loadUnreadCount(): void {
    if (!this.adminId) {
      return;
    }

    this.notificationService.getUnreadCount(
      this.adminId
    ).subscribe({
      next: response => {
        this.unreadCount = response.count || 0;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Unread count error:', error);
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
    if (notification.read || !this.adminId) {
      return;
    }

    this.notificationService.markAsRead(
      notification.id,
      this.adminId
    ).subscribe({
      next: () => {
        notification.read = true;
        this.loadUnreadCount();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Mark notification read error:', error);
      }
    });
  }

  markAllNotificationsRead(): void {
    if (!this.adminId) {
      return;
    }

    this.notificationService.markAllAsRead(
      this.adminId
    ).subscribe({
      next: () => {
        this.notifications = this.notifications.map(
          notification => ({
            ...notification,
            read: true
          })
        );

        this.unreadCount = 0;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Mark all notifications read error:', error);
      }
    });
  }

logout(): void {
  if (isPlatformBrowser(this.platformId)) {
  localStorage.removeItem('loggedInUser');
}

this.router.navigate(['/login']);
}
}
