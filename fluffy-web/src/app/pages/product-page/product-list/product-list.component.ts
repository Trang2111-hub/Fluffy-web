import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../models/product.model';
import { SortComponent, SortOption } from '../sort/sort.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent, SortComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    @Input() products: Product[] = [];
    paginatedProducts: Product[] = []; // Mảng chứa sản phẩm của trang hiện tại
    originalProducts: Product[] = []; // Store original order
    
    itemsPerPage = 16; // 4 hàng x 4 cột = 16 sản phẩm
    currentPage = 1;
    totalPages = 1;

    constructor(private http: HttpClient, private productService: ProductService) {}

    ngOnInit() {
        console.log('ProductList ngOnInit - Initial products:', this.products);
        this.productService.getProducts().subscribe(
            (data) => {
                console.log('ProductList - Products received from service:', data);
                this.products = data;
                this.originalProducts = [...data]; // Keep original copy
                this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
                this.updatePaginatedProducts();
                console.log('ProductList - Updated paginatedProducts:', this.paginatedProducts);
            },
            (error) => {
                console.error('Error fetching products:', error);
            }
        );
    }

    ngOnChanges() {
        console.log('ProductList ngOnChanges - Products received from parent:', this.products);
        if (this.products.length > 0) {
            this.originalProducts = [...this.products]; // Update original copy
            this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
            this.updatePaginatedProducts();
        }
    }
  
    // Hàm sắp xếp sản phẩm theo price
    sortProducts(sortOrder: string): void {
      const sortedProducts = [...this.products];
      
      if (sortOrder === 'price-asc') {
        this.products = sortedProducts.sort((a, b) => 
          parseFloat(a.pricing.original_price.replace(/[^0-9]/g, '')) - 
          parseFloat(b.pricing.original_price.replace(/[^0-9]/g, ''))
        );
      } else if (sortOrder === 'price-desc') {
        this.products = sortedProducts.sort((a, b) => 
          parseFloat(b.pricing.original_price.replace(/[^0-9]/g, '')) - 
          parseFloat(a.pricing.original_price.replace(/[^0-9]/g, ''))
        );
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

    onSortChange(sortOption: SortOption) {
        this.products = [...this.originalProducts]; // Reset to original order before sorting
        
        switch (sortOption) {
            case 'price-asc':
                this.products.sort((a, b) => 
                    parseFloat(a.pricing.original_price) - parseFloat(b.pricing.original_price)
                );
                break;
            case 'price-desc':
                this.products.sort((a, b) => 
                    parseFloat(b.pricing.original_price) - parseFloat(a.pricing.original_price)
                );
                break;
            case 'rating-asc':
                this.products.sort((a, b) => a.rating - b.rating);
                break;
            case 'rating-desc':
                this.products.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        this.currentPage = 1; // Reset to first page
        this.updatePaginatedProducts();
    }
}
