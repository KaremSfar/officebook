import React, { useMemo } from 'react';
import WeeklyList from '../components/WeeklyList';
import Navbar from '../components/Navbar';
import { User } from '../types';
import { Loader2 } from 'lucide-react';
import { useAttendance, useMarkAttendance, useRemoveAttendance } from '../hooks/useAttendance';
import { startOfWeek, addDays, format } from 'date-fns';

interface MainPageProps {
  user: User;
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ user, onLogout }) => {
  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const startDate = useMemo(() => format(weekStart, 'yyyy-MM-dd'), [weekStart]);
  const endDate = useMemo(() => format(addDays(weekStart, 4), 'yyyy-MM-dd'), [weekStart]);

  const { data: attendance = [], isLoading } = useAttendance(startDate, endDate);
  const markMutation = useMarkAttendance();
  const removeMutation = useRemoveAttendance();

  const handleJoin = (date: string) => {
    markMutation.mutate({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      date,
    });
  };

  const handleLeave = (date: string) => {
    removeMutation.mutate({ userId: user.id, date });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-500 font-medium">Loading this week's attendance...</p>
          </div>
        ) : (
          <WeeklyList 
            currentUser={user} 
            attendance={attendance} 
            onJoin={handleJoin} 
            onLeave={handleLeave} 
            isLoading={markMutation.isPending || removeMutation.isPending}
          />
        )}
      </main>
    </div>
  );
};

export default MainPage;
