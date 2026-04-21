import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, Clock3, LogOut, Shield, Users, XCircle, BarChart3, Download, Filter, TrendingUp, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import useDonors from '../hooks/useDonors.js';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const STATUSES = [
  { key: 'all', label: 'All Requests', icon: Users, pill: 'bg-slate-100 text-slate-800', color: 'text-slate-600' },
  { key: 'pending', label: 'Pending', icon: Clock3, pill: 'bg-yellow-100 text-yellow-800', color: 'text-yellow-600' },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2, pill: 'bg-green-100 text-green-800', color: 'text-green-600' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, pill: 'bg-red-100 text-red-800', color: 'text-red-600' },
];

function StatusPill({ status }) {
  const s = STATUSES.find((x) => x.key === status) || STATUSES[0];
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s.pill}`}>
      {s.label}
    </span>
  );
}

function StatBlock({ icon: Icon, label, value, colorClass, subtext = null }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-black text-gray-900">{value ?? 0}</p>
          {subtext && <p className="text-xs text-gray-600 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  const {
    donors,
    stats,
    updateDonorStatus,
    loadDonors,
    fetchAllDonors,
    page: providerPage,
    pageSize: providerPageSize,
    total,
  } = useDonors();
  const { logout } = useAdminAuth();
  const [activeStatus, setActiveStatus] = useState('pending');
  const [exportScope, setExportScope] = useState('active'); // 'active' | 'all'
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use server-side pagination. `donors` is the current page returned by the server.
  const totalRows = total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / (pageSize || 10)));
  const currentPage = Math.min(page, totalPages);
  const paged = donors || [];

  const handleChangeTab = (key) => {
    setActiveStatus(key);
    setPage(1);
    // request first page for new status
    loadDonors({ status: key === 'all' ? undefined : key, page: 1, pageSize });
  };

  const exportRows = useMemo(() => {
    const list = donors || [];
    return list.map((d) => ({
      ID: d.id ?? '',
      Name: d.fullName ?? '',
      Email: d.email ?? '',
      Phone: d.phone ?? '',
      Age: d.age ?? '',
      Gender: d.gender ?? '',
      BloodType: d.bloodType ?? '',
      City: d.city ?? '',
      Address: d.address ?? '',
      LastDonation: d.lastDonation ?? '',
      MedicalConditions: d.medicalConditions ?? '',
      EmergencyContact: d.emergencyContact ?? '',
      EmergencyPhone: d.emergencyPhone ?? '',
      Status: d.status ?? 'pending',
      RegisteredAt: d.registeredAt ?? '',
    }));
  }, [donors, exportScope]);

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadExcel = async () => {
    const rows = exportScope === 'all' ? await fetchAllDonors(activeStatus === 'all' ? undefined : activeStatus) : donors;
    const ws = XLSX.utils.json_to_sheet((rows || []).map((d) => ({
      ID: d.id ?? '',
      Name: d.fullName ?? '',
      Email: d.email ?? '',
      Phone: d.phone ?? '',
      Age: d.age ?? '',
      Gender: d.gender ?? '',
      BloodType: d.bloodType ?? '',
      City: d.city ?? '',
      Address: d.address ?? '',
      LastDonation: d.lastDonation ?? '',
      MedicalConditions: d.medicalConditions ?? '',
      EmergencyContact: d.emergencyContact ?? '',
      EmergencyPhone: d.emergencyPhone ?? '',
      Status: d.status ?? 'pending',
      RegisteredAt: d.registeredAt ?? '',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donors');
    const data = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    downloadBlob(blob, `donors_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const downloadCsv = async () => {
    const rows = exportScope === 'all' ? await fetchAllDonors(activeStatus === 'all' ? undefined : activeStatus) : donors;
    const ws = XLSX.utils.json_to_sheet((rows || []).map((d) => ({
      ID: d.id ?? '',
      Name: d.fullName ?? '',
      Email: d.email ?? '',
      Phone: d.phone ?? '',
      Age: d.age ?? '',
      Gender: d.gender ?? '',
      BloodType: d.bloodType ?? '',
      City: d.city ?? '',
      Address: d.address ?? '',
      LastDonation: d.lastDonation ?? '',
      MedicalConditions: d.medicalConditions ?? '',
      EmergencyContact: d.emergencyContact ?? '',
      EmergencyPhone: d.emergencyPhone ?? '',
      Status: d.status ?? 'pending',
      RegisteredAt: d.registeredAt ?? '',
    })));
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `donors_${exportScope}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const downloadPdf = async () => {
    // Expert UX: print-ready report that users can "Save as PDF" from the browser dialog.
    const title =
      exportScope === 'all'
        ? 'All Donors'
        : `Donors - ${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}`;
    const rows = exportScope === 'all' ? await fetchAllDonors(activeStatus === 'all' ? undefined : activeStatus) : donors;
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; color: #111827; }
            h1 { margin: 0 0 6px; font-size: 20px; }
            .meta { margin: 0 0 16px; color: #6b7280; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 8px 6px; font-size: 11px; text-align: left; vertical-align: top; }
            th { font-size: 11px; color: #374151; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-weight: 700; font-size: 10px; }
            .pending { background: #FEF3C7; color: #92400E; }
            .accepted { background: #D1FAE5; color: #065F46; }
            .rejected { background: #FEE2E2; color: #991B1B; }
            @media print {
              body { padding: 0; }
              a { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="meta">Generated: ${new Date().toLocaleString()} • Total rows: ${rows.length}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood</th>
                <th>City</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map((r) => {
                  const status = String(r.Status || 'pending');
                  const cls = status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'pending';
                  return `
                    <tr>
                      <td>${String(r.Name || '').replaceAll('<', '&lt;')}</td>
                      <td>${String(r.BloodType || '').replaceAll('<', '&lt;')}</td>
                      <td>${String(r.City || '').replaceAll('<', '&lt;')}</td>
                      <td>${String(r.Phone || '').replaceAll('<', '&lt;')}</td>
                      <td>${String(r.Email || '').replaceAll('<', '&lt;')}</td>
                      <td><span class="badge ${cls}">${status}</span></td>
                      <td>${String(r.RegisteredAt || '').replaceAll('<', '&lt;')}</td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  // Ensure we load data whenever the page/status/pageSize change
  React.useEffect(() => {
    const s = activeStatus === 'all' ? undefined : activeStatus;
    loadDonors({ status: s, page, pageSize });
  }, [activeStatus, page, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Shield className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Approve or reject donor registrations</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Total Registrations</div>
            <div className="text-3xl font-extrabold text-gray-900">{stats.total ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Total Male </div>
            <div className="text-3xl font-extrabold text-blue-700">{stats.male ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Total Female </div>
            <div className="text-3xl font-extrabold text-pink-700">{stats.female ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Total Accepted</div>
            <div className="text-3xl font-extrabold text-green-700">{stats.accepted ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Accepted Males</div>
            <div className="text-3xl font-extrabold text-green-700">{stats.acceptedMale ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 font-semibold mb-1">Accepted Females</div>
            <div className="text-3xl font-extrabold text-green-700">{stats.acceptedFemale ?? 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Requests</h2>
              <div className="mt-1 text-sm text-gray-500">
                Manage status and download reports (Excel/CSV/PDF).
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleChangeTab(key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold border transition-all ${
                    activeStatus === key
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-gray-800">Export scope:</div>
              <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExportScope('active')}
                  className={`px-4 py-2 text-sm font-bold ${
                    exportScope === 'active' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Current tab
                </button>
                <button
                  onClick={() => setExportScope('all')}
                  className={`px-4 py-2 text-sm font-bold ${
                    exportScope === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  All donors
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadExcel}
                className="px-4 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Download Excel
              </button>
              <button
                onClick={downloadCsv}
                className="px-4 py-2 rounded-xl font-bold bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              >
                Download CSV
              </button>
              <button
                onClick={downloadPdf}
                className="px-4 py-2 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Blood</th>
                  <th className="py-3 px-6">City</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Registered</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-6 font-semibold text-gray-900">{d.fullName}</td>
                    <td className="py-3 px-6">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {d.bloodType}
                      </span>
                    </td>
                    <td className="py-3 px-6">{d.city}</td>
                    <td className="py-3 px-6">{d.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {d.registeredAt ? new Date(d.registeredAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-6">
                      <StatusPill status={d.status || 'pending'} />
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateDonorStatus(d.id, 'pending')}
                          disabled={(d.status || 'pending') === 'pending'}
                          className="px-3 py-2 rounded-xl font-bold text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateDonorStatus(d.id, 'accepted')}
                          disabled={(d.status || 'pending') === 'accepted'}
                          className="px-3 py-2 rounded-xl font-bold text-sm bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateDonorStatus(d.id, 'rejected')}
                          disabled={(d.status || 'pending') === 'rejected'}
                          className="px-3 py-2 rounded-xl font-bold text-sm bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalRows === 0 && (
              <div className="text-center py-14 text-gray-500">
                {activeStatus === 'all' ? 'No donors found.' : `No ${activeStatus} requests.`}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalRows > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold">
                  {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, totalRows)}
                </span>{' '}
                of <span className="font-semibold">{totalRows}</span> donors
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Rows:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 10;
                      setPageSize(v);
                      setPage(1);
                    }}
                    className="border rounded-lg px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

