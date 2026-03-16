import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

type ToastType = 'success' | 'info' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" *ngIf="visible" [ngClass]="type">
      <span class="icon">
        <ng-container [ngSwitch]="type">
          <span *ngSwitchCase="'success'">✅</span>
          <span *ngSwitchCase="'info'">ℹ️</span>
          <span *ngSwitchCase="'error'">❌</span>
        </ng-container>
      </span>

      <span class="message">{{ message }}</span>
    </div>
  `,
  styles: [
    `
      .toast {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideDown 0.35s ease;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }

      .success {
        background: #22c55e;
      }
      .info {
        background: #3b82f6;
      }
      .error {
        background: #ef4444;
      }

      @keyframes slideDown {
        from {
          transform: translateY(-60px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent {
  visible = false;
  message = '';
  type: ToastType = 'info';

  private timer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  show(message: string, type: ToastType = 'info', duration = 2000) {
    clearTimeout(this.timer);

    this.message = message;
    this.type = type;
    this.visible = true;

    this.timer = setTimeout(() => {
      this.visible = false;
      this.cdr.detectChanges();
    }, duration);
  }
}
