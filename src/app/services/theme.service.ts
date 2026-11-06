import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'dineflow_theme';
  private currentThemeSubject: BehaviorSubject<'light' | 'dark'>;
  public currentTheme$: Observable<'light' | 'dark'>;

  constructor(private storage: StorageService) {
    const saved = this.storage.get<'light' | 'dark'>(this.THEME_KEY, 'dark');
    this.currentThemeSubject = new BehaviorSubject<'light' | 'dark'>(saved);
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    this.applyTheme(saved);
  }

  get currentTheme(): 'light' | 'dark' {
    return this.currentThemeSubject.value;
  }

  isDark(): boolean {
    return this.currentThemeSubject.value === 'dark';
  }

  toggleTheme(): 'light' | 'dark' {
    const nextTheme: 'light' | 'dark' = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentThemeSubject.next(theme);
    this.storage.set(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${theme}`);
    }
  }
}
