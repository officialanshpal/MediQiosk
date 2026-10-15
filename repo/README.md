# MediKiosk — AI-Powered Clinical History & Document Digitization Kiosk

> **Self-Service Multilingual Kiosk for Indian Hospital OPDs (SIH Prototype)**

MediKiosk allows patients, before seeing an OPD doctor, to record their medical history through an intuitive voice + touch interview and digitize old medical documents (prescriptions, lab reports). It produces a structured, physician-ready clinical summary, detects emergency red flags in real-time, supports both Allopathic and AYUSH clinical pathways, and demonstrates automatic post-consultation data privacy clearing.

---

## 🌟 Key Features

1. **7-Screen Kiosk Flow**:
   - **1. Language Select**: Icon-driven zero-literacy grid (Hindi, English, Bhojpuri, Marathi, etc.) with audio greetings.
   - **2. Identify**: Mock ABHA ID login (accepts any string or demo patient button) or New Patient registration + AYUSH mode toggle.
   - **3. Consent**: Audio-narrated consent screen with 3 mandatory independent toggles ("Share voice history", "Share documents", "Link to ABHA record"), enabled "I Agree", and visible "Decline".
   - **4. Converse**: SOCRATES adaptive interview with Web Speech API (TTS + STT), touch symptom chips, live transcript box, and background Emergency Red-Flag detection (e.g., chest pain + shortness of breath).
   - **5. Scan**: Camera capture & image upload with Tesseract.js OCR and regex extraction of medications (`500mg`, `1-0-1`) and lab values (`186 mg/dL`), document thumbnails, and chronological timeline.
   - **6. Confirm**: Spoken readback summary with Edit (returns to Converse) and Submit options.
   - **7. Doctor View**: Physician EHR view with patient snapshot, masked ABHA ID, AI confidence badge (High/Med/Low), structured clinical summary (Chief Complaint → HPI → Past → Drug/Allergy → Family → Personal → ROS → Investigations), document timeline, inline edit, and Accept button.

2. **Additional Functionalities**:
   - **Staff Dashboard (`/staff`)**: Real-time queue monitoring with urgent emergency red-flag alert header cards.
   - **AYUSH OPD Mode**: Toggle to switch clinical tree to Ayurvedic parameters (Prakriti, Vikriti, Agni, Koshtha, Ahara-Vihara).
   - **Session Clear Privacy Engine**: Automatically purges raw voice transcripts and scanned images after physician accepts summary.

---

## 🏗️ Layered Architecture & Code Patterns

- **Controller / Service / Repository Pattern**:
  - `server/controllers/`: `sessionController.js`, `triageController.js`, `ocrController.js`, `doctorController.js`, `staffController.js`
  - `server/services/`: `sessionService.js`, `triageService.js`, `ocrService.js`, `redFlagService.js`, `summaryService.js`, `schedulerService.js`
  - `server/repositories/`: `sessionRepository.js`, `interviewTurnRepository.js`, `documentRepository.js`, `redFlagRepository.js`, `summaryRepository.js`
- **Database & Data Access**: In-memory document store with indexing, meta tables (`sessionMeta`, `summaryMeta`), projection field filtering, and connection pooling simulation (`server/config/db.js`).
- **Background Task Scheduler**: Node cron task runner (`schedulerService.js`) auditing stale sessions and clearing old alert logs.
- **Common Reusable UI Components**: `CommonForm`, `CommonTable`, `CommonCard`, `CommonBadge`, `CommonAlert`, `CommonChip`, `CommonToggle`, `KioskHeader`, `StepProgress`.
- **API Interceptors & Auth Guards**: Client-side `apiService.js` and Server-side `authGuard.js`, `requestInterceptor.js`, and `errorFilter.js`.

---

## 🛠️ Tech Stack & Integration Matrix

| Component | Status | Implementation Details |
|---|---|---|
| **Web Speech API (TTS & STT)** | 🟢 **REAL** | Native browser `window.SpeechRecognition` & `SpeechSynthesisUtterance` |
| **Document OCR** | 🟢 **REAL** | `Tesseract.js` client-side worker engine |
| **Entity Parsing** | 🟢 **REAL** | Regex pattern matching for dosages (`500mg`, `1-0-1`) & lab values (`186 mg/dL`) |
| **Red Flag Engine** | 🟢 **REAL** | Rule-based evaluator for dangerous symptom combinations |
| **SOCRATES & AYUSH Trees** | 🟢 **REAL** | Adaptive branching question decision trees |
| **ABHA Login** | 🟡 **MOCKED** | Accepts any string / demo ID (Simulated API latency) |
| **HIS Push / FHIR Payload** | 🟡 **MOCKED** | Standard clinical JSON format mapping (Simulated server sync) |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Startup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Both Server and Vite Client**:
   ```bash
   npm run dev
   ```
   - Express Backend API running on `http://localhost:3000`
   - Vite React Kiosk running on `http://localhost:5173`

3. **Or Build & Serve Single Port**:
   ```bash
   npm run build
   npm start
   ```
   Access application at `http://localhost:3000`.

---

## 📱 Responsive Kiosk Navigation
- **Kiosk View**: Access root URL `http://localhost:5173`
- **Doctor EHR Portal**: Click "Doctor EHR View" in top bar
- **Staff Dashboard**: Click "Staff Dashboard" in top bar
- **AYUSH Toggle**: Click "Switch to AYUSH" in top bar
