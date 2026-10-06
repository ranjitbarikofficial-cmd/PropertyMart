import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-property',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-property.html',
  styleUrl: './add-property.css',
})
export class AddProperty implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  sellerId: number | null = null;

  property = {
    title: '',
    description: '',
    propertyType: '',
    location: '',
    area: null as number | null,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    basePrice: null as number | null,
    status: 'AVAILABLE',
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'Please login first.';
      return;
    }

    const user = JSON.parse(userData);

    if (!user.id) {
      this.errorMessage = 'User ID not found.';
      return;
    }

    this.loadSeller(user.id);
  }

  loadSeller(userId: number): void {
    this.http.get<any>(`http://localhost:8080/api/seller/user/${userId}`).subscribe({
      next: (seller) => {
        this.sellerId = seller.id;

        console.log('Seller ID:', this.sellerId);
      },

      error: (error) => {
        console.error('Seller loading failed:', error);
        this.errorMessage = 'Unable to load seller profile.';
      },
    });
  }

  addProperty(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.sellerId) {
      this.errorMessage = 'Seller profile not found.';
      return;
    }

    if (
      !this.property.title ||
      !this.property.description ||
      !this.property.propertyType ||
      !this.property.location ||
      !this.property.area ||
      !this.property.basePrice
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    const propertyData = {
      title: this.property.title,
      description: this.property.description,
      propertyType: this.property.propertyType,
      location: this.property.location,
      area: this.property.area,
      bedrooms: this.property.bedrooms,
      bathrooms: this.property.bathrooms,
      basePrice: this.property.basePrice,
      status: this.property.status,
      seller: {
        id: this.sellerId,
      },
    };

    this.loading = true;

    this.http.post('http://localhost:8080/api/property/create', propertyData).subscribe({
      next: (response) => {
        console.log('Property created:', response);

        this.loading = false;
        this.successMessage = 'Property added successfully!';

        setTimeout(() => {
          this.router.navigate(['/seller-dashboard']);
        }, 1000);
      },

      error: (error) => {
        console.error('Property creation failed:', error);

        this.loading = false;
        this.errorMessage = 'Failed to add property. Please try again.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/seller-dashboard']);
  }
}
