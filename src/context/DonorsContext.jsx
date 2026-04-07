import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext.jsx';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3001';

function normalizeDonor(d) {
  return {
    ...d,
    status: d?.status || 'pending',
    registeredAt: d?.registeredAt || new Date().toISOString(),
  };
}
 

function calculateStats(donorList) {
  // For this project, treat "Today's Registrations" as the same as total registrations
  const todayCount = donorList.length;

  const byBloodType = donorList.reduce((acc, d) => {
    if (!d?.bloodType) return acc;
    acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
    return acc;
  }, {});

  const acceptedByBloodType = donorList.reduce((acc, d) => {
    if ((d?.status || 'pending') !== 'accepted') return acc;
    if (!d?.bloodType) return acc;
    acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = donorList.reduce(
    (acc, d) => {
      if (d.status === 'accepted') acc.accepted++;
      else if (d.status === 'rejected') acc.rejected++;
      else acc.pending++;
      return acc;
    },
    { accepted: 0, rejected: 0, pending: 0 }
  );

  const male = donorList.reduce((acc, d) => (String(d.gender || '').toLowerCase() === 'male' ? acc + 1 : acc), 0);
  const female = donorList.reduce((acc, d) => (String(d.gender || '').toLowerCase() === 'female' ? acc + 1 : acc), 0);
  const acceptedMale = donorList.reduce(
    (acc, d) => (String(d.gender || '').toLowerCase() === 'male' && (d.status || 'pending') === 'accepted' ? acc + 1 : acc),
    0
  );
  const acceptedFemale = donorList.reduce(
    (acc, d) => (String(d.gender || '').toLowerCase() === 'female' && (d.status || 'pending') === 'accepted' ? acc + 1 : acc),
    0
  );

  return {
    total: donorList.length,
    today: todayCount,
    byBloodType,
    acceptedByBloodType,
    ...statusCounts,
    male,
    female,
    acceptedMale,
    acceptedFemale,
  };
}

const DonorsContext = createContext(null);

export function DonorsProvider({ children }) {
  // No mock data, no localStorage fallbacks — load from API only
  const [donors, setDonors] = useState([]);
  const { token } = useAdminAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/donors`);
        if (!res.ok) return;
        const body = await res.json();
        const list = Array.isArray(body.data) ? body.data : body;
        if (!mounted) return;
        setDonors((list || []).map(normalizeDonor));
      } catch (e) {
        // API unreachable — keep donors empty (no fallback)
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => calculateStats(donors), [donors]);

  const addDonor = async (newDonor) => {
    // Only update UI after successful POST
    try {
      const payload = {
        fullName: newDonor.fullName || newDonor.name || 'Donor',
        phone: newDonor.phone || '0000000000',
        age: newDonor.age || 30,
        bloodType: newDonor.bloodType || 'O+',
        city: newDonor.city || newDonor.address || 'Unknown',
        address: newDonor.address || '',
        gender: newDonor.gender || '',
      };
      const res = await fetch(`${API_BASE}/api/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const saved = await res.json();
      setDonors((prev) => [normalizeDonor(saved), ...prev]);
      return saved;
    } catch (e) {
      return null;
    }
  };

  const updateDonorStatus = async (id, newStatus) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/donors/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return false;
      setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));
      return true;
    } catch (e) {
      return false;
    }
  };

  const value = useMemo(() => ({ donors, stats, addDonor, updateDonorStatus }), [donors, stats, token]);

  return <DonorsContext.Provider value={value}>{children}</DonorsContext.Provider>;
}

export default function useDonorsContext() {
  const ctx = useContext(DonorsContext);
  if (!ctx) throw new Error('useDonors must be used within <DonorsProvider />');
  return ctx;
}

