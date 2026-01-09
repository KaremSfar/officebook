import { AttendanceRecord } from '../types';
import { pb } from './pocketbaseClient';

export const attendanceService = {
  /**
   * Fetches attendance records within a specific date range.
   */
  getAttendanceRange: async (startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    const records = await pb.collection('attendance').getFullList({
      filter: `date >= "${startDate} 00:00:00.000Z" && date <= "${endDate} 23:59:59.999Z"`,
      expand: 'user_id',
    });

    return records.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      userName: item.expand?.user_id?.full_name || 'Unknown',
      userAvatar: item.expand?.user_id?.avatar 
        ? pb.files.getUrl(item.expand.user_id, item.expand.user_id.avatar) 
        : `https://i.pravatar.cc/150?u=${item.user_id}`,
      date: item.date.split(' ')[0], // PocketBase dates might include time
      comment: item.comment,
      createdAt: item.created
    }));
  },

  /**
   * Marks attendance for a user on a specific date.
   */
  markAttendance: async (record: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<AttendanceRecord> => {
    const data = {
      user_id: record.userId,
      date: `${record.date} 00:00:00.000Z`,
      comment: record.comment,
    };

    const item = await pb.collection('attendance').create(data, {
      expand: 'user_id',
    });

    return {
      id: item.id,
      userId: item.user_id,
      userName: item.expand?.user_id?.full_name || 'Unknown',
      userAvatar: item.expand?.user_id?.avatar 
        ? pb.files.getUrl(item.expand.user_id, item.expand.user_id.avatar) 
        : `https://i.pravatar.cc/150?u=${item.user_id}`,
      date: item.date.split(' ')[0],
      comment: item.comment,
      createdAt: item.created
    };
  },

  /**
   * Removes an attendance record.
   */
  removeAttendance: async (userId: string, date: string): Promise<void> => {
    // PocketBase delete usually requires the record ID. 
    // Since we have a unique index on user_id and date, we first find the record.
    const record = await pb.collection('attendance').getFirstListItem(
      `user_id = "${userId}" && date ~ "${date}"`
    );

    if (record) {
      await pb.collection('attendance').delete(record.id);
    }
  }
};
