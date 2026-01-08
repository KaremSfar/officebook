import { AttendanceRecord } from '../types';
import { storageService } from './storageService';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  /**
   * Fetches attendance records within a specific date range.
   * In a real API, this would be a GET /attendance?startDate=...&endDate=...
   */
  getAttendanceRange: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    await delay(600);
    const allRecords = storageService.getAttendance();
    
    // Filter records within the range
    return allRecords.filter(record => {
      return record.date >= startDate && record.date <= endDate;
    });
  },

  /**
   * Marks attendance for a user on a specific date.
   */
  markAttendance: async (record: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<AttendanceRecord> => {
    await delay(500);
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    storageService.saveAttendance(newRecord);
    return newRecord;
  },

  /**
   * Removes an attendance record.
   */
  removeAttendance: async (userId: string, date: string): Promise<void> => {
    await delay(400);
    storageService.removeAttendance(userId, date);
  }
};
