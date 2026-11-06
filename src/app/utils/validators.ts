import { Reservation } from '../models/reservation.model';
import { Table } from '../models/table.model';

export class ValidatorsUtil {
  /**
   * Validate an email address format
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim());
  }

  /**
   * Validate a telephone number (minimum 7 digits, maximum 15 digits)
   */
  static isValidPhone(phone: string): boolean {
    if (!phone) return false;
    const digits = String(phone).replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }

  /**
   * Check if a booking date is today or in the future
   */
  static isFutureOrToday(dateStr: string): boolean {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateStr.split('-');
    if (parts.length !== 3) return false;
    const bookingDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return bookingDate >= today;
  }

  /**
   * Check if a requested time is within opening hours (11:30 - 23:00)
   */
  static isWithinOpeningHours(timeStr: string): boolean {
    if (!timeStr) return false;
    const parts = timeStr.split(':');
    if (parts.length < 2) return false;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const totalMinutes = hours * 60 + minutes;

    const openingMinutes = 11 * 60 + 30; // 11:30 AM
    const closingMinutes = 23 * 60;      // 11:00 PM
    return totalMinutes >= openingMinutes && totalMinutes <= closingMinutes;
  }

  /**
   * Calculate difference in minutes between two HH:mm strings
   */
  static getTimeDifferenceMinutes(timeA: string, timeB: string): number {
    const aParts = timeA.split(':');
    const bParts = timeB.split(':');
    const aMin = parseInt(aParts[0], 10) * 60 + parseInt(aParts[1], 10);
    const bMin = parseInt(bParts[0], 10) * 60 + parseInt(bParts[1], 10);
    return Math.abs(aMin - bMin);
  }

  /**
   * Detect booking conflict:
   * Returns true if there is an overlapping reservation on the same table
   * within bufferMinutes (default 90 mins for standard dining duration)
   */
  static hasTimeConflict(
    existingReservations: Reservation[],
    targetTableId: number,
    targetDate: string,
    targetTime: string,
    excludeResId?: string,
    bufferMinutes: number = 90
  ): boolean {
    const tableIdInt = Number(targetTableId);

    return existingReservations.some((res) => {
      // Skip same reservation if editing
      if (excludeResId && res.id === excludeResId) {
        return false;
      }
      // Skip cancelled reservations
      if (res.status === 'Cancelled') {
        return false;
      }
      // Match table and date
      if (Number(res.tableId) === tableIdInt && res.date === targetDate) {
        const diff = ValidatorsUtil.getTimeDifferenceMinutes(res.time, targetTime);
        return diff < bufferMinutes;
      }
      return false;
    });
  }

  /**
   * Check if table capacity fits the party size
   */
  static hasSufficientCapacity(table: Table, guestCount: number): boolean {
    if (!table || !guestCount) return false;
    return table.capacity >= Number(guestCount);
  }
}
