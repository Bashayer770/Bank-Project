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

  goToHome() {
    console.log('home');
    this.router.navigate(['/home']);
  }
  goToProfile() {
    console.log('home2');
    this.router.navigate(['/profile']);
  }
  goToUsers() {
    this.router.navigate(['/users']);
  }
  goToTransactions() {
    this.router.navigate(['/transactions']);
    console.log(this.router.url);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userProfile');
    this.router.navigate(['/auth']);
  }
}
