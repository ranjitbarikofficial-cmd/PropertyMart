
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText = '';
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.http.get<any[]>('http://localhost:8080/api/user/alluser', {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.filterUsers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Unable to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      String(user.name ?? '').toLowerCase().includes(search) ||
      String(user.email ?? '').toLowerCase().includes(search)
    );
  }

  updateUserApproval(
    userId: number,
    approvalStatus: 'APPROVED' | 'REJECTED'
  ): void {
    this.http.put(
      `http://localhost:8080/api/user/approval/${userId}`,
      { approvalStatus },
      { withCredentials: true }
    ).subscribe({
      next: () => {
       this.users = this.users.map(user =>
  Number(user.id) === Number(userId)
    ? { ...user, verificationStatus: approvalStatus }
    : user
);
        this.filterUsers();
      },
      error: (error) => {
        console.error('Error updating approval:', error);
        this.errorMessage = 'Unable to update user approval.';
      }
    });
  }

  viewUser(user: any): void {
    const details = [
      `Name: ${user.name ?? '—'}`,
      `Email: ${user.email ?? '—'}`,
      `Phone: ${user.phone ?? '—'}`,
      `Role: ${user.role ?? '—'}`,
      `Approval Status: ${user.approvalStatus ?? 'PENDING'}`
    ].join('\n');

    window.alert(details);
  }

 get pendingApprovals(): number {
  return this.users.filter(
    user => (user.verificationStatus ?? 'PENDING').toUpperCase() === 'PENDING'
  ).length;
}
}