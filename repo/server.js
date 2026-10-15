const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database for Active Patients & Queue
let patientDatabase = [
  {
    id: 'PAT-1001',
    token: 'OPD-204',
    name: 'Rameshwar Mahto',
    age: 52,
    gender: 'Male',
    location: 'Chhapra, Bihar',
    abhaId: '91-8492-3849-1029',
    dialect: 'Bhojpuri',
    rawAudioText: '3 din se sar me meethi meethi dard baa, aankhi ke peeche jalan hot baa aur chakkar aavat baa.',
    translatedClinicalText: 'Subacute frontal tension headache (Duration: 3 days) with retro-orbital burning sensation & transient vertigo.',
    symptomsList: ['Frontal Tension Headache', 'Retro-Orbital Burning', 'Vertigo on Standing'],
    stressLevel: 'Moderate (Speech Anxiety Detected)',
    confidenceScore: 94,
    status: 'ACTIVE',
    severityScore: 7.2,
    triageTier: 'YELLOW TIER (Priority OPD)',
    roomNumber: 'Room 12 (Dr. S. Sharma)',
    estimatedWait: '14 Mins',
    scannedDocs: [
      { hospital: 'Apollo Diagnostics', date: '15 days ago', test: 'Fasting Blood Sugar', value: '186 mg/dL', status: 'High / Diabetic' },
      { hospital: 'City Hospital', date: '3 days ago', test: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Normal' }
    ],
    conflictAlert: 'Contradictory Glycemic readings detected between Apollo Lab (186 mg/dL) and City Hospital (92 mg/dL) within 12 days.',
    pastVisits: ['June 2025: Retro-orbital pain reported', 'August 2025: Tension headache + Elevated BP']
  },
  {
    id: 'PAT-1002',
    token: 'OPD-205',
    name: 'Sunita Devi',
    age: 44,
    gender: 'Female',
    location: 'Patna, Bihar',
    abhaId: '91-7731-9021-4412',
    dialect: 'Hindi',
    rawAudioText: 'Sugar ki dawai chal rahi hai, regular checkup ke liye aaye hain.',
    translatedClinicalText: 'Routine diabetic follow-up & prescription refill.',
    symptomsList: ['Diabetes Follow-up'],
    stressLevel: 'Normal',
    confidenceScore: 98,
    status: 'WAITING',
    severityScore: 3.5,
    triageTier: 'GREEN TIER (Standard OPD)',
    roomNumber: 'Room 12 (Dr. S. Sharma)',
    estimatedWait: '22 Mins',
    scannedDocs: [],
    conflictAlert: null,
    pastVisits: ['May 2025: Routine Checkup']
  },
  {
    id: 'PAT-1003',
    token: 'OPD-206',
    name: 'Amit Kumar',
    age: 38,
    gender: 'Male',
    location: 'Muzaffarpur, Bihar',
    abhaId: '91-4402-1192-8821',
    dialect: 'Hindi',
    rawAudioText: 'Chati me tej dard aur ghabstraction ho raha hai kal raat se.',
    translatedClinicalText: 'Acute retrosternal chest pain with dyspnea & anxiety. Rule out ACS.',
    symptomsList: ['Acute Chest Discomfort', 'Dyspnea'],
    stressLevel: 'High (Severe Distress)',
    confidenceScore: 96,
    status: 'EMERGENCY_WAITING',
    severityScore: 9.4,
    triageTier: 'RED TIER (Immediate Emergency)',
    roomNumber: 'Room 12 (Dr. S. Sharma)',
    estimatedWait: 'Immediate Triage',
    scannedDocs: [],
    conflictAlert: null,
    pastVisits: []
  }
];

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediKiosk Engine Server Operational', timestamp: new Date() });
});

// 2. ABHA Authentication Simulator
app.post('/api/auth/abha', (req, res) => {
  const { abhaId } = req.body;
  const patient = patientDatabase.find(p => p.abhaId === abhaId) || {
    id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    token: `OPD-${Math.floor(200 + Math.random() * 800)}`,
    name: 'New Registered Patient',
    age: 45,
    gender: 'Female',
    location: 'Ranchi, Jharkhand',
    abhaId: abhaId || '91-9988-7766-5544',
    confidenceScore: 90
  };
  res.json({ success: true, patient });
});

// 3. Empathy Voice Triage Endpoint
app.post('/api/triage/voice', (req, res) => {
  const { dialect, audioTranscript } = req.body;
  
  // Simulated NLP Dialect Translation Dictionary
  let clinicalTranslation = "Symptom captured and processed by MediKiosk AI Speech Engine.";
  let stress = "Normal";

  if (audioTranscript && audioTranscript.toLowerCase().includes('dard')) {
    clinicalTranslation = "Subacute frontal tension headache with associated hyperalgesia.";
    stress = "Moderate (Speech Tension Detected)";
  } else if (audioTranscript && (audioTranscript.toLowerCase().includes('chati') || audioTranscript.toLowerCase().includes('chest'))) {
    clinicalTranslation = "Acute retrosternal chest pain with respiratory distress. Priority Flagged.";
    stress = "High (Acute Distress)";
  }

  res.json({
    success: true,
    dialectReceived: dialect || 'Bhojpuri',
    rawTranscript: audioTranscript || 'Patient spoken input',
    clinicalTranslation,
    stressLevel: stress,
    empathyAction: 'Soft Audio Prompting & Slow Pace Enabled'
  });
});

// 4. Document OCR & Conflict Detector
app.post('/api/ocr/scan', (req, res) => {
  res.json({
    success: true,
    documentsProcessed: [
      { hospital: 'Apollo Diagnostics', date: '15 days ago', test: 'Fasting Blood Sugar', value: '186 mg/dL', status: 'High / Diabetic' },
      { hospital: 'City Hospital', date: '3 days ago', test: 'Fasting Blood Sugar', value: '92 mg/dL', status: 'Normal' }
    ],
    conflictFlag: {
      hasConflict: true,
      alertMessage: 'Contradictory Glycemic readings detected between Apollo Lab (186 mg/dL) and City Hospital (92 mg/dL) within 12 days.'
    }
  });
});

// 5. Generate Queue Token & Triage Severity Ticket
app.post('/api/queue/token', (req, res) => {
  const { patientId, symptoms } = req.body;
  const tokenNumber = `OPD-${Math.floor(200 + Math.random() * 100)}`;
  
  res.json({
    success: true,
    token: tokenNumber,
    severityScore: 7.2,
    triageTier: 'YELLOW TIER (Priority OPD)',
    roomNumber: 'Room 12 (General Medicine - Dr. S. Sharma)',
    estimatedWait: '14 Mins',
    timestamp: new Date().toLocaleTimeString()
  });
});

// 6. Doctor EHR Dashboard Data Fetch
app.get('/api/doctor/patients', (req, res) => {
  res.json({
    success: true,
    queueCount: patientDatabase.length,
    activePatient: patientDatabase[0],
    queueList: patientDatabase
  });
});

app.listen(PORT, () => {
  console.log(`MediKiosk SIH Backend Server running on http://localhost:${PORT}`);
});
