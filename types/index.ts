export type UserRole = 'doctor' | 'admin' | 'receptionist' | 'patient'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  phone: string | null
  specialization: string | null
  license_number: string | null
  avatar_url: string | null
  created_at: string
}

export interface Patient {
  id: string
  patient_code: string
  full_name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  address: string | null
  blood_group: string | null
  allergies: string[]
  chronic_conditions: string[]
  emergency_contact: string | null
  risk_level: 'low' | 'medium' | 'high'
  profile_id: string | null
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  date: string
  time_slot: string
  consultation_type: 'general' | 'follow-up' | 'emergency'
  status: 'scheduled' | 'waiting' | 'in-consultation' | 'completed' | 'cancelled'
  token_number: number | null
  reminder_sent: boolean
  notes: string | null
  created_at: string
  patient?: Patient
  doctor?: Profile
}

export interface ExtractedSymptom {
  symptom: string
  duration: string | null
  severity: 'mild' | 'moderate' | 'severe' | null
}

export interface DiagnosisSuggestion {
  condition: string
  probability: number
  explanation: string
}

export interface Consultation {
  id: string
  patient_id: string
  doctor_id: string
  appointment_id: string | null
  date: string
  voice_transcript: string | null
  extracted_symptoms: ExtractedSymptom[]
  diagnosis_suggestions: DiagnosisSuggestion[]
  final_diagnosis: string | null
  ai_explanation: string | null
  recommended_tests: string[]
  doctor_notes: string | null
  status: 'active' | 'completed'
  patient?: Patient
  doctor?: Profile
}

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  generic_alt: string | null
  instructions: string | null
}

export interface DrugInteraction {
  drug_pair: string
  severity: 'low' | 'moderate' | 'high'
  message: string
}

export interface Prescription {
  id: string
  consultation_id: string
  patient_id: string
  doctor_id: string
  medicines: Medicine[]
  interaction_warnings: DrugInteraction[]
  allergy_alerts: string[]
  pdf_url: string | null
  created_at: string
  patient?: Patient
  doctor?: Profile
  consultation?: Consultation
}

export interface LabValue {
  test_name: string
  value: string
  unit: string
  normal_range: string
  status: 'normal' | 'high' | 'low' | 'critical'
}

export interface LabReport {
  id: string
  patient_id: string
  uploaded_by: string
  file_url: string
  file_name: string
  extracted_values: LabValue[]
  ai_summary: string | null
  uploaded_at: string
  patient?: Patient
}

export interface Vitals {
  id: string
  patient_id: string
  recorded_by: string
  bp_systolic: number | null
  bp_diastolic: number | null
  heart_rate: number | null
  temperature: number | null
  oxygen_saturation: number | null
  weight: number | null
  bmi: number | null
  recorded_at: string
}

export interface Billing {
  id: string
  patient_id: string
  consultation_id: string | null
  consultation_fee: number
  lab_charges: number
  medicine_charges: number
  total: number
  payment_mode: 'cash' | 'upi' | 'card' | null
  payment_status: 'pending' | 'paid' | 'partial'
  invoice_number: string
  created_at: string
  patient?: Patient
}

export interface AIAlert {
  id: string
  patient_id: string
  alert_type: 'drug_interaction' | 'high_risk' | 'abnormal_lab' | 'overdue_followup' | 'emergency'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  is_resolved: boolean
  created_at: string
  patient?: Patient
}

export interface DashboardStats {
  total_patients_today: number
  waiting_patients: number
  completed_consultations: number
  emergency_alerts: number
  follow_ups_today: number
}
