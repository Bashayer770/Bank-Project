import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-card',
  imports: [CommonModule],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.css',
})
export class PaymentCardComponent {
  @Input() card!: {
    number: string;
    name: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    type: string;
    background: string;
  };
  defaultBackground: string =
    'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg';

  // flipped = false;
  @Input() flipped: boolean = false;
  @Input() background: string = '';
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
    return (
      this.card.background ||
      'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg'
    );
  }
}
