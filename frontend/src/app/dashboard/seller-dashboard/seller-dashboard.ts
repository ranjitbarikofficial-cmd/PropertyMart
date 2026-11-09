
import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, DatePipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  user: {
    id: number;
  };
}

interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  status: string;
}

interface AuctionItem {
  id: number;
  status: string;
  startingPrice: number;
  winningBid?: number | null;
  startTime?: string;
  endTime?: string;
  winner?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
  };
  property?: {
    id?: number;
    title?: string;
    propertyType?: string;
    basePrice?: number;
    location?: string;
  };
}

export interface CategoryMetric {
  name: string;
  icon: string;
  added: number;
  sold: number;
  addedPct: number;
  soldPct: number;
}

export interface AuctionBarItem {
  id: number;
  title: string;
  status: string;
  startingPrice: number;
  winningBid: number;
  growthPct: number;
  startBarHeight: number;
  bidBarHeight: number;
}

@Component({
  selector: 'app-seller-dashboard',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard implements OnInit {

  readonly Math = Math;

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  seller: Seller | null = null;
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  auctions: AuctionItem[] = [];

  loading = true;
  errorMessage = '';

  // Property Metrics (Homes Added vs Sold)
  totalPropertiesCount = 0;
  soldPropertiesCount = 0;
  availablePropertiesCount = 0;
  pendingPropertiesCount = 0;
  sellThroughRate = 0;

  // Donut chart stroke dash calculations
  donutCircumference = 263.89; // 2 * pi * 42
  soldOffset = 0;
  soldLength = 0;
  availableOffset = 0;
  availableLength = 0;
  pendingOffset = 0;
  pendingLength = 0;

  categoryMetrics: CategoryMetric[] = [];

  // Auction Metrics
  activeAuctionsCount = 0;
  upcomingAuctionsCount = 0;
  endedAuctionsCount = 0;
  totalAuctionsCount = 0;
  auctionBarItems: AuctionBarItem[] = [];
  isUsingAuctionPreview = false;

  // Live Auction Bids Inspection
  expandedAuctionId: number | null = null;
  auctionBidsMap: { [auctionId: number]: any[] } = {};
  loadingBidsId: number | null = null;

  get activeProperties(): Property[] {
    return this.properties.filter(
      property => (property.status || '').toUpperCase() === 'AVAILABLE'
    );
  }

  get userInitials(): string {
    if (!this.seller?.name) {
      return 'S';
    }

    return this.seller.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('loggedInUser');

    if (!userData) {
      this.errorMessage = 'User is not logged in.';
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (!user.id) {
        this.errorMessage = 'User ID not found.';
        this.loading = false;
        return;
      }

      this.seller = {
        id: 0,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        user: {
          id: user.id
        }
      };

      this.loadSeller(user.id);
      this.loadAuctions(user.id);

    } catch (error) {
      console.error('Invalid user data:', error);
      this.errorMessage = 'Invalid login information.';
      this.loading = false;
    }
  }

  loadSeller(userId: number): void {
    this.http.get<Seller>(
      `http://localhost:8080/api/seller/user/${userId}`
    ).subscribe({
      next: (seller) => {
        this.seller = seller;
        this.loadProperties(seller.id);
      },
      error: (error) => {
        console.error('Failed to load seller:', error);
        this.errorMessage = 'Seller profile not found.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProperties(sellerId: number): void {
    this.http.get<Property[]>(
      `http://localhost:8080/api/property/seller/${sellerId}`
    ).subscribe({
      next: (properties) => {
        this.properties = properties || [];
        this.filteredProperties = this.properties;
        this.computePropertyMetrics();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load properties:', error);
        this.errorMessage = 'Failed to load properties.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAuctions(userId: number): void {
    this.http.get<AuctionItem[]>(
      `http://localhost:8080/api/auction/user/${userId}`
    ).subscribe({
      next: (auctions) => {
        this.auctions = auctions || [];
        this.computeAuctionMetrics();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load auctions:', error);
        // Fallback to seller endpoint if user endpoint fails
        this.http.get<AuctionItem[]>(`http://localhost:8080/api/auction/seller/${userId}`).subscribe({
          next: (auctions) => {
            this.auctions = auctions || [];
            this.computeAuctionMetrics();
            this.cdr.detectChanges();
          },
          error: () => {
            this.auctions = [];
            this.computeAuctionMetrics();
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  computePropertyMetrics(): void {
    const total = this.properties.length;
    this.totalPropertiesCount = total;

    let sold = 0;
    let available = 0;
    let pending = 0;

    for (const prop of this.properties) {
      const status = (prop.status || '').toUpperCase();
      if (status === 'SOLD') {
        sold++;
      } else if (status === 'AVAILABLE') {
        available++;
      } else {
        pending++;
      }
    }

    this.soldPropertiesCount = sold;
    this.availablePropertiesCount = available;
    this.pendingPropertiesCount = pending;

    this.sellThroughRate = total > 0 ? Math.round((sold / total) * 100) : 0;

    // SVG Donut calculation
    const C = this.donutCircumference;
    if (total > 0) {
      this.soldLength = (sold / total) * C;
      this.availableLength = (available / total) * C;
      this.pendingLength = (pending / total) * C;

      this.soldOffset = 0;
      this.availableOffset = -this.soldLength;
      this.pendingOffset = -(this.soldLength + this.availableLength);
    } else {
      this.soldLength = 0;
      this.availableLength = 0;
      this.pendingLength = 0;
    }

    // Category breakdown (Added vs Sold)
    const categoryMap: { [key: string]: { icon: string; added: number; sold: number } } = {
      'APARTMENT': { icon: '🏢', added: 0, sold: 0 },
      'HOUSE': { icon: '🏡', added: 0, sold: 0 },
      'VILLA': { icon: '🏰', added: 0, sold: 0 },
      'COMMERCIAL': { icon: '🏬', added: 0, sold: 0 },
      'LAND': { icon: '📐', added: 0, sold: 0 },
    };

    for (const prop of this.properties) {
      const typeKey = (prop.propertyType || 'HOUSE').toUpperCase();
      const matchedKey = Object.keys(categoryMap).find(k => typeKey.includes(k)) || 'HOUSE';
      categoryMap[matchedKey].added++;
      if ((prop.status || '').toUpperCase() === 'SOLD') {
        categoryMap[matchedKey].sold++;
      }
    }

    let maxAdded = 1;
    for (const key of Object.keys(categoryMap)) {
      if (categoryMap[key].added > maxAdded) {
        maxAdded = categoryMap[key].added;
      }
    }

    this.categoryMetrics = Object.keys(categoryMap).map(k => {
      const item = categoryMap[k];
      return {
        name: k.charAt(0) + k.slice(1).toLowerCase(),
        icon: item.icon,
        added: item.added,
        sold: item.sold,
        addedPct: maxAdded > 0 ? Math.round((item.added / maxAdded) * 100) : 0,
        soldPct: maxAdded > 0 ? Math.round((item.sold / maxAdded) * 100) : 0,
      };
    });
  }

  computeAuctionMetrics(): void {
    const list = this.auctions || [];
    this.totalAuctionsCount = list.length;
    this.activeAuctionsCount = list.filter(a => (a.status || '').toUpperCase() === 'ACTIVE').length;
    this.upcomingAuctionsCount = list.filter(a => (a.status || '').toUpperCase() === 'UPCOMING').length;
    this.endedAuctionsCount = list.filter(a => (a.status || '').toUpperCase() === 'ENDED').length;

    if (list.length === 0) {
      // Demo preview for new sellers with 0 auctions
      this.isUsingAuctionPreview = true;
      this.auctionBarItems = [
        {
          id: 101,
          title: 'Skyline Luxury Penthouse',
          status: 'ACTIVE',
          startingPrice: 4500000,
          winningBid: 5600000,
          growthPct: 24,
          startBarHeight: 65,
          bidBarHeight: 88,
        },
        {
          id: 102,
          title: 'Green Valley Villa',
          status: 'ENDED',
          startingPrice: 3200000,
          winningBid: 3950000,
          growthPct: 23,
          startBarHeight: 52,
          bidBarHeight: 74,
        },
        {
          id: 103,
          title: 'Downtown Retail Space',
          status: 'ACTIVE',
          startingPrice: 6000000,
          winningBid: 7100000,
          growthPct: 18,
          startBarHeight: 80,
          bidBarHeight: 100,
        },
        {
          id: 104,
          title: 'Sunset Beachfront Condo',
          status: 'UPCOMING',
          startingPrice: 2800000,
          winningBid: 2800000,
          growthPct: 0,
          startBarHeight: 46,
          bidBarHeight: 46,
        },
      ];
      return;
    }

    this.isUsingAuctionPreview = false;
    // Map actual auctions (up to 5 most recent)
    const recent = list.slice(0, 5);
    let maxVal = 1;
    for (const a of recent) {
      const start = Number(a.startingPrice || 0);
      const bid = Number(a.winningBid || a.startingPrice || 0);
      if (start > maxVal) maxVal = start;
      if (bid > maxVal) maxVal = bid;
    }

    this.auctionBarItems = recent.map((a, idx) => {
      const startingPrice = Number(a.startingPrice || 0);
      const winningBid = Number(a.winningBid || a.startingPrice || 0);
      const title = a.property?.title || `Auction #${a.id || idx + 1}`;
      const growth = startingPrice > 0 ? Math.round(((winningBid - startingPrice) / startingPrice) * 100) : 0;
      return {
        id: a.id,
        title: title.length > 18 ? title.slice(0, 16) + '...' : title,
        status: (a.status || 'ACTIVE').toUpperCase(),
        startingPrice,
        winningBid,
        growthPct: Math.max(0, growth),
        startBarHeight: maxVal > 0 ? Math.max(12, Math.round((startingPrice / maxVal) * 100)) : 20,
        bidBarHeight: maxVal > 0 ? Math.max(12, Math.round((winningBid / maxVal) * 100)) : 20,
      };
    });
  }

  toggleAuctionBids(auctionId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.expandedAuctionId === auctionId) {
      this.expandedAuctionId = null;
      this.cdr.detectChanges();
      return;
    }

    this.expandedAuctionId = auctionId;

    if (!this.auctionBidsMap[auctionId]) {
      this.loadingBidsId = auctionId;
      this.http.get<any[]>(`http://localhost:8080/api/bid/findbyauctionid/${auctionId}`, {
        withCredentials: true,
      }).subscribe({
        next: (bids) => {
          const sorted = Array.isArray(bids) ? [...bids] : [];
          sorted.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
          this.auctionBidsMap[auctionId] = sorted;
          this.loadingBidsId = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load bids for auction:', err);
          this.auctionBidsMap[auctionId] = [];
          this.loadingBidsId = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  getWinnerName(auction: AuctionItem): string {
    if (auction.winner?.name) {
      return auction.winner.name;
    }
    const bids = this.auctionBidsMap[auction.id];
    if (bids && bids.length > 0 && bids[0].buyer?.name) {
      return bids[0].buyer.name;
    }
    return 'Highest Bidder';
  }

  getWinnerEmail(auction: AuctionItem): string {
    if (auction.winner?.email) {
      return auction.winner.email;
    }
    const bids = this.auctionBidsMap[auction.id];
    if (bids && bids.length > 0 && bids[0].buyer?.email) {
      return bids[0].buyer.email;
    }
    return '';
  }

  getWinnerPhone(auction: AuctionItem): string {
    if (auction.winner?.phone) {
      return auction.winner.phone;
    }
    const bids = this.auctionBidsMap[auction.id];
    if (bids && bids.length > 0 && bids[0].buyer?.phone) {
      return bids[0].buyer.phone;
    }
    return '';
  }

  getWinningBidAmount(auction: AuctionItem): number {
    if (auction.winningBid && auction.winningBid > 0) {
      return auction.winningBid;
    }
    const bids = this.auctionBidsMap[auction.id];
    if (bids && bids.length > 0 && bids[0].amount) {
      return bids[0].amount;
    }
    return auction.startingPrice || 0;
  }

  formatPrice(price: number): string {
    if (!price || isNaN(price)) return '₹0';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  }

  searchListings(searchText: string): void {
    const text = (searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredProperties = this.properties;
      return;
    }

    this.filteredProperties = this.properties.filter(p =>
      (p.title || '').toLowerCase().includes(text) ||
      (p.location || '').toLowerCase().includes(text) ||
      (p.propertyType || '').toLowerCase().includes(text)
    );
  }

  deleteProperty(propertyId: number): void {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    this.http.delete(
      `http://localhost:8080/api/property/delete/${propertyId}`
    ).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== propertyId);
        this.filteredProperties = this.filteredProperties.filter(p => p.id !== propertyId);
        this.computePropertyMetrics();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Delete property failed:', err);
        alert('Failed to delete property. It may be linked to an active auction.');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}

