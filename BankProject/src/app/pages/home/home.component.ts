import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';
import { AddCardModalComponent } from '../../components/add-card-modal/add-card-modal.component';

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
  constructor(private router: Router) {}

  cards = signal([
    {
      number: '4242 4242 4242 4242',
      name: 'John Doe',
      expMonth: '12',
      expYear: '2027',
      cvv: '123',
      type: 'visa',
      background:
        'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg',
      balance: 1000,
    },
  ]);

  selectedCardIndex = signal<number | null>(null);
  showAddCardModal = signal(false);
  transactionAmount = 0;
  toastMessage = signal<string | null>(null);

  showModal() {
    return this.showAddCardModal();
  }

  openModal() {
    this.showAddCardModal.set(true);
  }

  closeModal() {
    this.showAddCardModal.set(false);
  }

  addCard(newCard: any) {
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

  selectedCard() {
    const index = this.selectedCardIndex();
    return index !== null ? this.cards()[index] : null;
  }

  deposit(index: number | null, amount: number) {
    if (index === null || amount <= 0) return;
    this.cards.update((cards) => {
      cards[index].balance += amount;
      return [...cards];
    });
    this.showToast(`Deposited $${amount}`);
  }

  withdraw(index: number | null, amount: number) {
    if (index === null || amount <= 0) return;
    this.cards.update((cards) => {
      if (cards[index].balance >= amount) {
        cards[index].balance -= amount;
        this.showToast(`Withdrew $${amount}`);
      } else {
        this.showToast('Insufficient funds');
      }
      return [...cards];
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
    this.router.navigate(['/auth']);
  }
}
