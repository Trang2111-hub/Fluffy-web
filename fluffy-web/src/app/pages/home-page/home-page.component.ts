import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product-detail.service';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../services/product-detail.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Slide {
  image: string;
  title: string;
  description: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  currentSlideIndex = 0;
  slideInterval: number | null = null;
  discountedProducts: Product[] = [];
  displayedProducts: Product[] = [];
  bestSellingProducts: Product[] = [];
  displayedBestSelling: Product[] = [];
  currentProductIndex = 0;
  currentBestSellingIndex = 0;
  loading = true;
  error: string | null = null;
  productsPerPage = 4;
  displayCount = 4;
  isFavorite = false;

  // Form related properties
  form: FormGroup;

  // Product related properties
  quantity = 1;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  product: Product | null = null;

  slides: Slide[] = [
    {
      image: "https://theme.hstatic.net/200000856317/1001220433/14/slide_1_mb.jpg?v=324",
      title: "Bộ sưu tập mới nhất",
      description: "Khám phá những thiết kế độc đáo và thời trang"
    },
    {
      image: "../../assets/images/homepage/2.png",
      title: "Ưu đãi đặc biệt",
      description: "Giảm giá lên đến 50% cho các sản phẩm bán chạy"
    },
    {
      image: "../../assets/images/homepage/3.png",
      title: "Phong cách độc đáo",
      description: "Thể hiện cá tính của bạn với những thiết kế độc nhất"
    }
  ];

  benefits: Benefit[] = [
    {
      icon: "assets/icons/quality.png",
      title: "Chất lượng cao",
      description: "Sản phẩm được kiểm tra kỹ lưỡng"
    },
    {
      icon: "assets/icons/shipping.png",
      title: "Giao hàng nhanh",
      description: "Miễn phí vận chuyển"
    },
    {
      icon: "assets/icons/support.png",
      title: "Hỗ trợ 24/7",
      description: "Luôn sẵn sàng phục vụ"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.updateDisplayCount();
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.startAutoSlide();
    this.loadDiscountedProducts();
    this.loadBestSellingProducts();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  getTransformStyle(): string {
    return `translateX(-${this.currentSlideIndex * 100}%)`;
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  currentSlide(index: number): void {
    this.currentSlideIndex = index;
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startAutoSlide();
    }
  }

  startAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.slideInterval = window.setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDisplayCount();
  }

  private updateDisplayCount(): void {
    this.displayCount = window.innerWidth <= 1280 ? 3 : 4;
  }

  loadDiscountedProducts(): void {
    this.loading = true;
    this.error = null;

    const productIds = Array.from({length: 10}, (_, i) => i + 45); 
    const promises = productIds.map(id => 
      this.productService.getProductById(id).toPromise()
    );

    Promise.all(promises)
      .then(products => {
        this.discountedProducts = products.filter((p): p is Product => p !== null);
        this.updateDisplayedProducts();
        this.loading = false;
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm khuyến mãi:', error);
        this.error = 'Không thể tải sản phẩm khuyến mãi';
        this.loading = false;
      });
  }

  updateDisplayedProducts(): void {
    const start = this.currentProductIndex;
    const end = start + this.productsPerPage;
    this.displayedProducts = this.discountedProducts.slice(start, end);
  }

  nextProducts(): void {
    const maxStartIndex = Math.max(0, this.discountedProducts.length - this.productsPerPage);
    this.currentProductIndex = Math.min(this.currentProductIndex + this.productsPerPage, maxStartIndex);
    this.updateDisplayedProducts();
  }

  prevProducts(): void {
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

  calculateOriginalPrice(discountedPrice: string, discountPercentage: string): string {
    const priceValue = parseFloat(discountedPrice.replace(/\./g, '').replace(' đ', ''));
    const discountValue = parseFloat(discountPercentage.replace('%', ''));
    
    if (isNaN(priceValue) || isNaN(discountValue)) {
      return discountedPrice;
    }
    
    const originalPrice = priceValue / (1 - discountValue / 100);
    return new Intl.NumberFormat('vi-VN').format(originalPrice) + ' đ';
  }

  loadBestSellingProducts(): void {
    const productIds = [75, 76, 77, 78, 79, 80, 81, 82, 83];
    const promises = productIds.map(id => 
      this.productService.getProductById(id).toPromise()
    );

    Promise.all(promises)
      .then(products => {
        this.bestSellingProducts = products.filter((p): p is Product => p !== null);
        this.updateDisplayedBestSelling();
      })
      .catch(error => {
        console.error('Error loading best selling products:', error);
        this.error = 'Không thể tải sản phẩm bán chạy';
      });
  }

  updateDisplayedBestSelling(): void {
    const start = this.currentBestSellingIndex;
    const end = start + this.productsPerPage;
    this.displayedBestSelling = this.bestSellingProducts.slice(start, end);
  }

  nextBestSelling(): void {
    const maxStartIndex = Math.max(0, this.bestSellingProducts.length - this.productsPerPage);
    this.currentBestSellingIndex = Math.min(this.currentBestSellingIndex + this.productsPerPage, maxStartIndex);
    this.updateDisplayedBestSelling();
  }

  prevBestSelling(): void {
    this.currentBestSellingIndex = Math.max(0, this.currentBestSellingIndex - this.productsPerPage);
    this.updateDisplayedBestSelling();
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  showBanner(index: number): void {
    this.currentSlideIndex = index;
  }
}
