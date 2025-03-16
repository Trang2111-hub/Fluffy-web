import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { HomePageComponent } from './pages/home-page/home-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductPageComponent } from './pages/product-page/product-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ProductDetailComponent, LoginComponent, SignupComponent, PaymentComponent, HomePageComponent, CommonModule, ReactiveFormsModule, AccountSettingsComponent, ProductPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fluffy-web';
}
