import { CommonModule } from '@angular/common';
import { Component, Input, input, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  toastMessage = signal<string | null>(null);
  @Input() toastMsg: string = '';

  showToast(message: string) {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
