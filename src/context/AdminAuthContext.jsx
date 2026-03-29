import React, { createContext, useContext, useMemo, useState } from 'react';

function getExpectedUsername() {
  // Recommended: set this in `.env.local` as VITE_ADMIN_USERNAME=...
  return import.meta.env.VITE_ADMIN_USERNAME || 'Admin@1';
}

function getExpectedPassword() {
  // Recommended: set this in `.env.local` as VITE_ADMIN_PASSWORD=...
  return import.meta.env.VITE_ADMIN_PASSWORD || 'Sukoon@2026';
}

function loadInitialIsAdmin() {
  try {
    // Do not persist admin across reloads — require fresh login every page load.
    // Returning false ensures the admin login prompt appears after a reload.
    return false;
  } catch {
    return false;
  }
}

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => loadInitialIsAdmin());

  const login = (username, password) => {
    const expectedUsername = getExpectedUsername();
    const expected = getExpectedPassword();
    const ok =
      String(username || '') === String(expectedUsername) &&
      String(password || '') === String(expected);
    if (ok) {
      setIsAdmin(true);
    }
    return ok;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider />');
  return ctx;
}

