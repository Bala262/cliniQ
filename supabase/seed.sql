-- ============================================================
-- CLINIQ-AI+ v2.0 — Demo Seed Data
-- Run AFTER schema.sql
-- NOTE: Create Auth users manually in Supabase Dashboard first,
--       then update the UUIDs below, OR use the app's login flow
-- ============================================================

-- Demo Staff Profiles
-- You must first create these users in Supabase Auth Dashboard
-- Auth → Users → "Add user" with the emails below, then run this

-- EXAMPLE: Replace UUIDs with actual auth user IDs after creation
-- insert into profiles (id, full_name, role, phone, specialization, department) values
--   ('UUID_HERE', 'Dr. Rajesh Kumar', 'doctor', '98765-43210', 'General Medicine', 'OPD'),
--   ('UUID_HERE', 'Dr. Priya Sharma', 'doctor', '87654-32109', 'Endocrinology', 'OPD'),
--   ('UUID_HERE', 'Dr. Ahmed Khan', 'visiting_doctor', '76543-21098', 'Orthopedics', 'OPD'),
--   ('UUID_HERE', 'Nurse Lakshmi', 'nurse', '65432-10987', null, 'Ward'),
--   ('UUID_HERE', 'Lab Tech Arjun', 'lab', '54321-09876', null, 'Laboratory'),
--   ('UUID_HERE', 'Pharmacist Meena', 'pharmacy', '43210-98765', null, 'Pharmacy'),
--   ('UUID_HERE', 'Billing Staff Raj', 'billing', '32109-87654', null, 'Billing'),
--   ('UUID_HERE', 'Reception Kavitha', 'receptionist', '21098-76543', null, 'Reception'),
--   ('UUID_HERE', 'Admin Suresh', 'admin', '10987-65432', null, 'Administration');

-- Demo Patients
insert into patients (patient_code, full_name, age, gender, phone, address, blood_group, allergies, chronic_conditions, risk_level) values
  ('PT00001', 'Ravi Kumar', 35, 'male', '98765-11111', '12 MG Road, Bangalore', 'B+', '{}', '{}', 'low'),
  ('PT00002', 'Meena Lakshmi', 28, 'female', '87654-22222', '45 Brigade Road, Bangalore', 'O+', '{"Penicillin"}', '{}', 'low'),
  ('PT00003', 'Suresh Iyer', 45, 'male', '76543-33333', '78 Indiranagar, Bangalore', 'A+', '{}', '{"Type 2 Diabetes","Hypertension"}', 'medium'),
  ('PT00004', 'Kavitha Nair', 32, 'female', '65432-44444', '23 Koramangala, Bangalore', 'AB+', '{}', '{"Hypothyroidism"}', 'low'),
  ('PT00005', 'Ahmed Khan', 52, 'male', '54321-55555', '56 Whitefield, Bangalore', 'O-', '{"Aspirin"}', '{"Hypertension"}', 'medium'),
  ('PT00006', 'Priya Devi', 24, 'female', '43210-66666', '89 JP Nagar, Bangalore', 'B-', '{}', '{}', 'low'),
  ('PT00007', 'Raj Kumar', 50, 'male', '32109-77777', '34 Malleswaram, Bangalore', 'A-', '{}', '{"Hypertension","CKD Stage 2"}', 'high'),
  ('PT00008', 'Sita Devi', 65, 'female', '21098-88888', '67 Vijayanagar, Bangalore', 'AB-', '{}', '{"COPD","Hypertension"}', 'high'),
  ('PT00009', 'Rajan Mehta', 58, 'male', '10987-99999', '90 RT Nagar, Bangalore', 'B+', '{"Sulfa"}', '{"Diabetes","CAD"}', 'high'),
  ('PT00010', 'Lalitha Rani', 38, 'female', '09876-00000', '12 Hebbal, Bangalore', 'O+', '{}', '{"Rheumatoid Arthritis"}', 'medium')
on conflict (patient_code) do nothing;

-- Demo Pharmacy Inventory
insert into pharmacy_inventory (medicine_name, generic_name, category, stock_quantity, unit, expiry_date, supplier, unit_price, reorder_level) values
  ('Paracetamol 500mg', 'Acetaminophen', 'Analgesic', 350, 'Tablets', '2026-12-31', 'Sun Pharma', 2.50, 100),
  ('Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', 12, 'Capsules', '2026-03-31', 'Cipla', 8.00, 50),
  ('Metformin 500mg', 'Metformin HCl', 'Antidiabetic', 25, 'Tablets', '2027-06-30', 'Dr. Reddy''s', 3.50, 100),
  ('Azithromycin 500mg', 'Azithromycin', 'Antibiotic', 80, 'Tablets', '2026-08-31', 'Abbott', 35.00, 30),
  ('Aspirin 75mg', 'Acetylsalicylic acid', 'Antiplatelet', 8, 'Tablets', '2026-06-30', 'Bayer', 1.50, 100),
  ('Omeprazole 20mg', 'Omeprazole', 'PPI', 200, 'Capsules', '2026-10-31', 'Zydus', 5.00, 60),
  ('Cetirizine 10mg', 'Cetirizine HCl', 'Antihistamine', 150, 'Tablets', '2026-11-30', 'UCB Pharma', 4.00, 50),
  ('ORS Sachet', 'Oral Rehydration Salts', 'Electrolyte', 60, 'Sachets', '2027-05-31', 'WHO ORS', 12.00, 20),
  ('Atorvastatin 10mg', 'Atorvastatin', 'Statin', 120, 'Tablets', '2027-03-31', 'Pfizer', 12.00, 50),
  ('Amlodipine 5mg', 'Amlodipine', 'CCB', 95, 'Tablets', '2026-09-30', 'Torrent', 6.50, 50),
  ('Tramadol 50mg', 'Tramadol HCl', 'Analgesic-Opioid', 40, 'Tablets', '2026-07-31', 'Glenmark', 18.00, 30),
  ('Glipizide 5mg', 'Glipizide', 'Antidiabetic', 0, 'Tablets', '2026-04-30', 'Pfizer', 8.50, 30)
on conflict do nothing;
