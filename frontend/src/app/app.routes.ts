import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';

import { UserDashboard } from './dashboard/user-dashboard/user-dashboard';
import { SellerDashboard } from './dashboard/seller-dashboard/seller-dashboard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';
import { Explore } from './dashboard/user-dashboard/explore/explore';
import { PropertyDetails } from './dashboard/user-dashboard/property-details/property-details';
import { AuctionDetails } from './dashboard/user-dashboard/auction-details/auction-details';
import { Auctions } from './dashboard/user-dashboard/auctions/auctions';

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
  {
    path:'user-dashboard/explore',
    component:Explore
  },
  {
  path: 'user-dashboard/property/:id',
  component: PropertyDetails
}
,
{
  path: 'user-dashboard/auction/:id',
  component: AuctionDetails
},
{
  path: 'user-dashboard/auctions',
  component: Auctions
}
];
