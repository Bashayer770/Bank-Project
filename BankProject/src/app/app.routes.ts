import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';

export const routes: Routes = [
  { path: 'auth', component: AuthWrapperComponent },
  { path: 'home', component: HomeComponent },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard]},
  // { path: '**', redirectTo: 'login' },
];

