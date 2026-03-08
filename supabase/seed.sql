-- ============================================================
-- CLINIQ-AI+  |  Comprehensive Demo Seed  v3
-- ============================================================
-- PREREQUISITES (Supabase Dashboard → Authentication → Users → Add User):
--
--   doctor@cliniq.demo    /  Demo@1234
--     User Metadata: {"role":"doctor","full_name":"Dr. Sanjay Kumar"}
--
--   admin@cliniq.demo     /  Demo@1234
--     User Metadata: {"role":"admin","full_name":"Priya Admin"}
--
--   reception@cliniq.demo /  Demo@1234
--     User Metadata: {"role":"receptionist","full_name":"Meena Reception"}
--
--   patient@cliniq.demo   /  Demo@1234
--     User Metadata: {"role":"patient","full_name":"Ramesh Sharma"}
--
-- Run in Supabase SQL Editor AFTER schema.sql
-- Safe to re-run — fully idempotent
-- ============================================================

-- ============================================================
-- STEP 1: FIX PROFILES
-- ============================================================
UPDATE public.profiles p
SET role = 'doctor', full_name = 'Dr. Sanjay Kumar'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'doctor@cliniq.demo';

UPDATE public.profiles p
SET role = 'admin', full_name = 'Priya Admin'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'admin@cliniq.demo';

UPDATE public.profiles p
SET role = 'receptionist', full_name = 'Meena Reception'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'reception@cliniq.demo';

UPDATE public.profiles p
SET role = 'patient', full_name = 'Ramesh Sharma'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'patient@cliniq.demo';

UPDATE public.profiles
SET specialization = 'General Medicine', license_number = 'MCI-12345'
WHERE role = 'doctor';

-- ============================================================
-- STEP 2: PATIENTS
-- ============================================================
INSERT INTO public.patients (patient_code, full_name, age, gender, phone, address, blood_group, allergies, chronic_conditions, risk_level)
VALUES
  ('CLQ-0001', 'Anil Patel',    45, 'male',   '9876541001', 'Andheri West, Mumbai',      'B+',  ARRAY['Penicillin'],    ARRAY['Hypertension'],                        'medium'),
  ('CLQ-0002', 'Meera Reddy',   30, 'female', '9876541002', 'Koramangala, Bangalore',    'A+',  ARRAY[]::text[],        ARRAY[]::text[],                              'low'),
  ('CLQ-0003', 'Ravi Shah',     60, 'male',   '9876541003', 'Navrangpura, Ahmedabad',    'O+',  ARRAY['Aspirin'],       ARRAY['Diabetes Type 2','Hypertension'],       'high'),
  ('CLQ-0004', 'Sita Devi',     50, 'female', '9876541004', 'Anna Nagar, Chennai',       'AB-', ARRAY[]::text[],        ARRAY['Thyroid'],                             'medium'),
  ('CLQ-0005', 'Rahul Verma',   28, 'male',   '9876541005', 'Lajpat Nagar, Delhi',       'B-',  ARRAY[]::text[],        ARRAY[]::text[],                              'low'),
  ('CLQ-0006', 'Kavitha Nair',  35, 'female', '9876541006', 'Ernakulam, Kochi',          'A-',  ARRAY['Sulfa drugs'],   ARRAY[]::text[],                              'low'),
  ('CLQ-0007', 'Suresh Babu',   68, 'male',   '9876541007', 'Mylapore, Chennai',         'O-',  ARRAY[]::text[],        ARRAY['Cardiac Arrhythmia','Diabetes Type 2'], 'high'),
  ('CLQ-0008', 'Priya Iyer',    40, 'female', '9876541008', 'T Nagar, Chennai',          'B+',  ARRAY[]::text[],        ARRAY[]::text[],                              'low'),
  ('CLQ-0009', 'Ramesh Sharma', 35, 'male',   '9876541009', 'Connaught Place, New Delhi','O+',  ARRAY[]::text[],        ARRAY[]::text[],                              'low'),
  ('CLQ-0010', 'Deepa Menon',   42, 'female', '9876541010', 'MG Road, Pune',             'A+',  ARRAY[]::text[],        ARRAY['Asthma'],                              'medium')
ON CONFLICT (phone) DO NOTHING;

-- Link patient@cliniq.demo user to Ramesh Sharma (enables patient portal)
UPDATE public.patients
SET profile_id = (SELECT id FROM auth.users WHERE email = 'patient@cliniq.demo')
WHERE patient_code = 'CLQ-0009'
  AND (SELECT id FROM auth.users WHERE email = 'patient@cliniq.demo') IS NOT NULL;

-- ============================================================
-- STEP 3: CLEAR ALL EXISTING DEMO DATA (idempotency)
-- ============================================================
DO $$
BEGIN
  -- Delete in FK-safe order
  DELETE FROM public.ai_alerts;
  DELETE FROM public.prescriptions;
  DELETE FROM public.billing;
  DELETE FROM public.consultations;
  DELETE FROM public.vitals;
  DELETE FROM public.lab_reports;
  DELETE FROM public.appointments;
END $$;

