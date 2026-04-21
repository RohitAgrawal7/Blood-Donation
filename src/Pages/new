import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useDonors from '../hooks/useDonors.js';

// Donor shape (for reference):
// {
//   id, name, bloodType, time, x, y, size
// }

// ─── Constants ───────────────────────────────────────────────────────────────
const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

// ─── SVG Drop clip path (roughly a teardrop / blood drop shape) ──────────────
// viewBox 0 0 200 260
const DROP_PATH =
  'M100,10 C60,10 20,55 20,115 C20,175 55,235 100,255 C145,235 180,175 180,115 C180,55 140,10 100,10 Z';

// Points that lie "inside" the drop (precomputed for random placement)
function randomInsideDrop() {
  // Simple rejection sampling on the drop bounding box
  for (let i = 0; i < 200; i++) {
    const px = 20 + Math.random() * 160; // 20–180
    const py = 10 + Math.random() * 245; // 10–255
    // Rough ellipse test (slightly elongated)
    const cx = 100, cy = 140, rx = 75, ry = 110;
    // Adjust for the pointed top
    const adjustY = py < cy ? (cy - py) * 0.3 : 0;
    if (Math.pow((px - cx) / rx, 2) + Math.pow((py - cy - adjustY) / ry, 2) <= 0.95) {
      return { x: (px / 200) * 100, y: (py / 260) * 100 };
    }
  }
  return { x: 50, y: 55 };
}

// ─── Pre-seed 0 donors (no mock data) ────────────────────────────────────────
const GOAL = 30;

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent = '#c0392b' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '16px 20px',
    border: '1px solid rgba(200,0,0,0.12)',
    boxShadow: '0 2px 16px rgba(180,0,0,0.07)',
    minWidth: '100px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '26px', fontWeight: 800, color: accent, fontFamily: '"Georgia", serif', lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);

