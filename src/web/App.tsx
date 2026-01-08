
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useUser, useLogout } from './hooks/useAuth';
import { supabase } from './services/supabaseClient';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();
  const qc = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      qc.invalidateQueries({ queryKey: ['user'] });
    });

    return () => subscription.unsubscribe();
  }, [qc]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MainPage user={user} onLogout={() => logoutMutation.mutate()} />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
