import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css',
})
export class TopNavbarComponent {
  isMenuOpen = signal(false);
  currentRoute = signal<string>('');
  constructor(private router: Router) {
    this.currentRoute.set(this.router.url);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
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
