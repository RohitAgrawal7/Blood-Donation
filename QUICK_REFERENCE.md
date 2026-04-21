# Admin Panel Quick Reference Card

## 🚀 Quick Start (30 seconds)

```bash
npm run dev
# Visit http://blood-donation-production-4948.up.railway.app:5173
# Click Admin → Login with Admin@1 / Sukoon@2026
```

---

## 📊 The 10 Metrics at a Glance

### Primary Metrics (Top Row - 6 Cards)
```
[Total Registrations] [Male Reg.] [Female Reg.] [Pending] [Accepted] [Rejected]
```

### Gender Analytics (Second Row - 4 Cards)
```
[Accepted Males] [Accepted Females] [M:F Ratio] [Acceptance %]
```

---

## 🎛️ Control Panel

### **Status Tabs** (Filter by)
```
[All Requests] [Pending] [Accepted] [Rejected]
```

### **Export Controls**
```
Scope:  [Current Tab] [All Donors]

Formats: [Excel] [CSV] [PDF]
```

---

## 📋 Donor Table Columns
```
Name | Blood Type | Gender | City | Phone | Registered | Status | Actions
```

### **Actions Per Donor**
```
[⏱ Pending]  [✓ Accept]  [✕ Reject]
```

---

## 🔐 Security

| Task | How To |
|------|--------|
| **Login** | Go to `/admin-login`, enter credentials |
| **Logout** | Click "Logout" button (top-right) |
| **Change Password** | Edit `.env.local`, set `VITE_ADMIN_PASSWORD` |
| **Session** | Cleared on page reload (intentional, for security) |

**Default Credentials**: Admin@1 / Sukoon@2026

---

## 📈 Data Interpretation

### **Male/Female Ratio = 1.25**
→ 25% more males than females registered

### **Acceptance Rate = 83%**
→ 83 out of every 100 donors approved

### **Accepted Males: 55 (88.7%)**
→ 88.7% of male registrations were approved

---

## 💾 Exporting Data

### **What Gets Exported?**
All fields: ID, Name, Email, Phone, Age, **Gender**, Blood Type, City, Address, Status, RegisteredAt

### **Choose Format**
- **Excel** → Open in Excel/Sheets, professional format
- **CSV** → Plain text, import anywhere
- **PDF** → Print-ready, archival

### **Choose Scope**
- **Current Tab** → Only filtered donors (e.g., only "Accepted")
- **All Donors** → Entire database

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check `.env.local` credentials match your input |
| Metrics don't update | Refresh page (F5) |
| Export is empty | Ensure donors are registered; try "All Donors" scope |
| Logout then immediate page access | Expected - session cleared for security, re-login |

---

## ⌨️ Keyboard Shortcuts

| Action | Method |
|--------|--------|
| **Refresh page** | F5 or Cmd+R |
| **Open browser console** | F12 or Cmd+Option+I |
| **Print/Export as PDF** | Press PDF button (triggers browser print dialog) |

---

## 📱 Mobile / Tablet

✅ **Responsive Design**
- Metrics stack vertically on mobile (1 col → 6 cols on desktop)
- Table scrolls horizontally on small screens
- All buttons remain accessible
- Touch-friendly button sizes

---

## 🎨 Color Meanings

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Total count, primary metric |
| 🩵 Cyan | Male-specific data |
| 💗 Pink | Female-specific data |
| 💚 Green | Accepted, approved, positive |
| 🟡 Amber | Pending, needs action |
| ❤️ Red | Rejected, declined |

---

## 📊 Analytics Formula

```
Total = All registered donors
Male % = (Male count / Total) × 100
Acceptance Rate = (Accepted / Total) × 100
M:F Ratio = Male count ÷ Female count
Male Approval % = (Accepted Males / Total Males) × 100
```

---

## ✅ Pre-Launch Checklist

- [ ] Admin login works
- [ ] Can view all 10 metrics
- [ ] Status filter tabs work (click each)
- [ ] Can approve/reject donors
- [ ] Metrics update on action
- [ ] Can export Excel/CSV/PDF
- [ ] Logout button works
- [ ] Reload redirects to login
- [ ] Mobile view looks good
- [ ] No console errors (F12)

---

## 📞 Emergency Contact

**Issue**: Admin panel broken  
**Solution**: 
1. Clear browser cache (Cmd+Shift+Delete)
2. Hard refresh (Cmd+Shift+R)
3. Check console errors (F12)
4. Restart dev server (npm run dev)
5. Check `.env.local` exists

---

## 💡 Pro Tips

✨ **Tip 1**: Export data daily as backup  
✨ **Tip 2**: Use "Current Tab" scope for filtered exports  
✨ **Tip 3**: Monitor gender disparity via metrics cards  
✨ **Tip 4**: Use PDF format for stakeholder reports  
✨ **Tip 5**: Gender data only shows if donors provided it during registration  

---

**Remember**: After page reload, you'll be logged out (for security). Simply log back in!

---

*Professional Blood Donation Admin Panel*  
*Version 1.0 | Ready for Production* ✅
