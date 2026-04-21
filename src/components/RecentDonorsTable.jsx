import React from 'react';

export default function RecentDonorsTable({ donors, updateDonorStatus, showActions = false, className = '' }) {
  // Expect `donors` to be provided as most-recent-first by the provider (server-side paging).
  // Show up to the first 10 entries.
  const recent = (donors || []).slice(0, 10);

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 mt-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Registrations</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Blood Type</th>
              <th className="text-left py-3 px-4">Gender</th>
              <th className="text-left py-3 px-4">City</th>
              <th className="text-left py-3 px-4">Contact</th>
              <th className="text-left py-3 px-4">Registered</th>
              <th className="text-left py-3 px-4">Status</th>
              {showActions && <th className="text-left py-3 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {recent.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{d.fullName}</td>
                <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">{d.bloodType}</span></td>
                <td className="py-3 px-4">{d.gender ?? '-'}</td>
                <td className="py-3 px-4">{d.city}</td>
                <td className="py-3 px-4">{d.phone}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{new Date(d.registeredAt).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${(d.status || 'pending') === 'accepted' ? 'bg-green-100 text-green-700' : (d.status || 'pending') === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {(d.status || 'pending').charAt(0).toUpperCase() + (d.status || 'pending').slice(1)}
                  </span>
                </td>
                {showActions && (
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateDonorStatus?.(d.id, 'accepted')}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateDonorStatus?.(d.id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {donors.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-lg">
            No donors yet.
          </div>
        )}
      </div>
    </div>
  );
}