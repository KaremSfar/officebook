import React from 'react';
import { Building, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onProfileClick }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Building size={20} />
          </div>
          <span className="text-xl font-black text-gray-900">OfficeBook</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" alt={user.name} />
            <span className="text-sm font-bold text-gray-700">{user.name}</span>
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
