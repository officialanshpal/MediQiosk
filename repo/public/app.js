// MediKiosk Client Application Logic

let currentStep = 1;
let patientQueue = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchDoctorQueue();
});

function switchView(mode) {
  const kiosk = document.getElementById('viewKiosk');
  const doctor = document.getElementById('viewDoctor');
  const btnKiosk = document.getElementById('btnKioskMode');
  const btnDoctor = document.getElementById('btnDoctorMode');

  if (mode === 'kiosk') {
    kiosk.classList.remove('hidden');
    doctor.classList.add('hidden');
    btnKiosk.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-teal-500 text-slate-950 shadow-md';
    btnDoctor.className = 'px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all duration-200';
  } else {
    kiosk.classList.add('hidden');
    doctor.classList.remove('hidden');
    btnDoctor.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-teal-500 text-slate-950 shadow-md';
    btnKiosk.className = 'px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all duration-200';
    fetchDoctorQueue();
  }
}

function changeStep(delta) {
  currentStep += delta;
  if (currentStep < 1) currentStep = 1;
  if (currentStep > 4) currentStep = 4;

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`step${i}Content`).classList.add('hidden');
    const nav = document.getElementById(`stepNav${i}`);
    nav.className = 'flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400';
  }

  document.getElementById(`step${currentStep}Content`).classList.remove('hidden');
  const activeNav = document.getElementById(`stepNav${currentStep}`);
  activeNav.className = 'flex items-center gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/40 text-teal-300';

  document.getElementById('btnPrev').disabled = (currentStep === 1);
  document.getElementById('btnNext').innerText = (currentStep === 4) ? 'Finish & Return' : 'Next Step →';
}

function simulateAbhaLogin(abhaId) {
  fetch('/api/auth/abha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ abhaId })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('patientInfoCard').classList.remove('hidden');
    document.getElementById('patientName').innerText = data.patient.name;
    document.getElementById('patientMeta').innerText = `ABHA: ${data.patient.abhaId} | Age: ${data.patient.age} | ${data.patient.gender} | Location: ${data.patient.location}`;
  })
  .catch(() => {
    // Local Fallback if server is not running
    document.getElementById('patientInfoCard').classList.remove('hidden');
    document.getElementById('patientMeta').innerText = `ABHA: ${abhaId} | Age: 52 | Male | Village: Chhapra, Bihar`;
  });
}

function toggleVoiceRecording() {
  const pulse = document.getElementById('micPulse');
  const status = document.getElementById('micStatusText');
  if (pulse.classList.contains('hidden')) {
    pulse.classList.remove('hidden');
    status.innerText = '🎙️ Listening to patient in Bhojpuri... Speak now!';
    status.className = 'text-xs font-medium text-teal-400 animate-pulse';
  } else {
    pulse.classList.add('hidden');
    status.innerText = '✓ Speech Captured & Translated to Clinical Terms';
    status.className = 'text-xs font-medium text-emerald-400';
  }
}

function simulateDocScan() {
  document.getElementById('scannedDocContainer').classList.remove('hidden');
}

function fetchDoctorQueue() {
  fetch('/api/doctor/patients')
    .then(res => res.json())
    .then(data => {
      if (data.success && data.queueList) {
        renderDoctorQueue(data.queueList);
      }
    })
    .catch(() => {
      // Fallback Data
      const defaultQueue = [
        { token: 'OPD-204', name: 'Rameshwar Mahto', symptom: 'Headache + Vertigo (3d)', status: 'ACTIVE', tier: 'YELLOW' },
        { token: 'OPD-205', name: 'Sunita Devi', symptom: 'Routine Diabetes Follow-up', status: 'WAITING', tier: 'GREEN' },
        { token: 'OPD-206', name: 'Amit Kumar', symptom: 'Acute Chest Discomfort', status: 'EMERGENCY', tier: 'RED' }
      ];
      renderDoctorQueue(defaultQueue);
    });
}

function renderDoctorQueue(list) {
  const container = document.getElementById('doctorQueueList');
  if (!container) return;
  container.innerHTML = '';

  list.forEach(p => {
    const isRed = p.triageTier && p.triageTier.includes('RED') || p.tier === 'RED';
    const isActive = p.status === 'ACTIVE';

    const card = document.createElement('div');
    card.className = `p-3 rounded-xl ${isActive ? 'bg-teal-950/40 border border-teal-500/50' : 'bg-slate-950 border border-slate-800'} flex items-center justify-between cursor-pointer`;
    
    card.innerHTML = `
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${isRed ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}"></span>
          <span class="text-xs font-bold text-slate-100">#${p.token} | ${p.name}</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-1">Symptom: ${p.translatedClinicalText || p.symptom || 'Triage Intake Completed'}</div>
      </div>
      <span class="text-[10px] font-bold ${isRed ? 'text-rose-400 bg-rose-500/20' : 'text-teal-300 bg-teal-500/20'} px-2 py-1 rounded">${isRed ? 'RED TIER' : p.status}</span>
    `;
    container.appendChild(card);
  });
}
