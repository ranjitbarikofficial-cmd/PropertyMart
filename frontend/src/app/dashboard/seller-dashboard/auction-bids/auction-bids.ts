
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction-bids',
  imports: [],
  templateUrl: './auction-bids.html',
  styleUrl: './auction-bids.css',
})
export class AuctionBids implements OnInit {

  auctionId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.auctionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Selected Auction ID:', this.auctionId);
  }
}