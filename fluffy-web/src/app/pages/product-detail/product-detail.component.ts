import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product-detail.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
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
  displayCount: number = 4;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.updateDisplayCount();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDisplayCount();
  }

  private updateDisplayCount() {
    this.displayCount = window.innerWidth <= 1280 ? 3 : 4;
  }

  ngOnInit() {
    // Lấy product ID từ URL và chuyển thành số
    this.route.params.subscribe({
      next: (params) => {
        const id = parseInt(params['id']);
        if (!isNaN(id)) {
          this.productId = id;
          this.loadProductDetails();
        } else {
          this.error = 'ID sản phẩm không hợp lệ';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy params:', error);
        this.error = 'Có lỗi xảy ra';
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

  calculateDiscountedPrice(originalPrice: string, discountPercentage: string): string {
    const price = parseFloat(originalPrice.replace(/[,.]/g, ''));
    const discount = parseFloat(discountPercentage);
    if (isNaN(price) || isNaN(discount)) return originalPrice;
    
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice.toLocaleString('vi-VN') + 'đ';
  }

  addToCart() {
    if (!this.product) return;
    
    // // TODO: Thêm vào giỏ hàng
    // console.log('Adding to cart:', {
    //   product: this.product,
    //   quantity: this.quantity,
    //   color: this.selectedColor,
    //   size: this.selectedSize
    // });
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/payment']);
  }

  navigateToRelatedProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}