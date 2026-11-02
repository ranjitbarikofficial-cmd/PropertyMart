import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller',
  imports: [FormsModule,CommonModule],
  templateUrl: './seller.html',
  styleUrl: './seller.css'
})
export class Seller implements OnInit {
  sellers: any[] = [];
  filteredSellers: any[] = [];
  searchText = '';
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>('http://localhost:8080/api/seller/allseller', {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.sellers = data ?? [];
        this.filterSellers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
        this.errorMessage = 'Unable to load sellers.';
        this.loading = false;
      }
    });
  }

  filterSellers(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredSellers = this.sellers.filter(seller =>
      String(seller.name ?? seller.user?.name ?? '').toLowerCase().includes(search) ||
      String(seller.email ?? seller.user?.email ?? '').toLowerCase().includes(search)
    );
  }

  get pendingSellers(): number {
    return this.sellers.filter(
      seller => String(seller.verificationStatus ?? '').toUpperCase() === 'PENDING'
    ).length;
  }

  get approvedSellers(): number {
  return this.sellers.filter(
    seller => String(seller.verificationStatus ?? '').toUpperCase() === 'APPROVED'
  ).length;
}
}