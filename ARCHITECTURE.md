# 📐 Admin Panel Architecture & Structure

## 🏗️ Component Hierarchy

```
AdminPanelPage.jsx
├── Header Section
│   ├── Logo + Title
│   └── Logout Button
│
├── Metrics Tier 1: Registration Overview
│   ├── StatBlock: Total Registrations
│   ├── StatBlock: Male Registrations
│   ├── StatBlock: Female Registrations
│   ├── StatBlock: Pending Review
│   ├── StatBlock: Total Accepted
│   └── StatBlock: Total Rejected
│
├── Metrics Tier 2: Gender-Based Analytics
│   ├── StatBlock: Accepted Males
│   ├── StatBlock: Accepted Females
│   ├── StatBlock: Male/Female Ratio
│   └── StatBlock: Acceptance Rate
│
├── Table Section
│   ├── Table Header
│   │   ├── Title + Description
│   │   ├── Status Filter Tabs (4)
│   │   ├── Export Scope Toggle
│   │   └── Export Buttons (3)
│   │
│   ├── Data Table
│   │   ├── Table Headers (8 columns)
│   │   ├── Table Rows (paginated, max 10)
│   │   │   ├── Name
│   │   │   ├── Blood Type (badge)
│   │   │   ├── Gender
│   │   │   ├── City
│   │   │   ├── Phone
│   │   │   ├── Registered (timestamp)
│   │   │   ├── Status (pill badge)
│   │   │   └── Actions (3 buttons)
│   │   └── Empty State (when no data)
│   │
│   └── Pagination Controls
│       ├── Previous Button
│       ├── Page Indicator
│       └── Next Button
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Donor Registration                     │
│                   (DonorForm.jsx)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Fields: Name, Email, Phone, Age, Gender,         │  │
│  │ Blood Type, City, Gender, Status='pending'       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────┘
                 │ addDonor()
                 ▼
         ┌──────────────────┐
         │ DonorsContext    │
         │ (State Store)    │
         └────────┬─────────┘
                  │
      ┌───────────┴──────────────┐
      │ calculateStats()          │
      │ - Count male/female       │
      │ - Count accepted/rejected │
      │ - Calculate percentages   │
      └───────────┬──────────────┘
                  │ stats object
                  ▼
         ┌──────────────────────┐
         │  AdminPanelPage.jsx  │
         │  ├─ Render Metrics   │
         │  ├─ Render Table     │
         │  └─ Handle Actions   │
         └────────┬─────────────┘
                  │
      ┌───────────┴──────────────┐
      │                          │
      ▼                          ▼
   updateDonorStatus()      Export Functions
   - Send status change     - Excel
   - Update context         - CSV
   - Trigger recalc         - PDF
      │                      │
      └──────────┬───────────┘
                 ▼
         localStorage.setItem()
         (Persist changes)
```

---

## 📱 Layout Grid System

### **Desktop (> 1024px)**
```
┌────────────────────────────────────────────────────────┐
│ [Shield] Admin Panel                        [Logout]   │
├────────────────────────────────────────────────────────┤
│ Donor Registration Metrics                             │
│ ┌─────┬─────┬──────┬────────┬──────────┬──────────┐   │
│ │ Total │Male │Female│Pending│Accepted │Rejected  │   │
│ └─────┴─────┴──────┴────────┴──────────┴──────────┘   │
│ Gender-Based Acceptance Stats                          │
│ ┌──────────────┬──────────────┬──────────┬──────────┐  │
│ │Accepted Males│Accepted Fem. │M:F Ratio │Acceptance│  │
│ └──────────────┴──────────────┴──────────┴──────────┘  │
├────────────────────────────────────────────────────────┤
│ [All] [Pending] [Accepted] [Rejected]  [Scope]        │
│ [Excel] [CSV] [PDF]                                    │
├────────────────────────────────────────────────────────┤
│ Name | Blood | Gender | City | Phone | Registered |   │
│ ──────────────────────────────────────────────────────│
│ John | A+    | Male   | NYC  | ...   | 2026-03-22 │   │
│ Jane | B-    | Female | LA   | ...   | 2026-03-22 │   │
├────────────────────────────────────────────────────────┤
│ Showing 1-10 of 50    [← Previous] Page 1 of 5 [Next →]│
└────────────────────────────────────────────────────────┘
```

