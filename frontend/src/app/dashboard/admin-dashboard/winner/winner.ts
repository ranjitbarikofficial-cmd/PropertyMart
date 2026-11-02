
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-winner',
  imports: [FormsModule],
  templateUrl: './winner.html',
  styleUrl: './winner.css'
})
export class Winner implements OnInit {
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
    this.loadWinners();
  }

  loadWinners(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(
      'http://localhost:8080/api/auction/winners',
      { withCredentials: true }
    ).subscribe({
      next: (data) => {
        this.auctions = data ?? [];
        this.filterWinners();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading winners:', error);
        this.errorMessage = 'Unable to load auction winners.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterWinners(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredAuctions = this.auctions.filter(auction =>
      String(auction.id ?? '').toLowerCase().includes(search) ||
      String(
        auction.property?.title ??
        auction.property?.propertyName ??
        auction.property?.name ??
        ''
      ).toLowerCase().includes(search) ||
      String(
        auction.winner?.name ??
        auction.winner?.user?.name ??
        ''
      ).toLowerCase().includes(search) ||
      String(
        auction.winner?.email ??
        auction.winner?.user?.email ??
        ''
      ).toLowerCase().includes(search)
    );
  }

  get totalEndedAuctions(): number {
    return this.auctions.length;
  }

  get auctionsWithWinners(): number {
    return this.auctions.filter(auction =>
      auction.winner != null
    ).length;
  }

  get auctionsWithoutWinners(): number {
    return this.auctions.filter(auction =>
      auction.winner == null
    ).length;
  }

  viewWinner(auction: any): void {
    const details = [
      `Auction ID: ${auction.id ?? '—'}`,
      `Property: ${this.getPropertyName(auction)}`,
      `Winner: ${this.getWinnerName(auction)}`,
      `Email: ${this.getWinnerEmail(auction)}`,
      `Winning Bid: ${this.formatAmount(auction.winningBid)}`,
      `Starting Price: ${this.formatAmount(auction.startingPrice)}`,
      `End Date: ${auction.endTime ?? '—'}`
    ].join('\n');

    window.alert(details);
  }

  getPropertyName(auction: any): string {
    return auction.property?.title ??
      auction.property?.propertyName ??
      auction.property?.name ??
      '—';
  }

  getWinnerName(auction: any): string {
    return auction.winner?.name ??
      auction.winner?.user?.name ??
      'No winner';
  }

  getWinnerEmail(auction: any): string {
    return auction.winner?.email ??
      auction.winner?.user?.email ??
      '—';
  }

  formatAmount(amount: number | null | undefined): string {
    if (amount == null) {
      return '—';
    }

    return '₹' + Number(amount).toLocaleString('en-IN');
  }
}
