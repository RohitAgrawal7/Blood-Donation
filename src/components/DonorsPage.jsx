import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import useDonors from '../hooks/useDonors';
import DonorTable from '../components/DonorTable';
import SearchFilter from '../components/SearchFilter';
import StatusBadge from '../components/StatusBadge';

const DonorsPage = () => {
  const { donors, updateDonorStatus, stats } = useDonors();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    bloodType: 'all',
    city: 'all'
  });

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch = 
        donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone.includes(searchTerm);

      const matchesStatus = filters.status === 'all' || donor.status === filters.status;
      const matchesBloodType = filters.bloodType === 'all' || donor.bloodType === filters.bloodType;
      const matchesCity = filters.city === 'all' || donor.city === filters.city;

      return matchesSearch && matchesStatus && matchesBloodType && matchesCity;
    });
  }, [donors, searchTerm, filters]);

  const handleStatusChange = (donorId, newStatus) => {
    updateDonorStatus(donorId, newStatus);
  };

  const sendReminder = (donor) => {
    // Integration with email/WhatsApp API
    alert(`Reminder sent to ${donor.fullName}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donor Management</h1>
          <p className="text-gray-600">Manage donor applications and status</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Approved', value: stats.approved, color: 'green' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Rejected', value: stats.rejected, color: 'red' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-${stat.color}-50 border-${stat.color}-200 border rounded-xl p-4`}>
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <SearchFilter
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, email, or phone..."
          />
          
          <select
            className="border rounded-lg px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            className="border rounded-lg px-3 py-2"
            value={filters.bloodType}
            onChange={(e) => setFilters({...filters, bloodType: e.target.value})}
          >
            <option value="all">All Blood Types</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            className="border rounded-lg px-3 py-2"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          >
            <option value="all">All Cities</option>
            {[...new Set(donors.map(d => d.city))].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Donor Table with Actions */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <DonorTable 
          donors={filteredDonors}
          onStatusChange={handleStatusChange}
          onSendReminder={sendReminder}
        />
        
        {/* Action Panel */}
        <div className="border-t p-4 bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredDonors.length} of {donors.length} donors
          </div>
          <div className="space-x-3">
            <button
              onClick={() => filteredDonors.forEach(d => handleStatusChange(d.id, 'approved'))}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              Approve All Filtered
            </button>
            <button
              onClick={() => filteredDonors.forEach(d => sendReminder(d))}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorsPage;