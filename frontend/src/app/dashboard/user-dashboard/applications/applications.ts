
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Bid } from '../../../services/bid';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-applications',
  imports: [DatePipe,RouterLink],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {
  bids: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private bidService: Bid, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');

    if (!user) {
      this.errorMessage = 'Please log in to view your bids.';
      this.loading = false;
      return;
    }

    const loggedInUser = JSON.parse(user);
    const buyerId = Number(loggedInUser.id);

    if (!buyerId) {
      this.errorMessage = 'Unable to identify the logged-in buyer.';
      this.loading = false;
      return;
    }

    this.bidService.getBidByBuyerId(buyerId).subscribe({
      next: (data) => {
        this.bids = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Buyer bids:', data);
      },
      error: (error) => {
        console.error('Error loading buyer bids:', error);
        this.errorMessage = 'Unable to load your bids.';
        this.loading = false;
      }
    });
  }
}

