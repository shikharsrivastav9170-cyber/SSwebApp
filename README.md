# SSWebStudio CRM

A Next.js PWA Sales CRM + Employee Tracking System for SSWebStudio.

## Features

### Authentication
- ✅ Google OAuth sign-in
- ✅ Email magic link authentication
- ✅ Phone OTP authentication
- ✅ Protected routes with middleware

### Employee Features
- ✅ Lead management (assign, track status, update)
- ✅ Sales recording (record sales with plans, payment mode)
- ✅ Monthly target tracking with achievement %
- ✅ Incentive calculation (auto-calculate based on target achievement)
- ✅ Personal performance dashboard

### Admin Features
- ✅ Employee management (add, edit, assign roles)
- ✅ Plan management (create, delete pricing tiers)
- ✅ Set monthly targets for employees
- ✅ Analytics dashboard (total sales, revenue, employee performance)
- ✅ Top & low performer reports
- ✅ Employee performance table

### Dashboard
- ✅ Home page with login
- ✅ Employee dashboard with sidebar
- ✅ Admin dashboard with analytics
- ✅ Responsive mobile-first UI

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase project (for auth & database)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the Supabase schema SQL in your Supabase project:
   - Open your Supabase dashboard → SQL editor
   - Copy contents of `supabase-schema.sql`
   - Run the SQL to create tables and policies

4. Start development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` and log in

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── login/page.tsx           # Login page
│   ├── auth/callback/page.tsx  # OAuth callback
│   ├── dashboard/
│   │   ├── layout.tsx          # Employee dashboard layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── leads/page.tsx      # Lead management
│   │   ├── sales/page.tsx      # Sales recording
│   │   └── targets/page.tsx    # Target tracking
│   └── admin/
│       ├── layout.tsx          # Admin panel layout
│       ├── page.tsx            # Admin analytics
│       ├── employees/page.tsx  # Employee management
│       ├── plans/page.tsx      # Plan management
│       └── targets/page.tsx    # Target setting
├── components/
│   ├── Header.tsx              # App header
│   ├── Sidebar.tsx             # Dashboard sidebar
│   └── ClientLayout.tsx        # Toast provider
├── lib/
│   ├── supabaseClient.ts       # Supabase client init
│   ├── useAuth.ts             # Auth hook
│   └── authService.ts         # Auth functions
├── styles/
│   └── globals.css            # Global styles
└── middleware.ts              # Route protection
```

## Database Schema

Core tables created in Supabase:
- `users` - Employees and admins
- `leads` - Lead information and status
- `sales` - Sales records with revenue
- `plans` - Pricing plans
- `targets` - Monthly targets per employee
- `incentives` - Incentive rules
- `activity_logs` - Action tracking

## Deployment

### GitHub
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Full CRM implementation"
   git push origin main
   ```

### Vercel
1. Import repository on vercel.com
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy (automatic on every push to main)

## Tech Stack
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth, Email OTP, Phone OTP)
- **Hosting:** Vercel
- **UI:** Lucide React icons, React Hot Toast

## Next Steps

- [x] Project scaffold with Next.js & Tailwind
- [x] Supabase schema with RLS policies
- [x] Authentication (Google, Email, Phone)
- [x] Employee dashboard (leads, sales, targets)
- [x] Admin dashboard (analytics, employee management)
- [x] CI/CD with GitHub Actions
- [ ] WhatsApp webhook integration
- [ ] Excel/PDF report exports
- [ ] Email notifications
- [ ] SMS notifications

---

Refer to the one-page prompt for full feature requirements and business logic details.
## Deployment to Vercel

1. Sign in to [Vercel](https://vercel.com) and import the GitHub repo.
2. Configure project settings, supply environment variables from Supabase.
3. The build command will be `npm run build` and the output directory is `.next`.

---

Refer back to the initial one-page prompt for full feature requirements and database schema guidelines.