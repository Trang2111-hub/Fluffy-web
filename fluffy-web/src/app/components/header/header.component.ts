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
  isDropdownVisible: boolean = false; // Dropdown cho SẢN PHẨM
  isCollectionDropdownVisible: boolean = false; // Dropdown cho BỘ SƯU TẬP
  selectedCollection: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private elementRef: ElementRef
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