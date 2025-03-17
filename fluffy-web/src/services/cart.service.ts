import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color?: string;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItems.asObservable();
  isCartOpen$ = this.isCartOpenSubject.asObservable();
  
  constructor() {
    // Khôi phục giỏ hàng từ localStorage khi service được khởi tạo
    this.loadCart();
  }
  
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems.next(JSON.parse(savedCart));
      } catch (error) {
        console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
        this.cartItems.next([]);
      }
    }
  }
  
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
  
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }
  
  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }
  
  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems$.subscribe(items => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }
  
  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      existingItem => existingItem.id === item.id && 
                      existingItem.color === item.color && 
                      existingItem.size === item.size
    );
    
    if (existingItemIndex !== -1) {
      // Sản phẩm đã tồn tại, cập nhật số lượng
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      this.cartItems.next(updatedItems);
    } else {
      // Thêm sản phẩm mới
      this.cartItems.next([...currentItems, item]);
    }
    
    this.saveCart();
  }
  
  updateQuantity(itemIndex: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemIndex);
      return;
    }
    
    const updatedItems = [...this.cartItems.value];
    updatedItems[itemIndex].quantity = quantity;
    this.cartItems.next(updatedItems);
    this.saveCart();
  }
  
  removeFromCart(itemIndex: number): void {
    const filteredItems = this.cartItems.value.filter((_, index) => index !== itemIndex);
    this.cartItems.next(filteredItems);
    this.saveCart();
  }
  
  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
  }
  
  openCart(): void {
    this.isCartOpenSubject.next(true);
    document.body.style.overflow = 'hidden'; // Vô hiệu hóa scroll khi popup mở
  }
  
  closeCart(): void {
    this.isCartOpenSubject.next(false);
    document.body.style.overflow = 'auto'; // Khôi phục scroll
  }
  
  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
    document.body.style.overflow = this.isCartOpenSubject.value ? 'hidden' : 'auto';
  }
} 