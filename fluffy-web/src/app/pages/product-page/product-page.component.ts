import { Component, OnInit } from '@angular/core';
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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.sortedProducts = [...data];
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  handleFilter(filters: any) {
    console.log('Applying filters:', filters);
    
    let filtered = [...this.products];

    // Filter by collection
    if (filters.collections && filters.collections.length > 0) {
      filtered = filtered.filter(product => 
        filters.collections.includes(product.collection)
      );
    }

    // Filter by color
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        filters.colors.some((color: any) => product.color.selected_colors.includes(color))
      );
    }

    // Filter by price range
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

    console.log('Filtered results:', filtered);
    this.sortedProducts = filtered;
  }

  handleSort(sortOption: string) {
    this.sortedProducts = [...this.sortedProducts]; // Tạo bản sao mới để sắp xếp
    
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
    }
  }
}