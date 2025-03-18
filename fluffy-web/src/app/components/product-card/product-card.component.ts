import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductPricing {
  original_price: string;
  discount_percentage: string;
}

interface Product {
  product_id: number;
  product_name: string;
  pricing: ProductPricing;
  images: string[];
  image: string;
  color: {
    selected_colors: string[];
  };
  size: {
    available_sizes: string[];
  };
  rating: number;
  description: string;
  collection: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  isFavorite: boolean = false;

  calculateDiscountedPrice(originalPrice: string, discountPercentage: string): string {
    const price = parseFloat(originalPrice.replace(/[,.]/g, ''));
    const discount = parseFloat(discountPercentage);
    if (isNaN(price) || isNaN(discount)) return originalPrice;
    
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice.toLocaleString('vi-VN');
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
