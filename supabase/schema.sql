-- CLINIQ-AI+ Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor','admin','receptionist','patient')),
  phone TEXT,
  specialization TEXT,
  license_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Patients
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INT,
  gender TEXT CHECK (gender IN ('male','female','other')),
  phone TEXT UNIQUE NOT NULL,
  address TEXT,
  blood_group TEXT,
  allergies TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  emergency_contact TEXT,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low','medium','high')),
  profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  consultation_type TEXT DEFAULT 'general' CHECK (consultation_type IN ('general','follow-up','emergency')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','waiting','in-consultation','completed','cancelled')),
  token_number INT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Consultations
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id),
  appointment_id UUID REFERENCES public.appointments(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  voice_transcript TEXT,
  extracted_symptoms JSONB DEFAULT '[]',
  diagnosis_suggestions JSONB DEFAULT '[]',
  final_diagnosis TEXT,
  ai_explanation TEXT,
  recommended_tests TEXT[] DEFAULT '{}',
  doctor_notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Prescriptions
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES public.consultations(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id),
  medicines JSONB NOT NULL DEFAULT '[]',
  interaction_warnings JSONB DEFAULT '[]',
  allergy_alerts TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Lab Reports
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  extracted_values JSONB DEFAULT '[]',
  ai_summary TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Vitals
CREATE TABLE IF NOT EXISTS public.vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  recorded_by UUID REFERENCES public.profiles(id),
  bp_systolic INT,
  bp_diastolic INT,
  heart_rate INT,
  temperature DECIMAL(4,1),
  oxygen_saturation INT,
  weight DECIMAL(5,2),
  bmi DECIMAL(4,1),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Billing
CREATE TABLE IF NOT EXISTS public.billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id),
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  lab_charges DECIMAL(10,2) DEFAULT 0,
  medicine_charges DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  payment_mode TEXT CHECK (payment_mode IN ('cash','upi','card')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','partial')),
  invoice_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI Alerts
CREATE TABLE IF NOT EXISTS public.ai_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('drug_interaction','high_risk','abnormal_lab','overdue_followup','emergency')),
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: each user can read all, write own
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write_own" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Patients: staff can read/write all; patient can read own
CREATE POLICY "patients_staff_all" ON public.patients FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );
CREATE POLICY "patients_read_own" ON public.patients FOR SELECT
  USING (profile_id = auth.uid());

-- Appointments: staff full access; patient reads own
CREATE POLICY "appointments_staff_all" ON public.appointments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );
CREATE POLICY "appointments_patient_read" ON public.appointments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- Consultations: doctor + admin full; patient reads own
CREATE POLICY "consultations_staff_all" ON public.consultations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin'))
  );
CREATE POLICY "consultations_patient_read" ON public.consultations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- Prescriptions: doctor/admin write; receptionist read; patient reads own
CREATE POLICY "prescriptions_doctor_all" ON public.prescriptions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );
CREATE POLICY "prescriptions_patient_read" ON public.prescriptions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- Lab Reports: staff full; patient reads own
CREATE POLICY "lab_reports_staff_all" ON public.lab_reports FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );
CREATE POLICY "lab_reports_patient_read" ON public.lab_reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- Vitals: staff full access
CREATE POLICY "vitals_staff_all" ON public.vitals FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );

-- Billing: receptionist + admin full; patient reads own
CREATE POLICY "billing_staff_all" ON public.billing FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','receptionist'))
  );
CREATE POLICY "billing_patient_read" ON public.billing FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND profile_id = auth.uid())
  );

-- AI Alerts: staff full access
CREATE POLICY "alerts_staff_all" ON public.ai_alerts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor','admin','receptionist'))
  );

-- =====================
-- Trigger: auto-create profile on signup
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- Storage Buckets (run in Supabase dashboard > Storage)
-- =====================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('lab-reports', 'lab-reports', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
