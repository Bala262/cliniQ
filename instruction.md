1. Overall System Workflow Prompt
Design the clinic management system so that all roles are connected through a patient workflow. The reception registers patients and generates a token which appears in the nurse dashboard queue. The nurse records vitals and sends the patient to the doctor consultation queue. The doctor performs consultation, adds diagnosis, generates prescriptions, and orders lab tests if needed. Lab orders appear in the lab technician dashboard for processing and report generation. Prescriptions automatically appear in the pharmacy dashboard for medicine dispensing. Billing collects consultation, lab, pharmacy, and ward charges. The admin dashboard monitors analytics, staff activity, revenue, and system operations across all modules.
2. Reception → Nurse → Doctor Link
When a receptionist registers a patient, the system generates a token and creates a patient visit record. This patient automatically appears in the nurse dashboard under the "Patients Waiting for Vitals" queue. After the nurse records vitals such as temperature, blood pressure, pulse, and SpO2, physical examination like height and weight  the system updates the patient status to "Ready for Consultation". The patient then appears in the doctor dashboard patient queue so the doctor can start the consultation.
.3 Doctor → Lab Technician Link
During consultation, if the doctor orders lab tests such as CBC, blood sugar, or X-ray, the system creates a lab order linked to the patient visit. These orders automatically appear in the lab technician dashboard under "Test Orders". The lab technician collects the sample, processes the test, and uploads the report. Once the report is generated, the doctor dashboard is updated with a notification and the lab report becomes available in the patient's medical record.
Doctor → Pharmacy Link
After the doctor completes the consultation and generates a prescription, the system sends the prescription details to the pharmacy dashboard. The pharmacist sees the prescription in the "Prescription Queue" with the patient name, doctor name, and medicine list. The pharmacist dispenses medicines, updates stock inventory, and marks the prescription as completed. The dispensing details are also linked to the patient billing record.
Pharmacy → Billing Link
Once medicines are dispensed in the pharmacy module, the medicine charges are automatically added to the patient billing record. The billing dashboard aggregates consultation fees, lab test charges, pharmacy sales, and ward charges. Billing staff generate the final invoice and accept payments through cash, UPI, or card. After payment, the bill is marked as completed and the patient visit record is closed.

Doctor → Nurse (Ward Management)
If a doctor decides to admit a patient, the system assigns the patient to one of the available inpatient beds in the ward management module. The nurse dashboard displays the patient in the ward monitoring list with diagnosis, medication schedule, and vital monitoring tasks. Nurses update treatment progress and patient condition, while doctors can review the information from their dashboard.
Admin Monitoring All Roles
The admin dashboard aggregates information from all modules including reception, doctor consultations, lab tests, pharmacy sales, billing, and ward management. Admin users can monitor patient volume, revenue trends, doctor performance, bed occupancy, and inventory levels. The admin panel also allows managing staff accounts, schedules, clinic settings, and system analytics.
AI Copilot Integration
The AI copilot module supports doctors during consultation by analyzing patient symptoms, vitals, and medical history. It suggests possible diagnoses, recommended lab tests, and treatment options. The AI panel appears in the doctor consultation interface and updates dynamically based on entered symptoms and patient data. The suggestions assist the doctor but final decisions remain with the physician.

Design the clinic management system so that all roles are connected through a continuous patient workflow supported by an AI Copilot layer. The receptionist first registers the patient, generates a token, and creates a patient visit record which automatically appears in the nurse dashboard under the “Patients Waiting for Vitals” queue. The nurse records vitals such as temperature, blood pressure, pulse, SpO₂, and physical examination details like height and weight, after which the system updates the patient status to “Ready for Consultation” and sends the patient to the doctor consultation queue. The doctor reviews symptoms and vitals, performs consultation, records clinical notes, enters diagnosis, generates prescriptions, and may order lab tests when required. Lab orders automatically appear in the lab technician dashboard under “Test Orders,” where samples are collected, tests are processed, and reports are uploaded; once reports are generated, the doctor dashboard receives a notification and the reports become available in the patient medical record. Prescriptions generated by the doctor automatically appear in the pharmacy dashboard where the pharmacist dispenses medicines, updates inventory, and marks prescriptions as completed, while the dispensing details are linked to the patient billing record. The billing module aggregates consultation fees, lab charges, pharmacy charges, and ward charges, allowing billing staff to generate invoices and accept payments through cash, UPI, or card, after which the patient visit is closed. If the doctor admits the patient, the system assigns an available bed in the ward management module where nurses monitor patient condition, medication schedules, and vitals while doctors review updates from their dashboard. The admin dashboard integrates information from all modules including reception, consultations, lab tests, pharmacy operations, billing, and ward management to monitor patient flow, revenue trends, doctor performance, bed occupancy, staff activity, and clinic analytics. Throughout this workflow, an AI Copilot layer powered by LLMs and clinical rules assists the doctor during consultation by analyzing symptoms, vitals, and medical history to suggest possible diagnoses, recommended lab tests, and treatment options. This AI Copilot layer interacts with the patient database, prescription engine, lab suggestion model, and follow-up scheduler to support decision-making, automate recommendations, and improve clinical workflow efficiency while keeping final medical decisions under the doctor’s control.

