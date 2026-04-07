# 💻 Blood Donation App - Code Explanations & Technical Details

## Entry Point: main.jsx

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { DonorsProvider } from './context/DonorsContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <DonorsProvider>
          <App />
        </DonorsProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

**Explanation:**
- `createRoot()`: React 18+ API to mount the app to DOM
- `StrictMode`: Highlights potential problems in development (warns about side effects)
- `BrowserRouter`: Enables client-side routing with React Router v7
- Provider nesting order:
  1. **BrowserRouter** (outermost - enables routing)
  2. **AdminAuthProvider** (auth context - needed by protected routes)
  3. **DonorsProvider** (data context - needed by pages)
  4. **App** (innermost - routes use these contexts)

---

## Route Configuration: App.jsx

```jsx
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
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/blood-drop" element={<BloodDropPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanelPage />} />
      </Route>

      {/* Catch-all: 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

**Explanation:**
- `<Routes>`: Container for route definitions
- Public routes: Accessible to anyone
- Protected route with `<AdminRoute />` wrapper:
  - `<Route element={<AdminRoute />}>` wraps admin route
  - `<AdminRoute />` checks `isAdmin` flag
  - If not admin: redirects to login with return URL
  - If admin: renders `<Outlet />` → `<AdminPanelPage />`
- Catch-all: Any undefined path → home page

---

## Protected Route: AdminRoute.jsx

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminRoute() {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    // Capture current URL for post-login redirect
    const next = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return <Navigate 
      to={`/admin-login?next=${encodeURIComponent(next)}`} 
      replace 
    />;
  }

  return <Outlet />;
}
```

**Explanation:**
- `useAdminAuth()`: Get `isAdmin` flag from context
- `useLocation()`: Get current URL pathname, search, hash
- **If NOT admin:**
  - Construct next URL with all components
  - `encodeURIComponent()`: Safely encode for URL param
  - Redirect to login with `next` param
  - `replace={true}`: Don't add to history stack
- **If admin:** Render child route via `<Outlet />`

---

## State Management: DonorsContext.jsx (Part 1: Setup)

```jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bloodDonors';

// Helper: Normalize donor object (ensure required fields)
function normalizeDonor(d) {
  return {
    ...d,
    status: d?.status || 'pending',  // Default to pending
    registeredAt: d?.registeredAt || new Date().toISOString(),
  };
}

// Load initial data from localStorage
function loadInitialDonors() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeDonor);  // Ensure all have required fields
  } catch (e) {
    console.error('Error loading donors:', e);
    return [];
  }
}
```

**Explanation:**
- `STORAGE_KEY = 'bloodDonors'`: Key for localStorage
- `normalizeDonor()`: Ensures every donor object has:
  - `status`: Defaults to 'pending' if missing
  - `registeredAt`: Defaults to current ISO timestamp if missing
- `loadInitialDonors()`:
  - Try to parse localStorage JSON
  - If error or not array: return empty array
  - Map all donors through normalizeDonor for safety

---

## State Management: DonorsContext.jsx (Part 2: Calculations)

```jsx
function calculateStats(donorList) {
  // COUNT REGISTRATIONS
  const todayCount = donorList.length;  // Same as total

  // GROUP BY BLOOD TYPE
  const byBloodType = donorList.reduce((acc, d) => {
    if (!d?.bloodType) return acc;
    acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
    return acc;
  }, {});

  // ACCEPTED DONORS BY BLOOD TYPE
  const acceptedByBloodType = donorList.reduce((acc, d) => {
    if ((d?.status || 'pending') !== 'accepted') return acc;
    if (!d?.bloodType) return acc;
    acc[d.bloodType] = (acc[d.bloodType] || 0) + 1;
    return acc;
  }, {});

  // COUNT BY STATUS
  const statusCounts = donorList.reduce(
    (acc, d) => {
      if (d.status === 'accepted') acc.accepted++;
      else if (d.status === 'rejected') acc.rejected++;
      else acc.pending++;
      return acc;
    },
    { accepted: 0, rejected: 0, pending: 0 }
  );

  // COUNT BY GENDER (case-insensitive)
  const male = donorList.reduce(
    (acc, d) => (String(d.gender || '').toLowerCase() === 'male' ? acc + 1 : acc), 
    0
  );
  const female = donorList.reduce(
    (acc, d) => (String(d.gender || '').toLowerCase() === 'female' ? acc + 1 : acc), 
    0
  );

  // ACCEPTED DONORS BY GENDER
  const acceptedMale = donorList.reduce(
    (acc, d) => (
      String(d.gender || '').toLowerCase() === 'male' && 
      (d.status || 'pending') === 'accepted' 
        ? acc + 1 
        : acc
    ),
    0
  );
  const acceptedFemale = donorList.reduce(
    (acc, d) => (
      String(d.gender || '').toLowerCase() === 'female' && 
      (d.status || 'pending') === 'accepted' 
        ? acc + 1 
        : acc
    ),
    0
  );

  return {
    total: donorList.length,
    today: todayCount,
    byBloodType,
    acceptedByBloodType,
    ...statusCounts,  // Spread pending, accepted, rejected
    male,
    female,
    acceptedMale,
    acceptedFemale,
  };
}
```

