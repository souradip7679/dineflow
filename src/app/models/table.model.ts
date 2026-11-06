export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning';
export type TableZone = 'Main Dining Room' | 'Garden Terrace' | 'Executive VIP Lounge' | 'Bar & Lounge';
export type TableShape = 'round' | 'square' | 'rectangle';

export interface Table {
  id: number;
  number: string;
  zone: TableZone;
  zoneCode: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  description: string;
}

export interface ZoneSummary {
  name: TableZone;
  code: string;
  totalTables: number;
  capacity: number;
}
