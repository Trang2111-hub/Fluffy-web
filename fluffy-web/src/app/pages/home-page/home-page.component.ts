import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product-detail.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../services/product-detail.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule, ProductCardComponent, RouterModule],
  standalone: true
})
export class HomePageComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  slideInterval: any;
  discountedProducts: Product[] = [];
  displayedProducts: Product[] = [];
  bestSellingProducts: Product[] = [];
  displayedBestSelling: Product[] = [];
  currentProductIndex = 0;
  currentBestSellingIndex = 0;
  loading: boolean = true;
  error: string | null = null;
  productsPerPage = 4;
  displayCount: number = 4;
  isFavorite: boolean = false;

  // Các biến cho sản phẩm
  quantity: number = 1;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  product: Product | null = null;

  slides = [
    "https://theme.hstatic.net/200000856317/1001220433/14/slide_1_mb.jpg?v=324",
    "/assets/images/homepage/2.png",
    "/assets/images/homepage/3.png"
  ];

  // Banner properties
  banners = this.slides;
  currentBannerIndex: number = 0;
  currentBanner: string = this.banners[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.updateDisplayCount();
  }

  ngOnInit() {
    this.startAutoSlide();
    this.loadDiscountedProducts();
    this.loadBestSellingProducts();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
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
    // Reset auto slide timer when manually changing slides
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Changed to 5 seconds for better UX
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDisplayCount();
  }

  private updateDisplayCount() {
    this.displayCount = window.innerWidth <= 1280 ? 3 : 4;
  }

  loadDiscountedProducts() {
    this.loading = true;
    this.error = null;

    const productIds = Array.from({length: 10}, (_, i) => i + 45); 
    const promises = productIds.map(id => 
      this.productService.getProductById(id).toPromise()
    );

    Promise.all(promises)
      .then(products => {
        this.discountedProducts = products.filter(p => p !== null) as Product[];
        this.updateDisplayedProducts();
        this.loading = false;
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm khuyến mãi:', error);
        this.error = 'Không thể tải sản phẩm khuyến mãi';
        this.loading = false;
      });
  }

  updateDisplayedProducts() {
    const start = this.currentProductIndex;
    const end = start + this.productsPerPage;
    this.displayedProducts = this.discountedProducts.slice(start, end);
  }

  nextProducts() {
    const maxStartIndex = Math.max(0, this.discountedProducts.length - this.productsPerPage);
    this.currentProductIndex = Math.min(this.currentProductIndex + this.productsPerPage, maxStartIndex);
    this.updateDisplayedProducts();
  }

  prevProducts() {
    this.currentProductIndex = Math.max(0, this.currentProductIndex - this.productsPerPage);
    this.updateDisplayedProducts();
  }

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

  loadBestSellingProducts() {
    const productIds = [75, 76, 77, 78, 79, 80, 81, 82, 83];
    const promises = productIds.map(id => 
      this.productService.getProductById(id).toPromise()
    );

    Promise.all(promises)
      .then(products => {
        this.bestSellingProducts = products.filter(p => p !== null) as Product[];
        this.updateDisplayedBestSelling();
      })
      .catch(error => {
        console.error('Error loading best selling products:', error);
        this.error = 'Không thể tải sản phẩm bán chạy';
      });
  }

  updateDisplayedBestSelling() {
    const start = this.currentBestSellingIndex;
    const end = start + this.productsPerPage;
    this.displayedBestSelling = this.bestSellingProducts.slice(start, end);
  }

  nextBestSelling() {
    const maxStartIndex = Math.max(0, this.bestSellingProducts.length - this.productsPerPage);
    this.currentBestSellingIndex = Math.min(this.currentBestSellingIndex + this.productsPerPage, maxStartIndex);
    this.updateDisplayedBestSelling();
  }

  prevBestSelling() {
    this.currentBestSellingIndex = Math.max(0, this.currentBestSellingIndex - this.productsPerPage);
    this.updateDisplayedBestSelling();
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  showBanner(index: number) {
    this.currentBannerIndex = index;
    this.currentBanner = this.banners[index];
  }

  benefits = [
    { icon: 'https://img.icons8.com/?size=100&id=pxWwSVIqQ14n&format=png&color=EB5265', title: 'KHUYẾN MÃI LIÊN TỤC', description: 'Có rất nhiều deal hot, voucher, mã giảm giá' },
    { icon: 'https://img.icons8.com/?size=100&id=Cgu81kzSlCZy&format=png&color=EB5265', title: 'TƯ VẤN TRỰC TUYẾN', description: 'Được tư vấn kỹ càng, tận tình và nhanh chóng' },
    { icon: 'https://img.icons8.com/?size=100&id=487&format=png&color=EB5265', title: 'GIAO HÀNG NHANH', description: 'Giao hàng nhanh chóng, đóng gói cẩn thận' },
    { icon: 'https://img.icons8.com/?size=100&id=2i2jDnoEm4ER&format=png&color=EB5265', title: 'SẢN PHẨM THIẾT KẾ ĐỘC QUYỀN', description: 'Các loại thú bông độc quyền chỉ có tại nhà FLUFFY' }
  ];
}
