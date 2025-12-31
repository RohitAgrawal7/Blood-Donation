import React from 'react';

export default function StatCard({ icon: Icon, title, value, colorClass = "text-red-600" }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
      <Icon className={`w-12 h-12 ${colorClass} mb-4`} />
      <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}