import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  imports: [],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  userName = '';
  userInitials = '';

  ngOnInit() {
    const user = localStorage.getItem('loggedInUser');

    if (user) {
      const loggedInUser = JSON.parse(user);

      this.userName = loggedInUser.name;

      this.userInitials = loggedInUser.name
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
  }
}
