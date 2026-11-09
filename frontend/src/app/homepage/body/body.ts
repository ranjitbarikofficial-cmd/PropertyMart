import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface PropertyItem {
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
  approvalStatus?: string;
  seller?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  properties: PropertyItem[] = [];
  filteredProperties: PropertyItem[] = [];
  loadingProperties = true;

  // Real Platform Stats from Database
  totalPropertiesCount = 0;
  totalUsersCount = 0;
  totalSellersCount = 0;
  totalCitiesCount = 0;

  // Real Hero Showcase Cards
  heroPrimaryProperty: PropertyItem | null = null;
  heroSecondaryProperty: PropertyItem | null = null;

  // Search Filter Model
  searchLocation = '';
  searchPropertyType = '';
  searchMinPrice: number | null = null;
  searchMaxPrice: number | null = null;

  selectedCategory = 'ALL';
  favorites = new Set<number>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadSavedFavorites();
    this.loadRealData();
  }

  loadSavedFavorites(): void {
    try {
      const saved = localStorage.getItem('pm_favorites');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          this.favorites = new Set(arr);
        }
      }
    } catch (e) {
      console.warn('Could not read saved favorites:', e);
    }
  }

  loadRealData(): void {
    this.loadingProperties = true;

    // 1. Fetch Real Properties
    this.http.get<PropertyItem[]>('http://localhost:8080/api/property/allproperty').subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : [];
        this.properties = list;
        this.filteredProperties = [...list];
        this.totalPropertiesCount = list.length;

        // Compute unique cities/localities
        const cities = new Set(
          list
            .map((p) => (p.location || '').trim())
            .filter((loc) => loc.length > 0)
        );
        this.totalCitiesCount = cities.size || (list.length > 0 ? 1 : 0);

        // Bind Real Hero Showcase Properties
        if (list.length > 0) {
          this.heroPrimaryProperty = list[0];
        }
        if (list.length > 1) {
          this.heroSecondaryProperty = list[1];
        } else if (list.length === 1) {
          this.heroSecondaryProperty = list[0];
        }

        this.loadingProperties = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load real properties:', err);
        this.loadingProperties = false;
        this.cdr.detectChanges();
      },
    });

    // 2. Fetch Real Users Count
    this.http.get<any[]>('http://localhost:8080/api/user/alluser').subscribe({
      next: (users) => {
        if (Array.isArray(users)) {
          this.totalUsersCount = users.length;
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });

    // 3. Fetch Real Sellers Count
    this.http.get<any[]>('http://localhost:8080/api/seller/allseller').subscribe({
      next: (sellers) => {
        if (Array.isArray(sellers)) {
          this.totalSellersCount = sellers.length;
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  onSearchSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.applyFilters();
    this.scrollToProperties();
  }

  applyFilters(): void {
    const loc = this.searchLocation.trim().toLowerCase();
    const type = this.searchPropertyType.trim().toUpperCase();
    const cat = this.selectedCategory.trim().toUpperCase();

    this.filteredProperties = this.properties.filter((prop) => {
      // Location match
      if (loc) {
        const pLoc = (prop.location || '').toLowerCase();
        const pTitle = (prop.title || '').toLowerCase();
        if (!pLoc.includes(loc) && !pTitle.includes(loc)) {
          return false;
        }
      }

      // Property type dropdown match
      if (type && type !== 'ALL') {
        const pType = (prop.propertyType || '').toUpperCase();
        if (!pType.includes(type)) {
          return false;
        }
      }

      // Category filter pill match
      if (cat && cat !== 'ALL') {
        const pType = (prop.propertyType || '').toUpperCase();
        if (!pType.includes(cat)) {
          return false;
        }
      }

      // Price range
      const price = Number(prop.basePrice || 0);
      if (this.searchMinPrice !== null && this.searchMinPrice > 0 && price < this.searchMinPrice) {
        return false;
      }
      if (this.searchMaxPrice !== null && this.searchMaxPrice > 0 && price > this.searchMaxPrice) {
        return false;
      }

      return true;
    });

    this.cdr.detectChanges();
  }

  selectCategory(categoryKey: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.selectedCategory = categoryKey;
    this.applyFilters();
    this.scrollToProperties();
  }

  resetFilters(): void {
    this.searchLocation = '';
    this.searchPropertyType = '';
    this.searchMinPrice = null;
    this.searchMaxPrice = null;
    this.selectedCategory = 'ALL';
    this.filteredProperties = [...this.properties];
    this.cdr.detectChanges();
  }

  toggleFavorite(propertyId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.favorites.has(propertyId)) {
      this.favorites.delete(propertyId);
    } else {
      this.favorites.add(propertyId);
    }

    try {
      localStorage.setItem('pm_favorites', JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }

    this.cdr.detectChanges();
  }

  isFavorite(propertyId: number): boolean {
    return this.favorites.has(propertyId);
  }

  scrollToProperties(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    setTimeout(() => {
      const el = document.getElementById('featured-properties');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  formatPrice(price: number | undefined | null): string {
    if (!price || isNaN(Number(price))) return '₹0';
    const num = Number(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }

  getMediaClass(type: string | undefined, id: number): string {
    const t = (type || '').toUpperCase();
    if (t.includes('APARTMENT')) return 'property-card__media--a';
    if (t.includes('VILLA')) return 'property-card__media--b';
    if (t.includes('LAND') || t.includes('PLOT')) return 'property-card__media--d';
    if (id % 4 === 1) return 'property-card__media--a';
    if (id % 4 === 2) return 'property-card__media--b';
    if (id % 4 === 3) return 'property-card__media--c';
    return 'property-card__media--d';
  }
}
