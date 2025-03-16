import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';  // Thêm FormsModule

interface Product {
  title: string;
  price: number;
  discountPercentage: number;
  images: string[];
  category: string;
  stock: boolean;
  quantity: number;
  totalPrice: number;
  selected: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule],  // Đảm bảo đã import CommonModule và FormsModule
  standalone: true  // Đánh dấu component này là standalone
})
export class CartComponent implements OnInit {
  products: Product[] = []; // Khai báo mảng sản phẩm
  totalAmount = 0;
  selectAll = false;

  constructor() {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => {
        this.products = data.products.slice(0, 4).map((product: any) => ({
          ...product,
          quantity: 1,
          totalPrice: product.price,  // Khởi tạo totalPrice
          selected: false,  // Khởi tạo selected
        }));
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      });
  }

  updateTotalAmount() {
    // Cập nhật totalAmount bằng cách tính tổng giá trị của các sản phẩm đã được chọn
    this.totalAmount = this.products.reduce((total, product) => {
      return total + (product.selected ? product.totalPrice : 0);
    }, 0);
  }

  updateProductTotalPrice(product: Product) {
    product.totalPrice = product.price * product.quantity;
    this.updateTotalAmount();
  }

  changeQuantity(product: Product, increment: boolean) {
    if (increment) {
      product.quantity++;
    } else if (product.quantity > 1) {
      product.quantity--;
    }
    this.updateProductTotalPrice(product);
  }

  toggleSelectProduct(product: Product) {
    product.selected = !product.selected;  // Đảo trạng thái chọn của sản phẩm
    this.updateTotalAmount();  // Cập nhật lại tổng khi chọn hoặc bỏ chọn
  }

  toggleSelectAll() {
    // Khi click vào "Chọn tất cả", cập nhật trạng thái của selectAll và các sản phẩm
    this.selectAll = !this.selectAll;
    this.products.forEach(product => product.selected = this.selectAll);
    this.updateTotalAmount();  // Cập nhật lại tổng khi chọn tất cả
  }

  deleteAll() {
    this.products = [];
    this.totalAmount = 0;
  }

  deleteProduct(product: Product) {
    const index = this.products.indexOf(product);
    if (index > -1) {
      this.products.splice(index, 1);
      this.updateTotalAmount();
    }
  }
}
