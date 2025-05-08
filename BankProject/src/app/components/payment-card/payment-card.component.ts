import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PaymentCard } from '../../models/card';

@Component({
  selector: 'app-payment-card',
  imports: [CommonModule],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.css',
})
export class PaymentCardComponent {
  @Input() card!: PaymentCard;
  @Input() flipped: boolean = false;
  @Input() background: string = '';

  defaultBackground: string =
    'https://images.pexels.com/photos/6402424/pexels-photo-6402424.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';

  showSensitive = false;
  private hideTimeout: any;

  flip() {
    this.flipped = !this.flipped;
  }

  get maskedNumber() {
    return this.showSensitive
      ? this.card.number
      : this.card.number.replace(/.(?=.{4})/g, '*');
  }

  toggleSensitiveInfo() {
    this.showSensitive = true;
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.showSensitive = false;
    }, 3000);
  }

  getCardTypeImage(type: string): string {
    return `assets/${type}.png`;
  }

  getCardLogoSvg(type: string): string {
    switch (type) {
      case 'amex':
        return 'amex';
      case 'mastercard':
        return 'mastercard';
      case 'visa':
      default:
        return 'visa';
    }
  }

  get backgroundImg() {
    return this.card.background || this.defaultBackground;
  }
}
