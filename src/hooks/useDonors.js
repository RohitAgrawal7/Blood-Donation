import { useState, useEffect } from 'react';

export default function useDonors() {
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    byBloodType: {},
    male: 0,
    female: 0,
    other: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    completeForms: 0 // All validated registrations
  });

  useEffect(() => {
    try {
      const savedDonors = JSON.parse(localStorage.getItem('bloodDonors') || '[]');
      setDonors(savedDonors);
      calculateStats(savedDonors);
    } catch (error) {
      console.error('Error loading donors:', error);
      setDonors([]);
      calculateStats([]);
    }
  }, []);

  const calculateStats = (donorList) => {
    const todayString = new Date().toDateString();
    const todayCount = donorList.filter(d => new Date(d.registeredAt).toDateString() === todayString).length;
    const bloodTypeCounts = donorList.reduce((acc, d) => { acc[d.bloodType] = (acc[d.bloodType] || 0) + 1; return acc; }, {});
    const genderCounts = donorList.reduce((acc, d) => {
      if (d.gender === 'Male') acc.male++;
      else if (d.gender === 'Female') acc.female++;
      else if (d.gender === 'Other') acc.other++;
      return acc;
    }, { male: 0, female: 0, other: 0 });
    const statusCounts = donorList.reduce((acc, d) => {
      if (d.status === 'accepted') acc.accepted++;
      else if (d.status === 'rejected') acc.rejected++;
      else acc.pending++;
      return acc;
    }, { accepted: 0, rejected: 0, pending: 0 });

    setStats({
      total: donorList.length,
      today: todayCount,
      byBloodType: bloodTypeCounts,
      ...genderCounts,
      ...statusCounts,
      completeForms: donorList.length // All are complete post-validation
    });
  };

  const addDonor = (newDonor) => {
    const updated = [...donors, { ...newDonor, status: 'pending' }]; // Default pending
    setDonors(updated);
    try {
      localStorage.setItem('bloodDonors', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving:', error);
    }
    calculateStats(updated);
  };

  const updateDonorStatus = (id, newStatus) => {
    const updated = donors.map(d => d.id === id ? { ...d, status: newStatus } : d);
    setDonors(updated);
    localStorage.setItem('bloodDonors', JSON.stringify(updated));
    calculateStats(updated);
  };

  return { donors, stats, addDonor, updateDonorStatus };
}