-- ============================================================
-- STEP 4: TODAY'S APPOINTMENTS (patient queue)
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID;
  p6 UUID; p7 UUID; p8 UUID; p9 UUID; p10 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p1  FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p2  FROM public.patients WHERE patient_code = 'CLQ-0002';
  SELECT id INTO p3  FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4  FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p5  FROM public.patients WHERE patient_code = 'CLQ-0005';
  SELECT id INTO p6  FROM public.patients WHERE patient_code = 'CLQ-0006';
  SELECT id INTO p7  FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p8  FROM public.patients WHERE patient_code = 'CLQ-0008';
  SELECT id INTO p9  FROM public.patients WHERE patient_code = 'CLQ-0009';
  SELECT id INTO p10 FROM public.patients WHERE patient_code = 'CLQ-0010';

  IF doc_id IS NULL THEN
    RAISE EXCEPTION 'Doctor profile not found — create doctor@cliniq.demo first';
  END IF;

  INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
  VALUES
    -- Active queue patients (waiting → doctor can start consultation + use voice)
    (p2,  doc_id, CURRENT_DATE, '09:00', 'emergency',  'waiting',          101),
    (p1,  doc_id, CURRENT_DATE, '09:30', 'general',    'waiting',          102),
    (p5,  doc_id, CURRENT_DATE, '10:00', 'general',    'waiting',          103),
    (p7,  doc_id, CURRENT_DATE, '10:30', 'emergency',  'waiting',          104),
    -- Scheduled (arrived but not yet called)
    (p8,  doc_id, CURRENT_DATE, '11:00', 'follow-up',  'scheduled',        105),
    (p10, doc_id, CURRENT_DATE, '11:30', 'general',    'scheduled',        106),
    (p6,  doc_id, CURRENT_DATE, '12:00', 'general',    'scheduled',        107),
    (p9,  doc_id, CURRENT_DATE, '14:00', 'general',    'scheduled',        108),
    -- Completed consultations (with saved consultation records below)
    (p3,  doc_id, CURRENT_DATE, '08:00', 'follow-up',  'completed',        109),
    (p4,  doc_id, CURRENT_DATE, '08:30', 'general',    'completed',        110);

  RAISE NOTICE 'Today appointments inserted for doctor: %', doc_id;
END $$;

-- ============================================================
-- STEP 5: HISTORICAL APPOINTMENTS (30 days — for analytics charts)
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID;
  p6 UUID; p7 UUID; p8 UUID; p10 UUID;
  i INT;
  base INT;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p1  FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p2  FROM public.patients WHERE patient_code = 'CLQ-0002';
  SELECT id INTO p3  FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4  FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p5  FROM public.patients WHERE patient_code = 'CLQ-0005';
  SELECT id INTO p6  FROM public.patients WHERE patient_code = 'CLQ-0006';
  SELECT id INTO p7  FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p8  FROM public.patients WHERE patient_code = 'CLQ-0008';
  SELECT id INTO p10 FROM public.patients WHERE patient_code = 'CLQ-0010';

  FOR i IN 1..30 LOOP
    base := 200 + (i * 10);

    -- Core 3 completed appointments every day
    INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
    VALUES
      (p1,  doc_id, CURRENT_DATE - i, '09:00', 'general',   'completed', base + 1),
      (p3,  doc_id, CURRENT_DATE - i, '10:00', 'follow-up', 'completed', base + 2),
      (p5,  doc_id, CURRENT_DATE - i, '11:00', 'general',   'completed', base + 3);

    -- Emergency every 3rd day
    IF i % 3 = 0 THEN
      INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
      VALUES (p7, doc_id, CURRENT_DATE - i, '14:00', 'emergency', 'completed', base + 4);
    END IF;

    -- Extra patients every 2nd day
    IF i % 2 = 0 THEN
      INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
      VALUES (p4, doc_id, CURRENT_DATE - i, '15:00', 'general', 'completed', base + 5);
    END IF;

    -- Cancelled every 5th day
    IF i % 5 = 0 THEN
      INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
      VALUES (p2, doc_id, CURRENT_DATE - i, '16:00', 'general', 'cancelled', base + 6);
    END IF;

    -- Asthma follow-ups every 7th day
    IF i % 7 = 0 THEN
      INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
      VALUES (p10, doc_id, CURRENT_DATE - i, '12:00', 'follow-up', 'completed', base + 7);
    END IF;
  END LOOP;

  RAISE NOTICE 'Historical appointments inserted (30 days)';
END $$;

-- ============================================================
-- STEP 6: FUTURE APPOINTMENTS (patient portal upcoming view)
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p9 UUID; p1 UUID; p4 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p9 FROM public.patients WHERE patient_code = 'CLQ-0009';
  SELECT id INTO p1 FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p4 FROM public.patients WHERE patient_code = 'CLQ-0004';

  INSERT INTO public.appointments (patient_id, doctor_id, date, time_slot, consultation_type, status, token_number)
  VALUES
    (p9, doc_id, CURRENT_DATE + 2, '10:00', 'general',   'scheduled', 301),
    (p9, doc_id, CURRENT_DATE + 9, '11:30', 'follow-up', 'scheduled', 302),
    (p1, doc_id, CURRENT_DATE + 3, '09:30', 'follow-up', 'scheduled', 303),
    (p4, doc_id, CURRENT_DATE + 5, '11:00', 'general',   'scheduled', 304);
