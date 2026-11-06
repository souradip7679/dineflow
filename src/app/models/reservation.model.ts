export type ReservationStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export type OccasionType =
  | 'Casual Dining'
  | 'Anniversary'
  | 'Birthday'
  | 'Business Dinner'
  | 'Romantic Date'
  | 'Family Gathering'
  | 'Reunion'
  | 'Corporate Celebration'
  | 'Other';

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24-hour)
  guests: number;
  tableId: number;
  status: ReservationStatus;
  occasion: OccasionType | string;
  specialRequests?: string;
  createdAt: string;
}

export interface ReservationFormData {
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: number | null;
  occasion: string;
  specialRequests: string;
  agreeTerms: boolean;
}

export interface DashboardMetrics {
  totalReservations: number;
  todayTotal: number;
  todayConfirmed: number;
  todayPending: number;
  todayGuestsExpected: number;
  totalTables: number;
  availableTables: number;
  reservedTables: number;
  occupiedTables: number;
  cleaningTables: number;
  cancelledBookings: number;
  completedBookings: number;
  utilizationRate: number; // percentage
}
