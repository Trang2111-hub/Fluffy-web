import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartComponent } from '../cart/cart.component';

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

  constructor(
    private router: Router,
    private cartService: CartService,
    private elementRef: ElementRef // Để truy cập DOM
  ) {}

  ngOnInit() {
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

  // Đóng popup khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInsidePopup = this.elementRef.nativeElement.querySelector('.order-tracking-popup')?.contains(target);
    const clickedOnLink = this.elementRef.nativeElement.querySelector('.order-tracking-link')?.contains(target);

    if (!clickedInsidePopup && !clickedOnLink && this.isOrderTrackingPopupOpen) {
      this.isOrderTrackingPopupOpen = false;
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
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

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.isUserMenuOpen = false;
    this.router.navigate(['/']);
  }

  toggleOrderTrackingPopup(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOrderTrackingPopupOpen = !this.isOrderTrackingPopupOpen;
  }
}