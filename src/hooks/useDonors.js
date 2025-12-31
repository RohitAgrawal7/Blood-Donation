// import { useState, useEffect } from 'react';

// export default function useDonors() {
//   const [donors, setDonors] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     today: 0,
//     byBloodType: {},
//     male: 0,
//     female: 0,
//     other: 0,
//     accepted: 0,
//     rejected: 0,
//     pending: 0,
//     completeForms: 0 // All validated registrations
//   });

//   useEffect(() => {
//     try {
//       const savedDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
//       setDonors(savedDonors);
//       calculateStats(savedDonors);
//     } catch (error) {
//       console.error('Error loading donors:', error);
//       setDonors([]);
//       calculateStats([]);
//     }
//   }, []);

//   const calculateStats = (donorList) => {
//     const todayString = new Date().toDateString();
//     const todayCount = donorList.filter(d => new Date(d.registeredAt).toDateString() === todayString).length;
//     const bloodTypeCounts = donorList.reduce((acc, d) => { acc[d.bloodType] = (acc[d.bloodType] || 0) + 1; return acc; }, {});
//     const genderCounts = donorList.reduce((acc, d) => {
//       if (d.gender === 'Male') acc.male++;
//       else if (d.gender === 'Female') acc.female++;
//       else if (d.gender === 'Other') acc.other++;
//       return acc;
//     }, { male: 0, female: 0, other: 0 });
//     const statusCounts = donorList.reduce((acc, d) => {
//       if (d.status === 'accepted') acc.accepted++;
//       else if (d.status === 'rejected') acc.rejected++;
//       else acc.pending++;
//       return acc;
//     }, { accepted: 0, rejected: 0, pending: 0 });

//     setStats({
//       total: donorList.length,
//       today: todayCount,
//       byBloodType: bloodTypeCounts,
//       ...genderCounts,
//       ...statusCounts,
//       completeForms: donorList.length // All are complete post-validation
//     });
//   };

//   const addDonor = (newDonor) => {
//     const updated = [...donors, { ...newDonor, status: 'pending' }]; // Default pending
//     setDonors(updated);
//     try {
//       localStorage.setItem('bloodDonors', JSON.stringify(updated));
//     } catch (error) {
//       console.error('Error saving:', error);
//     }
//     calculateStats(updated);
//   };

//   const updateDonorStatus = (id, newStatus) => {
//     const updated = donors.map(d => d.id === id ? { ...d, status: newStatus } : d);
//     setDonors(updated);
//     localStorage.setItem('bloodDonors', JSON.stringify(updated));
//     calculateStats(updated);
//   };

//   return { donors, stats, addDonor, updateDonorStatus };
// }

import { useState, useEffect, useCallback } from 'react';

const useDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load donors from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bloodDonors');
      if (saved) {
        setDonors(JSON.parse(saved));
      }
    } catch (err) {
      setError('Failed to load donor data');
      console.error('Error loading donors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save donors to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('bloodDonors', JSON.stringify(donors));
      } catch (err) {
        setError('Failed to save donor data');
        console.error('Error saving donors:', err);
      }
    }
  }, [donors, loading]);

  // Calculate statistics
  const calculateStats = useCallback((donorList = donors) => {
    const today = new Date().toDateString();
    
    const todayCount = donorList.filter(d => 
      new Date(d.registeredAt).toDateString() === today
    ).length;

    const statusCounts = donorList.reduce((acc, donor) => {
      const status = donor.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, active: 0, inactive: 0 });

    const bloodTypeCounts = donorList.reduce((acc, donor) => {
      if (donor.bloodType) {
        acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
      }
      return acc;
    }, {});

    const cityCounts = donorList.reduce((acc, donor) => {
      if (donor.city) {
        acc[donor.city] = (acc[donor.city] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate urgent blood types (less than 3 donors)
    const urgentTypes = Object.entries(bloodTypeCounts)
      .filter(([_, count]) => count < 3)
      .map(([type]) => type);

    return {
      total: donorList.length,
      today: todayCount,
      pending: statusCounts.pending,
      approved: statusCounts.approved,
      rejected: statusCounts.rejected,
      active: statusCounts.active,
      inactive: statusCounts.inactive,
      byBloodType: bloodTypeCounts,
      byCity: cityCounts,
      urgentTypes,
      lastUpdated: new Date().toISOString()
    };
  }, [donors]);

  // Add a new donor
  const addDonor = useCallback((donorData) => {
    const newDonor = {
      ...donorData,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: donorData.status || 'pending'
    };

    setDonors(prev => {
      const updated = [...prev, newDonor];
      return updated;
    });

    return newDonor;
  }, []);

  // Update donor status
  const updateDonorStatus = useCallback((donorId, status) => {
    setDonors(prev => prev.map(donor => 
      donor.id === donorId 
        ? { 
            ...donor, 
            status, 
            lastUpdated: new Date().toISOString() 
          }
        : donor
    ));
  }, []);

  // Update donor information
  const updateDonor = useCallback((donorId, updates) => {
    setDonors(prev => prev.map(donor => 
      donor.id === donorId 
        ? { 
            ...donor, 
            ...updates, 
            lastUpdated: new Date().toISOString() 
          }
        : donor
    ));
  }, []);

  // Delete donor
  const deleteDonor = useCallback((donorId) => {
    setDonors(prev => prev.filter(donor => donor.id !== donorId));
  }, []);

  // Bulk delete donors
  const deleteDonors = useCallback((donorIds) => {
    setDonors(prev => prev.filter(donor => !donorIds.includes(donor.id)));
  }, []);

  // Search donors
  const searchDonors = useCallback((query) => {
    const searchTerm = query.toLowerCase();
    return donors.filter(donor => 
      donor.fullName?.toLowerCase().includes(searchTerm) ||
      donor.email?.toLowerCase().includes(searchTerm) ||
      donor.phone?.includes(searchTerm) ||
      donor.city?.toLowerCase().includes(searchTerm) ||
      donor.bloodType?.toLowerCase().includes(searchTerm)
    );
  }, [donors]);

  // Filter donors by criteria
  const filterDonors = useCallback((filters = {}) => {
    return donors.filter(donor => {
      // Status filter
      if (filters.status && filters.status !== 'all' && donor.status !== filters.status) {
        return false;
      }

      // Blood type filter
      if (filters.bloodType && filters.bloodType !== 'all' && donor.bloodType !== filters.bloodType) {
        return false;
      }

      // City filter
      if (filters.city && filters.city !== 'all' && donor.city !== filters.city) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const donorDate = new Date(donor.registeredAt);
        if (filters.dateRange.start && donorDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && donorDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      // Age range filter
      if (filters.ageRange && donor.age) {
        const age = parseInt(donor.age);
        if (filters.ageRange.min && age < filters.ageRange.min) {
          return false;
        }
        if (filters.ageRange.max && age > filters.ageRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [donors]);

  // Get donor by ID
  const getDonorById = useCallback((donorId) => {
    return donors.find(donor => donor.id === donorId);
  }, [donors]);

  // Get recent donors
  const getRecentDonors = useCallback((limit = 10) => {
    return [...donors]
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      .slice(0, limit);
  }, [donors]);

  // Import donors
  const importDonors = useCallback((newDonors) => {
    const importedDonors = newDonors.map(donor => ({
      ...donor,
      id: donor.id || Date.now() + Math.random().toString(36).substr(2, 9),
      registeredAt: donor.registeredAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }));

    setDonors(prev => [...prev, ...importedDonors]);
    return importedDonors;
  }, []);

  // Clear all donors
  const clearAllDonors = useCallback(() => {
    setDonors([]);
  }, []);

  // Export donors
  const exportDonors = useCallback((filters = {}) => {
    const donorList = filters ? filterDonors(filters) : donors;
    return donorList;
  }, [donors, filterDonors]);

  return {
    donors,
    loading,
    error,
    stats: calculateStats(),
    calculateStats,
    addDonor,
    updateDonorStatus,
    updateDonor,
    deleteDonor,
    deleteDonors,
    searchDonors,
    filterDonors,
    getDonorById,
    getRecentDonors,
    importDonors,
    clearAllDonors,
    exportDonors
  };
};

export default useDonors;