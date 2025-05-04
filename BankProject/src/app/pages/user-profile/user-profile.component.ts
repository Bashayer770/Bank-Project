import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/Users';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.usersService
      .getMyProfile()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error fetching user profile:', err);
          this.error = 'Failed to load user profile. Please try again later.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((userData: User | null) => {
        this.user = userData;
        this.loading = false;
      });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.uploadProfileImage(file);
    }
  }

  uploadProfileImage(file: File): void {
    this.loading = true;
    this.error = null;

    this.usersService
      .updateUser(file)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.error = 'Failed to upload image. Please try again.';
          this.loading = false;
          this.loadUserProfile();
          return of(null);
        })
      )
      .subscribe((updatedUser: User | null) => {
        if (updatedUser) {
          this.user = updatedUser;
          console.log('Profile image updated successfully!');
        }
        this.loading = false;
      });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'profileImageInput'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
  goHome() {
    this.router.navigate(['/home']);
  }
}
