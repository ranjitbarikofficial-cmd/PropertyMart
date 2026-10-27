import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  user: {
    id: number;
  };
}

interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  status: string;
}

interface Auction {
  id: number;
  status: string;
}

@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterLink],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard implements OnInit {

  activeAuctionsCount = 0;

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private cdr=inject(ChangeDetectorRef);

  seller: Seller | null = null;
  properties: Property[] = [];

  loading = true;
  errorMessage = '';

  get activeProperties(): Property[] {
    return this.properties.filter(
      property => property.status === 'AVAILABLE'
    );
  }

  get userInitials(): string {
    if (!this.seller?.name) {
      return 'S';
    }

    return this.seller.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'User is not logged in.';
      this.loading = false;
      return;
    }

    try {

      const user = JSON.parse(userData);

      if (!user.id) {
        this.errorMessage = 'User ID not found.';
        this.loading = false;
        return;
      }

      this.seller = {
        id: 0,
        name: user.name,
        email: user.email,
        phone: '',
        user: {
          id: user.id
        }
      };

      this.loadSeller(user.id);

    } catch (error) {

      console.error('Invalid user data:', error);

      this.errorMessage = 'Invalid login information.';
      this.loading = false;

    }
  }

  loadSeller(userId: number): void {

    this.http.get<Seller>(
      `http://localhost:8080/api/seller/user/${userId}`
    ).subscribe({

      next: (seller) => {

        this.seller = seller;

        console.log('Seller loaded:', seller);

        this.loadProperties(seller.id);

      },

      error: (error) => {

        console.error('Failed to load seller:', error);

        this.errorMessage = 'Seller profile not found.';
        this.loading = false;

      }

    });
  }

  loadProperties(sellerId: number): void {
  this.http.get<Property[]>(
    `http://localhost:8080/api/property/seller/${sellerId}`
  ).subscribe({
    next: (properties) => {
      this.properties = properties;
      this.loading = false;

      console.log('Seller ID:', sellerId);
      console.log('Seller properties:', this.properties);
      console.log('Total properties:', this.properties.length);
      console.log('Active properties:', this.activeProperties.length);

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Failed to load properties:', error);
      this.errorMessage = 'Failed to load properties.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}
loadActiveAuctions(userId: number): void {
  this.http.get<Auction[]>(
    `http://localhost:8080/api/auction/seller/${userId}`
  ).subscribe({
    next: (auctions) => {
      this.activeAuctionsCount = auctions.filter(
        auction => auction.status === 'ACTIVE'
      ).length;

      console.log('Total auctions:', auctions.length);
      console.log('Active auctions:', this.activeAuctionsCount);
    },
    error: (error) => {
      console.error('Failed to load auctions:', error);
      this.activeAuctionsCount = 0;
    }
  });
}
}