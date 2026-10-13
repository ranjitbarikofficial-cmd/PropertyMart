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
  highestBid: number = 0;

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
        this.loadHighestBid(id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Auction details error:', error);
      }
    });
  }

  loadHighestBid(auctionId: number): void {
    this.auctionService.getHighestBid(auctionId).subscribe({
      next: (amount) => {
        this.highestBid = amount;
        this.bidAmount = amount;
        this.cdr.detectChanges();
      },
      error: () => {
        this.highestBid = this.auction.startingPrice;
        this.bidAmount = this.highestBid;
        this.cdr.detectChanges();
      }
    });
  }

  increaseBid(amount: number): void {
    if (this.bidAmount === null || this.bidAmount < this.highestBid) {
      this.bidAmount = this.highestBid;
    }

    this.bidAmount += amount;
  }

  placeBid(): void {
    if (!this.bidAmount || this.bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    if (this.bidAmount <= this.highestBid) {
      alert('Your bid must be higher than the current highest bid.');
      return;
    }

    const auctionId = this.auction.id;

    this.auctionService.placeBid(auctionId, this.bidAmount).subscribe({
      next: () => {
        alert('Bid placed successfully!');

        this.highestBid = this.bidAmount!;
        this.bidAmount = this.highestBid;

        this.cdr.detectChanges();
      },
      error: () => {
        alert('Failed to place bid.');
      }
    });
  }
}