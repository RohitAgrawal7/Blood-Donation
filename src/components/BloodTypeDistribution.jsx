// import React from 'react';

// const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// export default function BloodTypeDistribution({ byBloodType }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Blood Type Distribution</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {bloodTypes.map((type) => (
//           <div
//             key={type}
//             className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 text-center border-2 border-red-100 hover:border-red-300 transition-all"
//           >
//             <div className="text-2xl font-bold text-red-600 mb-2">{type}</div>
//             <div className="text-3xl font-bold text-gray-800">
//               {byBloodType[type] || 0}
//             </div>
//             <div className="text-sm text-gray-600 mt-1">donors</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Droplet } from 'lucide-react';

const BloodTypeDistribution = ({ data, showPercentages = true, showCounts = true, compact = false }) => {
  const totalDonors = useMemo(() => {
    return Object.values(data).reduce((sum, count) => sum + (count || 0), 0);
  }, [data]);

  const bloodTypes = useMemo(() => {
    const types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return types.map(type => ({
      type,
      count: data[type] || 0,
      percentage: totalDonors > 0 ? ((data[type] || 0) / totalDonors * 100).toFixed(1) : 0
    })).sort((a, b) => b.count - a.count);
  }, [data, totalDonors]);

  const getBloodTypeColor = (type) => {
    const colors = {
      'A+': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', bar: 'bg-red-500' },
      'A-': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', bar: 'bg-red-600' },
      'B+': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', bar: 'bg-blue-500' },
      'B-': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', bar: 'bg-blue-600' },
      'AB+': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', bar: 'bg-purple-500' },
      'AB-': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', bar: 'bg-purple-600' },
      'O+': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', bar: 'bg-green-500' },
      'O-': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', bar: 'bg-green-600' }
    };
    return colors[type] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', bar: 'bg-gray-500' };
  };

  const getCompatibilityInfo = (type) => {
    const compatibility = {
      'O-': 'Universal Donor',
      'O+': 'Compatible with O+, A+, B+, AB+',
      'A-': 'Compatible with A-, A+, AB-, AB+',
      'A+': 'Compatible with A+, AB+',
      'B-': 'Compatible with B-, B+, AB-, AB+',
      'B+': 'Compatible with B+, AB+',
      'AB-': 'Compatible with AB-, AB+',
      'AB+': 'Universal Recipient'
    };
    return compatibility[type] || '';
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bloodTypes.map(({ type, count, percentage }) => {
          const colors = getBloodTypeColor(type);
          return (
            <div 
              key={type} 
              className={`rounded-xl p-4 text-center border-2 ${colors.bg} ${colors.border} transition-all hover:scale-105`}
              title={`${type}: ${count} donors (${percentage}%)`}
            >
              <div className={`text-xl font-bold ${colors.text} mb-1`}>{type}</div>
              <div className="text-2xl font-bold text-gray-800">{count}</div>
              {showPercentages && (
                <div className="text-sm text-gray-600">({percentage}%)</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Blood Type Distribution</h3>
          <p className="text-sm text-gray-600">{totalDonors} total donors</p>
        </div>
        <Droplet className="w-6 h-6 text-red-500" />
      </div>

      {/* Distribution Bars */}
      <div className="space-y-4">
        {bloodTypes.map(({ type, count, percentage }) => {
          const colors = getBloodTypeColor(type);
          const compatibility = getCompatibilityInfo(type);
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${colors.text}`}>{type}</span>
                  {showCounts && <span className="text-gray-700">{count}</span>}
                  {showPercentages && <span className="text-gray-500">({percentage}%)</span>}
                </div>
                {count > 0 && (
                  <div className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                    {compatibility}
                  </div>
                )}
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Type A (A+, A-)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-600">Type B (B+, B-)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-600">Type AB (AB+, AB-)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Type O (O+, O-)</span>
        </div>
      </div>

      {/* Urgent Types */}
      {bloodTypes.some(bt => bt.count < 3 && bt.count > 0) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="font-semibold">⚠️ Urgent Need:</span>
            <span>
              {bloodTypes
                .filter(bt => bt.count < 3 && bt.count > 0)
                .map(bt => bt.type)
                .join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

BloodTypeDistribution.propTypes = {
  data: PropTypes.object.isRequired,
  showPercentages: PropTypes.bool,
  showCounts: PropTypes.bool,
  compact: PropTypes.bool
};

BloodTypeDistribution.defaultProps = {
  data: {},
  showPercentages: true,
  showCounts: true,
  compact: false
};

export default BloodTypeDistribution;