import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Search, Filter, X, ChevronDown, Calendar, 
  MapPin, Users, Droplet, Sliders, RefreshCw
} from 'lucide-react';

const SearchFilter = ({
  value,
  onChange,
  placeholder = 'Search...',
  filters = {},
  onFilterChange,
  onClear,
  showAdvanced = false,
  onAdvancedToggle,
  searchTypes = ['name', 'email', 'phone', 'city'],
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchType, setSearchType] = useState('all');
  const searchRef = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleFilterChange = (key, filterValue) => {
    const updatedFilters = { ...localFilters, [key]: filterValue };
    setLocalFilters(updatedFilters);
    
    // Apply filter after a short delay
    const timeoutId = setTimeout(() => {
      onFilterChange && onFilterChange(updatedFilters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    onChange('');
    setLocalFilters({});
    onClear && onClear();
  };

  const handleApplyFilters = () => {
    onFilterChange && onFilterChange(localFilters);
    setIsExpanded(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onFilterChange && onFilterChange(resetFilters);
  };

  const getFilterCount = () => {
    return Object.values(localFilters).filter(v => 
      v !== undefined && v !== '' && v !== 'all'
    ).length;
  };

  const filterCount = getFilterCount();

  const advancedFilters = [
    {
      key: 'status',
      label: 'Status',
      icon: <Users className="w-4 h-4" />,
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'bloodType',
      label: 'Blood Type',
      icon: <Droplet className="w-4 h-4" />,
      type: 'select',
      options: [
        { value: 'all', label: 'All Blood Types' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ]
    },
    {
      key: 'city',
      label: 'City',
      icon: <MapPin className="w-4 h-4" />,
      type: 'select',
      options: [
        { value: 'all', label: 'All Cities' },
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Hyderabad', label: 'Hyderabad' },
        { value: 'Chennai', label: 'Chennai' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      icon: <Calendar className="w-4 h-4" />,
      type: 'date-range',
      placeholder: 'Select date range'
    },
    {
      key: 'ageRange',
      label: 'Age Range',
      icon: <Users className="w-4 h-4" />,
      type: 'range',
      min: 18,
      max: 65,
      step: 1
    }
  ];

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={localFilters[filter.key] || 'all'}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date-range':
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={localFilters[filter.key]?.start || ''}
              onChange={(e) => handleFilterChange(filter.key, {
                ...localFilters[filter.key],
                start: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="Start date"
            />
            <input
              type="date"
              value={localFilters[filter.key]?.end || ''}
              onChange={(e) => handleFilterChange(filter.key, {
                ...localFilters[filter.key],
                end: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="End date"
            />
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{localFilters[filter.key] || filter.min}</span>
              <span>to</span>
              <span>{localFilters[filter.key] || filter.max}</span>
            </div>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={localFilters[filter.key] || filter.min}
              onChange={(e) => handleFilterChange(filter.key, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={localFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            />
            
            {value && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>

          {/* Advanced Toggle */}
          {onAdvancedToggle && (
            <button
              onClick={onAdvancedToggle}
              className={`px-4 py-3 rounded-xl border-2 transition-colors ${
                showAdvanced
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-white border-gray-200 hover:border-red-400'
              }`}
            >
              <Sliders className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Type Selector */}
        {searchTypes.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setSearchType('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                searchType === 'all'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Fields
            </button>
            {searchTypes.map(type => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-3 py-1 text-sm rounded-full capitalize ${
                  searchType === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedFilters.map(filter => (
              <div key={filter.key} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {filter.icon}
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {filterCount > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Active Filters ({filterCount})
                </span>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset All
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(localFilters).map(([key, filterValue]) => {
                  if (!filterValue || filterValue === 'all') return null;
                  
                  const filterConfig = advancedFilters.find(f => f.key === key);
                  const label = filterConfig?.label || key;
                  
                  let displayValue = filterValue;
                  if (typeof filterValue === 'object') {
                    displayValue = `${filterValue.start || ''} - ${filterValue.end || ''}`;
                  }
                  
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <span className="font-medium">{label}:</span>
                      <span>{displayValue}</span>
                      <button
                        onClick={() => handleFilterChange(key, 'all')}
                        className="p-0.5 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Filter Chips */}
      {!isExpanded && filterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(localFilters).map(([key, filterValue]) => {
            if (!filterValue || filterValue === 'all') return null;
            
            const filterConfig = advancedFilters.find(f => f.key === key);
            if (!filterConfig) return null;
            
            let displayValue = filterValue;
            if (typeof filterValue === 'object') {
              displayValue = `${filterValue.start || ''} - ${filterValue.end || ''}`;
            }
            
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
              >
                <span className="font-medium">{filterConfig.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="p-0.5 hover:bg-blue-100 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

SearchFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onClear: PropTypes.func,
  showAdvanced: PropTypes.bool,
  onAdvancedToggle: PropTypes.func,
  searchTypes: PropTypes.array,
  className: PropTypes.string
};

SearchFilter.defaultProps = {
  placeholder: 'Search donors...',
  filters: {},
  searchTypes: ['name', 'email', 'phone', 'city']
};

export default SearchFilter;