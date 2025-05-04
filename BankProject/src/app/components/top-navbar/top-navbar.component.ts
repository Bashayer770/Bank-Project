import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navbar',
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css',
})
export class TopNavbarComponent {
  isMenuOpen = signal(false);

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
