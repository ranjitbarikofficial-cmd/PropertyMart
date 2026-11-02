
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction',
  imports: [FormsModule],
  templateUrl: './auction.html',
  styleUrl: './auction.css'
})
export class Auction implements OnInit {
  auctions: any[] = [];
  filteredAuctions: any[] = [];
  searchText = '';
  loading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/auction/allauction',
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        this.auctions = data ?? [];
        this.filterAuctions();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading auctions:', error);
        this.errorMessage = 'Unable to load auctions.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterAuctions(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredAuctions = this.auctions.filter(auction =>
      String(auction.id ?? '').toLowerCase().includes(search) ||
      String(auction.property?.title ?? auction.property?.propertyName ?? auction.property?.name ?? '')
        .toLowerCase().includes(search) ||
      String(auction.status ?? '').toLowerCase().includes(search) ||
      String(auction.seller?.user?.name ?? auction.seller?.name ?? '')
        .toLowerCase().includes(search)
    );
  }

  get activeAuctions(): number {
    return this.auctions.filter(
      auction => String(auction.status ?? '').toUpperCase() === 'ACTIVE'
    ).length;
  }

  get upcomingAuctions(): number {
    return this.auctions.filter(
      auction => String(auction.status ?? '').toUpperCase() === 'UPCOMING'
    ).length;
  }

  get endedAuctions(): number {
    return this.auctions.filter(
      auction => String(auction.status ?? '').toUpperCase() === 'ENDED'
    ).length;
  }

  viewAuction(auction: any): void {
    const details = [
      `Auction ID: ${auction.id ?? '—'}`,
      `Property: ${auction.property?.title ?? auction.property?.propertyName ?? auction.property?.name ?? '—'}`,
      `Starting Price: ${auction.startingPrice ?? '—'}`,
      `Status: ${auction.status ?? '—'}`,
      `Start Date: ${auction.startTime ?? auction.startDate ?? '—'}`,
      `End Date: ${auction.endTime ?? auction.endDate ?? '—'}`
    ].join('\n');

    window.alert(details);
  }
}