Create a role-based clinic management dashboard UI for a 10-bed clinic.

Tech stack:
Next.js + React + TailwindCSS + ShadCN UI

Layout structure:

TOP BAR
Clinic name
Global search
Notifications
User profile

LEFT SIDEBAR
Role-based navigation

CENTER PANEL
Main working content

RIGHT PANEL
Alerts or AI Copilot suggestions

Roles:

Reception
Doctor
Visiting Doctor
Nurse
Lab Technician
Pharmacist
Billing
Admin

Each role should have:

- dashboard page
- sidebar navigation
- tables
- forms
- cards
- alerts

Use realistic medical UI layout and reusable components.

1. RECEPTION ROLE PROMPT
Create a Reception Dashboard UI for a clinic management system.

Sidebar:

Dashboard
Patient Registration
Appointments
Patient Queue
Patient Search
Follow-ups
Billing Queue
Daily Summary
Settings
Logout

Layout:

TopBar
Sidebar
Main Content

Dashboard content:

Cards:
Total Patients Registered Today
Patients Waiting
Patients Consulted
Billing Pending

Appointments table:

Time | Patient | Doctor | Status

Example data:
10:30 Ravi Kumar Dr Kumar Waiting
11:00 Meena Lakshmi Dr Priya Completed

Doctor availability card:

Dr Kumar Available
Dr Priya 10AM–12PM
Dr Ahmed 5PM–7PM

RECEPTION TAB PROMPTS
Patient Registration
Create a Patient Registration page.

Form fields:

Patient Name
Age
Gender
Phone
Address
Symptoms

Buttons:
Register Patient
Clear Form

On submit generate:

Token Number
Assigned Doctor

Display confirmation card:

Token A12
Doctor Dr Kumar

Patient Queue
Create a Patient Queue page.

Table columns:

Token
Patient Name
Age
Symptoms
Status

Statuses:

Waiting
With Nurse
With Doctor
Completed

Allow receptionist to update status.

Billing Queue
Create Billing Queue UI.

Table columns:

Patient
Consultation Fee
Lab Fee
Medicine Fee
Total

Buttons:

Generate Bill
Print Bill
Send WhatsApp Receipt

2. DOCTOR ROLE PROMPT
Create a Doctor Dashboard.

Sidebar:

Dashboard
Patient Queue
Consultation
Patient Records
Prescriptions
Lab Orders
Inpatient Ward
Follow-ups
Analytics
Settings
Logout

Layout:

TopBar
Sidebar
Main Consultation Workspace
Right AI Copilot Panel

DOCTOR TAB PROMPTS
Dashboard
Create Doctor Overview Dashboard.

Cards:

Patients Waiting
Patients Consulted Today
Pending Lab Reports
Ward Patients

Example:

Patients Waiting 6
Consulted Today 24
Pending Labs 3
Ward Patients 4

Display queue preview table:

Token | Patient | Symptoms
A01 Ravi Fever
A02 Kumar BP Check
A03 Devi Headache

Patient Queue
Create Patient Queue page.

Table:

Token
Patient Name
Age
Symptoms
Vitals
Status

Example rows:

A01 Ravi 35 Fever ✓ Waiting
A02 Kumar 50 BP Check ✓ Waiting
A03 Devi 27 Headache ✓ In Vitals

Clicking a patient opens consultation page.

Consultation
Create Doctor Consultation screen.

Sections:

Patient Information
Vitals
Symptoms
Clinical Notes
Diagnosis
Prescription
Lab Orders

Patient info card:

Name
Age
Phone

Vitals card:

Temperature
Blood Pressure
Pulse

Symptoms section:

List symptoms

Clinical Notes:

