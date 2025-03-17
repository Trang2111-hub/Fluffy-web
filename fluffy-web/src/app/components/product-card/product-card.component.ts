import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="product-card">
            <div class="product-image-container">
                <img [src]="product.image" [alt]="product.title" class="product-img">
            </div>
            
            <div class="product-info">
                <h3 class="product-name">{{product.title}}</h3>
                <div class="price-container">
                    <span class="sale-price">{{product.price | currency}}</span>
                </div>
            </div>
            
            <div class="product-actions">
                <div class="add-to-cart">
                    <i class="shopping-bag-icon"></i>
                    <span>Thêm vào giỏ hàng</span>
                </div>
                <button class="buy-now-btn">MUA NGAY</button>
            </div>
            
            <button class="favorite-btn">
                <i class="heart-icon"></i>
            </button>
        </div>
    `,
    styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
    @Input() product!: Product;
}
