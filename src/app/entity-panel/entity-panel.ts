import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination';
import { ToastComponent } from '../toast/toast';

export interface DeletableEntity {
  _id: string | number;
  [key: string]: any;
}

@Component({
  selector: 'app-entity-panel',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ToastComponent],
  template: `
    <div class="page-container">
      <div *ngIf="loading$ | async; else content" class="loader">Loading...</div>

      <ng-template #content>
        <h2 class="title">{{ title }}</h2>

        <div class="table">
          <div class="header">
            <span *ngFor="let col of columns">{{ col }}</span>
            <span class="actions">Actions</span>
          </div>

          <div class="row" *ngFor="let e of paginatedEntities">
            <span *ngFor="let col of columns">
              <ng-container *ngIf="col === 'avatarUrl'; else normalCol">
                <a [href]="e[col]" target="_blank" rel="noopener noreferrer">
                  {{ e[col]?.length > 20 ? (e[col] | slice: 0 : 20) + '...' : e[col] }}
                </a>
              </ng-container>
              <ng-template #normalCol>
                {{ e[col] }}
              </ng-template>
            </span>

            <div class="actions">
              <button class="edit-btn" (click)="editFn(e)">Edit</button>
              <button class="delete-btn" (click)="deleteItem(e._id)">Delete</button>
            </div>
          </div>
        </div>

        <div *ngIf="entities.length === 0" class="empty">No items found.</div>

        <app-pagination
          *ngIf="totalPages > 1"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)"
        >
        </app-pagination>
        <app-toast></app-toast>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .panel {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        max-width: 1000px;
        margin: 30px auto;
        font-family: Arial, sans-serif;
      }
      .title {
        margin-bottom: 20px;
        color: #1f2a44;
        font-size: 24px;
        font-weight: 600;
      }
      .table {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .header {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) 100px;
        font-weight: 600;
        padding: 10px;
        background: #f5f7fb;
        border-radius: 8px;
        color: #555;
      }
      .row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) 100px;
        padding: 10px;
        border-radius: 8px;
        background: #fafafa;
        transition: 0.2s;
        align-items: center;
      }
      .row:hover {
        background: #f0f4ff;
      }
      .delete-btn {
        background: #ff5a5a;
        border: none;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: 0.2s;
        width: 100px;
      }
      .delete-btn:hover {
        background: #e04848;
      }
      .edit-btn {
        background: lightgreen;
        border: none;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: 0.2s;
        width: 100px;
        margin-right: 6px;
      }
      .edit-btn:hover {
        background: #4338ca;
      }
      .loader {
        text-align: center;
        padding: 30px;
        font-size: 18px;
        color: #666;
      }
      .empty {
        margin-top: 20px;
        text-align: center;
        color: #888;
        font-style: italic;
      }
      .actions {
        display: flex;
      }
    `,
  ],
})
export class EntityPanelComponent {
  @Input() title!: string;
  @Input() entities: DeletableEntity[] = [];
  @Input() columns: string[] = [];
  @Input() loading$!: Observable<boolean>;
  @Input() deleteFn!: (id: string | number) => any;
  @Input() editFn!: (entity: any) => void;
  @ViewChild(ToastComponent) toast!: ToastComponent;

  currentPage = 1;
  itemsPerPage = 5;
  paginatedEntities: DeletableEntity[] = [];

  get totalPages(): number {
    return Math.ceil(this.entities.length / this.itemsPerPage);
  }

  ngOnChanges() {
    this.updatePagination();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEntities = this.entities.slice(start, end);
  }

  deleteItem(id: string | number) {
    this.deleteFn(id)?.subscribe(() => {
      this.updatePagination();
    });
  }
}
