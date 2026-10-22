import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  adminName = 'Admin';
  adminInitials = 'AD';

  users: any[] = [];
  filteredUsers: any[] = [];
  sellers: any[] = [];
  properties: any[] = [];
  auctions: any[] = [];

  get activePropertiesCount(): number {
    return this.properties.filter(p => p.status === 'AVAILABLE').length;
  }

  get activeAuctionsCount(): number {
    return this.auctions.filter(a => a.status === 'ACTIVE').length;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        if (u.name) {
          this.adminName = u.name;
          this.adminInitials = this.getInitials(u.name);
        }
      } catch {}
    }

    this.loadData();
  }

  loadData(): void {
    this.http.get<any[]>('http://localhost:8080/api/user/alluser').subscribe({
      next: (data) => {
        this.users = data || [];
        this.filteredUsers = this.users;
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>('http://localhost:8080/api/seller/allseller').subscribe({
      next: (data) => {
        this.sellers = data || [];
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>('http://localhost:8080/api/property/allproperty').subscribe({
      next: (data) => {
        this.properties = data || [];
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>('http://localhost:8080/api/auction/allauction').subscribe({
      next: (data) => {
        this.auctions = data || [];
        this.cdr.detectChanges();
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getSellerPropertyCount(sellerId: number): number {
    return this.properties.filter(p => p.seller?.id === sellerId).length;
  }

  searchGlobal(query: string): void {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  }

  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.http.delete(`http://localhost:8080/api/user/delete/${userId}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Could not delete user (they may have active properties or bids).');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
