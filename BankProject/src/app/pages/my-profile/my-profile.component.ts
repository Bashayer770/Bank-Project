import { Component } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../../models/Users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  constructor(private userService: UsersService) {}

  getMyProfile() {
    return this.userService
      .getMyProfile()
      .pipe(
        catchError((error) => {
          this.error = 'Failed to load user profile.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((user: User | null) => {
        this.user = user;
        this.loading = false;
      });
  }

  updateUser(image: File): Observable<User> {
    return this.userService.updateUser(image);
  }
}
