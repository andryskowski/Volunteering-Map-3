import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button 
        *ngFor="let page of pagesArray; let i = index"
        (click)="changePage(i + 1)"
        [class.active]="currentPage === i + 1">
        {{ i + 1 }}
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      margin-top: 1.5em;
      display: flex;
      gap: 6px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .pagination button {
      width: 36px;
      height: 36px;
      border: 1px solid #007acc;
      background-color: #cce6ff;
      color: #03396c;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      border-radius: 4px;
      padding: 0;
    }

    .pagination button:hover {
      background-color: #99ccff;
      transform: scale(1.05);
    }

    .pagination button.active {
      background-color: #007acc;
      color: white;
      font-weight: bold;
      transform: scale(1.1);
      border: 1px solid #005f99;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: default;
      transform: none;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0);
  }

  changePage(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}