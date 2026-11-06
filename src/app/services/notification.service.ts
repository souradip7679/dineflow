import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public notifications$: Observable<ToastMessage[]> = this.notificationsSubject.asObservable();
  private counter = 0;

  show(type: 'success' | 'error' | 'warning' | 'info', message: string, durationMs: number = 4000): void {
    const id = ++this.counter;
    const icons: Record<string, string> = {
      success: 'fa-circle-check',
      error: 'fa-circle-exclamation',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const newToast: ToastMessage = {
      id,
      type,
      message,
      icon: icons[type] || 'fa-bell'
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message, 5000);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    const current = this.notificationsSubject.value.filter((n) => n.id !== id);
    this.notificationsSubject.next(current);
  }
}
