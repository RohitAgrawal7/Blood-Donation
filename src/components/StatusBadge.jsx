import React from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, XCircle, Clock, AlertCircle, 
  UserCheck, UserX, Shield, Zap, Bell
} from 'lucide-react';

const StatusBadge = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showLabel = true,
  className = '',
  onClick
}) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: <Clock className="w-4 h-4" />,
      color: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: 'text-yellow-600'
      }
    },
    approved: {
      label: 'Approved',
      icon: <CheckCircle className="w-4 h-4" />,
      color: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: 'text-green-600'
      }
    },
    rejected: {
      label: 'Rejected',
      icon: <XCircle className="w-4 h-4" />,
      color: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: 'text-red-600'
      }
    },
    active: {
      label: 'Active',
      icon: <UserCheck className="w-4 h-4" />,
      color: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: 'text-blue-600'
      }
    },
    inactive: {
      label: 'Inactive',
      icon: <UserX className="w-4 h-4" />,
      color: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: 'text-gray-600'
      }
    },
    verified: {
      label: 'Verified',
      icon: <Shield className="w-4 h-4" />,
      color: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        icon: 'text-purple-600'
      }
    },
    urgent: {
      label: 'Urgent',
      icon: <AlertCircle className="w-4 h-4" />,
      color: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        icon: 'text-orange-600'
      }
    },
    emergency: {
      label: 'Emergency',
      icon: <Zap className="w-4 h-4" />,
      color: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: 'text-red-600'
      }
    },
    notified: {
      label: 'Notified',
      icon: <Bell className="w-4 h-4" />,
      color: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        icon: 'text-indigo-600'
      }
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const BadgeContent = () => (
    <>
      {showIcon && (
        <span className={config.color.icon}>
          {config.icon}
        </span>
      )}
      {showLabel && (
        <span className={`font-medium ${config.color.text}`}>
          {config.label}
        </span>
      )}
    </>
  );

  const badgeClasses = `
    inline-flex items-center gap-1.5 rounded-full border 
    ${sizeClasses[size]} 
    ${config.color.bg} 
    ${config.color.border}
    ${className}
  `.trim();

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${badgeClasses} transition-all hover:opacity-90 active:scale-95`}
      >
        <BadgeContent />
      </button>
    );
  }

  return (
    <div className={`${badgeClasses} ${className}`}>
      <BadgeContent />
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'pending', 'approved', 'rejected', 'active', 
    'inactive', 'verified', 'urgent', 'emergency', 'notified'
  ]).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

// Example usage component
export const StatusBadgeGroup = ({ statuses, selectedStatus, onStatusSelect }) => {
  const allStatuses = [
    'pending', 'approved', 'rejected', 'active', 
    'inactive', 'verified', 'urgent'
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
      {allStatuses.map(status => (
        <StatusBadge
          key={status}
          status={status}
          onClick={() => onStatusSelect && onStatusSelect(status)}
          className={selectedStatus === status ? 'ring-2 ring-offset-1 ring-gray-400' : ''}
        />
      ))}
    </div>
  );
};

// Status count display component
export const StatusCounts = ({ counts = {} }) => {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Status Distribution ({total} total)</div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <StatusBadge status={status} showLabel={false} />
            <span className="text-sm font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBadge;