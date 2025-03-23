import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Thêm ActivatedRoute để đọc query params
import { FilterComponent } from './filter/filter.component';
import { SortComponent } from './sort/sort.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FilterComponent, SortComponent, ProductListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  products: Product[] = [];
  sortedProducts: Product[] = [];
  loading: boolean = true;
  error: string | null = null;
  noProductsMessage: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute // Inject ActivatedRoute để đọc query params
  ) {}

  ngOnInit() {
    this.loading = true;

    // Lắng nghe query params từ URL
    this.route.queryParams.subscribe(params => {
      const collection = params['collection'];
      this.loadProducts(collection);
    });
  }

  loadProducts(collection?: string) {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Products received:', data);
        this.products = data;
        if (collection) {
          // Lọc sản phẩm theo collection từ query params (không phân biệt hoa thường)
          this.sortedProducts = this.products.filter(product =>
            product.collection.toLowerCase().includes(collection.toLowerCase())
          );
          if (this.sortedProducts.length === 0) {
            this.noProductsMessage = `Không tìm thấy sản phẩm nào thuộc danh mục "${collection}"`;
          }
        } else {
          this.sortedProducts = [...data]; // Hiển thị tất cả sản phẩm nếu không có collection
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.error = 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  handleFilter(filters: any) {
    this.noProductsMessage = '';
    let filtered = [...this.products];

    // Ưu tiên lọc theo collection từ URL (nếu có)
    const collectionFromUrl = this.route.snapshot.queryParams['collection'];
    if (collectionFromUrl) {
      filtered = filtered.filter(product =>
        product.collection.toLowerCase().includes(collectionFromUrl.toLowerCase())
      );
    }

    // Các filter khác từ component Filter
    if (filters.collections && filters.collections.length > 0) {
      filtered = filtered.filter(product =>
        filters.collections.some((col: string) =>
          product.collection.toLowerCase().includes(col.toLowerCase())
        )
      );
    }

    // Lọc theo màu
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        filters.colors.some((color: any) => product.color.selected_colors.includes(color))
      );
    }

    // Lọc theo giá
    if (filters.priceRange) {
      if (filters.priceRange.min !== null) {
        filtered = filtered.filter(product => {
          const price = parseFloat(product.pricing.original_price.replace(/[^0-9]/g, ''));
          return price >= filters.priceRange.min;
        });
      }
      if (filters.priceRange.max !== null) {
        filtered = filtered.filter(product => {
          const price = parseFloat(product.pricing.original_price.replace(/[^0-9]/g, ''));
          return price <= filters.priceRange.max;
        });
      }
    }

    // Kiểm tra nếu không có sản phẩm nào thỏa mãn điều kiện lọc
    if (filtered.length === 0) {
      this.noProductsMessage = 'Không tìm thấy sản phẩm nào phù hợp với các điều kiện lọc';
    }

    console.log('Filtered results:', filtered);
    this.sortedProducts = filtered;
  }

  handleSort(sortOption: string) {
    this.sortedProducts = [...this.sortedProducts];
   
    if (sortOption === 'price-asc') {
      this.sortedProducts.sort((a, b) =>
        parseFloat(a.pricing.original_price.replace(/[^0-9]/g, '')) -
        parseFloat(b.pricing.original_price.replace(/[^0-9]/g, ''))
      );
    } else if (sortOption === 'price-desc') {
      this.sortedProducts.sort((a, b) =>
        parseFloat(b.pricing.original_price.replace(/[^0-9]/g, '')) -
        parseFloat(a.pricing.original_price.replace(/[^0-9]/g, ''))
      );
    } else if (sortOption === 'rating-asc') {
      this.sortedProducts.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === 'rating-desc') {
      this.sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'name-asc') {
      this.sortedProducts.sort((a, b) =>
        (a.product_name || '').localeCompare(b.product_name || '')
      );
    } else if (sortOption === 'name-desc') {
      this.sortedProducts.sort((a, b) =>
        (b.product_name || '').localeCompare(a.product_name || '')
      );
    }
  }
}