END $$;

-- ============================================================
-- STEP 7: COMPLETED CONSULTATIONS (for today's completed appointments)
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p3 UUID; p4 UUID;
  apt_p3 UUID; apt_p4 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p3   FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4   FROM public.patients WHERE patient_code = 'CLQ-0004';

  SELECT id INTO apt_p3
  FROM public.appointments
  WHERE patient_id = p3 AND date = CURRENT_DATE AND status = 'completed'
  LIMIT 1;

  SELECT id INTO apt_p4
  FROM public.appointments
  WHERE patient_id = p4 AND date = CURRENT_DATE AND status = 'completed'
  LIMIT 1;

  -- Consultation 1: Ravi Shah — Diabetes + Hypertension follow-up
  IF apt_p3 IS NOT NULL THEN
    INSERT INTO public.consultations (
      patient_id, doctor_id, appointment_id, date,
      voice_transcript, extracted_symptoms, diagnosis_suggestions,
      final_diagnosis, ai_explanation, recommended_tests, doctor_notes, status
    ) VALUES (
      p3, doc_id, apt_p3, NOW() - INTERVAL '2 hours',
      'Patient reports increased thirst and frequent urination for the past two weeks. Also complaining of fatigue and blurred vision. Blood pressure was slightly elevated on home monitoring. He has been skipping medication occasionally.',
      '[
        {"symptom":"Polydipsia (increased thirst)","duration":"2 weeks","severity":"moderate"},
        {"symptom":"Polyuria (frequent urination)","duration":"2 weeks","severity":"moderate"},
        {"symptom":"Fatigue","duration":"2 weeks","severity":"mild"},
        {"symptom":"Blurred vision","duration":"1 week","severity":"mild"},
        {"symptom":"Medication non-compliance","duration":"ongoing","severity":"moderate"}
      ]'::jsonb,
      '[
        {"condition":"Type 2 Diabetes Mellitus — Uncontrolled","probability":0.89,"explanation":"Classic triad of polydipsia, polyuria, and fatigue with known diabetic history. HbA1c likely >9%."},
        {"condition":"Hypertensive Urgency","probability":0.45,"explanation":"Elevated home BP combined with visual symptoms warrants urgent evaluation."},
        {"condition":"Diabetic Retinopathy (early)","probability":0.38,"explanation":"Blurred vision in a long-standing diabetic — ophthalmology referral essential."}
      ]'::jsonb,
      'Type 2 Diabetes Mellitus — Poor Glycemic Control with Hypertension',
      'HbA1c likely elevated above 9%. Metformin dose increased. BP control suboptimal — Telmisartan added. Ophthalmology referral placed. Strict dietary counseling provided.',
      ARRAY['HbA1c', 'Fasting Blood Glucose', 'Lipid Profile', 'Urine Microalbumin', 'Fundoscopy / Ophthalmology referral'],
      'Increased Metformin to 1000mg BD. Added Telmisartan 40mg OD for BP control. Advised twice-daily home BP monitoring. Emphasized medication compliance. Diet chart given. Follow-up in 6 weeks with HbA1c report.',
      'completed'
    );
  END IF;

  -- Consultation 2: Sita Devi — Thyroid follow-up
  IF apt_p4 IS NOT NULL THEN
    INSERT INTO public.consultations (
      patient_id, doctor_id, appointment_id, date,
      voice_transcript, extracted_symptoms, diagnosis_suggestions,
      final_diagnosis, ai_explanation, recommended_tests, doctor_notes, status
    ) VALUES (
      p4, doc_id, apt_p4, NOW() - INTERVAL '3 hours',
      'Patient came for thyroid follow-up. Feeling better overall after dose adjustment last month. Mild weight gain of about 2 kilograms noted. No palpitations, no tremors. Energy levels have improved significantly. Sleeping better.',
      '[
        {"symptom":"Weight gain","duration":"1 month","severity":"mild"},
        {"symptom":"Fatigue","duration":"resolved","severity":null},
        {"symptom":"Improved sleep quality","duration":"2 weeks","severity":null}
      ]'::jsonb,
      '[
        {"condition":"Hypothyroidism — Stable on Levothyroxine","probability":0.93,"explanation":"Symptoms resolving on current dose. Weight gain acceptable during treatment initiation."},
        {"condition":"Subclinical Hypothyroidism","probability":0.20,"explanation":"May need minor dose titration if TSH remains above 3.0 on next check."}
      ]'::jsonb,
      'Hypothyroidism — Stable, Continue Levothyroxine 50mcg',
      'Patient responding well. TSH trending toward normal. Continue current management. Weight management counseling provided.',
      ARRAY['TSH', 'Free T4', 'CBC', 'Lipid Profile'],
      'Continue Levothyroxine 50mcg OD on empty stomach. Calcium and iron supplements to be taken 4 hours apart. Follow-up in 3 months with TSH and Free T4 report.',
      'completed'
    );
  END IF;

  RAISE NOTICE 'Consultations inserted';
