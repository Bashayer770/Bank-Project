import { Component, computed, inject, Input, signal } from '@angular/core';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AddCardModalComponent } from '../add-card-modal/add-card-modal.component';
import { PaymentCard } from '../../models/card';

@Component({
  selector: 'app-payment-card-list',
  imports: [PaymentCardComponent, CommonModule, AddCardModalComponent],
  templateUrl: './payment-card-list.component.html',
  styleUrl: './payment-card-list.component.css',
})
export class PaymentCardListComponent {
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
      balance: 1000,
    },
  ]);

  showModal = signal(false);
  selectedIndex = signal(0);

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  addCard(newCard: PaymentCard) {
    this.cards.update((cards) => [...cards, newCard]);
  }
  hideModal() {
    this.showModal.set(false);
  }
  addManualCard(card: PaymentCard) {
    this.cards.update((prev) => [...prev, card]);
    this.selectedIndex.set(this.cards().length);
  }

  selectedCard = computed(() => this.cards()[this.selectedIndex()]);

  selectCard(index: number) {
    this.selectedIndex.set(index);
  }

  addRandomCard() {
    const types = ['visa', 'mastercard', 'amex'];
    const type = types[Math.floor(Math.random() * types.length)] as
      | 'visa'
      | 'mastercard'
      | 'amex';

    const newCard: PaymentCard = {
      number: this.generateCardNumber(type),
      name: 'New User',
      expMonth: this.padZero(Math.floor(Math.random() * 12) + 1),
      expYear: (
        new Date().getFullYear() + Math.floor(Math.random() * 5 + 1)
      ).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      type,
      background:
        'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg',
      balance: 0,
    };

    this.cards.update((prev) => [...prev, newCard]);
    this.selectedIndex.set(this.cards().length);
  }

  generateCardNumber(type: string): string {
    let digits = '';
    if (type === 'visa') digits = `4${this.randomDigits(15)}`;
    else if (type === 'mastercard') digits = `5${this.randomDigits(15)}`;
    else if (type === 'amex') digits = `34${this.randomDigits(13)}`;
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  randomDigits(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      ''
    );
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