### **Mobile (< 640px)**
```
┌──────────────────────┐
│ [Shield] Admin Panel │
│        [Logout]      │
├──────────────────────┤
│ Donor Registration   │
│ ┌──────────────────┐ │
│ │ Total: 100       │ │
│ ├──────────────────┤ │
│ │ Male: 62 (62%)   │ │
│ ├──────────────────┤ │
│ │ Female: 38 (38%) │ │
│ └──────────────────┘ │
│                      │
│ [All][Pending]       │
│ [Accepted][Rejected] │
├──────────────────────┤
│ [Excel][CSV][PDF]    │
├──────────────────────┤
│ Name: John Doe       │
│ Blood: A+            │
│ Status: Pending      │
│ [⏱][✓][✕]           │
├──────────────────────┤
│ Showing 1-10 of 50   │
│ [←] Page 1/5 [→]     │
└──────────────────────┘
```

---

## 🧮 Statistics Calculation Logic

```javascript
// INPUTS: Array of donors with status and gender
donors = [
  { id: 1, fullName: 'John', gender: 'Male', status: 'accepted' },
  { id: 2, fullName: 'Jane', gender: 'Female', status: 'pending' },
  ...
]

// CALCULATIONS:
┌────────────────────────────────────────────────────────┐
│ TOTAL COUNTS                                           │
├────────────────────────────────────────────────────────┤
│ total = donors.length                                  │
│ male = donors.filter(d => d.gender === 'Male').length  │
│ female = donors.filter(d => d.gender === 'Female')...  │
│ pending = donors.filter(d => d.status === 'pending')   │
│ accepted = donors.filter(d => d.status === 'accepted') │
│ rejected = donors.filter(d => d.status === 'rejected') │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ GENDER-SPECIFIC COUNTS                                 │
├────────────────────────────────────────────────────────┤
│ acceptedMale = donors.filter(d =>                      │
│   d.gender === 'Male' && d.status === 'accepted'       │
│ ).length                                               │
│                                                        │
│ acceptedFemale = donors.filter(d =>                    │
│   d.gender === 'Female' && d.status === 'accepted'     │
│ ).length                                               │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PERCENTAGES & RATIOS                                   │
├────────────────────────────────────────────────────────┤
│ malePercent = (male / total) × 100                     │
│ femalePercent = (female / total) × 100                 │
│ acceptanceRate = (accepted / total) × 100              │
│ maleApprovalRate = (acceptedMale / male) × 100         │
│ femaleApprovalRate = (acceptedFemale / female) × 100   │
│ maleToFemaleRatio = male / female                      │
└────────────────────────────────────────────────────────┘

// RETURN: stats object to component
stats = {
  total: 100,
  male: 62,
  female: 38,
  pending: 15,
  accepted: 83,
  rejected: 2,
  acceptedMale: 55,
  acceptedFemale: 28,
  // ... plus byBloodType, acceptedByBloodType
}
```

---

## 🎨 Color & Styling System

### **Metric Card Colors**
```
StatBlock → colorClass prop → TailwindCSS gradient

Examples:
┌──────────────────────────────────────────────┐
│ Total Registrations                          │
│ colorClass="from-blue-400 to-blue-600"       │
│ ┌──────────────────────────────────────────┐ │
│ │ ╔════════════════════════╗               │ │
│ │ ║  ICON                  ║               │ │
│ │ ║  (Blue Gradient)       ║         100   │ │
│ │ ╚════════════════════════╝               │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘

Gradient Classes:
- Blue: from-blue-400 to-blue-600
- Cyan: from-cyan-400 to-cyan-600
- Pink: from-pink-400 to-pink-600
- Green: from-emerald-400 to-emerald-600
- Red: from-red-400 to-red-600
- Amber: from-amber-400 to-amber-600
- Purple: from-purple-500 to-purple-700
- Teal: from-teal-500 to-teal-700
```

### **Table Row States**
```
Default: bg-white border-gray-100
├─ Hover: bg-blue-50 transition-colors
├─ Status Pending: pill bg-yellow-100
├─ Status Accepted: pill bg-green-100
└─ Status Rejected: pill bg-red-100
```

---

## 📊 State Management

```javascript
// Component State
const [activeStatus, setActiveStatus] = useState('pending');  // Tab
const [exportScope, setExportScope] = useState('active');     // Export scope
const [page, setPage] = useState(1);                          // Pagination

// Derived State
const filtered = useMemo(() => {
  // Filter by status
  const base = activeStatus === 'all' 
    ? donors 
    : donors.filter(d => (d.status || 'pending') === activeStatus);
  return base.slice().reverse(); // Show newest first
}, [donors, activeStatus]);

const totalRows = filtered.length;
const totalPages = Math.ceil(totalRows / PAGE_SIZE);
const currentPage = Math.min(page, totalPages);
const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

// From Context
const { donors, stats, updateDonorStatus } = useDonors();
```

