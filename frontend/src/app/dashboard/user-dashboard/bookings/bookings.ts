import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auction } from '../../../services/auction';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings implements OnInit {
  wonAuctions: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private auctionService: Auction,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    if (!user.id) {
      this.errorMessage = 'Please log in to view your won properties.';
      this.loading = false;
      return;
    }

    this.auctionService.getWonAuctionsByBuyerId(Number(user.id)).subscribe({
      next: (auctions) => {
        this.wonAuctions = auctions;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Unable to load your won properties.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}