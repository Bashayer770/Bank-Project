import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';

@Component({
  selector: 'app-root',
  imports: [MyProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'BankProject';
}
