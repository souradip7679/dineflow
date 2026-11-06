import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="df-modal-backdrop" *ngIf="isOpen" (click)="closeOnBackdrop($event)">
      <div class="df-modal-container" role="dialog" aria-modal="true" [attr.aria-labelledby]="title">
        <div class="df-modal-header">
          <h3 class="df-modal-title">
            <i *ngIf="icon" class="fa-solid" [ngClass]="icon"></i>
            <span>{{ title }}</span>
          </h3>
          <button type="button" class="df-modal-close" aria-label="Close modal" (click)="close.emit()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="df-modal-body">
          <ng-content></ng-content>
        </div>
        <div class="df-modal-footer" *ngIf="hasFooter">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .df-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(18, 24, 21, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease forwards;
    }
    .df-modal-container {
      background: var(--df-surface, #ffffff);
      border: 1px solid var(--df-border, #e5e0d8);
      border-radius: var(--df-radius-xl, 20px);
      width: 100%;
      max-width: 540px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
    }
    .df-modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--df-border, #e5e0d8);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .df-modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--df-text-primary, #1e2420);
      font-family: var(--df-font-heading, 'Playfair Display', serif);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .df-modal-close {
      background: transparent;
      border: none;
      font-size: 1.25rem;
      color: var(--df-text-muted, #8e9590);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .df-modal-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--df-text-primary, #1e2420);
    }
    .df-modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    .df-modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--df-border, #e5e0d8);
      background: rgba(0, 0, 0, 0.02);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ModalDialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() icon = '';
  @Input() hasFooter = true;
  @Output() close = new EventEmitter<void>();

  closeOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('df-modal-backdrop')) {
      this.close.emit();
    }
  }
}
