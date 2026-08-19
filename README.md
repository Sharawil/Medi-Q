# Medi-Q - Simple Patient Pre-consultation and Queue Management System

## Overview
Medi-Q is a simple patient pre-consultation and doctor queue management system designed to reduce doctor waiting time by collecting only essential information before consultation and generating a queue token for doctors to call patients.

## Features
- **Patient Flow**:
  1. Simple landing page with "Start Check-in" and "Doctor Login" buttons
  2. Collect only: Name, Age, Blood Group (optional: Phone Number)
  3. Generate queue token (format: P-01, P-02, etc.)
  4. Select body part where experiencing problem
  5. Answer dynamic symptom questions based on selected body part
  6. Submit and see completion screen with token

- **Doctor Flow**:
  1. Login to access dashboard
  2. View queue list showing token number, patient name, and brief symptom info
  3. Click a token to see detailed patient information and symptom answers
  4. Treat patients in token order (first come, first served)

## Technology Stack
- **Frontend**: React 18+ with TypeScript, Tailwind CSS
- **Backend**: Node.js 18+ with Express.js
- **Database**: MongoDB with Mongoose ODM

## Getting Started
1. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

2. Set up environment variables:
   - Backend: Create `.env` file with `MONGODB_URI` and `JWT_SECRET`
   - Frontend: Create `.env` file with `VITE_API_BASE_URL=http://localhost:5000/api`

3. Start the application:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - Register user (doctor/nurse/admin)
- `POST /api/auth/login` - Login user
- `POST /api/patients` - Create patient profile
- `POST /api/symptoms` - Submit symptom data and generate queue token
- `GET /api/queue` - Get all queue tokens (for dashboard)
- `GET /api/dashboard/doctor` - Get doctor dashboard data
- `GET /api/dashboard/reception` - Get reception dashboard data

## Implementation Notes
This implementation follows the simplified MVP vision:
- Only essential patient information is collected
- Queue token is the main identifier for patients
- Doctor sees queue list and can view patient details by clicking token
- Patients are served in first-come, first-served order
- No patient login/accounts - check-in is anonymous per visit
- Symptom questions dynamically adjust based on selected body part
- No diagnosis attempted - only information collection for doctor reference