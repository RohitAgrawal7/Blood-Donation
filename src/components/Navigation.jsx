import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart3, ClipboardCheck, Droplet } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { path: '/register', label: 'Register', icon: <Home className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Droplet className="w-5 h-5" /> },
    { path: '/donors', label: 'Donor Management', icon: <ClipboardCheck className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Droplet className="w-8 h-8 text-red-600 fill-red-600" />
            <span className="text-xl font-bold text-gray-800">LifeFlow Blood Bank</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-100 text-red-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;