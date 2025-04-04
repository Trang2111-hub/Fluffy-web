import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
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

  checkoutProducts: any[] = [];
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Flow 1: Lấy sản phẩm từ giỏ hàng
    this.cartService.getCheckoutProducts().subscribe(products => {
      this.checkoutProducts = products;
      this.calculateTotal();
    });

    // Flow 2: Lấy sản phẩm từ trang sản phẩm
    this.route.queryParams.subscribe(params => {
      if (params['product']) {
        const product = JSON.parse(params['product']);
        this.checkoutProducts = [product];
        this.calculateTotal();
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.checkoutProducts.reduce((total, product) => {
      return total + product.totalPrice;
    }, 0);
  }

  onSubmit() {
    if (this.isFormValid()) {
      alert('Đơn hàng đã được đặt thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  isFormValid() {
    return this.orderDetails.name && this.orderDetails.email && this.orderDetails.phone && 
           this.orderDetails.city && this.orderDetails.district && this.orderDetails.ward;
  }

  // Thêm để xử lý sự kiện "Chọn mã"
  applyPromo() {
    alert('Chức năng chọn mã khuyến mãi đang được phát triển!');
  }
}