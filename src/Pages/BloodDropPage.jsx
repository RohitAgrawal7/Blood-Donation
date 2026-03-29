import React from 'react';
import { useNavigate } from 'react-router-dom';
import BloodDropVisualization from '../components/BloodDropVisualization';

export default function BloodDropPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500 mb-1">
              Visual impact
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              LifeFlow Blood Drop
            </h1>
            <p className="mt-1 text-sm md:text-base text-gray-600 max-w-xl">
              Watch the main blood drop gradually fill as donors are accepted. Each point and
              name represents a real person ready to save a life.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center">
          <BloodDropVisualization />
        </main>

        <div className="sm:hidden mt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

