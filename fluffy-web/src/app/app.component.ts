import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { CollectionComponent } from './pages/collection/collection.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoginComponent, SignupComponent, PaymentComponent, CollectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fluffy-web';
}
