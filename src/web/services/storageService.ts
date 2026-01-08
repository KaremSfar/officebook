
import { AttendanceRecord, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'officebook_users_db',
  ATTENDANCE: 'officebook_attendance',
  CURRENT_USER: 'officebook_current_user'
};

export const storageService = {
  getUsers: (): (User & { password?: string })[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const defaults = [
        { id: 'u-1', email: 'admin@office.com', password: 'password123', name: 'Sarah Admin', role: 'ADMIN' as const, avatar: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 'u-2', email: 'user@office.com', password: 'password123', name: 'John Doe', role: 'EMPLOYEE' as const, avatar: 'https://i.pravatar.cc/150?u=john' },
        { id: 'u-3', email: 'jane@office.com', password: 'password123', name: 'Jane Smith', role: 'EMPLOYEE' as const, avatar: 'https://i.pravatar.cc/150?u=jane' }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  saveUser: (user: User & { password?: string }) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: (record: AttendanceRecord) => {
    const records = storageService.getAttendance();
    // Prevent duplicates for same user same day
    if (!records.find(r => r.userId === record.userId && r.date === record.date)) {
      records.push(record);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    }
  },

  removeAttendance: (userId: string, date: string) => {
    const records = storageService.getAttendance();
    const filtered = records.filter(r => !(r.userId === userId && r.date === date));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};
