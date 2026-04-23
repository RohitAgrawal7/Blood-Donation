import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext.jsx';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3001';
const LOCAL_API_BASE = 'http://localhost:3001';

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
  const loadDonors = async ({
    status,
    page: p = 1,
    pageSize: ps = 10,
    gender,
    nirankarType,
    minAge,
    maxAge,
    q,
    sortBy,
    sortDir,
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      if (gender) qs.set('gender', gender);
      if (nirankarType) qs.set('nirankarType', nirankarType);
      if (minAge != null && String(minAge).trim() !== '') qs.set('minAge', String(minAge));
      if (maxAge != null && String(maxAge).trim() !== '') qs.set('maxAge', String(maxAge));
      if (q) qs.set('q', q);
      if (sortBy) qs.set('sortBy', sortBy);
      if (sortDir) qs.set('sortDir', sortDir);
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
  const fetchAllDonors = async (opts = {}) => {
    try {
      const qs = new URLSearchParams();
      const status = typeof opts === 'string' ? opts : opts?.status;
      const gender = typeof opts === 'object' ? opts?.gender : undefined;
      const nirankarType = typeof opts === 'object' ? opts?.nirankarType : undefined;
      const minAge = typeof opts === 'object' ? opts?.minAge : undefined;
      const maxAge = typeof opts === 'object' ? opts?.maxAge : undefined;
      const q = typeof opts === 'object' ? opts?.q : undefined;
      const sortBy = typeof opts === 'object' ? opts?.sortBy : undefined;
      const sortDir = typeof opts === 'object' ? opts?.sortDir : undefined;

      if (status) qs.set('status', status);
      if (gender) qs.set('gender', gender);
      if (nirankarType) qs.set('nirankarType', nirankarType);
      if (minAge != null && String(minAge).trim() !== '') qs.set('minAge', String(minAge));
      if (maxAge != null && String(maxAge).trim() !== '') qs.set('maxAge', String(maxAge));
      if (q) qs.set('q', q);
      if (sortBy) qs.set('sortBy', sortBy);
      if (sortDir) qs.set('sortDir', sortDir);
      // Request a large (but allowed) pageSize. Server clamps to [10, 20, 50, 100].
      qs.set('page', '1');
      qs.set('pageSize', '1000');
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

  // BloodDrop realtime helper: get acceptedCount + latest accepted donors in one response.
  const fetchAcceptedSnapshot = async (limit = 200, opts = {}) => {
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(limit || 200));
      const res = await fetch(`${API_BASE}/api/donors/accepted/snapshot?${qs.toString()}`, opts);
      if (!res.ok) return { acceptedCount: 0, donors: [] };
      const body = await res.json();
      const donors = Array.isArray(body?.donors) ? body.donors.map(normalizeDonor) : [];
      const acceptedCount = typeof body?.acceptedCount === 'number' ? body.acceptedCount : Number(body?.acceptedCount || 0);
      return { acceptedCount: Number.isFinite(acceptedCount) ? acceptedCount : 0, donors };
    } catch (e) {
      return { acceptedCount: 0, donors: [] };
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
        nirankarType: newDonor.nirankarType || '',
        source: newDonor.source || '',
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

  const updateDonor = async (id, payload) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      let res = await fetch(`${API_BASE}/api/donors/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload || {}),
      });
      // Fallback to local backend when deployed API does not yet expose edit endpoint.
      if (res.status === 404 && API_BASE !== LOCAL_API_BASE) {
        res = await fetch(`${LOCAL_API_BASE}/api/donors/${id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload || {}),
        });
      }
      if (!res.ok) {
        const message = `Update failed (${res.status}). If status is 404, deploy latest backend or run local backend at ${LOCAL_API_BASE}.`;
        return { ok: false, error: message };
      }
      const updated = await res.json();
      await loadDonors({ status: activeStatusFromList(donors), page, pageSize });
      await loadStats();
      return { ok: true, data: updated };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const deleteDonor = async (id) => {
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      let res = await fetch(`${API_BASE}/api/donors/${id}`, {
        method: 'DELETE',
        headers,
      });
      // Fallback to local backend when deployed API does not yet expose delete endpoint.
      if (res.status === 404 && API_BASE !== LOCAL_API_BASE) {
        res = await fetch(`${LOCAL_API_BASE}/api/donors/${id}`, {
          method: 'DELETE',
          headers,
        });
      }
      if (!res.ok) {
        const message = `Delete failed (${res.status}). If status is 404, deploy latest backend or run local backend at ${LOCAL_API_BASE}.`;
        return { ok: false, error: message };
      }

      const nextTotal = Math.max(0, (total || 0) - 1);
      const nextPages = Math.max(1, Math.ceil(nextTotal / pageSize));
      const targetPage = Math.min(page, nextPages);
      await loadDonors({ page: targetPage, pageSize });
      await loadStats();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  const activeStatusFromList = (list) => {
    // Best-effort heuristic: if all rows have same status, keep current filter on refresh.
    if (!Array.isArray(list) || list.length === 0) return undefined;
    const first = list[0]?.status || 'pending';
    const same = list.every((d) => (d?.status || 'pending') === first);
    return same ? first : undefined;
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
      updateDonor,
      deleteDonor,
      loadDonors,
      fetchAllDonors,
      fetchAcceptedSnapshot,
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

