import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import DashboardPage from './Pages/DashboardPage';
import BloodDropPage from './Pages/BloodDropPage';
import AdminLoginPage from './Pages/AdminLoginPage';
import AdminPanelPage from './Pages/AdminPanelPage';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/blood-drop" element={<BloodDropPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanelPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}