END $$;

-- ============================================================
-- STEP 8: PRESCRIPTIONS
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p1 UUID; p3 UUID; p4 UUID; p7 UUID; p9 UUID;
  c_p3 UUID; c_p4 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p1 FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p3 FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4 FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p7 FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p9 FROM public.patients WHERE patient_code = 'CLQ-0009';

  SELECT id INTO c_p3 FROM public.consultations WHERE patient_id = p3 ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO c_p4 FROM public.consultations WHERE patient_id = p4 ORDER BY created_at DESC LIMIT 1;

  -- Rx 1: Ravi Shah — Diabetes + Hypertension (linked to today's consultation)
  INSERT INTO public.prescriptions (consultation_id, patient_id, doctor_id, medicines, interaction_warnings, allergy_alerts)
  VALUES (
    c_p3, p3, doc_id,
    '[
      {"name":"Metformin","dosage":"1000 mg","frequency":"Twice daily (BD) with meals","duration":"90 days","generic_alt":"Glyciphage 1G","instructions":"Take with food to reduce GI side effects. Do not crush."},
      {"name":"Telmisartan","dosage":"40 mg","frequency":"Once daily (OD) morning","duration":"90 days","generic_alt":"Telma 40","instructions":"Take at the same time each day. Monitor BP regularly."},
      {"name":"Atorvastatin","dosage":"20 mg","frequency":"Once daily at bedtime","duration":"90 days","generic_alt":"Lipitor 20mg","instructions":"Avoid grapefruit juice. Report muscle pain immediately."},
      {"name":"Aspirin","dosage":"75 mg","frequency":"Once daily with food","duration":"90 days","generic_alt":"Ecosprin 75","instructions":"CAUTION: Patient has Aspirin allergy — prescribed at low dose with monitoring. Watch for GI symptoms."}
    ]'::jsonb,
    '[{"drug_pair":"Metformin + Ibuprofen","severity":"moderate","message":"NSAIDs reduce renal clearance of Metformin — avoid concurrent use of Ibuprofen/Diclofenac"}]'::jsonb,
    ARRAY['Aspirin (documented allergy — monitor closely, prescribed at low dose with indication)']
  );

  -- Rx 2: Sita Devi — Hypothyroidism (linked to today's consultation)
  INSERT INTO public.prescriptions (consultation_id, patient_id, doctor_id, medicines, interaction_warnings, allergy_alerts)
  VALUES (
    c_p4, p4, doc_id,
    '[
      {"name":"Levothyroxine","dosage":"50 mcg","frequency":"Once daily, empty stomach","duration":"90 days","generic_alt":"Thyronorm 50mcg","instructions":"Take 30-45 minutes before breakfast. Separate from calcium/iron by 4 hours."},
      {"name":"Calcium Carbonate + Vitamin D3","dosage":"500 mg + 250 IU","frequency":"Once daily after dinner","duration":"90 days","generic_alt":"Shelcal 500","instructions":"Take with food for better absorption."}
    ]'::jsonb,
    '[]'::jsonb,
    ARRAY[]::text[]
  );

  -- Rx 3: Anil Patel — Hypertension (standalone, no consultation today)
  INSERT INTO public.prescriptions (patient_id, doctor_id, medicines, interaction_warnings, allergy_alerts)
  VALUES (
    p1, doc_id,
    '[
      {"name":"Amlodipine","dosage":"5 mg","frequency":"Once daily","duration":"30 days","generic_alt":"Amlong 5mg","instructions":"Take at the same time each day. May cause ankle swelling."},
      {"name":"Losartan","dosage":"50 mg","frequency":"Once daily","duration":"30 days","generic_alt":"Repace 50","instructions":"Monitor renal function and potassium levels. Avoid potassium supplements."}
    ]'::jsonb,
    '[]'::jsonb,
    ARRAY['Penicillin (use alternative antibiotics if needed)']
  );

  -- Rx 4: Suresh Babu — Cardiac medications
  INSERT INTO public.prescriptions (patient_id, doctor_id, medicines, interaction_warnings, allergy_alerts)
  VALUES (
    p7, doc_id,
    '[
      {"name":"Bisoprolol","dosage":"2.5 mg","frequency":"Once daily morning","duration":"30 days","generic_alt":"Concor 2.5","instructions":"Do not stop abruptly. Monitor heart rate and BP."},
      {"name":"Furosemide","dosage":"40 mg","frequency":"Once daily morning","duration":"30 days","generic_alt":"Lasix 40","instructions":"Take in the morning to avoid nocturia. Monitor electrolytes."},
      {"name":"Spironolactone","dosage":"25 mg","frequency":"Once daily","duration":"30 days","generic_alt":"Aldactone 25","instructions":"Monitor potassium. Avoid potassium-rich foods."},
      {"name":"Digoxin","dosage":"0.25 mg","frequency":"Once daily","duration":"30 days","generic_alt":"Lanoxin","instructions":"Narrow therapeutic index — monitor levels. Report nausea or visual changes."}
    ]'::jsonb,
    '[
      {"drug_pair":"Furosemide + Digoxin","severity":"high","message":"Furosemide-induced hypokalemia increases Digoxin toxicity risk — monitor electrolytes closely"},
      {"drug_pair":"Spironolactone + Bisoprolol","severity":"low","message":"May cause additive bradycardia — monitor heart rate"}
    ]'::jsonb,
    ARRAY[]::text[]
  );

  -- Rx 5: Ramesh Sharma (patient@cliniq.demo) — simple prescription for patient portal
  INSERT INTO public.prescriptions (patient_id, doctor_id, medicines, interaction_warnings, allergy_alerts)
  VALUES (
    p9, doc_id,
    '[
      {"name":"Cetirizine","dosage":"10 mg","frequency":"Once daily at night","duration":"7 days","generic_alt":"Alerid 10","instructions":"May cause drowsiness — avoid driving."},
      {"name":"Vitamin C","dosage":"500 mg","frequency":"Once daily with food","duration":"30 days","generic_alt":"Limcee","instructions":"Take with meals."}
    ]'::jsonb,
    '[]'::jsonb,
    ARRAY[]::text[]
  );

  RAISE NOTICE 'Prescriptions inserted';
