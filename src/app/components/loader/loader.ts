import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="loading$ | async">
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
      .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.7);
        z-index: 9999;
      }

      .spinner {
        width: 60px;
        height: 60px;
        border: 6px solid #ccc;
        border-top-color: #0074d9;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent implements OnInit {
  loading$!: Observable<boolean>;
  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
  }
}
