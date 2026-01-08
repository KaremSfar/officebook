
import React, { useState, useEffect } from 'react';
import WeeklyList from './components/WeeklyList';
import { User, AttendanceRecord, ViewState } from './types';
import { storageService } from './services/storageService';
import { Mail, Lock, Building, AlertCircle, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storageService.getCurrentUser());
  const [view, setView] = useState<ViewState>('WEEKLY_LIST');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  // Auth state
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAttendance(storageService.getAttendance());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const users = storageService.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      storageService.setCurrentUser(userData);
    } else {
      setError("Incorrect email or password.");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const users = storageService.getUsers();
    if (users.some(u => u.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      password,
      role: 'EMPLOYEE' as const,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };

    storageService.saveUser(newUser);
    
    const { password: _, ...userData } = newUser;
    setUser(userData);
    storageService.setCurrentUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
    setEmail('');
    setPassword('');
    setName('');
    setIsSignUp(false);
  };

  const handleJoin = (date: string) => {
    if (!user) return;
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      date,
      createdAt: new Date().toISOString()
    };
    storageService.saveAttendance(newRecord);
    setAttendance(storageService.getAttendance());
  };

  const handleLeave = (date: string) => {
    if (!user) return;
    storageService.removeAttendance(user.id, date);
    setAttendance(storageService.getAttendance());
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="mx-auto bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Building size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">OfficeBook</h1>
            <p className="mt-2 text-gray-500 font-medium">
              {isSignUp ? 'Create your account' : 'Sign in to coordinate with your team'}
            </p>
          </div>
          
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-in shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-blue-50/50 rounded-xl text-xs text-blue-600/80 space-y-2 border border-blue-100">
              <p className="font-bold uppercase tracking-wider">Demo Credentials:</p>
              <p>Admin: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">admin@office.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">password123</code></p>
              <p>User: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">user@office.com</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200">password123</code></p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Building size={20} />
            </div>
            <span className="text-xl font-black text-gray-900">OfficeBook</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <img src={user.avatar} className="w-6 h-6 rounded-full" alt={user.name} />
              <span className="text-sm font-bold text-gray-700">{user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <WeeklyList 
          currentUser={user} 
          attendance={attendance} 
          onJoin={handleJoin} 
          onLeave={handleLeave} 
        />
      </main>
    </div>
  );
};

export default App;
