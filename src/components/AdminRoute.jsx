import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminRoute() {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    const next = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return <Navigate to={`/admin-login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <Outlet />;
}

