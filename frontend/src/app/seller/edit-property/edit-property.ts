import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-property',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-property.html',
  styleUrl: './edit-property.css',
})
export class EditProperty implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  propertyId: number = 0;

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
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.propertyId) {
      this.errorMessage = 'Property ID not found.';
      return;
    }
    this.loadProperty();
  }

  loadProperty(): void {
    this.http.get<any>(`http://localhost:8080/api/property/find/${this.propertyId}`).subscribe({
      next: (data) => {
        this.property = {
          title: data.title || '',
          description: data.description || '',
          propertyType: data.propertyType || '',
          location: data.location || '',
          area: data.area,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          basePrice: data.basePrice,
          status: data.status || 'AVAILABLE',
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load property:', err);
        this.errorMessage = 'Unable to load property details.';
        this.cdr.detectChanges();
      },
    });
  }

  updateProperty(): void {
    this.errorMessage = '';
    this.successMessage = '';

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

    this.loading = true;

    this.http
      .put(`http://localhost:8080/api/property/update/${this.propertyId}`, this.property)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Property updated successfully!';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/seller-dashboard']);
          }, 1000);
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.loading = false;
          this.errorMessage = 'Failed to update property. Please try again.';
          this.cdr.detectChanges();
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/seller-dashboard']);
  }
}
