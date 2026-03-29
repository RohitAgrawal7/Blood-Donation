import React, { useMemo } from 'react';
import useDonors from '../hooks/useDonors';

export default function BloodDropVisualization() {
  const { donors } = useDonors();

  const accepted = useMemo(() => donors.filter((d) => (d.status || 'pending') === 'accepted'), [donors]);

  // Goal can be configured via env: VITE_BLOOD_DROP_GOAL, default to 100
  const GOAL = Number(import.meta.env.VITE_BLOOD_DROP_GOAL || 100);
  const acceptedCount = accepted.length;
  const fillPercent = Math.min(100, Math.round((acceptedCount / Math.max(1, GOAL)) * 100));

  const dots = useMemo(() => {
    const count = accepted.length;
    if (count === 0) return [];
    const max = Math.min(count, 220); // cap for performance / readability
    const arr = [];
    for (let i = 0; i < max; i++) {
      const donor = accepted[i] || accepted[accepted.length - 1];
      const angle = (i / max) * Math.PI * 2;
      const radius = 0.12 + (i / max) * 0.36;
      const x = 50 + Math.cos(angle) * radius * 100 * 0.8;
      const y = 54 + Math.sin(angle) * radius * 100;
      arr.push({
        id: donor?.id ?? i,
        x,
        y,
        initials: (donor?.fullName || '?')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join('') || '?',
      });
    }
    return arr;
  }, [accepted]);

  const namesTicker =
    accepted.length === 0
      ? 'No accepted donors yet — approve registrations in the admin panel.'
      : accepted.map((d) => d.fullName || 'Anonymous donor').slice(0, 80).join('   •   ');

  return (
    <section className="mb-10 w-full">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500 mb-1">Live donor impact</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Every accepted donor fills the drop</h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Each dot inside the blood drop represents an <span className="font-semibold">accepted donor</span>.
            The visualization shows progress towards a community goal.
          </p>
        </div>

        <div className="relative w-full flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative">
            <div className="blood-drop-wrapper">
              <div className={`blood-drop ${accepted.length === 0 ? 'blood-drop-empty' : ''}`}>
                {/* fill element (height from bottom) */}
                <div
                  className="blood-drop-fill"
                  style={{ height: `${fillPercent}%`, transition: 'height 700ms ease' }}
                  aria-hidden
                />
                {dots.map((dot) => (
                  <span
                    key={dot.id}
                    className="blood-drop-dot"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                    title={dot.initials}
                  >
                    <span className="blood-drop-dot-label">{dot.initials}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500">Accepted donors</div>
                <div className="text-2xl font-bold text-gray-900">{acceptedCount}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Goal</div>
                <div className="text-2xl font-bold text-red-600">{GOAL}</div>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${fillPercent}%`, transition: 'width 700ms ease' }}
                aria-valuenow={fillPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">{fillPercent}% of goal filled</div>

            <div className="mt-4 w-full rounded-2xl border border-red-50 bg-gradient-to-r from-red-50 via-white to-pink-50 overflow-hidden">
              <div className="px-4 py-2 text-xs font-semibold tracking-wide text-red-700 bg-red-50 border-b border-red-100">Accepted donors (live ticker)</div>
              <div className="relative h-10 overflow-hidden">
                <div className="marquee whitespace-nowrap text-sm text-red-800 font-medium px-4">
                  {namesTicker}
                  {accepted.length > 0 && (
                    <>
                      <span className="mx-6">•</span>
                      {namesTicker}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

