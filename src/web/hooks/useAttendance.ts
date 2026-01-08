import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services/attendanceService';
import { AttendanceRecord } from '../types';

export const useAttendance = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['attendance', { startDate, endDate }],
    queryFn: () => attendanceService.getAttendanceRange(startDate, endDate),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => 
      attendanceService.markAttendance(record),
    onSuccess: () => {
      // Invalidate all attendance queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useRemoveAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, date }: { userId: string; date: string }) => 
      attendanceService.removeAttendance(userId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};
