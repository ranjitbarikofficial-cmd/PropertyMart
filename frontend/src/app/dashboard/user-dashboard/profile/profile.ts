
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../../services/user';

@Component({
  selector: 'app-buyer-profile',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = {};
  isEditing = false;
  editName = '';
  editPhone = '';

  constructor(private userService: User) {}

  ngOnInit(): void {
    this.user = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
  }

  startEditing(): void {
    this.editName = this.user.name || '';
    this.editPhone = this.user.phone || '';
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editName = '';
    this.editPhone = '';
  }

  saveProfile(): void {
    const name = this.editName.trim();
    const phone = this.editPhone.trim();

    if (!name || !phone) {
      alert('Name and phone number are required.');
      return;
    }

    if (!this.user.id) {
      alert('User ID not found. Please log in again.');
      return;
    }

    const updatedUser = {
      ...this.user,
      name,
      phone
    };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (response: any) => {
        this.user = {
          ...updatedUser,
          ...(response || {})
        };

        localStorage.setItem(
          'loggedInUser',
          JSON.stringify(this.user)
        );

        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      error: () => {
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}
