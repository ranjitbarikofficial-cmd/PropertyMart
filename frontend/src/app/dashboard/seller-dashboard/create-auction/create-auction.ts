import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-auction',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-auction.html',
  styleUrl: './create-auction.css',
})
export class CreateAuction implements OnInit {

  propertyId: number = 0;
  property: any = null;

  auction = {
    startTime: '',
    endTime: '',
    startingPrice: null as number | null,
    status: 'UPCOMING'
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.propertyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.propertyId) {
      this.errorMessage = 'Property ID not found.';
      return;
    }

    this.loadProperty();
  }

  loadProperty(): void {
    this.http.get<any>(
      `http://localhost:8080/api/property/find/${this.propertyId}`
    ).subscribe({
      next: (data) => {
        this.property = data;
      },
      error: (error) => {
        console.error('Property loading failed:', error);
        this.errorMessage = 'Unable to load property details.';
      }
    });
  }

  createAuction(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.auction.startTime ||
      !this.auction.endTime ||
      !this.auction.startingPrice
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    const auctionData = {
      startTime: this.auction.startTime,
      endTime: this.auction.endTime,
      startingPrice: this.auction.startingPrice,
      status: this.auction.status,
      property: {
        id: this.propertyId
      }
    };

    this.loading = true;

    this.http.post(
      'http://localhost:8080/api/auction/create',
      auctionData
    ).subscribe({
      next: (response) => {
        console.log('Auction created:', response);

        this.loading = false;
        this.successMessage = 'Auction created successfully!';

        setTimeout(() => {
          this.router.navigate(['/seller-dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Auction creation failed:', error);

        this.loading = false;
        this.errorMessage =
          'Failed to create auction. Please try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/seller-dashboard']);
  }
}