
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property',
  imports: [FormsModule],
  templateUrl: './property.html',
  styleUrl: './property.css'
})
export class Property implements OnInit {
  properties: any[] = [];
  filteredProperties: any[] = [];
  searchText = '';
  loading = true;
  errorMessage = '';
  processingPropertyIds: number[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/property/allproperty',
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        this.properties = data ?? [];
        this.filterProperties();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.errorMessage = 'Unable to load properties.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterProperties(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredProperties = this.properties.filter(property =>
      String(property.title ?? property.propertyName ?? property.name ?? '')
        .toLowerCase().includes(search) ||
      String(property.location ?? property.address ?? '')
        .toLowerCase().includes(search) ||
      String(property.seller?.user?.name ?? property.seller?.name ?? '')
        .toLowerCase().includes(search)
    );
  }

  get pendingProperties(): number {
    return this.properties.filter(property =>
      String(property.approvalStatus ?? 'PENDING').toUpperCase() === 'PENDING'
    ).length;
  }

  get approvedProperties(): number {
    return this.properties.filter(property =>
      String(property.approvalStatus ?? '').toUpperCase() === 'APPROVED'
    ).length;
  }

  get rejectedProperties(): number {
    return this.properties.filter(property =>
      String(property.approvalStatus ?? '').toUpperCase() === 'REJECTED'
    ).length;
  }

  updatePropertyApproval(
    propertyId: number,
    approvalStatus: 'APPROVED' | 'REJECTED'
  ): void {
    if (this.processingPropertyIds.includes(propertyId)) {
      return;
    }

    this.processingPropertyIds = [...this.processingPropertyIds, propertyId];

    this.http.put(
      `http://localhost:8080/api/property/approval/${propertyId}`,
      { approvalStatus },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.properties = this.properties.map(property =>
          Number(property.id) === Number(propertyId)
            ? { ...property, approvalStatus }
            : property
        );

        this.filterProperties();
        this.processingPropertyIds =
          this.processingPropertyIds.filter(id => id !== propertyId);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error updating property approval:', error);
        this.errorMessage = 'Unable to update property approval.';
        this.processingPropertyIds =
          this.processingPropertyIds.filter(id => id !== propertyId);
        this.cdr.detectChanges();
      }
    });
  }

  viewProperty(property: any): void {
    const details = [
      `Name: ${property.title ?? property.propertyName ?? property.name ?? '—'}`,
      `Location: ${property.location ?? property.address ?? '—'}`,
      `Price: ${property.price ?? property.expectedPrice ?? '—'}`,
      `Status: ${property.approvalStatus ?? 'PENDING'}`
    ].join('\n');

    window.alert(details);
  }
}
