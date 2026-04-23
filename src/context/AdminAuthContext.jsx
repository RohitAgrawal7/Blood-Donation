import React, { createContext, useContext, useMemo, useState } from 'react';

const AdminAuthContext = createContext(null);

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3001';

function loadInitialToken() {
  try {
    return sessionStorage.getItem('adminToken') || null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => loadInitialToken());


  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const body = await res.json();
      const accessToken = body?.accessToken;
      if (accessToken) {
        setToken(accessToken);
        try { sessionStorage.setItem('adminToken', accessToken); } catch {}
        return true;
      }
      return false;
    } catch (e) {
      // fallback: no backend reachable
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    try { sessionStorage.removeItem('adminToken'); } catch {}
  };

  const isAdmin = Boolean(token);

  const value = useMemo(() => ({ isAdmin, token, login, logout }), [isAdmin, token]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider />');
  return ctx;
}

