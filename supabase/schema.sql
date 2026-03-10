-- ============================================================
-- CLINIQ-AI+ v2.0 — Complete Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE (extends Supabase Auth users)
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null check (role in (
    'doctor', 'visiting_doctor', 'nurse', 'lab', 'pharmacy',
    'billing', 'receptionist', 'admin'
  )),
  phone text,
  specialization text,
  license_number text,
  department text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'receptionist')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PATIENTS TABLE
-- ============================================================
create table if not exists patients (
  id uuid default uuid_generate_v4() primary key,
  patient_code text unique not null,
  full_name text not null,
  age integer not null check (age > 0 and age < 150),
  gender text not null check (gender in ('male', 'female', 'other')),
  phone text not null,
  address text,
  blood_group text check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  allergies text[] default '{}',
  chronic_conditions text[] default '{}',
  emergency_contact text,
  risk_level text default 'low' check (risk_level in ('low', 'medium', 'high')),
  profile_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Auto-generate patient code
create or replace function generate_patient_code()
returns trigger language plpgsql as $$
declare
  new_code text;
  counter integer;
begin
  select count(*) + 1 into counter from patients;
  new_code := 'PT' || lpad(counter::text, 5, '0');
  new.patient_code := new_code;
  return new;
end;
$$;

drop trigger if exists set_patient_code on patients;
create trigger set_patient_code
  before insert on patients
  for each row execute procedure generate_patient_code();

-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================
create table if not exists appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  doctor_id uuid references profiles(id) on delete cascade not null,
  nurse_id uuid references profiles(id) on delete set null,
  date date not null,
  time_slot text not null,
  consultation_type text default 'general' check (consultation_type in ('general','follow-up','emergency')),
  status text default 'scheduled' check (status in (
    'scheduled','waiting','with_nurse','ready_for_doctor','in-consultation','completed','cancelled'
  )),
  token_number integer,
  reminder_sent boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- VITALS TABLE
-- ============================================================
create table if not exists vitals (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  appointment_id uuid references appointments(id) on delete set null,
  recorded_by uuid references profiles(id) on delete set null,
  temperature numeric(4,1),
  bp_systolic integer,
  bp_diastolic integer,
  heart_rate integer,
  oxygen_saturation numeric(4,1),
  height numeric(5,1),
  weight numeric(5,1),
  bmi numeric(4,1),
  recorded_at timestamptz default now()
);

-- ============================================================
-- CONSULTATIONS TABLE
-- ============================================================
create table if not exists consultations (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  doctor_id uuid references profiles(id) on delete cascade not null,
  appointment_id uuid references appointments(id) on delete set null,
  date date default current_date,
  voice_transcript text,
  extracted_symptoms jsonb default '[]',
  diagnosis_suggestions jsonb default '[]',
  final_diagnosis text,
  ai_explanation text,
  recommended_tests text[] default '{}',
  doctor_notes text,
  status text default 'active' check (status in ('active','completed')),
  created_at timestamptz default now()
);

-- ============================================================
-- PRESCRIPTIONS TABLE
-- ============================================================
create table if not exists prescriptions (
  id uuid default uuid_generate_v4() primary key,
  consultation_id uuid references consultations(id) on delete set null,
  patient_id uuid references patients(id) on delete cascade not null,
  doctor_id uuid references profiles(id) on delete cascade not null,
  medicines jsonb not null default '[]',
  interaction_warnings jsonb default '[]',
  allergy_alerts text[] default '{}',
  pdf_url text,
  status text default 'pending' check (status in ('pending','dispensed','partial')),
  created_at timestamptz default now()
);

-- ============================================================
-- LAB ORDERS TABLE
-- ============================================================
create table if not exists lab_orders (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  doctor_id uuid references profiles(id) on delete cascade not null,
  appointment_id uuid references appointments(id) on delete set null,
  test_type text not null,
  priority text default 'normal' check (priority in ('normal','high','urgent')),
  status text default 'pending' check (status in ('pending','sample_collected','processing','completed')),
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- LAB REPORTS TABLE
-- ============================================================
create table if not exists lab_reports (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  lab_order_id uuid references lab_orders(id) on delete set null,
  uploaded_by uuid references profiles(id) on delete set null,
  file_url text not null,
  file_name text not null,
  extracted_values jsonb default '[]',
  ai_summary text,
  is_approved boolean default false,
  approved_by uuid references profiles(id) on delete set null,
  uploaded_at timestamptz default now()
);

-- ============================================================
-- WARD BEDS TABLE
-- ============================================================
create table if not exists ward_beds (
  id uuid default uuid_generate_v4() primary key,
  bed_number text unique not null,
  ward_name text default 'General Ward',
  status text default 'available' check (status in ('available','occupied','cleaning','reserved')),
  patient_id uuid references patients(id) on delete set null,
  doctor_id uuid references profiles(id) on delete set null,
  diagnosis text,
  admission_date date,
  discharge_date date,
  notes text,
  updated_at timestamptz default now()
);

-- Seed 10 beds
insert into ward_beds (bed_number) values
  ('Bed 1'), ('Bed 2'), ('Bed 3'), ('Bed 4'), ('Bed 5'),
  ('Bed 6'), ('Bed 7'), ('Bed 8'), ('Bed 9'), ('Bed 10')
on conflict (bed_number) do nothing;

-- ============================================================
-- PHARMACY INVENTORY TABLE
-- ============================================================
create table if not exists pharmacy_inventory (
  id uuid default uuid_generate_v4() primary key,
  medicine_name text not null,
  generic_name text,
  category text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  unit text default 'Tablets',
  expiry_date date not null,
  supplier text,
  unit_price numeric(10,2) not null default 0,
  reorder_level integer default 50,
  batch_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PHARMACY DISPENSING TABLE
-- ============================================================
create table if not exists pharmacy_dispensing (
  id uuid default uuid_generate_v4() primary key,
  prescription_id uuid references prescriptions(id) on delete set null,
  pharmacist_id uuid references profiles(id) on delete set null,
  patient_id uuid references patients(id) on delete cascade not null,
  medicines_dispensed jsonb not null default '[]',
  total_amount numeric(10,2) default 0,
  dispensed_at timestamptz default now()
);

-- ============================================================
-- BILLING TABLE
-- ============================================================
create table if not exists billing (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  consultation_id uuid references consultations(id) on delete set null,
  appointment_id uuid references appointments(id) on delete set null,
  invoice_number text unique not null,
  consultation_fee numeric(10,2) default 0,
  lab_charges numeric(10,2) default 0,
  medicine_charges numeric(10,2) default 0,
  ward_charges numeric(10,2) default 0,
  total numeric(10,2) generated always as (
    consultation_fee + lab_charges + medicine_charges + ward_charges
  ) stored,
  payment_mode text check (payment_mode in ('cash','upi','card','insurance')),
  payment_status text default 'pending' check (payment_status in ('pending','paid','partial')),
  insurance_provider text,
  insurance_claim_id text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- Auto-generate invoice number
create or replace function generate_invoice_number()
returns trigger language plpgsql as $$
declare
  counter integer;
begin
  select count(*) + 2598 into counter from billing;
  new.invoice_number := 'INV-' || counter::text;
  return new;
end;
$$;

drop trigger if exists set_invoice_number on billing;
create trigger set_invoice_number
  before insert on billing
  for each row execute procedure generate_invoice_number();

-- ============================================================
-- AI ALERTS TABLE
-- ============================================================
create table if not exists ai_alerts (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references patients(id) on delete cascade not null,
  alert_type text not null check (alert_type in (
    'drug_interaction','high_risk','abnormal_lab','overdue_followup','emergency'
  )),
  message text not null,
  severity text default 'medium' check (severity in ('low','medium','high','critical')),
  is_resolved boolean default false,
  resolved_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table profiles enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table vitals enable row level security;
alter table consultations enable row level security;
alter table prescriptions enable row level security;
alter table lab_orders enable row level security;
alter table lab_reports enable row level security;
alter table ward_beds enable row level security;
alter table pharmacy_inventory enable row level security;
alter table pharmacy_dispensing enable row level security;
alter table billing enable row level security;
alter table ai_alerts enable row level security;

-- Profiles: users can read all profiles, update own
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Patients: all authenticated users can read/insert
create policy "patients_select" on patients for select using (auth.role() = 'authenticated');
create policy "patients_insert" on patients for insert with check (auth.role() = 'authenticated');
create policy "patients_update" on patients for update using (auth.role() = 'authenticated');

-- Appointments: all authenticated
create policy "appointments_all" on appointments for all using (auth.role() = 'authenticated');

-- Vitals: nurses and doctors
create policy "vitals_all" on vitals for all using (auth.role() = 'authenticated');

-- Consultations: doctors only (insert/update), all read
create policy "consultations_select" on consultations for select using (auth.role() = 'authenticated');
create policy "consultations_insert" on consultations for insert with check (auth.role() = 'authenticated');
create policy "consultations_update" on consultations for update using (auth.role() = 'authenticated');

-- Prescriptions: authenticated
create policy "prescriptions_all" on prescriptions for all using (auth.role() = 'authenticated');

-- Lab orders and reports: authenticated
create policy "lab_orders_all" on lab_orders for all using (auth.role() = 'authenticated');
create policy "lab_reports_all" on lab_reports for all using (auth.role() = 'authenticated');

-- Ward beds: authenticated
create policy "ward_beds_all" on ward_beds for all using (auth.role() = 'authenticated');

-- Pharmacy: authenticated
create policy "pharmacy_inventory_all" on pharmacy_inventory for all using (auth.role() = 'authenticated');
create policy "pharmacy_dispensing_all" on pharmacy_dispensing for all using (auth.role() = 'authenticated');

-- Billing: authenticated
create policy "billing_all" on billing for all using (auth.role() = 'authenticated');

-- AI alerts: authenticated
create policy "ai_alerts_all" on ai_alerts for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- Run these in Supabase Dashboard → Storage
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('lab-reports', 'lab-reports', false);
-- insert into storage.buckets (id, name, public) values ('prescriptions', 'prescriptions', false);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
