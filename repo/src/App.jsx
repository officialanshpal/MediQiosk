import React from 'react';
import { KioskProvider, useKiosk } from './context/KioskContext';
import { KioskHeader } from './components/common/KioskHeader';
import { StepProgress } from './components/common/StepProgress';
import { LanguageSelect } from './components/kiosk/LanguageSelect';
import { IdentifyPatient } from './components/kiosk/IdentifyPatient';
import { AudioConsent } from './components/kiosk/AudioConsent';
import { SOCRATESConverse } from './components/kiosk/SOCRATESConverse';
import { DocumentScan } from './components/kiosk/DocumentScan';
import { ConfirmSummary } from './components/kiosk/ConfirmSummary';
import { DoctorView } from './components/doctor/DoctorView';
import { StaffDashboard } from './components/staff/StaffDashboard';

const AppContent = () => {
  const {
    currentScreen,
    setCurrentScreen,
    isAyush,
    setIsAyush,
    resetSession,
    getStepIndex
  } = useKiosk();

  const isKioskFlow = ['language', 'identify', 'consent', 'converse', 'scan', 'confirm'].includes(currentScreen);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Kiosk Header */}
      <KioskHeader
        currentScreen={currentScreen}
        onReset={resetSession}
        onNavigateDoctor={() => setCurrentScreen('doctor')}
        onNavigateStaff={() => setCurrentScreen('staff')}
        isAyush={isAyush}
        onToggleAyush={() => setIsAyush(!isAyush)}
      />

      {/* Step Progress Bar for 6 Kiosk screens */}
      {isKioskFlow && <StepProgress currentStepIndex={getStepIndex()} />}

      {/* Main Screen Router Render */}
      <main className="flex-1 pb-16">
        {currentScreen === 'language' && <LanguageSelect />}
        {currentScreen === 'identify' && <IdentifyPatient />}
        {currentScreen === 'consent' && <AudioConsent />}
        {currentScreen === 'converse' && <SOCRATESConverse />}
        {currentScreen === 'scan' && <DocumentScan />}
        {currentScreen === 'confirm' && <ConfirmSummary />}
        {currentScreen === 'doctor' && <DoctorView />}
        {currentScreen === 'staff' && <StaffDashboard />}
      </main>

      {/* Footer Banner - Hackathon Mocked vs Real Legend */}
      <footer className="bg-slate-900/90 border-t border-slate-800 p-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong className="text-emerald-400">REAL:</strong> Web Speech API, Tesseract.js OCR, Regex Dosage Parser, SOCRATES/AYUSH Tree
          </span>
          <span>
            <strong className="text-amber-400">MOCKED:</strong> ABHA Auth Login, FHIR Payload, HIS System Push
          </span>
          <span className="font-mono text-slate-500">MediKiosk v2.0 OPD Kiosk</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <KioskProvider>
      <AppContent />
    </KioskProvider>
  );
}
