import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentCardComponent } from '../payment-card/payment-card.component';

@Component({
  selector: 'app-add-card-modal',
  imports: [CommonModule, FormsModule, PaymentCardComponent],
  templateUrl: './add-card-modal.component.html',
  styleUrl: './add-card-modal.component.css',
})
export class AddCardModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  @Output() save = new EventEmitter<any>();

  flipped = false;

  skins = [
    'https://img.freepik.com/free-vector/gradient-abstract-wireframe-background_23-2149009903.jpg?semt=ais_hybrid&w=740',
    'https://images.freeimages.com/images/large-previews/a43/textured-gradient-background-0410-5697130.jpg?fmt=webp&w=500',
    'https://w0.peakpx.com/wallpaper/957/892/HD-wallpaper-blue-gradient-2021-abstract-art-design-ultra-poster.jpg',
    'https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2021/09/gradient-blue-pink-abstract-art-wallpaper-preview-e1656162284223.jpg',
    'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/22.jpeg',
  ];
  selectedSkin: string = this.skins[0];
  card = {
    number: '',
    name: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    type: 'visa',
    background: this.selectedSkin,
  };
  expiry: string = '';

  ngOnInit() {
    this.card.background = this.selectedSkin;
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

    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();

    this.card.number = formatted;
  }
  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    this.expiry = value;

    this.card.expMonth = this.expiry.slice(0, 2);
    this.card.expYear = '20' + this.expiry.slice(3);
  }
  saveCard() {
    this.card.background = this.selectedSkin;
    this.save.emit(this.card);
    this.closeModal.emit();
  }
}
