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
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  private apiUrl = 'http://localhost:8080/api/user/forgot-password';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must contain at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.loading = true;

    this.http.put(
      this.apiUrl,
      {
        email: this.email.trim(),
        newPassword: this.newPassword
      },
      {
        withCredentials: true,
        responseType: 'text'
      }
    ).subscribe({
      next: () => {
        this.loading = false;
        alert('Password updated successfully! Please login with your new password.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          typeof error.error === 'string'
            ? error.error
            : 'Unable to update password. Please try again.';
      }
    });
  }
}
