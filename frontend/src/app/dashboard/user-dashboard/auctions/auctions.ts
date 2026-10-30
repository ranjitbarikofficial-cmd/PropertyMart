
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Auction } from '../../../services/auction';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auctions',
  imports: [RouterLink],
  templateUrl: './auctions.html',
  styleUrl: './auctions.css',
})
export class Auctions implements OnInit, OnDestroy {
  auctions: any[] = [];
  loaded = false;
  currentTime = new Date();

  private timerInterval: ReturnType<typeof setInterval> | undefined;

  constructor(
    private auctionService: Auction,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auctionService.getAllAuctions().subscribe({
      next: (data) => {
        this.auctions = data;
        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Auction error:', error);
        this.loaded = true;
        this.cdr.detectChanges();
      }
    });

    this.timerInterval = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  getAuctionTimer(auction: any): string {
    const now = this.currentTime.getTime();
    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return 'Time unavailable';
    }

    if (now < start) {
      return 'Starts in ' + this.formatTime(start - now);
    }

    if (now < end) {
      return 'Ends in ' + this.formatTime(end - now);
    }

    return 'Auction ended';
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