---

## 🔐 Security Architecture

```
Login Flow:
┌──────────────────────────────────────────────────────┐
│ User navigates to /admin                             │
└────────┬─────────────────────────────────────────────┘
         │ AdminRoute checks isAdmin?
         ├─ YES ──→ Show AdminPanel
         │
         └─ NO ──→ Redirect to /admin-login?next=/admin
                   │
                   ▼
         ┌──────────────────────────────────┐
         │ Admin Login Form                  │
         │ [Username] [Password] [Sign in]  │
         └────────┬────────────────────────┘
                  │ User submits credentials
                  ▼
         ┌──────────────────────────────────┐
         │ Compare against env vars         │
         │ .env.local or .env               │
         │ VITE_ADMIN_USERNAME              │
         │ VITE_ADMIN_PASSWORD              │
         └────────┬────────────────────────┘
                  │
      ┌───────────┴──────────────┐
      │ Match?                   │
      ├─ YES ──→ setIsAdmin(true)
      │          │
      │          ▼
      │   Redirect to /admin
      │   (show panel)
      │
      └─ NO ──→ Show error
                 (try again)

Page Reload Event:
┌──────────────────────────────────────────────────────┐
│ User reloads page (F5)                               │
└────────┬─────────────────────────────────────────────┘
         │ loadInitialIsAdmin() runs
         │ (returns false always)
         │
         ▼
   isAdmin = false
   │
   ▼
   Redirect to /admin-login
   (session cleared for security)
```

---

## 📈 Performance Optimizations

```javascript
// useMemo for expensive calculations
const filtered = useMemo(() => {...}, [donors, activeStatus])
const paged = useMemo(() => {...}, [filtered, currentPage, PAGE_SIZE])
const exportRows = useMemo(() => {...}, [donors, filtered, exportScope])

// useMemo in DonorsContext
const stats = useMemo(() => calculateStats(donors), [donors])
const value = useMemo(() => ({ donors, stats, ... }), [donors, stats])

// Result: Recalculates only when dependencies change
// Not on every render → faster, smoother UI
```

---

## 🚀 Deployment Checklist

```
Pre-Deploy:
├─ [ ] Update .env.local with production credentials
├─ [ ] Test all features (metrics, filter, export)
├─ [ ] Verify responsive design on mobile/tablet
├─ [ ] Check browser console for errors (F12)
├─ [ ] Run npm run lint (should pass)
├─ [ ] Run npm run build (production build)
└─ [ ] Test production build locally

Deploy:
├─ [ ] Push code to Git
├─ [ ] Deploy to hosting (Vercel, Netlify, etc.)
├─ [ ] Verify app loads correctly
├─ [ ] Test admin login with prod credentials
├─ [ ] Verify metrics display
└─ [ ] Confirm export functions work

Post-Deploy:
├─ [ ] Monitor console for errors (week 1)
├─ [ ] Gather user feedback
├─ [ ] Track usage analytics
└─ [ ] Plan future enhancements
```

---

## 🔗 File Dependencies

```
AdminPanelPage.jsx
├─ imports: useDonors (custom hook)
├─ imports: useAdminAuth (context hook)
├─ imports: Lucide icons (UI)
├─ imports: XLSX (Excel export)
└─ uses: DonorsContext, AdminAuthContext

DonorForm.jsx
├─ gender field added to state
└─ gender included in submitted donor object

DonorsContext.jsx
├─ calculateStats() computes male/female/accepted
└─ stats object passed to AdminPanel

AdminAuthContext.jsx
├─ login() checks credentials
├─ logout() clears session
└─ session NOT persisted (intentional)
```

---

## 📊 Database Schema (localStorage)

```json
{
  "bloodDonors": [
    {
      "id": 1647936000000,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "age": 28,
      "gender": "Male",
      "bloodType": "A+",
      "city": "New York",
      "address": "123 Main St",
      "lastDonation": "2025-10-15",
      "medicalConditions": "",
      "status": "accepted",
      "registeredAt": "2026-03-22T14:00:00Z"
    },
    ...
  ]
}
```

---

**Architecture Version**: 1.0  
**Last Updated**: March 22, 2026  
**Status**: Production Ready ✅
