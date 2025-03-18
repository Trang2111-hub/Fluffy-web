import { Component } from '@angular/core';
import { FilterComponent } from './filter/filter.component';
import { SortComponent } from './sort/sort.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-page',
  imports: [CommonModule,FilterComponent, SortComponent, ProductListComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {
  currentSortOrder: string = '';

  onSortChange(sortOrder: string): void {
    this.currentSortOrder = sortOrder; // Lưu lựa chọn sắp xếp
  }

  currentFilters: any = {};
  handleApplyFilters(filters: any) {
    this.currentFilters = filters;
  }
}