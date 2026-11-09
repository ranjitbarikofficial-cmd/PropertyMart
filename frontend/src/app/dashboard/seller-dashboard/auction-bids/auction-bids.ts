import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Bid as BidService } from '../../../services/bid';
import { Auction as AuctionService } from '../../../services/auction';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-auction-bids',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './auction-bids.html',
  styleUrl: './auction-bids.css',
})
export class AuctionBids implements OnInit {
  private route = inject(ActivatedRoute);
  private bidService = inject(BidService);
  private auctionService = inject(AuctionService);
  private cdr = inject(ChangeDetectorRef);

  auctionId!: number;
  auction: any = null;
  bids: any[] = [];
  loading = false;
  errorMessage = '';

  highestBid: any = null;
  winner: any = null;
  winningAmount: number | null = null;
  isEnded = false;
  isActive = false;

  ngOnInit(): void {
    this.auctionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // 1. Load Auction Details
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (auctionData) => {
        this.auction = auctionData;
        const status = (auctionData?.status || '').toUpperCase();
        this.isEnded = status === 'ENDED';
        this.isActive = status === 'ACTIVE';

        // 2. Load Bids for Auction
        this.bidService.getBidByAuctionId(this.auctionId).subscribe({
          next: (bidsData) => {
            const list = Array.isArray(bidsData) ? [...bidsData] : [];
            // Sort bids by amount descending so highest bid is #1
            list.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
            this.bids = list;

            if (list.length > 0) {
              this.highestBid = list[0];
            }

            // Determine winner
            if (auctionData?.winner) {
              this.winner = auctionData.winner;
              this.winningAmount = auctionData.winningBid || (this.highestBid ? this.highestBid.amount : null);
            } else if (this.isEnded && this.highestBid) {
              this.winner = this.highestBid.buyer;
              this.winningAmount = this.highestBid.amount;
            }

            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (bidErr) => {
            console.error('Failed to load bids:', bidErr);
            this.errorMessage = 'Unable to load bids for this auction.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Failed to load auction details:', err);
        // Fallback: try loading bids anyway
        this.bidService.getBidByAuctionId(this.auctionId).subscribe({
          next: (bidsData) => {
            const list = Array.isArray(bidsData) ? [...bidsData] : [];
            list.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
            this.bids = list;
            if (list.length > 0) {
              this.highestBid = list[0];
            }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'Unable to load auction and bids data.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
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

  getInitials(name: string | undefined | null): string {
    if (!name) return 'U';
    return name
      .trim()
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
