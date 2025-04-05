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
  totalQuantity = 0;

  // Danh sách gợi ý (có thể lấy từ API hoặc định nghĩa tĩnh)
  cities: string[] = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng']; // Ví dụ
  districts: string[] = ['Ba Đình', 'Hoàn Kiếm', 'Quận 1', 'Quận 3']; // Ví dụ
  wards: string[] = ['Phúc Xá', 'Trúc Bạch', 'Phường 1', 'Phường 2']; // Ví dụ

  // Lịch sử nhập liệu
  cityHistory: string[] = [];
  districtHistory: string[] = [];
  wardHistory: string[] = [];

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

    // Tải lịch sử từ localStorage
    this.loadHistory();
  }

  calculateTotal() {
    this.totalAmount = this.checkoutProducts.reduce((total, product) => {
      return total + (product.totalPrice || 0);
    }, 0);
    this.totalQuantity = this.checkoutProducts.reduce((total, product) => {
      return total + (product.quantity || 0);
    }, 0);
  }

  // Tải lịch sử từ localStorage
  loadHistory() {
    this.cityHistory = JSON.parse(localStorage.getItem('cityHistory') || '[]');
    this.districtHistory = JSON.parse(localStorage.getItem('districtHistory') || '[]');
    this.wardHistory = JSON.parse(localStorage.getItem('wardHistory') || '[]');
  }

  // Lưu giá trị vào lịch sử
  saveToHistory(field: 'city' | 'district' | 'ward', value: string) {
    if (!value) return;

    let historyArray: string[];
    let storageKey: string;

    switch (field) {
      case 'city':
        historyArray = this.cityHistory;
        storageKey = 'cityHistory';
        break;
      case 'district':
        historyArray = this.districtHistory;
        storageKey = 'districtHistory';
        break;
      case 'ward':
        historyArray = this.wardHistory;
        storageKey = 'wardHistory';
        break;
      default:
        return;
    }

    // Chỉ lưu nếu giá trị chưa tồn tại trong lịch sử
    if (!historyArray.includes(value)) {
      historyArray.unshift(value); // Thêm vào đầu danh sách
      if (historyArray.length > 5) historyArray.pop(); // Giới hạn 5 mục
      localStorage.setItem(storageKey, JSON.stringify(historyArray));
    }
  }

  // Xử lý khi thay đổi giá trị
  onInputChange(field: 'city' | 'district' | 'ward') {
    const value = this.orderDetails[field];
    this.saveToHistory(field, value);
  }

  onSubmit() {
    if (this.isFormValid()) {
      // Lưu lịch sử trước khi submit
      this.saveToHistory('city', this.orderDetails.city);
      this.saveToHistory('district', this.orderDetails.district);
      this.saveToHistory('ward', this.orderDetails.ward);
      alert('Đơn hàng đã được đặt thành công!');
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }

  isFormValid() {
    return this.orderDetails.name && this.orderDetails.email && this.orderDetails.phone &&
           this.orderDetails.city && this.orderDetails.district && this.orderDetails.ward;
  }

  applyPromo() {
    alert('Chức năng chọn mã khuyến mãi đang được phát triển!');
  }
}