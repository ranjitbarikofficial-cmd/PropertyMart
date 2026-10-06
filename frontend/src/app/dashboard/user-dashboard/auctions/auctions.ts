import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Auction } from '../../../services/auction';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auctions',
  imports: [RouterLink],
  templateUrl: './auctions.html',
  styleUrl: './auctions.css',
})
export class Auctions implements OnInit {

  auctions: any[] = [];
  loaded = false;

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
  }

}