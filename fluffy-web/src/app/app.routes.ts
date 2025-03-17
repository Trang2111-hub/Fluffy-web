import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  { 
    path: 'product/:id', 
    component: ProductDetailComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'signup', 
    component: SignupComponent 
  },
  { 
    path: 'payment', 
    component: PaymentComponent 
  },
  { 
    path: 'account-settings', 
    component: AccountSettingsComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
