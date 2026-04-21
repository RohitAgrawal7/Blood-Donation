import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext.jsx';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'https://bd-backend-production.up.railway.app';

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(() => ({
    total: 0,
    today: 0,
    byBloodType: {},
    acceptedByBloodType: {},
    accepted: 0,
    rejected: 0,
    pending: 0,
    male: 0,
    female: 0,
    acceptedMale: 0,
    acceptedFemale: 0,
  }));
  const { token } = useAdminAuth();

  // Load a single page from server. Returns the parsed response or null on error.
  const loadDonors = async ({ status, page: p = 1, pageSize: ps = 10 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      qs.set('page', String(p));
      qs.set('pageSize', String(ps));
      const url = `${API_BASE}/api/donors?${qs.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError(`Server returned ${res.status}`);
        setLoading(false);
        return null;
      }
      const body = await res.json();
      // API may return { data, total, page, pageSize } or an array
      const list = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : (body.data || []);
      const normalized = (list || []).map(normalizeDonor);
      setDonors(normalized);
      setTotal(body.total ?? normalized.length);
      setPage(body.page ?? p);
      setPageSize(body.pageSize ?? ps);
      // If the response contains aggregated stats, use them; otherwise do a lightweight fetch
      if (body.stats) {
        setStats(body.stats);
      }
      setLoading(false);
      return body;
    } catch (e) {
      setError(String(e));
      setLoading(false);
      return null;
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/donors/stats`);
      if (!res.ok) return;
      const body = await res.json();
      setStats(body || {});
    } catch (e) {
      // ignore
    }
  };

  // Helper to fetch all donors (on-demand) without mutating current provider state.
  const fetchAllDonors = async (status) => {
    try {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      // request a large pageSize to retrieve all rows; server will clamp pageSize
      qs.set('page', '1');
      qs.set('pageSize', '100000');
      const url = `${API_BASE}/api/donors?${qs.toString()}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const body = await res.json();
      const list = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : (body.data || []);
      return (list || []).map(normalizeDonor);
    } catch (e) {
      return [];
    }
  };

  // Note: `stats` is fetched from server (setStats). calculateStats() remains
  // available as a local fallback but is not used for the exported `stats`.

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
        email: newDonor.email || '',
        emergencyPhone: newDonor.emergencyPhone || '',
      };
      const res = await fetch(`${API_BASE}/api/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const saved = await res.json();
      // after adding a donor, refresh current page and global stats
      await loadDonors({ page, pageSize });
      await loadStats();
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
      // Try optimistic update; if donor not present on current page, reload page
      let found = false;
      setDonors((prev) => prev.map((d) => {
        if (d.id === id) {
          found = true;
          return { ...d, status: newStatus };
        }
        return d;
      }));
      if (!found) {
        // reload current page so the change is visible
        await loadDonors({ page, pageSize });
      }
      // refresh global stats after status change
      await loadStats();
      return true;
    } catch (e) {
      return false;
    }
  };

  // Auto-load initial page and stats once on mount
  useEffect(() => {
    (async () => {
      await loadDonors({ page: 1, pageSize });
      await loadStats();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      donors,
      stats,
      addDonor,
      updateDonorStatus,
      loadDonors,
      fetchAllDonors,
      loadStats,
      page,
      pageSize,
      total,
      loading,
      error,
      setPage,
      setPageSize,
    }),
    [donors, stats, token, page, pageSize, total, loading, error]
  );

  return <DonorsContext.Provider value={value}>{children}</DonorsContext.Provider>;
}

export default function useDonorsContext() {
  const ctx = useContext(DonorsContext);
  if (!ctx) throw new Error('useDonors must be used within <DonorsProvider />');
  return ctx;
}

