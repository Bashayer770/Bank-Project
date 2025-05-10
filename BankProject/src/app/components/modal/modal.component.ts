import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ClosesvgComponent } from '../../svg/closesvg/closesvg.component';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CopysvgComponent } from '../../svg/copysvg/copysvg.component';
import { UsersService } from '../../services/users/users.service';
import { User } from '../../models/Users';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ClosesvgComponent, CommonModule, FormsModule, CopysvgComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  transactionAmount: number | null = null;

  shouldShowLink = false;

  toastMessage = signal<string | null>(null);

  constructor(private userService: UsersService) {}

  close() {
    this.closeModal.emit();
    this.shouldShowLink = false;
  }

  GenerateLink() {
    this.userService.getMyProfile().subscribe((response: User) => {
      if (response != null) {
        this.shouldShowLink = true;
        this.link = `http://localhost:4200/transferLink?user=${response.username}&amount=${this.transactionAmount}`;
      } else {
        this.showToast('Error occured');
      }
    });
  }

  CopyToClipboard() {
    this.copyText(this.link);
    this.showToast('Link Copied!');
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {},
      (err) => {
        console.error('Failed to copy!', err);
      }
    );
  }

  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
  link: string = '';
}
