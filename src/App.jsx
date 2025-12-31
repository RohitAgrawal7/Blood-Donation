import React, { useState } from 'react';
import HomePage from './Pages/HomePage';
import DashboardPage from './Pages/DashboardPage';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' or 'dashboard'

  return (
    <>
      {page === 'home' ? (
        <HomePage setPage={setPage} />
      ) : (
        <DashboardPage setPage={setPage} />
      )}
    </>
  );
}