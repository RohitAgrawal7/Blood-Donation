# 🔄 Blood Donation App - Complete Workflow Diagrams

## 1. Application Initialization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser Loads App                          │
│                      (index.html)                               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   main.jsx Runs      │
                    └──────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
        ┌────────────────────┐   ┌──────────────────────┐
        │ BrowserRouter      │   │ Create React Root    │
        │ (Enable Routing)   │   │ (Mount to #root)     │
        └────────────────────┘   └──────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────┐
        │  AdminAuthProvider             │
        │  ├─ isAdmin = false (initial)  │
        │  ├─ login(user, pass) method   │
        │  └─ logout() method            │
        └────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────┐
        │   DonorsProvider               │
        │   ├─ Load from localStorage    │
        │   ├─ Initialize donors array   │
        │   ├─ calculateStats()          │
        │   ├─ addDonor() method         │
        │   └─ updateDonorStatus() meth  │
        └────────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────────┐
        │  App.jsx                       │
        │  ├─ Route definitions          │
        │  ├─ Page rendering             │
        │  └─ 404 handling               │
        └────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────────────────────┐
        │ App Ready - User Can Interact               │
        └─────────────────────────────────────────────┘
```

---

## 2. Route Navigation Map

```
                    ROOT (/)
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      HomePage    DashboardPage   BloodDropPage
      (Register)   (Analytics)    (Visualization)
          │            │            │
          ├────────────┴────────────┤
          │                         │
          └─────────────┬───────────┘
                        │
                   /admin-login
                  (AdminLoginPage)
                        │
                   [Credentials Check]
                        │
          ┌─────────────┴─────────────┐
          │ Valid                     │ Invalid
          ▼                           ▼
      AdminRoute              Show Error
   [Next URL from params]     Stay on login
          │
          ▼
    /admin (Protected)
    (AdminPanelPage)
          │
          └─────► [Logout] ─────► Back to /
```

---

## 3. Donor Registration Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                         HomePage                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Display Stats from DonorsContext                        │ │
│  │  ├─ stats.total (Total Donors)                          │ │
│  │  ├─ stats.today (Registrations Today)                   │ │
│  │  └─ "24/7" Emergency Support (static)                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  DonorForm Component                                     │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ User Input Fields:                                 │  │ │
│  │  │ • Full Name (required, min 3 chars)                │  │ │
│  │  │ • Phone (required, 10 digits)                      │  │ │
│  │  │ • Age (required, 18-65)                            │  │ │
│  │  │ • Blood Type (required, dropdown)                  │  │ │
│  │  │ • Gender (optional, dropdown)                      │  │ │
│  │  │ • Area/City (required)                             │  │ │
│  │  │ • Last Donation Date (optional)                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ On Field Change:                                   │  │ │
│  │  │ ✓ Update local state                              │  │ │
│  │  │ ✓ Clear error for that field                       │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ On Submit:                                         │  │ │
│  │  │ ┌──────────────────────────────────────────────┐   │  │ │
│  │  │ │ Step 1: Validate All Fields                 │   │  │ │
│  │  │ │ ├─ Check fullName.length >= 3               │   │  │ │
│  │  │ │ ├─ Check phone matches /^\d{10}$/           │   │  │ │
│  │  │ │ ├─ Check 18 <= age <= 65                    │   │  │ │
│  │  │ │ ├─ Check bloodType is not empty             │   │  │ │
│  │  │ │ └─ Check city is not empty                  │   │  │ │
│  │  │ └──────────────────────────────────────────────┘   │  │ │
│  │  │           │                                         │  │ │
│  │  │  ┌────────┴────────┐                               │  │ │
│  │  │  │ Invalid         │ Valid                         │  │ │
│  │  │  ▼                 ▼                               │  │ │
│  │  │ Show Error    Create Donor Object                 │  │ │
│  │  │ Toast         {                                    │  │ │
│  │  │ Red Borders   id: Date.now(),                      │  │ │
│  │  │ Error Msgs    status: 'pending',                   │  │ │
│  │  │               registeredAt: ISO-timestamp,         │  │ │
│  │  │               ...formData                          │  │ │
│  │  │               }                                    │  │ │
│  │  │               │                                    │  │ │
│  │  │               ▼                                    │  │ │
│  │  │               Call onSubmitSuccess()               │  │ │
│  │  │               addDonor(newDonor)                  │  │ │
│  │  │               │                                    │  │ │
│  │  │               ▼                                    │  │ │
│  │  │  ┌──────────────────────────────────────┐         │  │ │
│  │  │  │ DonorsContext Updates:              │         │  │ │
│  │  │  │ ├─ Add to donors array              │         │  │ │
│  │  │  │ ├─ Auto-save to localStorage        │         │  │ │
│  │  │  │ ├─ Trigger calculateStats()         │         │  │ │
│  │  │  │ └─ Update stats object              │         │  │ │
│  │  │  └──────────────────────────────────────┘         │  │ │
│  │  │               │                                    │  │ │
│  │  │               ▼                                    │  │ │
│  │  │  ┌──────────────────────────────────────┐         │  │ │
│  │  │  │ UI Updates:                         │         │  │ │
│  │  │  │ ├─ Show "Registration Successful"   │         │  │ │
│  │  │  │ ├─ Disable button                   │         │  │ │
│  │  │  │ ├─ Clear form fields                │         │  │ │
│  │  │  │ └─ Success toast display            │         │  │ │
│  │  │  └──────────────────────────────────────┘         │  │ │
│  │  │               │                                    │  │ │
│  │  │               ▼ (Wait 1.8s)                       │  │ │
│  │  │               navigate('/dashboard')              │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Links:                                                 │ │
│  │  • View Donor Dashboard → /dashboard                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Admin Login & Authentication Flow

```
┌─────────────────────────────────────┐
│  User Clicks "Admin Login" Link      │
│  Navigate to /admin-login            │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│  AdminLoginPage                                          │
│  ├─ Check: isAdmin from context?                        │
│  │         └─ YES → Auto-redirect to /admin              │
│  │         └─ NO → Show login form                       │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Login Form:                                         │ │
│  │ ├─ Username Input (placeholder: Admin@1)           │ │
│  │ ├─ Password Input (placeholder: Enter password)    │ │
│  │ └─ Sign In Button                                  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ On Submit:                                          │ │
│  │ ┌──────────────────────────────────────────────┐   │ │
│  │ │ 1. Disable button → Show "Signing in…"      │   │ │
│  │ │ 2. Call login(username, password)           │   │ │
│  │ │    from useAdminAuth hook                   │   │ │
│  │ │ 3. Compare with context credentials         │   │ │
│  │ │    Expected: Admin@1 / Sukoon@2026          │   │ │
│  │ │    Or from env: VITE_ADMIN_* vars           │   │ │
│  │ └──────────────────────────────────────────────┘   │ │
│  │         │                                           │ │
│  │    ┌────┴─────┐                                     │ │
│  │    │           │                                    │ │
│  │    ▼ Invalid   ▼ Valid                             │ │
│  │  Show Error  Set isAdmin = true                     │ │
│  │  Message     │                                      │ │
│  │  Stay on     ▼                                      │ │
│  │  page     Redirect to:                              │ │
│  │           - URL from ?next= param                   │ │
│  │           - Or default /admin                       │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Protected Route Check

```
┌────────────────────────────────────┐
│  User navigates to /admin           │
└────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│  App.jsx Route:                     │
│  <Route element={<AdminRoute />}>  │
│    <Route path="/admin" .../>       │
│  </Route>                           │
└────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  AdminRoute Component:                                 │
│  ├─ Check: isAdmin from useAdminAuth()?              │
│  │                                                    │
│  └─ Decision Point:                                  │
│      ├─ NO (isAdmin = false):                        │
│      │  └─ Capture current URL                       │
│      │  └─ Create next param with encoded URL        │
│      │  └─ Return:                                   │
│      │     <Navigate                                 │
│      │       to="/admin-login?next={encoded-url}"   │
│      │       replace                                 │
│      │     />                                        │
│      │                                               │
│      └─ YES (isAdmin = true):                        │
│         └─ Return: <Outlet />                       │
│            ├─ Renders AdminPanelPage                │
│            └─ User sees admin dashboard             │
└────────────────────────────────────────────────────────┘
```

---

## 6. Admin Panel Data Management Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    AdminPanelPage Loads                          │
│                                                                   │
│  Initialize State:                                               │
│  ├─ activeStatus = 'pending'  (tab filter)                       │
│  ├─ exportScope = 'active'    (export filter)                    │
│  ├─ page = 1                  (pagination)                       │
│  │                                                               │
│  ├─ Fetch from DonorsContext:                                    │
│  │  ├─ donors: [{ id, fullName, status, ... }]                 │
│  │  ├─ stats: { total, male, female, ... }                     │
│  │  └─ updateDonorStatus(id, status) function                  │
│  │                                                               │
│  └─ Fetch from AdminAuthContext:                                │
│     └─ logout() function                                         │
│                                                                   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   DISPLAY METRICS  DISPLAY TABS        DISPLAY TABLE
        │                  │                  │
        ▼                  ▼                  ▼
   ┌────────────┐  ┌──────────────┐  ┌──────────────┐
   │ 6 Cards    │  │ 4 Status     │  │ Donor Data   │
   │ showing:   │  │ Tabs:        │  │ with:        │
   │ • Total    │  │ • All        │  │ • Filtering  │
   │ • Male     │  │ • Pending    │  │ • Pagination │
   │ • Female   │  │ • Accepted   │  │ • Actions    │
   │ • Accepted │  │ • Rejected   │  │ • Status     │
   │ • Acc. M   │  │              │  │   changes    │
   │ • Acc. F   │  │ Selected tab │  │              │
   │            │  │ filters data │  │              │
   └────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        │      ┌───────────┴─────────────┬────┘
        │      │                         │
        ▼      ▼                         ▼
   Re-render on Data Change (Donors updated)
        │
        ▼
   ┌────────────────────────────────────────────┐
   │ Admin Actions:                             │
   │                                            │
   │ 1. Status Tab Click:                       │
   │    ├─ setActiveStatus(key)                 │
   │    ├─ setPage(1) [reset pagination]        │
   │    └─ Table re-filters & displays          │
   │                                            │
   │ 2. Row Action Button Click:                │
   │    ├─ Pending | Accept | Reject button    │
   │    │ clicked                              │
   │    ├─ Call updateDonorStatus(id, status)  │
   │    │                                       │
   │    └─ DonorsContext:                       │
   │       ├─ Find donor by id                  │
   │       ├─ Update status field               │
   │       ├─ Auto-calculate new stats          │
   │       ├─ Save to localStorage              │
   │       └─ useMemo hook updates UI           │
   │                                            │
   │ 3. Export Scope Toggle:                    │
   │    ├─ Current Tab | All Donors button     │
   │    └─ setExportScope(scope)                │
   │                                            │
   │ 4. Export Button Click:                    │
   │    ├─ Excel: Generate .xlsx file           │
   │    ├─ CSV: Generate .csv file              │
   │    └─ PDF: Open print-ready HTML           │
   │                                            │
   │ 5. Logout Button Click:                    │
   │    ├─ Call logout() from context           │
   │    ├─ Set isAdmin = false                  │
   │    └─ (User redirected via navigate)       │
   │                                            │
   └────────────────────────────────────────────┘
```

---

## 7. Data State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DonorsContext                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Initial Load:                                        │  │
│  │ 1. Load from localStorage('bloodDonors')             │  │
│  │ 2. JSON.parse() → array of donor objects             │  │
│  │ 3. Set as initial state                              │  │
│  │ 4. Call calculateStats(donors)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ STATE:                                               │  │
│  │ const [donors, setDonors] = useState([...])          │  │
│  │ const stats = useMemo(() =>                          │  │
│  │   calculateStats(donors), [donors])                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SIDE EFFECT (useEffect):                             │  │
│  │ On every donors change:                              │  │
│  │ ├─ localStorage.setItem('bloodDonors',               │  │
│  │ │   JSON.stringify(donors))                          │  │
│  │ └─ Dependency: [donors]                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ FUNCTIONS:                                           │  │
│  │                                                      │  │
│  │ addDonor(newDonor):                                  │  │
│  │ ├─ Normalize: set status='pending'                  │  │
│  │ ├─ Add registeredAt: ISO timestamp                  │  │
│  │ ├─ setDonors(prev => [...prev, donor])              │  │
│  │ └─ Triggers: save to localStorage + calc stats      │  │
│  │                                                      │  │
│  │ updateDonorStatus(id, newStatus):                   │  │
│  │ ├─ setDonors(prev =>                                │  │
│  │ │   prev.map(d =>                                   │  │
│  │ │     d.id === id                                   │  │
│  │ │       ? { ...d, status: newStatus }               │  │
│  │ │       : d                                         │  │
│  │ │   )                                               │  │
│  │ │ )                                                 │  │
│  │ └─ Triggers: save to localStorage + calc stats      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    calculateStats(donorList)                │
│                                                             │
│  INPUT: Array of donors                                     │
│                                                             │
│  CALCULATIONS:                                              │
│  ├─ total = donorList.length                               │
│  ├─ today = donorList.length (same as total)               │
│  │                                                         │
│  ├─ Status Counts:                                         │
│  │  ├─ pending = filter by status='pending'                │
│  │  ├─ accepted = filter by status='accepted'              │
│  │  └─ rejected = filter by status='rejected'              │
│  │                                                         │
│  ├─ Gender Counts:                                         │
│  │  ├─ male = filter by gender='Male' (case-insensitive)  │
│  │  ├─ female = filter by gender='Female'                 │
│  │  ├─ acceptedMale = filter both conditions              │
│  │  └─ acceptedFemale = filter both conditions            │
│  │                                                         │
│  ├─ Blood Type Distribution:                               │
│  │  ├─ byBloodType = reduce to { A+: count, ... }         │
│  │  └─ acceptedByBloodType = filter + reduce              │
│  │                                                         │
│  OUTPUT: stats object                                       │
│  {                                                         │
│    total, today,                                           │
│    pending, accepted, rejected,                            │
│    male, female,                                           │
│    acceptedMale, acceptedFemale,                           │
│    byBloodType, acceptedByBloodType                        │
│  }                                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Provide via Context:                                       │
│  <DonorsContext.Provider value={{                           │
│    donors,                                                  │
│    stats,                                                   │
│    addDonor,                                                │
│    updateDonorStatus                                        │
│  }}>                                                        │
│    {children}                                               │
│  </DonorsContext.Provider>                                 │
│                                                             │
│  Usage in Components:                                       │
│  const { donors, stats, addDonor, updateDonorStatus }      │
│    = useDonors()                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Admin Export Flow

```
┌──────────────────────────────────────────────┐
│  Admin clicks Export Button:                  │
│  • Download Excel                            │
│  • Download CSV                              │
│  • Download PDF                              │
└──────────────┬───────────────────────────────┘
               │
        ┌──────┴──────────┬────────────┐
        │                 │            │
        ▼                 ▼            ▼
   EXCEL             CSV           PDF
        │                 │            │
        ▼                 ▼            ▼

┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ Prepare     │  │ Prepare      │  │ Prepare      │
│ Export Data │  │ Export Data  │  │ Export Data  │
├─────────────┤  ├──────────────┤  ├──────────────┤
│ exportRows: │  │ exportRows:  │  │ exportRows:  │
│ - If scope  │  │ - If scope   │  │ - If scope   │
│   'active':  │  │   'active':  │  │   'active':  │
│   use       │  │   use        │  │   use        │
│   filtered  │  │   filtered   │  │   filtered   │
│   donors    │  │   donors     │  │   donors     │
│ - If scope  │  │ - If scope   │  │ - If scope   │
│   'all':    │  │   'all':     │  │   'all':     │
│   use all   │  │   use all    │  │   use all    │
│   donors    │  │   donors     │  │   donors     │
└────────────┬┘  └──────────────┘  └──────────────┘
             │                  │            │
             ▼                  ▼            ▼

┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐
│ Convert to       │  │ Convert to       │  │ Generate HTML  │
│ XLSX format      │  │ CSV format       │  │ Table:         │
│                  │  │                  │  │ • Header       │
│ XLSX.utils.      │  │ XLSX.utils.      │  │ • Rows with    │
│ json_to_sheet()  │  │ sheet_to_csv()   │  │   donor data   │
│                  │  │                  │  │ • Status       │
│ XLSX.utils.      │  │                  │  │   badges       │
│ book_new()       │  │                  │  │ • Styling      │
│                  │  │                  │  │ • Print media  │
│ XLSX.utils.      │  │                  │  │   styles       │
│ book_append_     │  │                  │  │                │
│ sheet()          │  │                  │  │                │
│                  │  │                  │  │                │
│ XLSX.write()     │  │                  │  │                │
└──────────────────┘  └──────────────────┘  └────────────────┘
             │                  │                   │
             ▼                  ▼                   ▼

┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐
│ Create Blob:     │  │ Create Blob:     │  │ Create Blob:   │
│ type:            │  │ type:            │  │ type:          │
│ application/..   │  │ text/csv;        │  │ text/html;     │
│ .spreadsheetml   │  │ charset=utf-8    │  │ charset=utf-8  │
│ .sheet           │  │                  │  │                │
│                  │  │                  │  │ Convert HTML   │
│ data: array      │  │ data: CSV string │  │ to Blob        │
│ from XLSX.write  │  │                  │  │                │
└──────────────────┘  └──────────────────┘  └────────────────┘
             │                  │                   │
             ▼                  ▼                   ▼

┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐
│ downloadBlob()   │  │ downloadBlob()   │  │ window.open()  │
│                  │  │                  │  │                │
│ 1. Create URL:   │  │ 1. Create URL:   │  │ 1. Create URL: │
│    URL.create    │  │    URL.create    │  │    URL.create  │
│    ObjectURL()   │  │    ObjectURL()   │  │    ObjectURL() │
│                  │  │                  │  │                │
│ 2. Create <a>:   │  │ 2. Create <a>:   │  │ 2. Open in     │
│    el.href=url   │  │    el.href=url   │  │    new window  │
│    el.download   │  │    el.download   │  │                │
│                  │  │                  │  │ 3. Browser     │
│ 3. Click <a>:    │  │ 3. Click <a>:    │  │    print       │
│    el.click()    │  │    el.click()    │  │    dialog auto │
│                  │  │                  │  │    opens       │
│ 4. Cleanup:      │  │ 4. Cleanup:      │  │                │
│    el.remove()   │  │    el.remove()   │  │ 4. User presses│
│    URL.revoke    │  │    URL.revoke    │  │    Ctrl+P or   │
│                  │  │                  │  │    Cmd+P or    │
│                  │  │                  │  │    Print button│
│                  │  │                  │  │                │
│ ▼ RESULT ▼       │  │ ▼ RESULT ▼       │  │ 5. In print    │
│ FILE              │  │ FILE             │  │    dialog:     │
│ donors_active_    │  │ donors_active_   │  │    "Save as    │
│ 2026-03-22.xlsx   │  │ 2026-03-22.csv   │  │    PDF" option │
│                  │  │                  │  │                │
│ OPENS IN:        │  │ OPENS IN:        │  │ ▼ RESULT ▼     │
│ Excel            │  │ Excel            │  │ PDF FILE       │
│ Sheets           │  │ Sheets           │  │ donors_active_ │
│ Numbers          │  │ Any App          │  │ 2026-03-22.pdf │
└──────────────────┘  └──────────────────┘  └────────────────┘
```

---

## 9. Dashboard Analytics Flow

```
┌──────────────────────────────────────┐
│    DashboardPage Renders             │
│                                      │
│  Fetch data from useDonors:          │
│  ├─ donors (all records)             │
│  └─ stats (calculated metrics)       │
└────────────┬───────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼

┌─────────────────────────┐
│ Display Stat Cards (4)  │
│                         │
│ • Today's Registrations │
│   (stats.today)         │
│                         │
│ • Total Donors          │
│   (stats.total)         │
│                         │
│ • Blood Types Available │
│   (count of keys in     │
│    acceptedByBloodType) │
│                         │
│ • Potential Volume      │
│   (stats.total × 450ml) │
└─────────────────────────┘
    │
    ▼

┌──────────────────────────────────┐
│ BloodTypeDistribution Component   │
│                                  │
│ Display grid of 8 blood types:   │
│ A+, A-, B+, B-, AB+, AB-, O+, O- │
│                                  │
│ For each blood type:             │
│ • Blood type label (red)          │
│ • Total donors: byBloodType[type] │
│ • "donors" subtitle              │
│                                  │
│ Example:                         │
│ ┌──────────┐                     │
│ │    A+    │                     │
│ │    30    │                     │
│ │ donors   │                     │
│ └──────────┘                     │
└──────────────────────────────────┘
    │
    ▼

┌──────────────────────────────────┐
│ RecentDonorsTable Component       │
│                                  │
│ 1. Take last 10 donors           │
│ 2. Reverse (newest first)         │
│ 3. Display table:                │
│    ├─ Name                       │
│    ├─ Blood Type (red badge)     │
│    ├─ Gender                     │
│    ├─ City                       │
│    ├─ Contact (phone)            │
│    ├─ Registered (timestamp)     │
│    └─ Status (color pill)        │
│                                  │
│ NO ACTION BUTTONS                │
│ (Read-only view for dashboard)   │
└──────────────────────────────────┘
    │
    ▼

┌──────────────────────────────────┐
│ Navigation Links:                │
│ • Admin Login → /admin-login     │
│ • Blood Drop → /blood-drop       │
└──────────────────────────────────┘
```

---

## 10. Blood Drop Visualization Flow

```
┌──────────────────────────────────────────────┐
│  BloodDropPage Loads                         │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  BloodDropVisualization Component                        │
│                                                          │
│  1. Fetch data:                                          │
│     ├─ donors from useDonors                            │
│     └─ Filter: status='accepted' only                   │
│                                                          │
│  2. Calculate goal & progress:                           │
│     ├─ GOAL = env.VITE_BLOOD_DROP_GOAL || 100           │
│     ├─ acceptedCount = filtered donors length            │
│     └─ fillPercent = (acceptedCount / GOAL) × 100        │
│        └─ Capped at 100%                                │
│                                                          │
│  3. Generate donor dots (max 220):                       │
│     ├─ For each accepted donor:                          │
│     │  ├─ Calculate spiral position:                     │
│     │  │  ├─ angle = (i / max) × 2π                     │
│     │  │  └─ radius = 0.12 + (i / max) × 0.36           │
│     │  ├─ Get x, y coordinates on SVG                   │
│     │  ├─ Extract donor initials (first 2 letters)      │
│     │  └─ Store: { id, x%, y%, initials }               │
│     │                                                   │
│     └─ Render dots with initials                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│  Display Visual Elements:                    │
│                                              │
│  1. SVG Blood Drop Shape                    │
│     ├─ SVG path (teardrop shape)            │
│     ├─ Background: outlined (no fill)       │
│     │                                        │
│     ├─ Fill layer (red):                     │
│     │  └─ height = fillPercent%              │
│     │  └─ animated: 700ms ease               │
│     │                                        │
│     └─ Donor dots overlay:                   │
│        ├─ Each dot = 1 accepted donor        │
│        ├─ Initials inside circle             │
│        └─ Positioned at calculated x,y       │
│                                              │
│  2. Progress Info Card (right/bottom):      │
│     ├─ Current count: {acceptedCount}       │
│     ├─ Goal: {GOAL}                         │
│     │                                        │
│     ├─ Progress bar:                         │
│     │  └─ width = fillPercent%               │
│     │  └─ animated: 700ms ease               │
│     │                                        │
│     ├─ Percentage text:                      │
│     │  └─ "{fillPercent}% of goal filled"    │
│     │                                        │
│     └─ Donor names ticker:                   │
│        ├─ Scrolling marquee animation        │
│        ├─ Shows all accepted donor names     │
│        ├─ Looped text: name • name • ...     │
│        └─ Continuous scroll effect           │
│                                              │
└──────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│  User Interactions:                          │
│                                              │
│  • Hover over dots:                         │
│    └─ Show tooltip with donor initials      │
│                                              │
│  • Watch animated progress:                  │
│    └─ Smooth fill as donors are accepted    │
│                                              │
│  • View donor ticker:                       │
│    └─ Names scroll continuously             │
│                                              │
│  • Click "Back to Dashboard":                │
│    └─ Navigate to /dashboard                │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 11. Complete User Journey: New Donor

```
START: User visits website
  │
  ▼
Home Page (/)
  ├─ See stats (0 donors initially)
  ├─ See form
  └─ Fill registration form:
     ├─ Name: "John Doe"
     ├─ Phone: "9876543210"
     ├─ Age: "28"
     ├─ Blood Type: "A+"
     ├─ Gender: "Male"
     ├─ City: "Mumbai"
     └─ Click Register
        │
        ▼
    Validation
      ├─ Valid → Success toast
      │          Show "Registration Successful"
      │          Clear form
      │          │
      │          ▼ Wait 1.8s
      │          Navigate to /dashboard
      │          │
      │          └─────────────┐
      │                        │
      └─ Invalid → Error toast │
         Show errors           │
         Red borders           │
         Stay on page          │
                               │
                               ▼
                    Dashboard Page (/)
                      ├─ See stats updated:
                      │  ├─ Total Donors: 1
                      │  ├─ Today: 1
                      │  ├─ Blood Types Available: 1
                      │  └─ Volume: 450ml
                      │
                      ├─ See blood type grid
                      │  └─ A+: 1 donor
                      │
                      ├─ See recent donors table
                      │  ├─ Name: John Doe
                      │  ├─ Blood: A+
                      │  ├─ Gender: Male
                      │  ├─ City: Mumbai
                      │  ├─ Phone: 9876543210
                      │  ├─ Registered: [timestamp]
                      │  └─ Status: Pending (yellow)
                      │
                      ├─ Optional: Click "Blood Drop" link
                      │  └─ See drop (0% filled, no accepted)
                      │
                      └─ Optional: Click "Admin Login"
                         └─ Navigate to /admin-login

                    Admin Login (/admin-login)
                      ├─ Enter credentials:
                      │  ├─ Username: Admin@1
                      │  └─ Password: Sukoon@2026
                      │
                      ├─ Click "Sign in"
                      │  │
                      │  ▼ Valid
                      │  Navigate to /admin
                      │
                      └─────────────────────┐
                                            │
                                            ▼
                            Admin Panel (/admin)
                              ├─ See metrics:
                              │  ├─ Total Registrations: 1
                              │  ├─ Total Male: 1
                              │  ├─ Total Female: 0
                              │  ├─ Total Accepted: 0
                              │  ├─ Accepted Males: 0
                              │  └─ Accepted Females: 0
                              │
                              ├─ See request table:
                              │  └─ John Doe
                              │     ├─ Blood: A+
                              │     ├─ City: Mumbai
                              │     ├─ Phone: 9876543210
                              │     ├─ Status: Pending
                              │     └─ Actions: [Pending] [Accept] [Reject]
                              │
                              ├─ Click "Accept" button
                              │  │
                              │  ▼ updateDonorStatus(id, 'accepted')
                              │  ├─ Update context
                              │  ├─ Recalculate stats
                              │  ├─ Save to localStorage
                              │  │
                              │  └─ UI updates instantly:
                              │     ├─ Metrics:
                              │     │  └─ Total Accepted: 1
                              │     │  └─ Accepted Males: 1
                              │     │
                              │     └─ Table:
                              │        ├─ Status: Accepted (green)
                              │        └─ Accept button: disabled
                              │
                              ├─ Can export data:
                              │  ├─ Excel (.xlsx)
                              │  ├─ CSV (.csv)
                              │  └─ PDF (print-ready)
                              │
                              └─ Click "Logout"
                                 │
                                 ▼ isAdmin = false
                                 Redirect to /

END: Back to home
```

---

## 12. Component Re-render Dependency Tree

```
Root (App)
  │
  ├─ DonorsContext updated
  │  └─ triggers useContext hooks in all child components
  │
  ├─ HomePage
  │  ├─ useDonors → stats
  │  │  └─ StatCard components re-render (new values)
  │  │
  │  └─ DonorForm
  │     └─ Re-renders on handleChange (local state)
  │
  ├─ DashboardPage
  │  ├─ useDonors → donors, stats
  │  │  └─ All cards re-render
  │  │
  │  ├─ BloodTypeDistribution
  │  │  └─ Re-renders (byBloodType updated)
  │  │
  │  └─ RecentDonorsTable
  │     └─ Re-renders (donors array changed)
  │
  ├─ BloodDropPage
  │  └─ BloodDropVisualization
  │     ├─ useDonors → donors (filtered)
  │     └─ Recalculates:
  │        ├─ acceptedCount
  │        ├─ fillPercent
  │        ├─ dots array
  │        ├─ Animations
  │        └─ Ticker names
  │
  ├─ AdminPanelPage
  │  ├─ useDonors → donors, stats, updateDonorStatus
  │  │  └─ All metrics re-render
  │  │
  │  ├─ useMemo(() => filtered)
  │  │  └─ Filter by activeStatus
  │  │
  │  ├─ useMemo(() => paged)
  │  │  └─ Slice for current page
  │  │
  │  └─ Table rows re-render
  │     └─ Status changes visible immediately
  │
  └─ AdminAuthContext updated
     └─ triggers useAdminAuth hooks
```

---

**End of Workflow Diagrams Document**
