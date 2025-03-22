import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,  RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

    constructor(
      private router: Router
    ) {}

  // Toggle hiển thị mật khẩu
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Xử lý đăng nhập
  onLogin(event: Event) {
    event.preventDefault(); // Ngừng hành động mặc định của form

    // Kiểm tra đăng nhập giả lập
    if (this.email === 'admin@example.com' && this.password === '123456') {
      alert('Đăng nhập thành công!');
    } else {
      alert('Email hoặc mật khẩu không đúng, vui lòng thử lại!');
    }
  }
}