END $$;

-- ============================================================
-- STEP 9: LAB REPORTS
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p3 UUID; p7 UUID; p9 UUID; p1 UUID; p4 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p1 FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p3 FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4 FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p7 FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p9 FROM public.patients WHERE patient_code = 'CLQ-0009';

  -- Lab 1: Ravi Shah — Diabetes + Anaemia panel (critical findings)
  INSERT INTO public.lab_reports (patient_id, uploaded_by, file_url, file_name, extracted_values, ai_summary, uploaded_at)
  VALUES (
    p3, doc_id,
    'https://placehold.co/800x1100/ffffff/333333?text=CBC+%26+HbA1c+Report',
    'Ravi_Shah_CBC_HbA1c_Mar2026.pdf',
    '[
      {"test_name":"HbA1c","value":"9.2","unit":"%","normal_range":"4.0-5.6","status":"critical"},
      {"test_name":"Fasting Blood Glucose","value":"210","unit":"mg/dL","normal_range":"70-100","status":"critical"},
      {"test_name":"Post-Prandial Glucose","value":"285","unit":"mg/dL","normal_range":"<140","status":"critical"},
      {"test_name":"Hemoglobin","value":"9.2","unit":"g/dL","normal_range":"13.0-17.0","status":"low"},
      {"test_name":"Serum Creatinine","value":"1.3","unit":"mg/dL","normal_range":"0.7-1.2","status":"high"},
      {"test_name":"Total Cholesterol","value":"228","unit":"mg/dL","normal_range":"<200","status":"high"},
      {"test_name":"LDL Cholesterol","value":"148","unit":"mg/dL","normal_range":"<100","status":"high"},
      {"test_name":"Urine Microalbumin","value":"62","unit":"mg/24h","normal_range":"<30","status":"high"}
    ]'::jsonb,
    'CRITICAL findings: HbA1c 9.2% indicates severely uncontrolled diabetes. Fasting and post-prandial glucose markedly elevated. Hemoglobin low at 9.2 g/dL — iron deficiency or anemia of chronic disease likely. Early renal involvement suggested by elevated creatinine and microalbuminuria. Dyslipidemia present. Immediate medication adjustment, dietary counseling, and nephrology referral recommended.',
    NOW() - INTERVAL '3 hours'
  );

  -- Lab 2: Suresh Babu — Cardiac panel (critical emergency)
  INSERT INTO public.lab_reports (patient_id, uploaded_by, file_url, file_name, extracted_values, ai_summary, uploaded_at)
  VALUES (
    p7, doc_id,
    'https://placehold.co/800x1100/ffffff/333333?text=Cardiac+Panel+Report',
    'Suresh_Babu_Cardiac_Panel_Mar2026.pdf',
    '[
      {"test_name":"Troponin I","value":"0.82","unit":"ng/mL","normal_range":"<0.04","status":"critical"},
      {"test_name":"BNP (B-type Natriuretic Peptide)","value":"480","unit":"pg/mL","normal_range":"<100","status":"critical"},
      {"test_name":"ECG Rhythm","value":"Irregular (AF)","unit":"","normal_range":"Sinus rhythm","status":"critical"},
      {"test_name":"Ejection Fraction (Echo)","value":"36","unit":"%","normal_range":"55-70","status":"low"},
      {"test_name":"Serum Potassium","value":"5.9","unit":"mEq/L","normal_range":"3.5-5.0","status":"high"},
      {"test_name":"Serum Sodium","value":"132","unit":"mEq/L","normal_range":"135-145","status":"low"},
      {"test_name":"Creatinine","value":"1.6","unit":"mg/dL","normal_range":"0.7-1.2","status":"high"}
    ]'::jsonb,
    'EMERGENCY: Troponin I severely elevated (0.82 ng/mL) — acute myocardial injury confirmed. BNP critically elevated indicating acute decompensated heart failure. ECG shows atrial fibrillation with rapid ventricular response. Echo reveals reduced ejection fraction at 36% (severe systolic dysfunction). Hyperkalemia and hyponatremia present. Acute renal impairment noted. Immediate ICU admission and urgent cardiology consultation required. Consider IV diuretics, anticoagulation, and rate control.',
    NOW() - INTERVAL '1 hour'
  );

  -- Lab 3: Anil Patel — Routine + lipid panel
  INSERT INTO public.lab_reports (patient_id, uploaded_by, file_url, file_name, extracted_values, ai_summary, uploaded_at)
  VALUES (
    p1, doc_id,
    'https://placehold.co/800x1100/ffffff/333333?text=Lipid+Profile+Report',
    'Anil_Patel_Lipid_Profile_Mar2026.pdf',
    '[
      {"test_name":"Total Cholesterol","value":"198","unit":"mg/dL","normal_range":"<200","status":"normal"},
      {"test_name":"LDL Cholesterol","value":"118","unit":"mg/dL","normal_range":"<100","status":"high"},
      {"test_name":"HDL Cholesterol","value":"42","unit":"mg/dL","normal_range":">40","status":"normal"},
      {"test_name":"Triglycerides","value":"165","unit":"mg/dL","normal_range":"<150","status":"high"},
      {"test_name":"Blood Pressure","value":"142/90","unit":"mmHg","normal_range":"<120/80","status":"high"},
      {"test_name":"Fasting Blood Glucose","value":"98","unit":"mg/dL","normal_range":"70-100","status":"normal"}
    ]'::jsonb,
    'Borderline dyslipidemia: LDL elevated at 118 mg/dL and triglycerides mildly elevated. Total cholesterol borderline normal. Hypertension confirmed at 142/90 mmHg. Fasting glucose normal — no diabetes risk currently. Lifestyle modification recommended: reduce saturated fats, increase physical activity. Consider statin therapy given hypertension and LDL elevation.',
    NOW() - INTERVAL '2 days'
  );

  -- Lab 4: Sita Devi — Thyroid panel
  INSERT INTO public.lab_reports (patient_id, uploaded_by, file_url, file_name, extracted_values, ai_summary, uploaded_at)
  VALUES (
    p4, doc_id,
    'https://placehold.co/800x1100/ffffff/333333?text=Thyroid+Panel',
    'Sita_Devi_Thyroid_Panel_Mar2026.pdf',
    '[
      {"test_name":"TSH","value":"3.8","unit":"mIU/L","normal_range":"0.4-4.0","status":"normal"},
      {"test_name":"Free T4","value":"1.1","unit":"ng/dL","normal_range":"0.8-1.8","status":"normal"},
      {"test_name":"Free T3","value":"2.9","unit":"pg/mL","normal_range":"2.3-4.2","status":"normal"},
      {"test_name":"Anti-TPO Antibodies","value":"45","unit":"IU/mL","normal_range":"<35","status":"high"},
      {"test_name":"Hemoglobin","value":"11.8","unit":"g/dL","normal_range":"12.0-16.0","status":"low"}
    ]'::jsonb,
    'Thyroid function on treatment: TSH within normal limits (3.8 mIU/L) — Levothyroxine dose appears adequate. Anti-TPO antibodies mildly elevated suggesting underlying autoimmune thyroiditis (Hashimoto). Mild anemia noted — consider iron supplementation. Monitor TSH and Free T4 in 3 months.',
    NOW() - INTERVAL '3 hours'
  );

  -- Lab 5: Ramesh Sharma — Normal routine (patient portal)
  INSERT INTO public.lab_reports (patient_id, uploaded_by, file_url, file_name, extracted_values, ai_summary, uploaded_at)
  VALUES (
    p9, doc_id,
    'https://placehold.co/800x1100/ffffff/333333?text=Routine+Blood+Work',
    'Ramesh_Sharma_CBC_Routine_Mar2026.pdf',
    '[
      {"test_name":"Hemoglobin","value":"14.5","unit":"g/dL","normal_range":"13.0-17.0","status":"normal"},
      {"test_name":"WBC Count","value":"7200","unit":"/μL","normal_range":"4000-11000","status":"normal"},
      {"test_name":"Platelet Count","value":"265000","unit":"/μL","normal_range":"150000-400000","status":"normal"},
      {"test_name":"Fasting Blood Glucose","value":"88","unit":"mg/dL","normal_range":"70-100","status":"normal"},
      {"test_name":"TSH","value":"2.3","unit":"mIU/L","normal_range":"0.4-4.0","status":"normal"},
      {"test_name":"Serum Creatinine","value":"0.9","unit":"mg/dL","normal_range":"0.7-1.2","status":"normal"},
      {"test_name":"Total Cholesterol","value":"175","unit":"mg/dL","normal_range":"<200","status":"normal"}
    ]'::jsonb,
    'All parameters within normal range. Complete blood count normal — no anemia or infection signs. Blood glucose normal — no diabetes risk. Thyroid function normal. Renal function normal. Cholesterol within healthy range. Continue healthy lifestyle. Next routine check in 12 months.',
    NOW() - INTERVAL '5 days'
  );

  RAISE NOTICE 'Lab reports inserted';
