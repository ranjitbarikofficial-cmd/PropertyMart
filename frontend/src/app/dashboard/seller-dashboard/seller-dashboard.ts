import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
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

@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterLink],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard implements OnInit {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

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

        console.log('Seller properties:', properties);

        this.loading = false;

      },

      error: (error) => {

        console.error('Failed to load properties:', error);

        this.errorMessage = 'Failed to load properties.';
        this.loading = false;

      }

    });
  }
}