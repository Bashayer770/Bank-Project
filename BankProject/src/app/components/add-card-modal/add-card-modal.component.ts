import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentCardComponent } from '../payment-card/payment-card.component';
import { PaymentCard } from '../../models/card';

@Component({
  selector: 'app-add-card-modal',
  imports: [CommonModule, FormsModule, PaymentCardComponent],
  templateUrl: './add-card-modal.component.html',
  styleUrl: './add-card-modal.component.css',
})
export class AddCardModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<PaymentCard>();
  @Input() username: string | undefined;

  flipped = false;
  selectedSkin: string = 'default-skin';
  expiry: string = '';

  skins = [
    'https://static.vecteezy.com/system/resources/thumbnails/038/199/591/small_2x/orange-background-design-with-gradient-wavy-fluid-shapes-abstract-wallpaper-suitable-for-businesses-selling-banners-ads-events-templates-pages-and-others-vector.jpg',
    'https://wallpapers.com/images/hd/black-and-orange-7680-x-4320-wallpaper-uv67y369elj4cgpb.jpg',
    'https://t3.ftcdn.net/jpg/06/77/22/98/360_F_677229846_W5DmCWzuoSe9F0cOwUYqt4bcU9WmnZqi.jpg',
    'https://c4.wallpaperflare.com/wallpaper/667/804/30/abstract-pattern-black-orange-design-wallpaper-thumb.jpg',
    'https://img.freepik.com/premium-vector/abstract-mesh-gradation-orange-color-background-template-with-fluid-style-vector_490655-998.jpg?semt=ais_hybrid&w=740',
    'https://media.istockphoto.com/id/2165041511/vector/abstract-black-and-gray-color-gradient-background.jpg?s=612x612&w=0&k=20&c=gqSsRRunIq39-mi5hm85tAJf93D-ds6D9mzDEm7kBp4=',
  ];

  card: PaymentCard = {
    number: '',
    name: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    type: 'visa',
    background: '',
    balance: 0,
  };

  // ngOnInit() {
  //   this.selectedSkin = this.skins[0];
  //   this.card.background = this.selectedSkin;
  // }

  ngOnInit() {
    this.selectedSkin = this.skins[0];
    this.card.background = this.selectedSkin;

    this.card.number = this.generateCardNumber();
    this.card.cvv = this.generateCVV();
    this.card.expMonth = this.padZero(Math.floor(Math.random() * 12) + 1);
    this.card.expYear = (new Date().getFullYear() + 3).toString();
    this.card.name = this.username ?? 'Unknown User';
    this.expiry = `${this.card.expMonth}/${this.card.expYear.slice(2)}`;
  }
  generateCardNumber(): string {
    const digits = `4${Array.from({ length: 15 }, () =>
      Math.floor(Math.random() * 10)
    ).join('')}`;
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  generateCVV(): string {
    return Math.floor(100 + Math.random() * 900).toString();
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  selectSkin(skin: string) {
    this.selectedSkin = skin;
    this.card.background = skin;
  }

  flipCard(status: boolean) {
    this.flipped = status;
  }

  onFocusCVV() {
    this.flipped = true;
  }

  onBlurCVV() {
    this.flipped = false;
  }

  sanitizeCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    this.card.number = input.value.replace(/\D/g, '').slice(0, 12);
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '').slice(0, 16);
    this.card.number = raw.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    this.expiry = value;
    this.card.expMonth = this.expiry.slice(0, 2);
    this.card.expYear = '20' + this.expiry.slice(3);
  }
  setSkin(skin: string) {
    this.selectedSkin = skin;
  }

  saveCard() {
    this.card.background = this.selectedSkin;
    this.save.emit(this.card);
    this.closeModal.emit();
  }
}
