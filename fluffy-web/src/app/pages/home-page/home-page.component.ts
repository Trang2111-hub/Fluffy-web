import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product-detail.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component'; 
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
    imports: [CommonModule, ProductCardComponent,RouterModule],
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
  currentIndex = 0;
  slideInterval: any;
  discountedProducts: Product[] = [];
  loading: boolean = true;
  error: string | null = null;
  displayCount: number = 4;
  isFavorite: boolean = false;

  // Các biến cho sản phẩm
  quantity: number = 1;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  product: Product | null = null;


  slides = [
    "https://theme.hstatic.net/200000856317/1001220433/14/slide_1_mb.jpg?v=324",
    "../../assets/images/homepage/2.png",
    "../../assets/images/homepage/3.png" 
  ];

  ngOnInit() {
    this.startAutoSlide(); 
    this.loadDiscountedProducts(); 
  }

  getTransformStyle() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  currentSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

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
// SAN PHAM KHUYEN MAI
  loadDiscountedProducts() {
    this.loading = true;
  
    const categoryId = 1;
    this.productService.getDiscountedProducts(categoryId).subscribe({
      next: (products) => {
        console.log("Sản phẩm khuyến mãi đã lấy được:", products);
        this.discountedProducts = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm khuyến mãi:', err);
        this.loading = false;
        this.error = 'Không thể lấy dữ liệu sản phẩm';
      }
    });
  }

  
  // Phương thức để tính discount price
  calculateDiscountPrice(originalPrice: string, discountPercentage: string): string {
    const priceValue = parseFloat(originalPrice.replace('₫', '').replace(',', '').trim());
    const discountValue = parseFloat(discountPercentage.replace('%', '').trim());

    if (isNaN(priceValue) || isNaN(discountValue)) {
      return originalPrice;  
    }

    const discountPrice = priceValue - (priceValue * discountValue / 100);
    return new Intl.NumberFormat('vi-VN').format(discountPrice) + '₫'; 
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
    const priceValue = parseFloat(discountedPrice.replace(/\./g, '').replace(' đ', ''));
    const discountValue = parseFloat(discountPercentage.replace('%', ''));
    
    if (isNaN(priceValue) || isNaN(discountValue)) {
      return discountedPrice;
    }
    
    const originalPrice = priceValue / (1 - discountValue / 100);
    return new Intl.NumberFormat('vi-VN').format(originalPrice) + ' đ';
  }


  addToCart() {
    if (!this.product) return;
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

  navigateToDiscountedProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }


  benefits = [
    { icon: 'https://img.icons8.com/?size=100&id=pxWwSVIqQ14n&format=png&color=EB5265', title: 'KHUYẾN MÃI LIÊN TỤC', description: 'Có rất nhiều deal hot, voucher, mã giảm giá' },
    { icon: 'https://img.icons8.com/?size=100&id=Cgu81kzSlCZy&format=png&color=EB5265', title: 'TƯ VẤN TRỰC TUYẾN', description: 'Được tư vấn kỹ càng, tận tình và nhanh chóng' },
    { icon: 'https://img.icons8.com/?size=100&id=487&format=png&color=EB5265', title: 'GIAO HÀNG NHANH', description: 'Giao hàng nhanh chóng, đóng gói cẩn thận' },
    { icon: 'https://img.icons8.com/?size=100&id=2i2jDnoEm4ER&format=png&color=EB5265', title: 'SẢN PHẨM THIẾT KẾ ĐỘC QUYỀN', description: 'Các loại thú bông độc quyền chỉ có tại nhà FLUFFY' }
  ];

}
