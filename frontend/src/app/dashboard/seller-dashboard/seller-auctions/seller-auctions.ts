
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auction } from '../../../services/auction';

@Component({
  selector: 'app-seller-auctions',
  imports: [RouterLink],
  templateUrl: './seller-auctions.html',
  styleUrl: './seller-auctions.css',
})
export class SellerAuctions implements OnInit {

  auctions: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private auctionService: Auction,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'Please log in to view your auctions.';
      return;
    }

    const user = JSON.parse(userData);

    if (!user.id) {
      this.errorMessage = 'User ID not found.';
      return;
    }

    this.loadAuctions(user.id);
  }

  loadAuctions(userId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.auctionService.getAuctionBySellerUserId(userId).subscribe({
      next: (data) => {
        this.auctions = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load seller auctions:', error);
        this.errorMessage = 'Unable to load your auctions.';
        this.loading = false;
      }
    });
  }
}