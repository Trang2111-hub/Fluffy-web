import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent {
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortChange.emit(target.value);
  }
}
