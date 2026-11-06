import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="df-stat-card" [ngClass]="'df-stat-card--' + theme">
      <div class="df-stat-card__icon-wrap">
        <i class="fa-solid" [ngClass]="icon"></i>
      </div>
      <div class="df-stat-card__content">
        <div class="df-stat-card__val">{{ value }}</div>
        <div class="df-stat-card__title">{{ title }}</div>
        <div class="df-stat-card__sub" *ngIf="subtitle">{{ subtitle }}</div>
      </div>
    </div>
  `,
  styles: [`
    .df-stat-card {
      background: var(--df-surface, #ffffff);
      border: 1px solid var(--df-border, #e5e0d8);
      border-radius: var(--df-radius-lg, 16px);
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: var(--df-shadow-sm, 0 2px 8px rgba(0,0,0,0.04));
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .df-stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--df-shadow-md, 0 6px 16px rgba(0,0,0,0.08));
    }
    .df-stat-card__icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .df-stat-card__content {
      flex: 1;
      min-width: 0;
    }
    .df-stat-card__val {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1.1;
      color: var(--df-text-primary, #1e2420);
      font-family: var(--df-font-heading, 'Playfair Display', serif);
    }
    .df-stat-card__title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--df-text-secondary, #5f6661);
      margin-top: 4px;
    }
    .df-stat-card__sub {
      font-size: 0.75rem;
      color: var(--df-text-muted, #8e9590);
      margin-top: 2px;
    }
    .df-stat-card--forest .df-stat-card__icon-wrap {
      background: rgba(26, 59, 50, 0.12);
      color: #1a3b32;
    }
    .df-stat-card--terracotta .df-stat-card__icon-wrap {
      background: rgba(194, 84, 53, 0.12);
      color: #c25435;
    }
    .df-stat-card--gold .df-stat-card__icon-wrap {
      background: rgba(212, 163, 89, 0.15);
      color: #b07f24;
    }
    .df-stat-card--emerald .df-stat-card__icon-wrap {
      background: rgba(45, 106, 79, 0.12);
      color: #2d6a4f;
    }
    .df-stat-card--amber .df-stat-card__icon-wrap {
      background: rgba(224, 122, 95, 0.12);
      color: #e07a5f;
    }
    .df-stat-card--purple .df-stat-card__icon-wrap {
      background: rgba(114, 9, 183, 0.12);
      color: #7209b7;
    }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = 'fa-chart-simple';
  @Input() subtitle?: string;
  @Input() theme: string = 'forest';
}
