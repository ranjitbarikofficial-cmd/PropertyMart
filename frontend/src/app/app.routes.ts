
import { Routes } from '@angular/router';

import { Home } from './homepage/home/home';
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
import { Favorites } from './dashboard/user-dashboard/favorites/favorites';
import { Applications } from './dashboard/user-dashboard/applications/applications';
import { Bookings } from './dashboard/user-dashboard/bookings/bookings';
import { Profile } from './dashboard/user-dashboard/profile/profile';

import { AddProperty } from './seller/add-property/add-property';
import { CreateAuction } from './dashboard/seller-dashboard/create-auction/create-auction';
import { SellerAuctions } from './dashboard/seller-dashboard/seller-auctions/seller-auctions';
import { AuctionBids } from './dashboard/seller-dashboard/auction-bids/auction-bids';
import { MyProperties } from './dashboard/seller-dashboard/my-properties/my-properties';
import { EditProperty } from './dashboard/seller-dashboard/edit-property/edit-property';

import { Users } from './dashboard/admin-dashboard/users/users';
import { Seller } from './dashboard/admin-dashboard/seller/seller';
import { Property } from './dashboard/admin-dashboard/property/property';
import { Auction } from './dashboard/admin-dashboard/auction/auction';
import { Winner } from './dashboard/admin-dashboard/winner/winner';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'home',
    component: Home,
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
    path: 'user-dashboard/explore',
    component: Explore,
  },
  {
    path: 'user-dashboard/property/:id',
    component: PropertyDetails,
  },
  {
    path: 'user-dashboard/auction/:id',
    component: AuctionDetails,
  },
  {
    path: 'user-dashboard/auctions',
    component: Auctions,
  },
  {
    path: 'user-dashboard/favorites',
    component: Favorites,
  },
  {
    path: 'user-dashboard/applications',
    component: Applications,
  },
  {
    path: 'user-dashboard/bookings',
    component: Bookings,
  },
  {
    path: 'user-dashboard/profile',
    component: Profile,
  },
  {
    path: 'user/settings',
    component: Profile,
  },
  {
    path: 'seller-dashboard/add-property',
    component: AddProperty,
  },
  {
    path: 'seller-dashboard/my-properties',
    component: MyProperties,
  },
  {
    path: 'seller-dashboard/edit-property/:id',
    component: EditProperty,
  },
  {
    path: 'seller-dashboard/profile',
    component: Profile,
  },
  {
    path: 'seller-dashboard/settings',
    component: Profile,
  },
  {
    path: 'seller-dashboard/create-auction/:id',
    component: CreateAuction,
  },
  {
    path: 'seller-dashboard/auctions',
    component: SellerAuctions,
  },
  {
    path: 'seller-dashboard/auctions/:id/bids',
    component: AuctionBids,
  },
  {
    path: 'admin-dashboard/users',
    component: Users,
  },
  {
    path: 'admin-dashboard/seller',
    component: Seller,
  },
  {
    path: 'admin-dashboard/property',
    component: Property,
  },
  {
    path: 'admin-dashboard/auction',
    component: Auction,
  },
  {
    path: 'admin-dashboard/winner',
    component: Winner,
  },
];
