# Blood Donation App (LifeFlow)

## Run locally

```bash
npm install
npm run dev
```

## URLs

- **Home / Registration**: `/`
- **Public dashboard (read-only)**: `/dashboard`
- **Admin login**: `/admin-login`
- **Admin panel (protected)**: `/admin`

## Admin credentials

Default credentials (hardcoded fallback):

- **Username**: `Admin@1`
- **Password**: `Sukoon@2026`

Recommended: set these via environment variables:

1. Copy `env.example` → `.env.local`
2. Edit values:
   - `VITE_ADMIN_USERNAME`
   - `VITE_ADMIN_PASSWORD`

## Admin exports (expert)

In `/admin` you can export donor data as:

- **Excel (.xlsx)**: real spreadsheet download
- **CSV (.csv)**: clean sheet-compatible download
- **PDF**: a print-ready report opens; use browser dialog → **Save as PDF**

