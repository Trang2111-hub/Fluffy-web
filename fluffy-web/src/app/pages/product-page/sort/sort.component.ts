import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent {
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(event: any) {
    const value = event.target.value;
    this.sortChange.emit(value);
  }
}
