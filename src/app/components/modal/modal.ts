import { Component } from '@angular/core';
import { CommonModule, NgComponentOutlet, NgIf } from '@angular/common';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgIf, NgComponentOutlet],
  template: `
    <ng-container *ngIf="modalService.modalState$ | async as modal">
      <div *ngIf="modal.visible" class="backdrop" (click)="modalService.close()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="header">
            <h2>{{ modal.title }}</h2>
            <button class="close-btn" (click)="modalService.close()">✕</button>
          </div>
          <div class="body">
            <p *ngIf="typeof modal.content === 'string'">{{ modal.content }}</p>

            <ng-container
              *ngIf="modal.content && typeof modal.content !== 'string'"
              [ngComponentOutlet]="modal.content"
              [ngComponentOutletInputs]="modal.inputs"
            >
            </ng-container>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal {
        background: white;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: fadeIn 0.2s ease-out;
      }
      .header {
        padding: 1rem;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .header h2 {
        margin: 0;
        font-size: 1.25rem;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
      }
      .body {
        padding: 1rem;
        max-height: 80vh;
        overflow-y: auto;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}
}
