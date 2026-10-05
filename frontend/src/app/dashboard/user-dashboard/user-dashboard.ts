import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {

  userName = '';
  userInitials = '';
  userEmail = '';
  userRole = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');

    if (user) {
      try {
        const loggedInUser = JSON.parse(user);

        this.userName = loggedInUser.name || '';
        this.userEmail = loggedInUser.email || '';
        this.userRole = loggedInUser.role || '';

        this.generateInitials(this.userName);
      } catch (error) {
        console.error('Invalid logged-in user data:', error);
      }
    }
  }

  private generateInitials(name: string): void {
    if (!name) {
      this.userInitials = '';
      return;
    }

    this.userInitials = name
      .trim()
      .split(/\s+/)
      .map((part: string) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  profileMenuOpen = false;

toggleProfileMenu(): void {
  this.profileMenuOpen = !this.profileMenuOpen;
}

}