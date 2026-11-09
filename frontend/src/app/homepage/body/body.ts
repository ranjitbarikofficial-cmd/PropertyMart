import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  private router = inject(Router);

  searchProperties(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      this.router.navigate(['/user-dashboard/explore']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