END $$;

-- ============================================================
-- STEP 10: VITALS
-- ============================================================
DO $$
DECLARE
  doc_id UUID;
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID;
  p7 UUID; p8 UUID; p9 UUID;
BEGIN
  SELECT id INTO doc_id FROM public.profiles WHERE role = 'doctor' LIMIT 1;
  SELECT id INTO p1 FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p2 FROM public.patients WHERE patient_code = 'CLQ-0002';
  SELECT id INTO p3 FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4 FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p5 FROM public.patients WHERE patient_code = 'CLQ-0005';
  SELECT id INTO p7 FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p8 FROM public.patients WHERE patient_code = 'CLQ-0008';
  SELECT id INTO p9 FROM public.patients WHERE patient_code = 'CLQ-0009';

  INSERT INTO public.vitals (patient_id, recorded_by, bp_systolic, bp_diastolic, heart_rate, temperature, oxygen_saturation, weight, bmi, recorded_at)
  VALUES
    -- Today's vitals (patients in queue)
    (p2,  doc_id, 100, 65, 104, 99.1, 96, 58.0, 22.1, NOW() - INTERVAL '30 minutes'),  -- Meera — emergency fever
    (p1,  doc_id, 145, 92,  88, 98.4, 97, 72.5, 27.1, NOW() - INTERVAL '45 minutes'),  -- Anil — hypertension
    (p5,  doc_id, 118, 76,  74, 98.2, 99, 68.0, 23.4, NOW() - INTERVAL '1 hour'),      -- Rahul — normal
    (p7,  doc_id, 175,108, 112, 99.2, 92, 78.0, 29.5, NOW() - INTERVAL '20 minutes'),  -- Suresh — critical
    -- Completed consultations earlier today
    (p3,  doc_id, 158, 98,  94, 98.6, 95, 85.0, 31.2, NOW() - INTERVAL '2 hours'),     -- Ravi — high
    (p4,  doc_id, 118, 75,  72, 98.2, 99, 68.0, 26.4, NOW() - INTERVAL '3 hours'),     -- Sita — normal
    -- Historical vitals (past visits)
    (p1,  doc_id, 148, 94,  86, 98.4, 97, 73.0, 27.4, NOW() - INTERVAL '7 days'),
    (p3,  doc_id, 152, 96,  90, 98.5, 96, 84.5, 31.0, NOW() - INTERVAL '7 days'),
    (p9,  doc_id, 120, 78,  74, 98.6, 99, 70.0, 24.2, NOW() - INTERVAL '5 days'),
    (p8,  doc_id, 112, 72,  68, 98.4, 99, 62.0, 23.8, NOW() - INTERVAL '3 days');

  RAISE NOTICE 'Vitals inserted';
