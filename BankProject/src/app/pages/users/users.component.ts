import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/Users';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  toastMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (usersData: User[]) => {
          console.log('Users data received:', usersData);
          this.users = usersData;
          this.loading = false;
        },
        (err: any) => {
          console.error('Error fetching users list:', err);
          this.error = 'Failed to load users list. Please try again later.';
          this.loading = false;
          this.users = [];
        }
      );
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
