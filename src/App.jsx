import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';

// Import Components
import DonorForm from './components/DonorForm';
import DonorTable from './components/DonorTable';
import StatCard from './components/StatCard';
import BloodTypeDistribution from './components/BloodTypeDistribution';

// Import Pages
import HomePage from './pages/HomePage';
import DonorsPage from './components/DonorsPage';
import DashboardPage from './Pages/DashboardPage';

// Import Hooks
import useDonors from './hooks/useDonors';

// Navigation Component
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/register', label: 'Register', icon: '📝' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/donors', label: 'Donors', icon: '👥' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Droplet className="w-8 h-8 text-red-600 fill-red-600" />
            <div>
              <span className="text-xl font-bold text-gray-800">LifeFlow</span>
              <span className="text-sm text-gray-600 ml-2">Blood Bank</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// Main App Component
const App = () => {
  const { donors, stats, addDonor, updateDonorStatus } = useDonors();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;