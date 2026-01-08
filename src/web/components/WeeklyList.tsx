
import React from 'react';
import { AttendanceRecord, User } from '../types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { UserPlus, UserMinus, CalendarDays, Loader2 } from 'lucide-react';

interface WeeklyListProps {
  currentUser: User;
  attendance: AttendanceRecord[];
  onJoin: (date: string) => void;
  onLeave: (date: string) => void;
  isLoading?: boolean;
}

const WeeklyList: React.FC<WeeklyListProps> = ({ 
  currentUser, 
  attendance, 
  onJoin, 
  onLeave,
  isLoading
}) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Weekly Attendance</h1>
          <p className="text-gray-500 mt-1">See who's in the office from {format(weekDays[0], 'MMM d')} to {format(weekDays[4], 'MMM d')}</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-700 font-medium">
          <CalendarDays size={20} />
          {format(today, 'EEEE, MMMM do')}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayAttendance = attendance.filter((r) => r.date === dateStr);
          const isAttending = dayAttendance.some((r) => r.userId === currentUser.id);
          const isPast = day < new Date(new Date().setHours(0,0,0,0));
          const isToday = isSameDay(day, today);

          return (
            <div 
              key={dateStr} 
              className={`flex flex-col bg-white rounded-2xl border transition-all ${
                isToday ? 'border-blue-500 ring-2 ring-blue-50 shadow-lg' : 'border-gray-200'
              } ${isPast ? 'opacity-60' : ''}`}
            >
              <div className={`p-4 border-b ${isToday ? 'bg-blue-50/50' : 'bg-gray-50/50'}`}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{format(day, 'EEEE')}</p>
                <p className="text-lg font-bold text-gray-900">{format(day, 'MMM d')}</p>
              </div>

              <div className="flex-1 p-4 space-y-3 min-h-[200px]">
                {dayAttendance.map((record) => (
                  <div key={record.id} className="flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <img 
                      src={record.userAvatar} 
                      alt={record.userName} 
                      className="w-8 h-8 rounded-full border border-white shadow-sm" 
                    />
                    <span className="text-sm font-medium text-gray-700 truncate">{record.userName}</span>
                  </div>
                ))}
                {dayAttendance.length === 0 && (
                  <p className="text-xs text-gray-400 italic py-4">No one yet...</p>
                )}
              </div>

              <div className="p-4 pt-0">
                {!isPast && (
                  isAttending ? (
                    <button 
                      onClick={() => onLeave(dateStr)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <UserMinus size={14} />
                      )}
                      I'm not coming
                    </button>
                  ) : (
                    <button 
                      onClick={() => onJoin(dateStr)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <UserPlus size={14} />
                      )}
                      I'll be in
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyList;
