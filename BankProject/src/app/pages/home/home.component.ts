import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { CardTransferBoldComponent } from '../../svg/card-transfer-bold/card-transfer-bold.component';
import { HandHoldingDollarComponent } from '../../svg/hand-holding-dollar/hand-holding-dollar.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PaymentCardComponent,
    AddCardModalComponent,
    CommonModule,
    FormsModule,
    CardTransferBoldComponent,
    HandHoldingDollarComponent,
    HandHoldingDollarComponent,
    ModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  constructor(
    private router: Router,
    private userService: UsersService,
    private transactionService: TransactionService
  ) {}

  cards = signal<UserWithCardProps[]>([]);
  selectedCardIndex = signal<number | null>(null);
  showAddCardModal = signal(false);
  transactionAmount: number | null = null;
  toastMessage = signal<string | null>(null);
  user: User | null = null;
  isDeposit: boolean = true;
  transferAmount = 0;
  showTransferSection = signal(false);
  transferTargetIndex: number | null = null;
  public shouldShowTransferLinkModal = false;

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe((userData: User) => {
      this.user = userData;
      this.cards.set([{ ...userData, background: '#8bb3ee' }]);
    });
  }

  transfer() {
    const from = this.selectedCardIndex();
    const to = this.transferTargetIndex;
    const amount = this.transferAmount;

    if (from === null || to === null || from === to || amount <= 0) {
      this.showToast('Invalid transfer details');
      return;
    }

    const cards = [...this.cards()];
    if (cards[from].balance < amount) {
      this.showToast('Insufficient balance');
      return;
    }

    cards[from].balance -= amount;
    cards[to].balance += amount;

    this.cards.set(cards);
    this.showToast(`Transferred $${amount} to ${cards[to].username}`);
    this.transferAmount = 0;
    this.transferTargetIndex = null;
    this.showTransferSection.set(false);
  }

  toggleTransferSection() {
    this.showTransferSection.update((v) => !v);
  }

  showTransferLinkModal() {
    this.shouldShowTransferLinkModal = true;
  }

  closeTransferLinkModal() {
    this.shouldShowTransferLinkModal = false;
  }

  showModal() {
    return this.showAddCardModal();
  }

  openModal() {
    this.showAddCardModal.set(true);
  }

  closeModal() {
    this.showAddCardModal.set(false);
  }

  addCard(newCard: PaymentCard) {
    const userCard: UserWithCardProps = {
      _id: Date.now().toString(),
      username: newCard.name,
      image: null,
      balance: newCard.balance ?? 0,
      background: newCard.background ?? '#8bb3ee',
      card: newCard,
    };

    this.cards.update((cards) => [...cards, userCard]);
    this.closeModal();
  }

  getSelectedBalance(): string {
    const index = this.selectedCardIndex();
    return index !== null ? `${this.cards()[index].balance}` : '0';
  }

  selectCard(index: number) {
    this.selectedCardIndex.set(index);
  }

  selectedCard() {
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
                //this.showToast(`Withdrew $${amount}`);
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
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userProfile');
    this.router.navigate(['/auth']);
  }
  toPaymentCard(user: UserWithCardProps): PaymentCard {
    return {
      number: user.card?.number?.toString() ?? '4254 2522 2442 7762',
      name: user.card?.name ?? user.username,
      expMonth: user.card?.expMonth ?? '01',
      expYear: user.card?.expYear ?? '27',
      cvv: user.card?.cvv ?? '533',
      type: user.card?.type ?? 'Visa',
      background:
        user.card?.background ??
        'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg',
      balance: user.balance ?? 0,
    };
  }
}

interface UserWithCardProps extends User {
  background: string;
  card?: PaymentCard;
}
