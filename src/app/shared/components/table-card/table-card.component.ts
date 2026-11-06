import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../models/table.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="df-table-card"
         [ngClass]="['df-table-card--' + table.status.toLowerCase(), 'df-table-shape--' + table.shape]"
         (click)="select.emit(table)">
      <div class="df-table-card__top">
        <span class="df-table-number">{{ table.number }}</span>
        <app-status-badge [status]="table.status"></app-status-badge>
      </div>

      <div class="df-table-illustration" [ngClass]="'shape-' + table.shape">
        <div class="table-surface">
          <span class="table-capacity"><i class="fa-solid fa-users"></i> {{ table.capacity }}</span>
        </div>
      </div>

      <div class="df-table-card__bottom">
        <div class="df-table-zone">{{ table.zone }}</div>
        <div class="df-table-desc">{{ table.description }}</div>
      </div>
    </div>
  `,
  styles: [`
    .df-table-card {
      background: var(--df-surface, #ffffff);
      border: 2px solid var(--df-border, #e5e0d8);
      border-radius: var(--df-radius-lg, 16px);
      padding: 1rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.25s ease;
      position: relative;
    }
    .df-table-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--df-shadow-md, 0 8px 24px rgba(0,0,0,0.08));
      border-color: var(--df-forest-light, #2d6a4f);
    }
    .df-table-card__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .df-table-number {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--df-text-primary, #1e2420);
      font-family: var(--df-font-heading, 'Playfair Display', serif);
    }
    .df-table-illustration {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 10px;
      margin: 0.25rem 0;
    }
    .table-surface {
      padding: 8px 16px;
      border-radius: 8px;
      background: var(--df-border, #e5e0d8);
      color: var(--df-text-primary, #1e2420);
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .shape-round .table-surface {
      border-radius: 50%;
      width: 58px;
      height: 58px;
      justify-content: center;
      padding: 0;
    }
    .shape-square .table-surface {
      width: 58px;
      height: 58px;
      justify-content: center;
      padding: 0;
    }
    .shape-rectangle .table-surface {
      width: 90px;
      height: 48px;
      justify-content: center;
      padding: 0;
    }
    .df-table-card--available .table-surface {
      background: rgba(45, 106, 79, 0.2);
      color: #2d6a4f;
      border: 1px solid rgba(45, 106, 79, 0.4);
    }
    .df-table-card--reserved .table-surface {
      background: rgba(201, 138, 34, 0.2);
      color: #b07219;
      border: 1px solid rgba(201, 138, 34, 0.4);
    }
    .df-table-card--occupied .table-surface {
      background: rgba(194, 84, 53, 0.2);
      color: #c25435;
      border: 1px solid rgba(194, 84, 53, 0.4);
    }
    .df-table-card--cleaning .table-surface {
      background: rgba(120, 120, 120, 0.2);
      color: #666;
      border: 1px solid rgba(120, 120, 120, 0.4);
    }
    .df-table-card__bottom {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .df-table-zone {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--df-forest-light, #2d6a4f);
    }
    .df-table-desc {
      font-size: 0.75rem;
      color: var(--df-text-muted, #8e9590);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class TableCardComponent {
  @Input({ required: true }) table!: Table;
  @Output() select = new EventEmitter<Table>();
}
