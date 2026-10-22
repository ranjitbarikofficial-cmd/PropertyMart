
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Property } from '../../../services/property';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
  properties: any[] = [];
  filteredProperties: any[] = [];
  favoriteProperties: any[] = [];
  loaded = false;

  constructor(
    private propertyservice: Property,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();

    this.propertyservice.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.filteredProperties = data;
        this.loaded = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Property error:', error);
        this.loaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  loadFavorites(): void {
    const saved = localStorage.getItem('favoriteProperties');
    this.favoriteProperties = saved ? JSON.parse(saved) : [];
  }

  isFavorite(property: any): boolean {
    return this.favoriteProperties.some(
      favorite => favorite.id === property.id
    );
  }

  toggleFavorite(property: any): void {
    if (this.isFavorite(property)) {
      this.favoriteProperties = this.favoriteProperties.filter(
        favorite => favorite.id !== property.id
      );
    } else {
      this.favoriteProperties = [...this.favoriteProperties, property];
    }

    localStorage.setItem(
      'favoriteProperties',
      JSON.stringify(this.favoriteProperties)
    );
  }

  searchProperties(searchText: string): void {
    const text = searchText.toLowerCase().trim();

    this.filteredProperties = this.properties.filter(property =>
      (property.title || '').toLowerCase().includes(text) ||
      (property.location || '').toLowerCase().includes(text) ||
      (property.propertyType || '').toLowerCase().includes(text)
    );
  }
}
