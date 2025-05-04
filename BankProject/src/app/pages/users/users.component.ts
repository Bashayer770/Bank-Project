import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/Users'; // Adjust path as needed
import { Subject, takeUntil, catchError, of, Observable } from 'rxjs'; // Import necessary RxJS operators and Observable
import { CommonModule, CurrencyPipe } from '@angular/common'; // For ngIf, ngFor, etc.
import { UsersService } from '../../services/users/users.service';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { TransactionResponse } from '../../models/TransactionsResponse';
import { TransferRequest } from '../../models/TransactionsRequest';

// Assuming these interfaces are defined elsewhere, e.g., in a models file
// export interface TransferRequest {
//   username: string; // Target username
//   amount: number;
// }

// export interface TransactionResponse {
//   // Define the structure of your backend's success response for a transaction
//   // Example:
//   success: boolean;
//   message: string;
//   newBalance?: number; // Optional: if the response includes the new balance
// }

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, // Make sure CommonModule is imported for ngIf, ngFor, currency pipe
    FormsModule, // Import FormsModule for ngModel
    HttpClientModule, // Import HttpClientModule
  ],
  templateUrl: './users.component.html', // Ensure this path is correct
  styleUrls: ['./users.component.css'], // Ensure this path is correct
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  toastMessage: string | null = null;

  // Object to store transfer amounts for each user, keyed by username
  transferAmounts: { [username: string]: number | null } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private transactionService: TransactionService
  ) {} // Assuming UsersService has the transfer method

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
          return of([]);
        })
      )
      .subscribe((usersData: User[]) => {
        console.log('Users data received:', usersData);
        this.users = usersData;
        this.loading = false;

        this.users.forEach((user) => {
          this.transferAmounts[user.username] = null;
        });
      });
  }

  /**
   * Initiates the transfer process for a specific user.
   * Creates a TransferRequest object and sends it to the backend.
   * @param user The target user for the transfer.
   */
  initiateTransfer(user: User): void {
    const amount = this.transferAmounts[user.username];

    if (!amount || amount <= 0) {
      this.showToast('Please enter a valid amount to transfer.', 'error');
      return;
    }

    this.transferAmounts[user.username] = null;

    // Create the TransferRequest object
    const transferRequestData: TransferRequest = {
      username: user.username, // Target username
      amount: amount,
    };
    console.log(transferRequestData);
    this.transactionService
      .transfer(transferRequestData)
      .pipe(
        // Assuming usersService has the transfer method
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
        // Expect TransactionResponse or null from catchError
        if (response !== null) {
          // Assuming the backend response indicates success, e.g., response.success
          // Adjust this check based on your actual TransactionResponse structure
          if (response) {
            this.showToast(
              `Successfully transferred ${amount} to ${user.username}.`,
              'success'
            );
            // Optionally, refresh the user list to show updated balances
            this.loadAllUsers();
          } else {
            // Handle backend indicating failure even with a 2xx status
            this.showToast(
              `Transfer failed: ${response || 'Unknown error'}`,
              'error'
            );
          }
        }
        // If response is null, it was handled by catchError
      });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}

// Placeholder interfaces if not defined elsewhere
// export interface TransferRequest {
//   username: string;
//   amount: number;
// }

// export interface TransactionResponse {
//   success: boolean;
//   message: string;
//   // Add other properties your backend response might include
// }
