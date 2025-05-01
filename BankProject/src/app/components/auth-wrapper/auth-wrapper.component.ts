import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-wrapper',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.css',
})
export class AuthWrapperComponent {
  activeForm: 'login' | 'register' = 'login';

  loading = false;
  errorMessage = '';

  loginData = {
    username: '',
    password: '',
  };

  registerData = {
    username: '',
    password: '',
    image: null as File | null,
  };

  constructor(private authService: AuthService, private router: Router) {}

  switchTo(form: 'login' | 'register') {
    this.activeForm = form;
    this.errorMessage = '';
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registerData.image = file;
    }
  }

  onRegisterSubmit() {
    if (!this.registerData.image) {
      this.errorMessage = 'Please upload a profile image.';
      return;
    }

    this.authService
      .register({
        username: this.registerData.username,
        password: this.registerData.password,
        image: this.registerData.image as File,
      })
      .subscribe({
        next: (res) => {
          console.log('register Payload:', this.registerData);
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed.';
        },
      });
  }

  onLoginSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login Payload:', this.loginData);
        sessionStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed.';
        this.loading = false;
      },
    });
  }
}
