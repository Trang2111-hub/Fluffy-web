import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
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
    color?: string;
    size?: string;
}
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnChanges {
    @Input() sortOrder: string = ''; // Nhận sortOrder từ parent component
    @Input() filters: any; // Thêm Input filters từ parent component

    filteredProducts: Product[] = []; // Chứa sản phẩm sau lọc

    products: Product[] = [];
    paginatedProducts: Product[] = [];
    itemsPerPage = 16;
    currentPage = 1;
    totalPages = 1;
  
    constructor(private http: HttpClient) {}
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['sortOrder'] && !changes['sortOrder'].firstChange) {
        console.log('Sorting order changed to:', this.sortOrder);
        this.sortProducts(this.sortOrder);
      }
    }
  
    ngOnInit() {
      this.http.get<Product[]>('https://fakestoreapi.com/products')
        .subscribe(data => {
          this.products = data;
          this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          this.updatePaginatedProducts();
        });
    }
  
    // Hàm sắp xếp sản phẩm theo price
    sortProducts(sortOrder: string): void {
      const sortedProducts = [...this.products];
      
      if (sortOrder === 'price-asc') {
        this.products = sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'price-desc') {
        this.products = sortedProducts.sort((a, b) => b.price - a.price);
      }
      
      console.log('Sorted products:', this.products);
      this.updatePaginatedProducts();
    }
  
    // Cập nhật phân trang
    updatePaginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.products.slice(startIndex, endIndex);
    }
  
    // Chuyển trang
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedProducts();
      }
    }
  
    // Lấy danh sách trang
    getPageNumbers(): number[] {
      return Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
}
