# CLINIQ-AI+ 🏥
### AI Clinical Workflow Copilot for Small Clinics

> Hackathon 2026 · Built with Next.js 14 + Supabase + OpenAI GPT-4o

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/cliniq-ai-plus
cd cliniq-ai-plus
npm install
```

### 2. Environment Variables
Copy `.env.local` and fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → run `supabase/schema.sql`
3. Create storage buckets: `lab-reports`, `prescriptions`, `avatars`
4. Create demo users in Authentication → Users:
   - `doctor@cliniq.demo` / `Demo@1234` → metadata: `{"role":"doctor","full_name":"Dr. Sanjay Kumar"}`
   - `admin@cliniq.demo` / `Demo@1234` → metadata: `{"role":"admin","full_name":"Priya Admin"}`
   - `reception@cliniq.demo` / `Demo@1234` → metadata: `{"role":"receptionist","full_name":"Meena Reception"}`
   - `patient@cliniq.demo` / `Demo@1234` → metadata: `{"role":"patient","full_name":"Ramesh Sharma"}`
5. Run `supabase/seed.sql` to add demo patients

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add all env variables in Vercel → Settings → Environment Variables
4. Deploy!

---

## Features

| Feature | Status |
|---|---|
| Role-based auth (Doctor/Admin/Receptionist/Patient) | ✅ |
| Voice-to-text using Web Speech API | ✅ |
| AI symptom extraction (GPT-4o) | ✅ |
| AI diagnosis suggestion with probability | ✅ |
| AI medicine suggestion | ✅ |
| Drug interaction checker | ✅ |
| Patient registration (receptionist only) | ✅ |
| Patient portal login (clinic-managed) | ✅ |
| Appointment booking | ✅ |
| Prescription generator | ✅ |
| WhatsApp prescription sharing | ✅ |
| Admin analytics dashboard | ✅ |
| AI alerts panel | ✅ |
| Real-time patient queue | ✅ |

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth with role metadata
- **AI**: OpenAI GPT-4o-mini
- **Voice**: Web Speech API (browser-native)
- **Charts**: Recharts
- **Deployment**: Vercel

---

## Demo Accounts
| Role | Email | Password |
|---|---|---|
| Doctor | doctor@cliniq.demo | Demo@1234 |
| Admin | admin@cliniq.demo | Demo@1234 |
| Receptionist | reception@cliniq.demo | Demo@1234 |
| Patient | patient@cliniq.demo | Demo@1234 |
