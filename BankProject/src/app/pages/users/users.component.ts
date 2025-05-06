import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/Users';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from '../../services/transaction.service';

export interface TransferRequest {
  username: string;
  amount: number;
}

export interface TransactionResponse {
  success: boolean;
  msg: string;
  newBalance?: number;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersListComponent implements OnInit, OnDestroy {


  testprint2(arg0: File) {
console.log(arg0)
  }

users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  toastMessage: string | null = null;

  transferAmounts: { [username: string]: number | null } = {};

  searchTerm: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private transactionService: TransactionService
  ) {}

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
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error fetching users list:', err);
          this.error = 'Failed to load users list. Please try again later.';
          this.loading = false;
          this.users = [];
          this.filteredUsers = [];
          return of([]);
        })
      )
      .subscribe((usersData: User[]) => {
        this.users = usersData;

        this.filteredUsers = usersData;
        this.loading = false;

        this.users.forEach((user) => {
          this.transferAmounts[user.username] = null;
        });
      });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter((user) =>
        user?.username?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }

  initiateTransfer(user: User): void {
    const amount = this.transferAmounts[user.username];

    if (!amount || amount <= 0) {
      this.showToast('Please enter a valid amount to transfer.', 'error');
      return;
    }

    this.transferAmounts[user.username] = null;

    const transferRequestData: TransferRequest = {
      username: user.username,
      amount: amount,
    };

    this.transactionService
      .transfer(transferRequestData)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error during transfer:', err);
          this.showToast(
            `Transfer to ${user.username} failed. Please try again.`,
            'error'
          );
          return of(null as any);
        })
      )
      .subscribe((response: TransactionResponse | null) => {
        if (response !== null) {
          if (response.msg === 'Transaction Done') {
            this.showToast(
              `Successfully transferred ${amount} to ${user.username}.`,
              'success'
            );
            this.loadAllUsers();
          } else {
            this.showToast(
              `Transfer failed: ${response.msg || 'Unknown error'}`,
              'error'
            );
          }
        }
      });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
