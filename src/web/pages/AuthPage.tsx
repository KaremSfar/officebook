import React, { useState } from 'react';
import { Mail, Lock, Building, AlertCircle, User as UserIcon, Loader2 } from 'lucide-react';
import { useLogin, useRegister } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error = (loginMutation.error as Error)?.message || (registerMutation.error as Error)?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (name.length < 2) return;
      registerMutation.mutate({ name, email, password });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              loginMutation.reset();
              registerMutation.reset();
            }}
            disabled={isLoading}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
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
};

export default AuthPage;
