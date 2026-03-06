-- CLINIQ-AI+ Demo Seed Data
-- Run AFTER schema.sql
-- NOTE: Create the 4 auth users manually in Supabase Auth dashboard first,
-- then update the UUIDs below to match.

-- =====================
-- STEP 1: Create users in Supabase Auth Dashboard:
-- doctor@cliniq.demo  / Demo@1234  / metadata: {role:"doctor", full_name:"Dr. Sanjay Kumar"}
-- admin@cliniq.demo   / Demo@1234  / metadata: {role:"admin",  full_name:"Priya Admin"}
-- reception@cliniq.demo / Demo@1234 / metadata: {role:"receptionist", full_name:"Meena Reception"}
-- patient@cliniq.demo / Demo@1234  / metadata: {role:"patient", full_name:"Ramesh Sharma"}
-- =====================

-- Update profiles with specialization
UPDATE public.profiles
SET specialization = 'General Medicine', license_number = 'MCI-12345'
WHERE role = 'doctor';

-- =====================
-- Demo Patients
-- =====================
INSERT INTO public.patients (patient_code, full_name, age, gender, phone, address, blood_group, allergies, chronic_conditions, risk_level)
VALUES
  ('CLQ-0001', 'Anil Patel', 45, 'male', '9876541001', 'Andheri West, Mumbai', 'B+', ARRAY['Penicillin'], ARRAY['Hypertension'], 'medium'),
  ('CLQ-0002', 'Meera Reddy', 30, 'female', '9876541002', 'Koramangala, Bangalore', 'A+', ARRAY[]::text[], ARRAY[]::text[], 'low'),
  ('CLQ-0003', 'Ravi Shah', 60, 'male', '9876541003', 'Navrangpura, Ahmedabad', 'O+', ARRAY['Aspirin'], ARRAY['Diabetes Type 2', 'Hypertension'], 'high'),
  ('CLQ-0004', 'Sita Devi', 50, 'female', '9876541004', 'Anna Nagar, Chennai', 'AB-', ARRAY[]::text[], ARRAY['Thyroid'], 'medium'),
  ('CLQ-0005', 'Rahul Verma', 28, 'male', '9876541005', 'Lajpat Nagar, Delhi', 'B-', ARRAY[]::text[], ARRAY[]::text[], 'low'),
  ('CLQ-0006', 'Kavitha Nair', 35, 'female', '9876541006', 'Ernakulam, Kochi', 'A-', ARRAY['Sulfa drugs'], ARRAY[]::text[], 'low'),
  ('CLQ-0007', 'Suresh Babu', 68, 'male', '9876541007', 'Mylapore, Chennai', 'O-', ARRAY[]::text[], ARRAY['Cardiac Arrhythmia', 'Diabetes Type 2'], 'high'),
  ('CLQ-0008', 'Priya Iyer', 40, 'female', '9876541008', 'T Nagar, Chennai', 'B+', ARRAY[]::text[], ARRAY[]::text[], 'low');

-- =====================
-- Today's Appointments (requires doctor profile UUID)
-- Replace 'DOCTOR_UUID' with the actual UUID from profiles table
-- =====================
-- DO $$
-- DECLARE
--   doc_id UUID;
--   p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID;
-- BEGIN
--   SELECT id INTO doc_id FROM profiles WHERE role = 'doctor' LIMIT 1;
--   SELECT id INTO p1 FROM patients WHERE patient_code = 'CLQ-0001';
--   SELECT id INTO p2 FROM patients WHERE patient_code = 'CLQ-0002';
--   SELECT id INTO p3 FROM patients WHERE patient_code = 'CLQ-0003';
--   SELECT id INTO p4 FROM patients WHERE patient_code = 'CLQ-0004';
--   SELECT id INTO p5 FROM patients WHERE patient_code = 'CLQ-0005';
--
--   INSERT INTO appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
--   VALUES
--     (p1, doc_id, CURRENT_DATE::text, '09:00', 'general', 'waiting', 101),
--     (p2, doc_id, CURRENT_DATE::text, '09:30', 'emergency', 'waiting', 102),
--     (p3, doc_id, CURRENT_DATE::text, '10:00', 'follow-up', 'completed', 103),
--     (p4, doc_id, CURRENT_DATE::text, '10:30', 'general', 'scheduled', 104),
--     (p5, doc_id, CURRENT_DATE::text, '11:00', 'general', 'scheduled', 105);
-- END $$;

-- =====================
-- AI Alerts (requires patient UUIDs)
-- =====================
-- INSERT INTO ai_alerts (patient_id, alert_type, message, severity)
-- SELECT id, 'high_risk', 'High diabetes risk detected — HbA1c elevated', 'high'
-- FROM patients WHERE patient_code = 'CLQ-0003';
--
-- INSERT INTO ai_alerts (patient_id, alert_type, message, severity)
-- SELECT id, 'drug_interaction', 'Possible interaction: Metformin + Ibuprofen', 'medium'
-- FROM patients WHERE patient_code = 'CLQ-0001';
--
-- INSERT INTO ai_alerts (patient_id, alert_type, message, severity)
-- SELECT id, 'emergency', 'Cardiac risk flag: irregular pulse reported', 'critical'
-- FROM patients WHERE patient_code = 'CLQ-0007';
--
-- INSERT INTO ai_alerts (patient_id, alert_type, message, severity)
-- SELECT id, 'overdue_followup', 'Follow-up overdue by 2 weeks', 'medium'
-- FROM patients WHERE patient_code = 'CLQ-0004';