**Explanation:**
- `reduce()` pattern: Iterate and accumulate results
- **byBloodType**: Object with keys A+, A-, etc., values = count
- **acceptedByBloodType**: Only count donors with status='accepted'
- **statusCounts**: Tally by status (pending/accepted/rejected)
- **Gender counts**: Use `.toLowerCase()` for case-insensitive comparison
- **acceptedMale/acceptedFemale**: Check both gender AND status

---

## State Management: DonorsContext.jsx (Part 3: Provider)

```jsx
const DonorsContext = createContext(null);

export function DonorsProvider({ children }) {
  // Load initial data from localStorage
  const [donors, setDonors] = useState(() => loadInitialDonors());

  // SIDE EFFECT: Save to localStorage whenever donors change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
    } catch (e) {
      console.error('Error saving donors:', e);
    }
  }, [donors]);  // Dependency: only run when donors changes

  // Memoized stats (recalculated only when donors changes)
  const stats = useMemo(() => calculateStats(donors), [donors]);

  // Add new donor
  const addDonor = (newDonor) => {
    const donor = normalizeDonor({
      ...newDonor,
      status: 'pending',
    });
    setDonors((prev) => [...prev, donor]);
  };

  // Update donor status
  const updateDonorStatus = (id, newStatus) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ donors, stats, addDonor, updateDonorStatus }),
    [donors, stats]
  );

  return (
    <DonorsContext.Provider value={value}>
      {children}
    </DonorsContext.Provider>
  );
}

// Custom hook to use context (with error handling)
export default function useDonorsContext() {
  const ctx = useContext(DonorsContext);
  if (!ctx) throw new Error('useDonors must be used within <DonorsProvider />');
  return ctx;
}
```

**Explanation:**
- `useState(() => loadInitialDonors())`: Lazy initialization (load from storage on mount)
- `useEffect`: Save to localStorage whenever donors change
  - Dependency `[donors]`: Only run when donors array changes
  - Try-catch: Handle quota errors gracefully
- `stats = useMemo(...)`: Recalculate only when donors change (performance)
- `addDonor()`:
  - Normalize donor (ensure status='pending')
  - Add to array: `[...prev, donor]`
- `updateDonorStatus()`:
  - Map over array, update matching donor by id
- `value = useMemo(...)`: Memoize entire value object to prevent child re-renders
- Error in hook: Check if context exists (used outside provider)

---

## Authentication: AdminAuthContext.jsx

```jsx
import React, { createContext, useContext, useMemo, useState } from 'react';

function getExpectedUsername() {
  return import.meta.env.VITE_ADMIN_USERNAME || 'Admin@1';
}

function getExpectedPassword() {
  return import.meta.env.VITE_ADMIN_PASSWORD || 'Sukoon@2026';
}

function loadInitialIsAdmin() {
  // Do NOT persist admin status - require fresh login on reload
  return false;
}

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => loadInitialIsAdmin());

  // Login: Compare credentials
  const login = (username, password) => {
    const expectedUsername = getExpectedUsername();
    const expected = getExpectedPassword();
    const ok =
      String(username || '') === String(expectedUsername) &&
      String(password || '') === String(expected);
    if (ok) {
      setIsAdmin(true);
    }
    return ok;  // Return success status
  };

  // Logout: Clear admin status
  const logout = () => {
    setIsAdmin(false);
  };

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within <AdminAuthProvider />');
  return ctx;
}
```

