import { Component } from '@angular/core';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(private userService: UsersService) {}

  getAllUsers() {
    return this.userService.getAllUsers();
  }
  getUserbyID(id: number) {
    return this.userService.getUserbyID(id);
  }
}
