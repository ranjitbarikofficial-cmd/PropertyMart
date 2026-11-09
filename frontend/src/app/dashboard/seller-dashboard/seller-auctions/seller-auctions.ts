import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auction } from '../../../services/auction';
import { Bid } from '../../../services/bid';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-seller-auctions',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './seller-auctions.html',
  styleUrl: './seller-auctions.css',
})
export class SellerAuctions implements OnInit {
  private auctionService = inject(Auction);
  private bidService = inject(Bid);
  private cdr = inject(ChangeDetectorRef);

  auctions: any[] = [];
  loading = false;
  errorMessage = '';

  activeCount = 0;
  endedCount = 0;
  upcomingCount = 0;

  expandedAuctionId: number | null = null;
  auctionBidsMap: { [auctionId: number]: any[] } = {};
  loadingBidsId: number | null = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'Please log in to view your auctions.';
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!user.id) {
        this.errorMessage = 'User ID not found.';
        return;
      }
      this.loadAuctions(user.id);
    } catch {
      this.errorMessage = 'Invalid login session.';
    }
  }

  loadAuctions(userId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.auctionService.getAuctionBySellerUserId(userId).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : [];
        this.auctions = list;

        this.activeCount = list.filter((a) => (a.status || '').toUpperCase() === 'ACTIVE').length;
        this.endedCount = list.filter((a) => (a.status || '').toUpperCase() === 'ENDED').length;
        this.upcomingCount = list.filter((a) => (a.status || '').toUpperCase() === 'UPCOMING').length;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load seller auctions:', error);
        this.errorMessage = 'Unable to load your auctions.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleBids(auctionId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.expandedAuctionId === auctionId) {
      this.expandedAuctionId = null;
      this.cdr.detectChanges();
      return;
    }

    this.expandedAuctionId = auctionId;

    if (!this.auctionBidsMap[auctionId]) {
      this.loadingBidsId = auctionId;
      this.bidService.getBidByAuctionId(auctionId).subscribe({
        next: (bids) => {
          const sorted = Array.isArray(bids) ? [...bids] : [];
          sorted.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
          this.auctionBidsMap[auctionId] = sorted;
          this.loadingBidsId = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load bids for auction:', err);
          this.auctionBidsMap[auctionId] = [];
          this.loadingBidsId = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  formatPrice(price: number | null | undefined): string {
    if (!price || isNaN(Number(price))) return '₹0';
    const num = Number(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }
}
