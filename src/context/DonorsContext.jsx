import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bloodDonors';

function normalizeDonor(d) {
  return {
    ...d,
    status: d?.status || 'pending',
    registeredAt: d?.registeredAt || new Date().toISOString(),
  };
}

function loadInitialDonors() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeDonor);
  } catch (e) {
    console.error('Error loading donors:', e);
    return [];
  }
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

  // Gender-based counts (case-insensitive). Donors may omit gender; those are ignored here.
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
  const [donors, setDonors] = useState(() => loadInitialDonors());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
    } catch (e) {
      console.error('Error saving donors:', e);
    }
  }, [donors]);

  const stats = useMemo(() => calculateStats(donors), [donors]);

  const addDonor = (newDonor) => {
    const donor = normalizeDonor({
      ...newDonor,
      status: 'pending',
    });
    setDonors((prev) => [...prev, donor]);
  };

  const updateDonorStatus = (id, newStatus) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const value = useMemo(
    () => ({ donors, stats, addDonor, updateDonorStatus }),
    [donors, stats]
  );

  return <DonorsContext.Provider value={value}>{children}</DonorsContext.Provider>;
}

export default function useDonorsContext() {
  const ctx = useContext(DonorsContext);
  if (!ctx) throw new Error('useDonors must be used within <DonorsProvider />');
  return ctx;
}

