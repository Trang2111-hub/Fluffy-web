import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  // Cập nhật đối tượng orderDetails với tất cả các trường cần thiết
  orderDetails = {
    name: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    address: '',
    note: '',
    giftWrap: false,
    vacuumSeal: false,
    paymentMethod: ''
  };
  constructor(
    private router: Router
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      alert('Đơn hàng đã được đặt thành công!');
      // Thực hiện các thao tác như gửi thông tin qua API hoặc các xử lý khác.
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  isFormValid() {
    return this.orderDetails.name && this.orderDetails.email && this.orderDetails.phone && this.orderDetails.city && this.orderDetails.district && this.orderDetails.ward;
  }
}
