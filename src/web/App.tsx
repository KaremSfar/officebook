
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser, useLogout } from './hooks/useAuth';
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
