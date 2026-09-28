import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  };

  confirmPassword = '';
  termsAccepted = false;

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  register() {
    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!this.termsAccepted) {
      alert('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    this.auth.register(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);

        alert('Registration successful! Please login.');

        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Registration failed:', error);

        alert('Registration failed. Please try again.');
      },
    });
  }
}
