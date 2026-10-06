import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auction } from '../../../services/auction';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction-details',
  imports: [FormsModule],
  templateUrl: './auction-details.html',
  styleUrl: './auction-details.css',
})
export class AuctionDetails implements OnInit {

  auction: any;
  bidAmount: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private auctionService: Auction,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.auctionService.getAuctionById(id).subscribe({
      next: (data) => {
        this.auction = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Auction details error:', error);
      }
    });
  }

  placeBid(): void {
    if (!this.bidAmount || this.bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    const auctionId = this.auction.id;

    this.auctionService.placeBid(auctionId, this.bidAmount).subscribe({
      next: () => {
        alert('Bid placed successfully!');
        this.bidAmount = null;
      },
      error: () => {
        alert('Failed to place bid.');
      }
    });
  }
}