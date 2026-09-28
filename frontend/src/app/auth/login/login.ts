import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  login() {
    this.auth.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        localStorage.setItem('loggedInUser', JSON.stringify(response));

        if (response.role === 'BUYER') {
          this.router.navigate(['/user-dashboard']);
        } else if (response.role === 'SELLER') {
          this.router.navigate(['/seller-dashboard']);
        } else if (response.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Unknown user role.');
        }
      },

      error: (error) => {
        console.error('Login failed:', error);

        if (error.status === 401) {
          alert('Invalid email or password.');
        } else {
          alert('Login failed. Please try again.');
        }
      },
    });
  }
}
