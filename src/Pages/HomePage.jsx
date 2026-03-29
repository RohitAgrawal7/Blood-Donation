import React from 'react';
import { Heart, Users, Clock, Droplet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DonorForm from '../components/DonorForm';
import useDonors from '../hooks/useDonors';

export default function HomePage() {
  const navigate = useNavigate();
  const { stats, addDonor } = useDonors();

  const handleSuccessfulSubmit = (newDonor) => {
    addDonor(newDonor);
    // Auto redirect to dashboard after successful registration
    setTimeout(() => navigate('/dashboard'), 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-16 h-16 text-red-600 fill-red-600 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Sant Nirankari Charitable Foundation (SNCF)</h1>
          <p className="text-xl text-gray-600">Save Lives. Donate Blood. Be a Hero.</p>
        </header>

        {/* Live Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={Users} title="Total Registered Donors" value={stats.total} colorClass="text-blue-600" />
          <StatCard icon={Clock} title="Registrations Today" value={stats.today} colorClass="text-green-600" />
          <StatCard icon={Droplet} title="Emergency Support" value="24/7" colorClass="text-red-600" />
        </div>

        {/* Registration Form Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Register as a Blood Donor
          </h2>
          <DonorForm onSubmitSuccess={handleSuccessfulSubmit} />

          {/* Link to Dashboard */}
          <div className="mt-8 text-center">
            <Link
              to="/dashboard"
              className="text-red-600 hover:text-red-700 font-semibold underline transition-colors"
            >
              View Donor Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}