import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true, 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule,  RouterModule] 
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreeToTerms: boolean = false;
  errorMessage: string = '';
  constructor(
    private router: Router
  ) {}

  onSignup() {
    console.log('Button clicked!'); 
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không trùng khớp!';
      return;
    }
    if (!this.agreeToTerms) {
      this.errorMessage = 'Bạn cần đồng ý với điều khoản!';
      return;
    }

    alert(`Đăng ký thành công!\nEmail: ${this.email}`);
    this.errorMessage = '';
  }
}

