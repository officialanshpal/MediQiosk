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
    <div className="min-h-screen flex flex-col app-shell text-slate-800">
      <KioskHeader
        currentScreen={currentScreen}
        onReset={resetSession}
        onNavigateDoctor={() => setCurrentScreen('doctor')}
        onNavigateStaff={() => setCurrentScreen('staff')}
        isAyush={isAyush}
        onToggleAyush={() => setIsAyush(!isAyush)}
      />

      {isKioskFlow && <StepProgress currentStepIndex={getStepIndex()} />}

      <main className="flex-1 pb-10">
        {currentScreen === 'language' && <LanguageSelect />}
        {currentScreen === 'identify' && <IdentifyPatient />}
        {currentScreen === 'consent' && <AudioConsent />}
        {currentScreen === 'converse' && <SOCRATESConverse />}
        {currentScreen === 'scan' && <DocumentScan />}
        {currentScreen === 'confirm' && <ConfirmSummary />}
        {currentScreen === 'doctor' && <DoctorView />}
        {currentScreen === 'staff' && <StaffDashboard />}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3">
          <span>MediQiosk</span>
          <span className="hidden sm:inline">•</span>
          <span>OPD record intake</span>
          <span className="hidden sm:inline">•</span>
          <span>Multilingual care workflow</span>
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
