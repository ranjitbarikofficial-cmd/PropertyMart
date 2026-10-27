
import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-my-properties',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './my-properties.html',
  styleUrl: './my-properties.css'
})
export class MyProperties implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  properties: Property[] = [];
  loading = true;
  errorMessage = '';
 

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'Please log in to view your properties.';
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (!user.id) {
        this.errorMessage = 'User ID not found. Please log in again.';
        this.loading = false;
        return;
      }

      this.loadSellerProperties(user.id);
    } catch {
      this.errorMessage = 'Unable to read your login information.';
      this.loading = false;
    }
  }

  loadSellerProperties(userId: number): void {
    this.http.get<any>(
      `http://localhost:8080/api/seller/user/${userId}`
    ).subscribe({
      next: (seller) => {
        if (!seller?.id) {
          this.errorMessage = 'Seller profile not found.';
          this.loading = false;
          return;
        }

        this.http.get<Property[]>(
          `http://localhost:8080/api/property/seller/${seller.id}`
        ).subscribe({
          next: (properties) => {
            this.properties = properties;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Failed to load properties:', error);
            this.errorMessage = 'Failed to load your properties.';
            this.loading = false;
            
          }
        });
      },
      error: (error) => {
        console.error('Failed to load seller:', error);
        this.errorMessage = 'Seller profile not found.';
        this.loading = false;
      }
    });
  }

  get activeProperties(): Property[] {
    return this.properties.filter(
      property => property.status === 'AVAILABLE'
    );
  }
 
}