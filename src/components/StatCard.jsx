// import React from 'react';

// export default function StatCard({ icon: Icon, title, value, colorClass = "text-red-600" }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
//       <Icon className={`w-12 h-12 ${colorClass} mb-4`} />
//       <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
//       <p className="text-gray-600">{title}</p>
//     </div>
//   );
// }

import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon, color, description, trend, className }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600'
  };

  const iconClasses = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600'
  };

  return (
    <div className={`rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${colorClasses[color]} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <div className="flex items-end gap-2 mb-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            {trend && (
              <span className={`text-sm font-semibold ${trest.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm opacity-75">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-white ${iconClasses[color]}`}>
            <div className="w-6 h-6">{icon}</div>
          </div>
        )}
      </div>
      
      {trend && trend.label && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <div className="flex justify-between items-center">
            <span className="text-sm">{trend.label}</span>
            <span className={`text-sm font-semibold ${trend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.change > 0 ? '+' : ''}{trend.change}
            </span>
          </div>
          {trend.timeframe && (
            <div className="text-xs opacity-60 mt-1">{trend.timeframe}</div>
          )}
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'yellow', 'indigo', 'pink']),
  description: PropTypes.string,
  trend: PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
    change: PropTypes.number,
    timeframe: PropTypes.string
  }),
  className: PropTypes.string
};

StatCard.defaultProps = {
  color: 'blue',
  className: ''
};

export default StatCard;