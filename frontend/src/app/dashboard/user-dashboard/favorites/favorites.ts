
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  favoriteProperties: any[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const saved = localStorage.getItem('favoriteProperties');
    this.favoriteProperties = saved ? JSON.parse(saved) : [];
  }

  removeFavorite(propertyId: number): void {
    this.favoriteProperties = this.favoriteProperties.filter(
      property => property.id !== propertyId
    );

    localStorage.setItem(
      'favoriteProperties',
      JSON.stringify(this.favoriteProperties)
    );
  }
}
