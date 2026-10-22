import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = '';
  newPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    if (!this.email) {
      alert('Please enter your email address.');
      return;
    }

    this.http
      .post('http://localhost:8080/api/user/reset-password', {
        email: this.email,
        newPassword: this.newPassword || 'password123',
      })
      .subscribe({
        next: () => {
          alert('Password reset successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 404) {
            alert('No account found with that email address.');
          } else {
            alert('Failed to reset password. Please try again.');
          }
        },
      });
  }
}
