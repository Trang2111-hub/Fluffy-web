import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() applyFilters = new EventEmitter<any>();

  filters = {
    categories: [],
    priceRange: { min: 0, max: Infinity },
    colors: [],
    sizes: []
  };

  expandedSections = {
    category: false,
    price: false,
    color: false,
    size: false
  };

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  // Gọi hàm này khi nhấn nút "ÁP DỤNG"
  onApplyFilters() {
    this.applyFilters.emit(this.filters);
  }
}
