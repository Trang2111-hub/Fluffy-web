import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  quantity: number = 1;
  selectedColor: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Lấy product ID từ URL
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      // Gọi service để lấy thông tin sản phẩm
      this.loadProductDetails();
    });
  }

  loadProductDetails() {
    // TODO: Gọi service để lấy thông tin sản phẩm
    console.log('Loading product details for ID:', this.productId);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  addToCart() {
    // TODO: Thêm vào giỏ hàng
    console.log('Adding to cart:', {
      productId: this.productId,
      quantity: this.quantity,
      color: this.selectedColor
    });
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/payment']);
  }

  navigateToRelatedProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
