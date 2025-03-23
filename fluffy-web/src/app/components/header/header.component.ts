import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isUserMenuOpen: boolean = false;
  cartItemCount: number = 0;
  isScrolled: boolean = false;
  isOrderTrackingPopupOpen: boolean = false;
  isDropdownVisible: boolean = false; 
  isCollectionDropdownVisible: boolean = false; 
  selectedCollection: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Đăng ký lắng nghe sự thay đổi trạng thái đăng nhập
    this.authService.loggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userName = this.authService.getUserName();
      } else {
        this.userName = '';
      }
    });

    // Kiểm tra trạng thái đăng nhập ban đầu
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
    }

    // Theo dõi số lượng sản phẩm trong giỏ hàng
    this.cartService.getCartItemCount().subscribe((count: number) => {
      this.cartItemCount = count;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    if (this.isScrolled) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Xử lý đóng popup tra cứu đơn hàng
    const clickedInsidePopup = this.elementRef.nativeElement.querySelector('.order-tracking-popup')?.contains(target);
    const clickedOnLink = this.elementRef.nativeElement.querySelector('.order-tracking-link')?.contains(target);
    if (!clickedInsidePopup && !clickedOnLink && this.isOrderTrackingPopupOpen) {
      this.isOrderTrackingPopupOpen = false;
    }
    
    // Xử lý đóng user menu khi click ngoài
    const userAccountContainer = this.elementRef.nativeElement.querySelector('.user-account-container');
    if (userAccountContainer && !userAccountContainer.contains(target) && this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    console.log('Navigating to login page');
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  navigateToAccountSettings() {
    this.router.navigate(['/account-settings']);
  }

  openCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.toggleCart();
  }

  toggleUserMenu(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigate(['/']);
  }

  toggleOrderTrackingPopup(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOrderTrackingPopupOpen = !this.isOrderTrackingPopupOpen;
  }

  // Logic cho dropdown SẢN PHẨM
  showDropdown() {
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.isDropdownVisible = false;
  }

  // Logic cho dropdown BỘ SƯU TẬP
  showCollectionDropdown() {
    this.isCollectionDropdownVisible = true;
  }

  hideCollectionDropdown() {
    this.isCollectionDropdownVisible = false;
  }

  filterByCollection(collection: string) {
    this.selectedCollection = collection;
    this.isDropdownVisible = false;
    this.isCollectionDropdownVisible = false;
    this.router.navigate(['/product-page'], {
      queryParams: { collection: collection || null }
    });
  }
}