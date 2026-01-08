
export type Role = 'EMPLOYEE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export type ViewState = 'WEEKLY_LIST' | 'ADMIN';
