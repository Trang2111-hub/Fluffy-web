import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  expandedSections = {
    category: false,
    color: false,
    size: false,
    price: false
  };

  toggleSection(section: string) {
    if (section in this.expandedSections) {
      this.expandedSections[section as keyof typeof this.expandedSections] = 
        !this.expandedSections[section as keyof typeof this.expandedSections];
    }
  }
}
