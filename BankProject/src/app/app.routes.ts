import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { AuthWrapperComponent } from './components/auth-wrapper/auth-wrapper.component';
import { TransferLinkComponent } from './pages/transfer-link/transfer-link.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UsersListComponent } from './pages/users/users.component';

export const routes: Routes = [
  {
    path: 'transferLink',
    component: TransferLinkComponent,
  },
  { path: 'auth', component: AuthWrapperComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
  // { path: '**', redirectTo: 'login' },
];
