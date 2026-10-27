
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-edit-property',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-property.html',
  styleUrl: './edit-property.css'
})
export class EditProperty implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  property: Property | null = null;
  loading = true;
  saving = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid property ID.';
      this.loading = false;
      return;
    }

    this.http.get<Property>(
      `http://localhost:8080/api/property/find/${id}`
    ).subscribe({
      next: (property) => {
        this.property = { ...property };
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load property:', error);
        this.errorMessage = 'Failed to load property details.';
        this.loading = false;
      }
    });
  }

  saveProperty(): void {
    if (!this.property || this.saving) {
      return;
    }

    if (
      !this.property.title.trim() ||
      !this.property.location.trim() ||
      !this.property.area ||
      !this.property.basePrice
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.http.put<Property>(
      `http://localhost:8080/api/property/update/${this.property.id}`,
      this.property,
      { withCredentials: true }
    ).subscribe({
      next: () => {
        alert('Property updated successfully!');
        this.router.navigate(['/seller-dashboard/my-properties']);
      },
      error: (error) => {
        console.error('Failed to update property:', error);
        this.errorMessage = 'Failed to update property. Please try again.';
        this.saving = false;
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/seller-dashboard/my-properties']);
  }
}