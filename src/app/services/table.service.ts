import { Injectable } from '@angular/core';
import { Table, TableStatus, TableZone, ZoneSummary } from '../models/table.model';
import { StorageService } from './storage.service';
import { INITIAL_TABLES } from '../data/initial-data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly STORAGE_KEY = 'dineflow_tables';
  private tablesSubject: BehaviorSubject<Table[]>;
  public tables$: Observable<Table[]>;

  constructor(private storage: StorageService) {
    const existing = this.storage.get<Table[]>(this.STORAGE_KEY, []);
    const initial = existing && existing.length > 0 ? existing : INITIAL_TABLES;
    if (!existing || existing.length === 0) {
      this.storage.set(this.STORAGE_KEY, initial);
    }
    this.tablesSubject = new BehaviorSubject<Table[]>(initial);
    this.tables$ = this.tablesSubject.asObservable();
  }

  getAllTables(): Table[] {
    return [...this.tablesSubject.value];
  }

  getTableById(id: number): Table | undefined {
    return this.tablesSubject.value.find((t) => t.id === Number(id));
  }

  getTablesByZone(zoneCode: string): Table[] {
    if (!zoneCode || zoneCode === 'all') {
      return this.getAllTables();
    }
    return this.tablesSubject.value.filter((t) => t.zoneCode === zoneCode);
  }

  getAvailableTables(minCapacity?: number): Table[] {
    return this.tablesSubject.value.filter((t) => {
      const isAvailable = t.status === 'Available';
      if (!minCapacity) return isAvailable;
      return isAvailable && t.capacity >= minCapacity;
    });
  }

  updateTableStatus(tableId: number, newStatus: TableStatus): boolean {
    const tables = this.getAllTables();
    const target = tables.find((t) => t.id === Number(tableId));
    if (!target) return false;

    target.status = newStatus;
    this.saveTables(tables);
    return true;
  }

  getZoneSummaries(): ZoneSummary[] {
    const tables = this.getAllTables();
    const zoneMap: Record<string, ZoneSummary> = {
      main: { name: 'Main Dining Room', code: 'main', totalTables: 0, capacity: 0 },
      terrace: { name: 'Garden Terrace', code: 'terrace', totalTables: 0, capacity: 0 },
      vip: { name: 'Executive VIP Lounge', code: 'vip', totalTables: 0, capacity: 0 },
      bar: { name: 'Bar & Lounge', code: 'bar', totalTables: 0, capacity: 0 }
    };

    tables.forEach((t) => {
      if (zoneMap[t.zoneCode]) {
        zoneMap[t.zoneCode].totalTables += 1;
        zoneMap[t.zoneCode].capacity += t.capacity;
      }
    });

    return Object.values(zoneMap);
  }

  resetTables(): Table[] {
    const fresh = JSON.parse(JSON.stringify(INITIAL_TABLES));
    this.saveTables(fresh);
    return fresh;
  }

  private saveTables(tables: Table[]): void {
    this.tablesSubject.next(tables);
    this.storage.set(this.STORAGE_KEY, tables);
  }
}