**Explanation:**
- `import.meta.env`: Vite's environment variable access (VITE_ prefix required)
- `getExpectedUsername/Password()`: Fallback to hardcoded if env var not set
- `loadInitialIsAdmin()`: Always return false (no persistence)
  - Each page reload requires fresh login
  - Better security: no cached admin token in browser
- `login()`:
  - Convert inputs to strings (defensive)
  - Compare with expected values
  - Set isAdmin=true if match
  - Return boolean for feedback
- `logout()`: Simply set to false
- Memoize value for performance

---

## Form Validation: DonorForm.jsx (Validation Logic)

```jsx
const validateForm = () => {
  const newErrors = {};
  
  // NAME: Required, min 3 characters
  if (!formData.fullName.trim() || formData.fullName.length < 3)
    newErrors.fullName = 'Full name must be at least 3 characters';
  
  // EMAIL: Validation commented (optional field)
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(formData.email)) 
  //   newErrors.email = 'Please enter a valid email address';
  
  // PHONE: Required, exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(formData.phone.replace(/\D/g, '')))
    newErrors.phone = 'Phone number must be 10 digits';
  
  // AGE: Required, between 18 and 65
  const age = parseInt(formData.age);
  if (!age || age < 18 || age > 65) 
    newErrors.age = 'Age must be between 18 and 65';
  
  // BLOOD TYPE: Required, must be selected
  if (!formData.bloodType) 
    newErrors.bloodType = 'Please select your blood type';
  
  // CITY: Required, not empty
  if (!formData.city.trim()) 
    newErrors.city = 'City is required';
  
  // ... other optional fields commented out
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;  // Return true if no errors
};
```

**Explanation:**
- `formData.fullName.trim()`: Remove whitespace, check if empty
- `.length < 3`: Minimum length check
- Phone regex `/^\d{10}$/`:
  - `^`: Start of string
  - `\d{10}`: Exactly 10 digits
  - `$`: End of string
  - `.replace(/\D/g, '')`: Remove all non-digits before regex (allows formatting)
- `parseInt()`: Convert age string to number
- `age < 18 || age > 65`: Range validation
- Return `true` if `newErrors` object is empty
- Store errors in state to display to user

---

## Form Submission: DonorForm.jsx (Submit Logic)

```jsx
const handleSubmit = async () => {
  // STEP 1: Validate
  if (!validateForm()) {
    setSubmitStatus('error');
    setTimeout(() => setSubmitStatus(null), 3000);
    return;
  }

  // STEP 2: Show loading
  setIsSubmitting(true);
  await new Promise(resolve => setTimeout(resolve, 800));  // Artificial delay

  // STEP 3: Create donor object
  const newDonor = {
    ...formData,
    id: Date.now(),  // Unique ID from timestamp
    registeredAt: new Date().toISOString()
  };

  // STEP 4: Callback to parent
  onSubmitSuccess(newDonor);

  // STEP 5: Show success
  setSubmitStatus('success');
  setIsSubmitting(false);

  // STEP 6: Reset after delay
  setTimeout(() => {
    setSubmitStatus(null);
    setFormData({
      fullName: '', email: '', phone: '', age: '', bloodType: '', address: '',
      city: '', lastDonation: '', medicalConditions: '', emergencyContact: '', emergencyPhone: ''
    });
  }, 1500);
};
```

**Explanation:**
- **Validation**: If invalid, show error toast and return early
- **Loading delay**: `await new Promise(...)` simulates API call (UX improvement)
- **Donor object**:
  - Spread all form data
  - `id: Date.now()`: Simple unique ID (milliseconds since epoch)
  - `registeredAt: ISO timestamp`: When registered
- **Callback**: `onSubmitSuccess(newDonor)` → parent (HomePage) handles:
  - `addDonor(newDonor)` → adds to DonorsContext
  - `navigate('/dashboard')` → redirect
- **Success toast**: Show for 3 seconds (setTimeout clears it)
- **Reset**: Clear form and status after 1.5s

---

## Data Display: AdminPanelPage.jsx (Filtering & Pagination)

