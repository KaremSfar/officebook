import { AttendanceRecord } from '../types';
import { supabase } from './supabaseClient';

export const attendanceService = {
  /**
   * Fetches attendance records within a specific date range.
   */
  getAttendanceRange: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id,
        date,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.profiles.id,
      userName: item.profiles.full_name,
      userAvatar: item.profiles.avatar_url,
      date: item.date,
      createdAt: item.created_at
    }));
  },

  /**
   * Marks attendance for a user on a specific date.
   */
  markAttendance: async (record: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<AttendanceRecord> => {
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        { user_id: record.userId, date: record.date }
      ])
      .select(`
        id,
        date,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.profiles.id,
      userName: data.profiles.full_name,
      userAvatar: data.profiles.avatar_url,
      date: data.date,
      createdAt: data.created_at
    };
  },

  /**
   * Removes an attendance record.
   */
  removeAttendance: async (userId: string, date: string): Promise<void> => {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .match({ user_id: userId, date: date });

    if (error) throw error;
  }
};