// ─── Blood Drop SVG Visualization ────────────────────────────────────────────
const BloodDropVisualization = ({ donors, fillPct, pulseActive }) => {
  const clipId = 'dropClip';
  const fillGradId = 'fillGrad';
  const glowId = 'dropGlow';

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 200 280"
        style={{
          width: '100%',
          filter: pulseActive ? 'drop-shadow(0 0 18px rgba(192,57,43,0.55))' : 'drop-shadow(0 4px 24px rgba(180,0,0,0.18))',
          transition: 'filter 0.4s ease',
          overflow: 'visible',
        }}
      >
        <defs>
          {/* Clip to drop shape */}
          <clipPath id={clipId}>
            <path d={DROP_PATH} />
          </clipPath>

          {/* Blood fill gradient */}
          <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e74c3c" />
            <stop offset="100%" stopColor="#8b0000" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Shimmer gradient on blood surface */}
          <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* ── Drop outline / empty shell ── */}
        <path
          d={DROP_PATH}
          fill="rgba(255,220,220,0.35)"
          stroke="#c0392b"
          strokeWidth="2.5"
        />

        {/* ── Filling blood rect, clipped to drop shape ── */}
        <g clipPath={`url(#${clipId})`}>
          {/* background */}
          <rect x="0" y="0" width="200" height="260" fill="rgba(255,230,230,0.3)" />

          {/* animated fill from bottom */}
          <rect
            x="0"
            y={260 - (260 * fillPct) / 100}
            width="200"
            height={(260 * fillPct) / 100}
            fill={`url(#${fillGradId})`}
            style={{ transition: 'y 1.2s cubic-bezier(0.34,1.56,0.64,1), height 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          />

          {/* Shimmer overlay on the blood */}
          <rect
            x="0"
            y={260 - (260 * fillPct) / 100}
            width="200"
            height={(260 * fillPct) / 100}
            fill="url(#shimmer)"
            style={{ transition: 'y 1.2s ease, height 1.2s ease' }}
          />

          {/* Ripple wave on blood surface */}
          {fillPct > 5 && (
            <ellipse
              cx="100"
              cy={260 - (260 * fillPct) / 100 + 4}
              rx="80"
              ry="5"
              fill="rgba(255,255,255,0.15)"
              style={{ transition: 'cy 1.2s ease' }}
            />
          )}

          {/* ── Donor dots inside drop, only visible in filled area ── */}
          {donors.map((d) => {
            const dotX = (d.x / 100) * 200;
            const dotY = (d.y / 100) * 260;
            const fillY = 260 - (260 * fillPct) / 100;
            if (dotY < fillY) return null; // only show dots in filled region
            return (
              <g key={d.id}>
                <circle
                  cx={dotX}
                  cy={dotY}
                  r={d.size + 2}
                  fill="rgba(255,255,255,0.15)"
                />
                <circle
                  cx={dotX}
                  cy={dotY}
                  r={d.size}
                  fill="rgba(255,255,255,0.85)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.8"
                >
                  <animate
                    attributeName="r"
                    values={`${d.size};${d.size + 1.5};${d.size}`}
                    dur={`${2 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.85;1;0.85"
                    dur={`${2 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </g>

        {/* ── Drop outline on top (crisp border) ── */}
        <path
          d={DROP_PATH}
          fill="none"
          stroke="#c0392b"
          strokeWidth="2.5"
        />

        {/* ── % label in center ── */}
        <text
          x="100"
          y="138"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="800"
          fill={fillPct > 45 ? 'white' : '#c0392b'}
          fontFamily="Georgia, serif"
          style={{ transition: 'fill 0.6s ease' }}
        >
          {Math.round(fillPct)}%
        </text>
        <text
          x="100"
          y="162"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="600"
          fill={fillPct > 45 ? 'rgba(255,255,255,0.8)' : '#e74c3c'}
          letterSpacing="1.5"
          fontFamily="sans-serif"
          style={{ transition: 'fill 0.6s ease' }}
        >
          CAPACITY
        </text>

        {/* ── Pulse ring when new donor added ── */}
        {pulseActive && (
          <circle cx="100" cy="135" r="30" fill="none" stroke="rgba(231,76,60,0.6)" strokeWidth="2">
            <animate attributeName="r" values="30;75" dur="0.7s" fill="freeze" />
            <animate attributeName="opacity" values="0.7;0" dur="0.7s" fill="freeze" />
          </circle>
        )}
      </svg>
    </div>
  );
};

// ─── Donor List Item ──────────────────────────────────────────────────────────
const DonorRow = ({ donor, isNew }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '12px',
    background: isNew ? 'rgba(231,76,60,0.08)' : 'rgba(255,255,255,0.7)',
    border: isNew ? '1px solid rgba(231,76,60,0.25)' : '1px solid rgba(0,0,0,0.06)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.4s ease',
    animation: isNew ? 'slideIn 0.4s ease' : 'none',
  }}>
    {/* Blood type badge */}
    <div style={{
      minWidth: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #c0392b, #8b0000)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 800,
      letterSpacing: '-0.3px',
      boxShadow: '0 2px 8px rgba(192,57,43,0.35)',
      fontFamily: 'Georgia, serif',
    }}>
      {donor.bloodType}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {donor.name}
      </div>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '1px' }}>{donor.time}</div>
    </div>
    {isNew && (
      <span style={{
        fontSize: '10px', fontWeight: 700, color: '#c0392b',
        background: 'rgba(192,57,43,0.1)', padding: '2px 8px',
        borderRadius: '20px', letterSpacing: '0.05em',
      }}>NEW</span>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BloodDropPage() {
  const { donors: backendDonors = [], addDonor } = useDonors();
  const [pulseActive, setPulseActive] = useState(false);
  const [newDonorId, setNewDonorId] = useState(null);
  const positionsRef = useRef({}); // map donorId -> { x, y, size }

  // Map backend donors to UI donors with a deterministic per-id position (generated once)
  const donors = useMemo(() => {
    const map = backendDonors.map((d) => {
      if (!positionsRef.current[d.id]) {
        const { x, y } = randomInsideDrop();
        positionsRef.current[d.id] = { x, y, size: 3 + Math.random() * 4 };
      }
      const pos = positionsRef.current[d.id];
      return {
        id: d.id,
        name: d.fullName || d.name || 'Donor',
        bloodType: d.bloodType || 'O+',
        time: d.registeredAt ? new Date(d.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        x: pos.x,
        y: pos.y,
        size: pos.size,
      };
    });
    return map;
  }, [backendDonors]);

  const fillPct = Math.min((donors.length / GOAL) * 100, 100);
  const isGoalReached = donors.length >= GOAL;

  const onAddDonor = useCallback(async () => {
    if (donors.length >= GOAL) return;
    // Prompt user for donor details — replace with a proper form/modal as desired
    const fullName = window.prompt('Full name of donor');
    if (!fullName) return;
    const phone = window.prompt('Phone number', '');
    const ageStr = window.prompt('Age (number)', '30');
    const age = Number(ageStr) || 30;
    const bloodType = window.prompt('Blood type (e.g. A+)', 'O+');
    const city = window.prompt('City', 'Unknown');

    const payload = { fullName, phone, age, bloodType, city };
    // call context addDonor which posts to backend; UI updates only after success
    const saved = await addDonor(payload);
    if (saved) {
      setNewDonorId(saved.id);
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 800);
      setTimeout(() => setNewDonorId(null), 3000);
    } else {
      window.alert('Failed to add donor. Please try again.');
    }
  }, [addDonor, donors.length]);

  // no auto-add; donors come exclusively from backend

  const bloodTypeStats = BLOOD_TYPES.reduce((acc, bt) => {
    acc[bt] = donors.filter((d) => d.bloodType === bt).length;
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f5 0%, #fff 45%, #fdf2f2 100%)',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Background decoration ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 80% 20%, rgba(231,76,60,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(192,57,43,0.05) 0%, transparent 55%)',
      }} />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.15); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.08); }
          70%     { transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hb { animation: heartbeat 1.4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }
      `}</style>

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1100px', margin: '0 auto',
        padding: '28px 20px 48px',
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>

        {/* ── Header ── */}
        <header className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="hb" style={{ fontSize: '22px' }}>🩸</span>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c0392b' }}>
                LifeFlow — Live Donor Tracker
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900, color: '#1a0000', lineHeight: 1.1, margin: 0, fontFamily: 'Georgia, serif' }}>
              Blood Drop
              <span style={{ color: '#c0392b' }}> Visualization</span>
            </h1>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#666', maxWidth: '480px', lineHeight: 1.6 }}>
              Watch the blood drop fill as donors are accepted. Every glowing dot inside
              represents a real person ready to save a life.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
              background: 'white', border: '1.5px solid #e5e5e5', color: '#333',
              cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'all 0.2s',
            }}
          >
            ← Dashboard
          </button>
        </header>

        {/* ── Stats row ── */}
        <div className="fade-up" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', animationDelay: '0.1s' }}>
          <StatCard label="Donors" value={donors.length} />
          <StatCard label="Goal" value={GOAL} accent="#555" />
          <StatCard label="Remaining" value={Math.max(GOAL - donors.length, 0)} accent="#e67e22" />
          <StatCard label="Fill %" value={`${Math.round(fillPct)}%`} />
          {isGoalReached && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #27ae60, #1e8449)',
              color: 'white', fontWeight: 700, fontSize: '14px',
              boxShadow: '0 4px 16px rgba(39,174,96,0.3)',
              animation: 'slideIn 0.5s ease',
            }}>
              🎉 Goal Reached!
            </div>
          )}
        </div>

        {/* ── Main content: drop + sidebar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '28px', alignItems: 'start' }}>

          {/* ── Left: Drop + controls ── */}
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', animationDelay: '0.15s' }}>

            {/* Drop card */}
            <div style={{
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
              borderRadius: '24px', padding: '32px 24px',
              border: '1.5px solid rgba(192,57,43,0.12)',
              boxShadow: '0 8px 40px rgba(180,0,0,0.08)',
            }}>
              <BloodDropVisualization donors={donors} fillPct={fillPct} pulseActive={pulseActive} />

              {/* Progress bar */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Progress</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#c0392b' }}>{donors.length} / {GOAL}</span>
                </div>
                <div style={{ height: '8px', borderRadius: '99px', background: '#f0e0e0', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
                    width: `${fillPct}%`,
                    transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
                    boxShadow: '0 0 8px rgba(231,76,60,0.5)',
                  }} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={onAddDonor}
                disabled={isGoalReached}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: '14px',
                  background: isGoalReached ? '#ddd' : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white', fontWeight: 700, fontSize: '14px', border: 'none',
                  cursor: isGoalReached ? 'not-allowed' : 'pointer',
                  boxShadow: isGoalReached ? 'none' : '0 4px 16px rgba(192,57,43,0.35)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <span style={{ fontSize: '16px' }}>🩸</span> Accept Donor
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '14px 16px', borderRadius: '14px',
                  background: 'white', color: '#888',
                  fontWeight: 600, fontSize: '13px',
                  border: '1.5px solid #e0e0e0', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Refresh"
              >
                ⟳ Refresh
              </button>
            </div>

            {/* Blood type breakdown */}
            <div style={{
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
              borderRadius: '20px', padding: '20px',
              border: '1px solid rgba(192,57,43,0.1)',
              boxShadow: '0 4px 20px rgba(180,0,0,0.06)',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#999', textTransform: 'uppercase', marginBottom: '14px' }}>
                Blood Type Breakdown
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {BLOOD_TYPES.map((bt) => (
                  <div key={bt} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '18px', fontWeight: 800, color: bloodTypeStats[bt] > 0 ? '#c0392b' : '#ddd',
                      fontFamily: 'Georgia, serif', lineHeight: 1,
                      transition: 'color 0.3s',
                    }}>
                      {bloodTypeStats[bt] || 0}
                    </div>
                    <div style={{
                      fontSize: '10px', fontWeight: 700, color: '#aaa',
                      marginTop: '2px', letterSpacing: '0.05em',
                    }}>
                      {bt}
                    </div>
                    <div style={{
                      height: '3px', borderRadius: '99px', marginTop: '4px',
                      background: bloodTypeStats[bt] > 0 ? `rgba(192,57,43,${Math.min(bloodTypeStats[bt] / 5, 1)})` : '#f0f0f0',
                      transition: 'background 0.5s',
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Donor feed ── */}
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px', animationDelay: '0.2s' }}>
            <div style={{
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
              borderRadius: '24px', padding: '20px',
              border: '1.5px solid rgba(192,57,43,0.1)',
              boxShadow: '0 8px 40px rgba(180,0,0,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase' }}>
                  Live Donor Feed
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: '#27ae60',
                  background: 'rgba(39,174,96,0.1)', padding: '3px 10px',
                  borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#27ae60', display: 'inline-block',
                    animation: 'heartbeat 1s ease infinite',
                  }} />
                  LIVE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                {donors.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ccc', fontSize: '14px' }}>
                    No donors yet. Accept the first donor!
                  </div>
                ) : (
                  donors.map((d) => (
                    <DonorRow key={d.id} donor={d} isNew={d.id === newDonorId} />
                  ))
                )}
              </div>
            </div>

            {/* Motivational message */}
            <div style={{
              borderRadius: '16px', padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(192,57,43,0.08), rgba(231,76,60,0.04))',
              border: '1px solid rgba(192,57,43,0.12)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>❤️</div>
              <p style={{ fontSize: '13px', color: '#c0392b', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {isGoalReached
                  ? 'Goal reached! Thank you to all donors — lives will be saved today.'
                  : `${GOAL - donors.length} more donor${GOAL - donors.length !== 1 ? 's' : ''} needed to reach the goal.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}