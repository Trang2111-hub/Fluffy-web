import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomePageComponent, CommonModule, ReactiveFormsModule, AccountSettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fluffy-web';
}
