import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';

// Add this interface before the component class
interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products: Product[] = []; // Mảng chứa tất cả sản phẩm
    paginatedProducts: Product[] = []; // Mảng chứa sản phẩm của trang hiện tại
    
    itemsPerPage = 16; // 4 hàng x 4 cột = 16 sản phẩm
    currentPage = 1;
    totalPages = 1;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<any[]>('https://fakestoreapi.com/products')
            .subscribe(data => {
                this.products = data;
                this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
                this.updatePaginatedProducts();
            });
    }

    updatePaginatedProducts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedProducts = this.products.slice(startIndex, endIndex);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePaginatedProducts();
        }
    }

    getPageNumbers(): number[] {
        return Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
}
