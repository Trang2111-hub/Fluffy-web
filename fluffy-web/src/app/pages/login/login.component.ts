import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin(event: Event) {
    event.preventDefault(); 

    if (this.email === 'admin@example.com' && this.password === '123456') {
      alert('Đăng nhập thành công!');
    } else {
      alert('Email hoặc mật khẩu không đúng, vui lòng thử lại!');
    }
  }
}
