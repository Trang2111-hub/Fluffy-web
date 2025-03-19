import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product-detail.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product: Product | null = null;
  quantity: number = 1;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  relatedProducts: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Lấy product ID từ URL và chuyển thành số
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (!isNaN(id)) {
        this.productId = id;
        this.loadProductDetails();
      } else {
        this.error = 'ID sản phẩm không hợp lệ';
        this.loading = false;
      }
    });
  }

  loadProductDetails() {
    this.loading = true;
    
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.selectedColor = data.color?.selected_colors?.[0] || null;
        this.selectedSize = data.size?.available_sizes?.[0] || null;
        this.loading = false;
        
        // Sau khi lấy thông tin sản phẩm, lấy các sản phẩm liên quan
        this.loadRelatedProducts();
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin sản phẩm:', err);
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts() {
    this.productService.getRelatedProducts(this.productId).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm liên quan:', err);
      }
    });
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

  selectSize(size: string) {
    this.selectedSize = size;
  }

  calculateOriginalPrice(discountedPrice: string, discountPercentage: string): string {
    // Chuyển đổi giá từ chuỗi "xxx.xxx đ" thành số
    const priceValue = parseFloat(discountedPrice.replace(/\./g, '').replace(' đ', ''));
    const discountValue = parseFloat(discountPercentage.replace('%', ''));
    
    if (isNaN(priceValue) || isNaN(discountValue)) {
      return discountedPrice;
    }
    
    // Tính giá gốc
    const originalPrice = priceValue / (1 - discountValue / 100);
    
    // Format giá gốc về dạng "xxx.xxx đ"
    return new Intl.NumberFormat('vi-VN').format(originalPrice) + ' đ';
  }

  addToCart() {
    if (!this.product) return;
    
    // TODO: Thêm vào giỏ hàng
    console.log('Adding to cart:', {
      product: this.product,
      quantity: this.quantity,
      color: this.selectedColor,
      size: this.selectedSize
    });
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/payment']);
  }

  navigateToRelatedProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}