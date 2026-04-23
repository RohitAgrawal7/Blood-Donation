import React from 'react';
import { Users, User, UserRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useDonors from '../hooks/useDonors';
import BloodTypeDistribution from '../components/BloodTypeDistribution';
import RecentDonorsTable from '../components/RecentDonorsTable';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { donors, stats } = useDonors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Donor Dashboard</h1>
          <p className="text-gray-600">Real-time donor statistics and blood type availability</p>
        </header>

        {/* Top Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <Users className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">{stats.total ?? 0}</h3>
            <p className="text-blue-100">Total Registrations</p>
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl shadow-lg p-6 text-white">
            <User className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">{stats.male ?? 0}</h3>
            <p className="text-sky-100">Total Male</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <UserRound className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">{stats.female ?? 0}</h3>
            <p className="text-pink-100">Total Female</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <CheckCircle2 className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-3xl font-bold mb-1">{(stats.acceptedMale ?? 0) + (stats.acceptedFemale ?? 0)}</h3>
            <p className="text-emerald-100">Total Accepted (M + F)</p>
          </div>
        </div>

        {/* Blood Type Distribution (same as previous) */}
        <BloodTypeDistribution byBloodType={stats.byBloodType} />

        {/* Recent Donors Table */}
  <RecentDonorsTable donors={donors} className="mt-8" showActions={false} startIndex={1} />

        <div className="mt-8 text-center">
          <Link
            to="/admin-login"
            className="text-gray-700 hover:text-gray-900 font-semibold underline underline-offset-4"
          >
            Admin Login →
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
}