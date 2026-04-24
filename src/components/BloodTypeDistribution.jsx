import React from 'react';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'None'];

export default function BloodTypeDistribution({ byBloodType, title = 'Blood Type Distribution' }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodTypes.map((type) => (
          <div
            key={type}
            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 text-center border-2 border-red-100 hover:border-red-300 transition-all"
          >
            <div className="text-2xl font-bold text-red-600 mb-2">{type}</div>
            <div className="text-3xl font-bold text-gray-800">
              {byBloodType[type] || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">donors</div>
          </div>
        ))}
      </div>
    </div>
  );
}