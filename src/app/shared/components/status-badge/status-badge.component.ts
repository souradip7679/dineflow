import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="df-badge" [ngClass]="badgeClass">
      <span class="df-badge__dot" aria-hidden="true"></span>
      <span class="df-badge__text">{{ status }}</span>
    </span>
  `,
  styles: [`
    .df-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .df-badge__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
    .df-badge--confirmed, .df-badge--available {
      background-color: rgba(30, 90, 70, 0.15);
      color: var(--df-forest-light, #2d6a4f);
      border: 1px solid rgba(45, 106, 79, 0.3);
    }
    .df-badge--pending, .df-badge--reserved {
      background-color: rgba(201, 138, 34, 0.15);
      color: #b07219;
      border: 1px solid rgba(201, 138, 34, 0.3);
    }
    .df-badge--occupied {
      background-color: rgba(194, 84, 53, 0.15);
      color: var(--df-terracotta, #c25435);
      border: 1px solid rgba(194, 84, 53, 0.3);
    }
    .df-badge--cleaning {
      background-color: rgba(110, 110, 110, 0.15);
      color: #777;
      border: 1px solid rgba(110, 110, 110, 0.3);
    }
    .df-badge--completed {
      background-color: rgba(40, 120, 180, 0.15);
      color: #1e6091;
      border: 1px solid rgba(40, 120, 180, 0.3);
    }
    .df-badge--cancelled {
      background-color: rgba(160, 40, 40, 0.15);
      color: #b7094c;
      border: 1px solid rgba(160, 40, 40, 0.3);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = 'Available';

  get badgeClass(): string {
    const s = (this.status || '').toLowerCase().trim();
    return `df-badge--${s}`;
  }
}