```jsx
// FILTER LOGIC
const filtered = useMemo(() => {
  const base =
    activeStatus === 'all'
      ? donors  // Show all
      : donors.filter((d) => (d.status || 'pending') === activeStatus);
  return base.slice().reverse();  // Newest first
}, [donors, activeStatus]);

// PAGINATION LOGIC
const totalRows = filtered.length;
const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
const currentPage = Math.min(page, totalPages);  // Clamp to valid range

const paged = useMemo(() => {
  const start = (currentPage - 1) * PAGE_SIZE;
  return filtered.slice(start, start + PAGE_SIZE);  // Extract page slice
}, [filtered, currentPage, PAGE_SIZE]);
```

**Explanation:**
- **Filtering**:
  - If `activeStatus='all'`: use all donors
  - Else: filter by status (`d.status || 'pending'` handles missing)
  - `.slice().reverse()`: Create copy & reverse (newest first)
- **Pagination**:
  - `PAGE_SIZE = 10`: Rows per page
  - `totalPages = ceil(totalRows / PAGE_SIZE)`: Calculate max pages
  - `currentPage = min(page, totalPages)`: Clamp page to valid range
  - `start = (currentPage - 1) * PAGE_SIZE`: Calculate starting index
  - `.slice(start, start + PAGE_SIZE)`: Extract rows for current page

---

## Status Update: AdminPanelPage.jsx (Admin Actions)

```jsx
// In table row:
<button
  onClick={() => updateDonorStatus(d.id, 'accepted')}
  disabled={(d.status || 'pending') === 'accepted'}
  className="px-3 py-2 rounded-xl font-bold text-sm bg-green-100 text-green-800..."
>
  Accept
</button>
```

**Flow:**
1. Admin clicks "Accept" button
2. `onClick` calls `updateDonorStatus(id, 'accepted')`
3. This function is from `useDonors` hook → DonorsContext
4. Updates donor.status in context
5. Context saves to localStorage
6. Context recalculates stats
7. useMemo dependencies trigger:
   - Filtered data recalculates
   - Paged data recalculates
   - Table re-renders
   - Row status changes to green "Accepted"
   - Metrics update
8. Admin sees instant feedback

---

## Export Feature: AdminPanelPage.jsx (Excel Export)

