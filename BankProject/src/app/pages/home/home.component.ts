import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';
import { AddCardModalComponent } from '../../components/add-card-modal/add-card-modal.component';
import { PaymentCard } from '../../models/card';
import { User } from '../../models/Users';
import { UsersService } from '../../services/users/users.service';
import { TransactionService } from '../../services/transaction.service';
import { TransactionRequest } from '../../models/TransactionsRequest';
import { catchError, of } from 'rxjs';
import { TransactionResponse } from '../users/users.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PaymentCardComponent,
    AddCardModalComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  currentUser: User | null = null;
  constructor(
    private router: Router,
    private userService: UsersService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.cards.update((cards) => {
          const updatedCards = [...cards];
          updatedCards[0].balance = user.balance;
          return updatedCards;
        });
      },
      error: (err) => {
        console.error('Failed to load current user profile:', err);
      },
    });
  }

  goToUserProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToUsersList(): void {
    this.router.navigate(['/users']);
  }

  cards = signal<PaymentCard[]>([
    {
      number: '4242 4242 4242 4242',
      name: 'John Doe',
      expMonth: '12',
      expYear: '2027',
      cvv: '123',
      type: 'visa',
      background:
        'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg',
      balance: 0,
    },
  ]);

  selectedCardIndex = signal<number | null>(null);
  showAddCardModal = signal(false);
  transactionAmount = 0;
  toastMessage = signal<string | null>(null);

  // Modal Control
  showModal() {
    return this.showAddCardModal();
  }

  openModal() {
    this.showAddCardModal.set(true);
  }

  closeModal() {
    this.showAddCardModal.set(false);
  }

  // Card Operations
  addCard(newCard: PaymentCard) {
    this.cards.update((cards) => [...cards, { ...newCard, balance: 0 }]);
    this.closeModal();
  }

  getSelectedBalance(): string {
    const index = this.selectedCardIndex();
    return index !== null ? `$${this.cards()[index].balance}` : '$0.00';
  }

  selectCard(index: number) {
    this.selectedCardIndex.set(index);
  }

  selectedCard(): PaymentCard | null {
    const index = this.selectedCardIndex();
    return index !== null ? this.cards()[index] : null;
  }

  deposit(index: number | null, amount: number) {
    if (index === null || amount <= 0) return;
    const myTransactionData: TransactionRequest = {
      amount: amount,
    };
    this.transactionService
      .deposit(myTransactionData)
      .pipe(
        catchError(() => {
          this.showToast('Error during withdrawal');
          return of(null as any);
        })
      )
      .subscribe((response: TransactionResponse | null) => {
        if (response !== null) {
          if (response.msg === 'Done') {
            this.showToast(`Successfully deposit ${amount}`);
            this.cards.update((cards) => {
              const updated = [...cards];
              if (updated[index].balance >= amount) {
                updated[index].balance -= amount;
                this.showToast(`Deposit $${amount}`);
              } else {
                this.showToast('Insufficient funds');
              }
              return updated;
            });
          } else {
            this.showToast(
              `Deposit failed: ${response.msg || 'Unknown error'}`
            );
          }
        }
      });
  }

  withdraw(index: number | null, amount: number) {
    if (index === null || amount <= 0) return;
    const myTransactionData: TransactionRequest = {
      amount: amount,
    };
    this.transactionService
      .withdraw(myTransactionData)
      .pipe(
        catchError(() => {
          this.showToast('Error during withdrawal');
          return of(null as any);
        })
      )
      .subscribe((response: TransactionResponse | null) => {
        if (response !== null) {
          if (response.msg === 'Done') {
            this.showToast(`Successfully withdrew ${amount}`);
            this.cards.update((cards) => {
              const updated = [...cards];
              if (updated[index].balance >= amount) {
                updated[index].balance -= amount;
                this.showToast(`Withdrew $${amount}`);
              } else {
                this.showToast('Insufficient funds');
              }
              return updated;
            });
          } else {
            this.showToast(
              `Withdrawal failed: ${response.msg || 'Unknown error'}`
            );
          }
        }
      });
  }

  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
