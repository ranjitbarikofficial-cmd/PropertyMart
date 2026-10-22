
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bid } from '../../../services/bid';

@Component({
  selector: 'app-auction-bids',
  imports: [],
  templateUrl: './auction-bids.html',
  styleUrl: './auction-bids.css',
})
export class AuctionBids implements OnInit {
  auctionId!: number;
  bids: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bidService: Bid,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auctionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBids();
  }

  loadBids(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.bidService.getBidByAuctionId(this.auctionId).subscribe({
      next: (data) => {
        this.bids = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Auction bids:', data);
      },
      error: (error) => {
        console.error('Failed to load bids:', error);
        this.errorMessage = 'Unable to load bids.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