Large text editor
Voice input option

Diagnosis:

Search dropdown

Prescription table:

Drug | Dose | Frequency | Duration

AI Copilot Panel
Create AI Copilot panel for consultation page.

Sections:

Possible Diagnosis
Suggested Tests
Suggested Medicines
Drug Interaction Alerts

Example:

Possible Diagnosis
Viral Fever
Dengue
Flu

Suggested Tests
CBC
Dengue NS1

Suggested Medicines
Paracetamol
ORS

Lab Orders
Create Lab Orders page.

Table columns:

Patient
Test
Doctor
Status

Example:

Ravi CBC Pending
Meena Sugar Completed

Buttons:

Order Test
View Report
Download Report

Inpatient Ward
Create Ward Management page.

Display 10 beds.

Fields:

Bed Number
Patient
Diagnosis
Status

Statuses:

Available
Occupied
Cleaning
Reserved

3. NURSE ROLE PROMPT
Create Nurse Dashboard UI.

Sidebar:

Dashboard
Patient Queue
Vitals Entry
Ward Management
Procedures
Lab Samples
Patient Monitoring
Settings
Logout

Nurse Dashboard
Create nurse dashboard cards.

Patients Waiting for Vitals
Ward Patients
Emergency Alerts
Doctor Requests

Vitals Entry
Create Vitals Entry page.

Fields:

Temperature
Blood Pressure
Pulse
SpO2
Height
Weight

Button:

Save Vitals
Send to Doctor

Ward Management
Create Ward Management page.

Display beds with:

Bed Number
Patient
Condition
Status

Example:

Bed 1 Ravi Dengue Occupied
Bed 2 Empty Available
Bed 3 Meena Fever Occupied

4. LAB TECHNICIAN PROMPT
Create Lab Technician dashboard.

Sidebar:

Dashboard
Test Orders
Sample Processing
Reports
Lab Analytics
Settings
Logout

Test Orders
Create Test Orders page.

Table columns:

Patient
Test Type
Doctor
Priority
Status

Example:

Ravi CBC Dr Kumar High Pending
Meena Sugar Dr Priya Normal Completed

Reports
Create Lab Reports page.

Columns:

Patient
Test
Result
Report
Status

Buttons:

Generate Report
Approve Report
Print Report
Download Report

5. PHARMACY ROLE PROMPT
Create Pharmacy Dashboard.

Sidebar:

Dashboard
Prescription Queue
Dispense Medicines
Sales
Inventory
Expiry Alerts
Pharmacy Reports
Settings
Logout

Prescription Queue
Create Prescription Queue page.

Table:

Patient
Doctor
Medicine
Status

Example:

Ravi Dr Kumar Paracetamol Pending
Devi Dr Ahmed Amoxicillin Pending

Click opens dispensing screen.

Inventory
Create Pharmacy Inventory page.

Columns:

Medicine
Stock
Expiry
Supplier

Example:

Paracetamol 120 Aug 2026 Sun Pharma
Amoxicillin 80 Mar 2026 Cipla

6. BILLING ROLE PROMPT
Create Billing Dashboard.

Sidebar:

Dashboard
Generate Bill
Payments
Insurance
Billing Reports
Settings
Logout

Generate Bill
Create billing screen.

Sections:

Consultation Fee
Lab Charges
Medicine Charges
Ward Charges

Display total.

Payment options:

Cash
Card
UPI

7. ADMIN ROLE PROMPT
Create Admin Dashboard.

Sidebar:

Dashboard
Staff Management
Clinic Management
Revenue
Inventory
Analytics
System Settings
Logout

Admin Dashboard
Create admin dashboard cards.

Patients Today
Revenue Today
Occupied Beds
Available Beds

Example:

Patients Today 34
Revenue Today ₹18,500
Occupied Beds 6
Available Beds 4

Staff Management
Create staff management page.

Table:

Name
Role
Department
Status

Buttons:

Add Staff
Edit Staff
Delete Staff

FINAL CURSOR PROMPT (BEST)
If you want Cursor to generate everything automatically, run this:
Generate a complete role-based clinic management dashboard UI for a 10-bed clinic.

Roles:

Reception
Doctor
Nurse
Lab Technician
Pharmacy
Billing
Admin

Each role must include:

Dashboard
Sidebar navigation
Tables
Forms
Cards
Alerts

Use modern medical UI design with TailwindCSS and ShadCN components.

Ensure each sidebar tab has its own page with realistic mock data and components.