```jsx
const downloadExcel = () => {
  // Step 1: Convert JSON to Excel sheet
  const ws = XLSX.utils.json_to_sheet(exportRows);
  
  // Step 2: Create workbook and add sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Donors');
  
  // Step 3: Write to array buffer
  const data = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Step 4: Create blob
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  // Step 5: Download
  downloadBlob(blob, `donors_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const downloadBlob = (blob, filename) => {
  // Create URL for blob
  const url = URL.createObjectURL(blob);
  
  // Create temporary <a> element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // Append to body, click, remove
  document.body.appendChild(a);
  a.click();
  a.remove();
  
  // Cleanup after delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
```

**Explanation:**
- XLSX library workflow:
  1. `json_to_sheet()`: Convert JSON array to worksheet
  2. `book_new()`: Create empty workbook
  3. `book_append_sheet()`: Add worksheet to workbook
  4. `write()`: Generate binary data
- Blob creation: MIME type tells browser it's Excel file
- Download trick:
  - `createObjectURL()`: Create URL for blob
  - Create hidden `<a>` element with download attribute
  - Click it programmatically
  - Browser downloads as file
  - Cleanup: revoke URL after 1s

---

## Blood Drop Visualization: BloodDropVisualization.jsx (Core Logic)

```jsx
const accepted = useMemo(() => 
  donors.filter((d) => (d.status || 'pending') === 'accepted'), 
  [donors]
);

const GOAL = Number(import.meta.env.VITE_BLOOD_DROP_GOAL || 100);
const acceptedCount = accepted.length;
const fillPercent = Math.min(100, Math.round((acceptedCount / Math.max(1, GOAL)) * 100));

const dots = useMemo(() => {
  const count = accepted.length;
  if (count === 0) return [];
  
  const max = Math.min(count, 220);  // Cap for performance
  const arr = [];
  
  for (let i = 0; i < max; i++) {
    const donor = accepted[i] || accepted[accepted.length - 1];
    
    // Calculate spiral position
    const angle = (i / max) * Math.PI * 2;  // 0 to 2π
    const radius = 0.12 + (i / max) * 0.36;  // 0.12 to 0.48
    
    // Convert to x, y coordinates (percent)
    const x = 50 + Math.cos(angle) * radius * 100 * 0.8;
    const y = 54 + Math.sin(angle) * radius * 100;
    
    // Extract initials
    const initials = (donor?.fullName || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';
    
    arr.push({ id: donor?.id ?? i, x, y, initials });
  }
  return arr;
}, [accepted]);
```

**Explanation:**
- **Accepted filter**: Only count donors with status='accepted'
- **Fill calculation**:
  - `acceptedCount / GOAL`: Ratio (0 to 1 if at goal)
  - `× 100`: Convert to percentage
  - `Math.round()`: Round to nearest percent
  - `Math.min(100, ...)`: Cap at 100%
  - `Math.max(1, GOAL)`: Avoid division by zero
- **Dots spiral**:
  - `angle = (i / max) * 2π`: Distribute around circle
  - `radius = 0.12 + (i / max) * 0.36`: Grow from center outward
  - `Math.cos(angle) * radius`: X coordinate calculation
  - `Math.sin(angle) * radius`: Y coordinate calculation
  - Multiply by 100 to convert to percentage for SVG positioning
- **Initials extraction**:
  - `.split(' ')`: Break name into words
  - `.filter(Boolean)`: Remove empty strings
  - `.slice(0, 2)`: Take first 2 words
  - `.map(p => p[0]?.toUpperCase())`: Get first letter of each
  - `.join('')`: Combine into 2-letter code

---

## Performance Optimization: useMemo Patterns

```jsx
// PATTERN 1: Memoize computed data
const stats = useMemo(() => calculateStats(donors), [donors]);

// PATTERN 2: Memoize filtered data
const filtered = useMemo(() => {
  const base = activeStatus === 'all' ? donors : donors.filter(...);
  return base.slice().reverse();
}, [donors, activeStatus]);

// PATTERN 3: Memoize complex calculations
const dots = useMemo(() => {
  // Expensive spiral calculations
  const arr = [];
  for (let i = 0; i < max; i++) {
    // ... complex math ...
    arr.push(...);
  }
  return arr;
}, [accepted]);

// PATTERN 4: Memoize context value
const value = useMemo(
  () => ({ donors, stats, addDonor, updateDonorStatus }),
  [donors, stats]
);
```

**Why useMemo?**
- **calculateStats()**: Expensive calculation (many filter/reduce calls)
  - Memoize so only runs when donors array changes
  - Prevents recalc on unrelated re-renders
- **filtered data**: Same donor array many times
  - Memoize so table doesn't re-render unnecessarily
- **dots array**: Complex spiral calculations (for-loop with trig)
  - Memoize so animation smooth (not recalc every render)
- **context value**: Without memoization, new object every render
  - Would cause all children to re-render unnecessarily
  - Memoizing prevents this cascade

---

## Key React Patterns Used

### 1. Context + Custom Hook Pattern
```jsx
// In Context file
export function MyProvider({ children }) {
  const [state, setState] = useState(...);
  const value = useMemo(() => ({ state, ... }), [...]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('Must be within provider');
  return ctx;
}

// In component
const { state, ... } = useMyContext();
```

### 2. Controlled Form Pattern
```jsx
// State
const [formData, setFormData] = useState({ field: '' });

// Input
<input value={formData.field} onChange={handleChange} />

// Handler
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

### 3. Protected Route Pattern
```jsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
}

// Usage
<Route element={<ProtectedRoute />}>
  <Route path="/admin" element={<AdminPanel />} />
</Route>
```

### 4. Lazy Initialization Pattern
```jsx
const [state, setState] = useState(() => {
  // This function runs only once on mount
  // Useful for expensive computations or localStorage access
  return expensiveCalculation();
});
```

### 5. Memoization Pattern
```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(dependency);
}, [dependency]);  // Only recompute when dependency changes
```

---

## Common JavaScript Techniques

### Array Methods Used
```javascript
// filter: Get subset
donors.filter(d => d.status === 'accepted')

// map: Transform elements
donors.map(d => ({ ...d, status: 'rejected' }))

// reduce: Aggregate into single value
donors.reduce((acc, d) => acc + d.count, 0)

// slice: Extract subset (non-destructive)
donors.slice(0, 10)

// find: Get first match
donors.find(d => d.id === targetId)

// some: Check if any match
donors.some(d => d.status === 'accepted')
```

### String Methods
```javascript
// Regex for validation
/^\d{10}$/.test('9876543210')  // true

// Replace non-digits
'98-765-4321'.replace(/\D/g, '')  // '9876543210'

// Split and join
'John Doe'.split(' ').join('-')  // 'John-Doe'

// Template literals
`donors_${scope}_${date}.xlsx`
```

### Date Handling
```javascript
// Current timestamp (milliseconds)
Date.now()  // 1709856000000

// ISO string
new Date().toISOString()  // '2026-03-22T10:30:00.000Z'

// Format date
new Date(d.registeredAt).toLocaleString()  // '3/22/2026, 10:30:00 AM'

// Date slice for YYYY-MM-DD
new Date().toISOString().slice(0, 10)  // '2026-03-22'
```

---

## Error Handling Patterns

### Try-Catch for Data Operations
```jsx
try {
  const data = JSON.parse(localStorage.getItem('key'));
  return data;
} catch (e) {
  console.error('Error loading data:', e);
  return null;  // Fallback
}
```

### Optional Chaining & Nullish Coalescing
```jsx
// Optional chaining: safely access nested properties
d?.status  // undefined if d is null/undefined

// Nullish coalescing: default value
d?.status || 'pending'  // Use second value if first is falsy
d?.status ?? 'pending'  // Use second value if first is null/undefined

// Difference: || treats 0, '', false as falsy
// ?? only treats null/undefined as falsy
```

### Hook Error Boundaries
```jsx
export function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return ctx;
}
```

---

## Performance Considerations

### 1. Avoid Unnecessary Re-renders
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Memoize context value to prevent cascade re-renders

### 2. Efficient Array Operations
```jsx
// Bad: Creates new array
const newDonors = donors.filter(...).map(...).slice(...);

// Good: Chain operations, create once
const result = donors
  .filter(d => ...)
  .map(d => ...)
  .slice(0, 10);
```

### 3. Pagination Prevents Rendering All Items
```jsx
// Instead of rendering 1000 items
const all = donors;  // 1000 items

// Only render 10
const paged = donors.slice((page - 1) * 10, page * 10);
```

### 4. Capping Data Sets
```jsx
// Cap blood drop dots to 220 for performance
const max = Math.min(count, 220);
for (let i = 0; i < max; i++) { ... }
```

---

## LocalStorage API

### Basic Operations
```javascript
// Set
localStorage.setItem('key', JSON.stringify(value))

// Get
const value = JSON.parse(localStorage.getItem('key') || 'null')

// Remove
localStorage.removeItem('key')

// Clear all
localStorage.clear()
```

### Limitations
- ~5-10MB per domain (browser-dependent)
- String values only (must JSON stringify)
- No cross-domain access
- Persists across sessions

### Best Practices
```javascript
// Always wrap in try-catch (quota errors)
try {
  localStorage.setItem(key, JSON.stringify(data));
} catch (e) {
  console.error('Storage quota exceeded', e);
}

// Validate on read
try {
  const data = JSON.parse(localStorage.getItem(key) || 'null');
  return Array.isArray(data) ? data : [];
} catch (e) {
  console.error('Invalid stored data', e);
  return [];
}
```

---

## Tailwind CSS Utilities Used

```css
/* Spacing */
p-6              /* padding: 1.5rem */
px-4 py-3        /* padding-x: 1rem, padding-y: 0.75rem */
gap-6            /* gap: 1.5rem (grid/flex) */
mb-4             /* margin-bottom: 1rem */

/* Sizing */
w-full           /* width: 100% */
h-10             /* height: 2.5rem */

/* Display & Layout */
flex             /* display: flex */
flex-col         /* flex-direction: column */
grid             /* display: grid */
md:grid-cols-6   /* @media (min-width: 768px): grid-template-columns */

/* Colors */
bg-white         /* background-color: white */
text-gray-900    /* color: #111827 */
border-red-500   /* border-color: #ef4444 */

/* Effects */
shadow-lg        /* box-shadow: large */
rounded-xl       /* border-radius: 0.75rem */
hover:bg-gray-50 /* :hover background */
transition-all   /* transition: all 150ms */

/* Responsive */
md:flex-row      /* @media (min-width: 768px) */
lg:grid-cols-4   /* @media (min-width: 1024px) */

/* States */
disabled:opacity-50      /* :disabled */
focus:border-red-500     /* :focus */
group-hover:text-blue-600 /* :hover parent */
```

---

**End of Code Explanations Document**
