import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';

import { UserDashboard } from './dashboard/user-dashboard/user-dashboard';
import { SellerDashboard } from './dashboard/seller-dashboard/seller-dashboard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  // Authentication
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  // Dashboards
  {
    path: 'user-dashboard',
    component: UserDashboard,
  },

  {
    path: 'seller-dashboard',
    component: SellerDashboard,
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
  },
];