END $$;

-- ============================================================
-- STEP 11: BILLING (today + historical for revenue analytics)
-- ============================================================
DO $$
DECLARE
  p1 UUID; p2 UUID; p3 UUID; p4 UUID; p5 UUID;
  p7 UUID; p8 UUID; p9 UUID; p10 UUID;
  c_p3 UUID; c_p4 UUID;
  i INT;
BEGIN
  SELECT id INTO p1  FROM public.patients WHERE patient_code = 'CLQ-0001';
  SELECT id INTO p2  FROM public.patients WHERE patient_code = 'CLQ-0002';
  SELECT id INTO p3  FROM public.patients WHERE patient_code = 'CLQ-0003';
  SELECT id INTO p4  FROM public.patients WHERE patient_code = 'CLQ-0004';
  SELECT id INTO p5  FROM public.patients WHERE patient_code = 'CLQ-0005';
  SELECT id INTO p7  FROM public.patients WHERE patient_code = 'CLQ-0007';
  SELECT id INTO p8  FROM public.patients WHERE patient_code = 'CLQ-0008';
  SELECT id INTO p9  FROM public.patients WHERE patient_code = 'CLQ-0009';
  SELECT id INTO p10 FROM public.patients WHERE patient_code = 'CLQ-0010';

  SELECT id INTO c_p3 FROM public.consultations WHERE patient_id = p3 ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO c_p4 FROM public.consultations WHERE patient_id = p4 ORDER BY created_at DESC LIMIT 1;

  -- Today's billing records
  INSERT INTO public.billing (patient_id, consultation_id, consultation_fee, lab_charges, medicine_charges, total, payment_mode, payment_status, invoice_number)
  VALUES
    (p3,  c_p3, 500, 800, 250, 1550, 'upi',  'paid',    'INV-2026-1001'),
    (p4,  c_p4, 500, 300,   0,  800, 'cash', 'paid',    'INV-2026-1002'),
    (p1,  null, 500, 400, 150, 1050, 'upi',  'paid',    'INV-2026-1003'),
    (p7,  null, 500,   0,   0,  500, null,   'pending', 'INV-2026-1004'),
    (p9,  null, 500,   0,   0,  500, 'card', 'paid',    'INV-2026-1005'),
    (p2,  null, 500,   0,   0,  500, null,   'pending', 'INV-2026-1006')
  ON CONFLICT (invoice_number) DO NOTHING;

  -- Historical billing (30 days for revenue analytics)
  FOR i IN 1..30 LOOP
    INSERT INTO public.billing (patient_id, consultation_fee, lab_charges, medicine_charges, total, payment_mode, payment_status, invoice_number, created_at)
    VALUES
      (p1,  500, 0,   0,    500,  'cash', 'paid',    'INV-HIST-' || LPAD(i::text, 4, '0') || 'A', (NOW() - (i || ' days')::INTERVAL)),
      (p3,  500, 600, 200, 1300,  'upi',  'paid',    'INV-HIST-' || LPAD(i::text, 4, '0') || 'B', (NOW() - (i || ' days')::INTERVAL)),
      (p5,  500, 0,   0,    500,  'upi',  'paid',    'INV-HIST-' || LPAD(i::text, 4, '0') || 'C', (NOW() - (i || ' days')::INTERVAL))
    ON CONFLICT (invoice_number) DO NOTHING;

    -- Emergency billing every 3rd day
    IF i % 3 = 0 THEN
      INSERT INTO public.billing (patient_id, consultation_fee, lab_charges, medicine_charges, total, payment_mode, payment_status, invoice_number, created_at)
      VALUES (p7, 1000, 1200, 350, 2550, 'card', 'paid', 'INV-HIST-' || LPAD(i::text, 4, '0') || 'D', (NOW() - (i || ' days')::INTERVAL))
      ON CONFLICT (invoice_number) DO NOTHING;
    END IF;

    -- Pending billing every 7th day
    IF i % 7 = 0 THEN
      INSERT INTO public.billing (patient_id, consultation_fee, lab_charges, medicine_charges, total, payment_mode, payment_status, invoice_number, created_at)
      VALUES (p8, 500, 0, 0, 500, null, 'pending', 'INV-HIST-' || LPAD(i::text, 4, '0') || 'E', (NOW() - (i || ' days')::INTERVAL))
      ON CONFLICT (invoice_number) DO NOTHING;
    END IF;
  END LOOP;

  RAISE NOTICE 'Billing records inserted';
