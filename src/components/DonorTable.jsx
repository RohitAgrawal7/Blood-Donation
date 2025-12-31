import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, XCircle, Clock, Mail, Phone, MapPin,
  User, Calendar, MoreVertical, Search, Filter,
  ChevronDown, ChevronUp, Download, Eye, Edit, Trash2
} from 'lucide-react';

const DonorTable = ({ 
  donors, 
  onStatusChange, 
  onView, 
  onEdit, 
  onDelete,
  onSelect,
  selectedIds = [],
  showFilters = true,
  showActions = true,
  compact = false
}) => {
  const [sortField, setSortField] = useState('registeredAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statusOptions = ['all', 'pending', 'approved', 'rejected', 'active', 'inactive'];

  const filteredAndSortedDonors = useMemo(() => {
    let filtered = donors.filter(donor => {
      const matchesSearch = 
        donor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone?.includes(searchTerm) ||
        donor.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
      const matchesBloodType = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
      const matchesCity = cityFilter === 'all' || donor.city === cityFilter;

      return matchesSearch && matchesStatus && matchesBloodType && matchesCity;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'registeredAt' || sortField === 'lastUpdated') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [donors, searchTerm, statusFilter, bloodTypeFilter, cityFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' },
      active: { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" />, label: 'Inactive' }
    };

    const { color, icon, label } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {label}
      </span>
    );
  };

  const getBloodTypeBadge = (type) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
        {type}
      </span>
    );
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Blood Type', 'City', 'Status', 'Registered'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedDonors.map(d => [
        d.fullName,
        d.email,
        d.phone,
        d.bloodType,
        d.city,
        d.status,
        new Date(d.registeredAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortableHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredAndSortedDonors.map(donor => (
          <div key={donor.id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-900">{donor.fullName}</div>
                <div className="text-sm text-gray-600">{donor.bloodType} • {donor.city}</div>
              </div>
              <div>
                {getStatusBadge(donor.status)}
              </div>
            </div>
            {showActions && (
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                <button
                  onClick={() => onView && onView(donor)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  View
                </button>
                <button
                  onClick={() => onStatusChange(donor.id, 'approved')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="all">All Cities</option>
              {[...new Set(donors.map(d => d.city))].sort().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedDonors.length} of {donors.length} donors
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {onSelect && (
                  <th className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredAndSortedDonors.length}
                      onChange={(e) => {
                        const allIds = filteredAndSortedDonors.map(d => d.id);
                        onSelect(e.target.checked ? allIds : []);
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                
                <th className="py-3 px-4 text-left">
                  <SortableHeader field="fullName">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Donor
                    </div>
                  </SortableHeader>
                </th>
                
                <th className="py-3 px-4 text-left">
                  <SortableHeader field="bloodType">
                    Blood Type
                  </SortableHeader>
                </th>
                
                <th className="py-3 px-4 text-left">
                  <SortableHeader field="city">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  </SortableHeader>
                </th>
                
                <th className="py-3 px-4 text-left">
                  <SortableHeader field="status">
                    Status
                  </SortableHeader>
                </th>
                
                <th className="py-3 px-4 text-left">
                  <SortableHeader field="registeredAt">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Registered
                    </div>
                  </SortableHeader>
                </th>
                
                {showActions && (
                  <th className="py-3 px-4 text-left">Actions</th>
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedDonors.length === 0 ? (
                <tr>
                  <td 
                    colSpan={showActions ? 7 : 6} 
                    className="py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-12 h-12 text-gray-300" />
                      <p className="text-lg">No donors found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedDonors.map(donor => (
                  <tr 
                    key={donor.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {onSelect && (
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(donor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onSelect([...selectedIds, donor.id]);
                            } else {
                              onSelect(selectedIds.filter(id => id !== donor.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{donor.fullName}</div>
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {donor.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {donor.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      {getBloodTypeBadge(donor.bloodType)}
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="font-medium">{donor.city}</div>
                      <div className="text-sm text-gray-500">{donor.address?.substring(0, 30)}...</div>
                    </td>
                    
                    <td className="py-3 px-4">
                      {getStatusBadge(donor.status)}
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(donor.registeredAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(donor.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    
                    {showActions && (
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onView && onView(donor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => onEdit && onEdit(donor)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {donor.status !== 'approved' && (
                            <button
                              onClick={() => onStatusChange && onStatusChange(donor.id, 'approved')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {donor.status !== 'rejected' && (
                            <button
                              onClick={() => onStatusChange && onStatusChange(donor.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => onDelete && onDelete(donor.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="border-t bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-yellow-800">
                {selectedIds.length} donor(s) selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => selectedIds.forEach(id => onStatusChange(id, 'approved'))}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Approve Selected
                </button>
                <button
                  onClick={() => selectedIds.forEach(id => onStatusChange(id, 'rejected'))}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Reject Selected
                </button>
                <button
                  onClick={() => selectedIds.forEach(id => onDelete(id))}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DonorTable.propTypes = {
  donors: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  selectedIds: PropTypes.array,
  showFilters: PropTypes.bool,
  showActions: PropTypes.bool,
  compact: PropTypes.bool
};

DonorTable.defaultProps = {
  donors: [],
  selectedIds: [],
  showFilters: true,
  showActions: true,
  compact: false
};

export default DonorTable;