END $$;

-- ============================================================
-- STEP 12: AI ALERTS
-- ============================================================
INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'high_risk',
  'CRITICAL: HbA1c 9.2% — severely uncontrolled diabetes. Immediate medication review and dietary counseling required.',
  'critical'
FROM public.patients WHERE patient_code = 'CLQ-0003';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'abnormal_lab',
  'Abnormal CBC: Hemoglobin 9.2 g/dL — iron deficiency anaemia suspected. Consider iron supplementation and diet review.',
  'high'
FROM public.patients WHERE patient_code = 'CLQ-0003';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'drug_interaction',
  'Potential interaction: Metformin + Ibuprofen — NSAIDs reduce renal clearance of Metformin. Avoid concurrent use.',
  'medium'
FROM public.patients WHERE patient_code = 'CLQ-0001';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'emergency',
  'EMERGENCY: Troponin I elevated at 0.82 ng/mL + AF on ECG + EF 36%. Acute cardiac event — ICU admission required.',
  'critical'
FROM public.patients WHERE patient_code = 'CLQ-0007';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'overdue_followup',
  'Thyroid follow-up overdue by 3 weeks — TSH and Free T4 recheck required for Levothyroxine dose adjustment.',
  'medium'
FROM public.patients WHERE patient_code = 'CLQ-0004';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'high_risk',
  'Cardiac risk score elevated: Arrhythmia + Diabetes + Age 68. Cardiology referral and lifestyle counseling advised.',
  'high'
FROM public.patients WHERE patient_code = 'CLQ-0007';

INSERT INTO public.ai_alerts (patient_id, alert_type, message, severity)
SELECT id, 'drug_interaction',
  'Furosemide + Digoxin interaction detected: Diuretic-induced hypokalemia may increase Digoxin toxicity. Monitor electrolytes.',
  'high'
FROM public.patients WHERE patient_code = 'CLQ-0007';

-- ============================================================
-- DONE
-- ============================================================
-- What you can now demo:
--
-- [Doctor Login — doctor@cliniq.demo]
--   • Queue:          4 patients WAITING  (tokens 101-104) → click Start → consultation screen
--   • Consultation:   Voice recording → stop → Whisper transcribes → Extract Symptoms → AI Diagnosis
--   • Prescriptions:  5 prescriptions with drug interaction warnings
--   • Patients:       10 patients with risk badges, allergies, chronic conditions
--   • Lab Reports:    5 reports with AI analysis
--   • AI Alerts:      7 alerts (critical/high/medium)
--   • Analytics:      30 days of appointment + revenue data
--
-- [Receptionist Login — reception@cliniq.demo]
--   • Queue Manager:  All 10 today's appointments, advance/cancel status
--   • Register Patient: Create new patient
--   • Billing:        6 today + 100+ historical invoices
--
-- [Admin Login — admin@cliniq.demo]
--   • Analytics:      Revenue charts, appointment trends, patient risk distribution
--   • Users:          All 4 role profiles
--   • Alerts:         7 active AI alerts
--
-- [Patient Login — patient@cliniq.demo]
--   • Profile linked to Ramesh Sharma (CLQ-0009)
--   • Upcoming:       2 scheduled appointments
--   • Prescriptions:  1 prescription (Cetirizine + Vitamin C)
--   • Lab Reports:    1 report (normal CBC)
-- ============================================================
