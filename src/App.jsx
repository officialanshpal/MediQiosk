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
import { getTranslation } from './utils/translations';
import { Check, FileText, HeartPulse, ShieldCheck } from 'lucide-react';

const AppContent = () => {
  const {
    currentScreen,
    setCurrentScreen,
    selectedLanguage,
    isAyush,
    setIsAyush,
    resetSession,
    getStepIndex,
    interviewTurns,
    scannedDocs
  } = useKiosk();

  const isKioskFlow = ['language', 'identify', 'consent', 'converse', 'scan', 'confirm'].includes(currentScreen);
  const stepIndex = getStepIndex();
  const t = (key) => getTranslation(selectedLanguage, key);
  const steps = [
    { screen: 'language', label: t('stepLanguage') },
    { screen: 'identify', label: t('stepIdentify') },
    { screen: 'consent', label: t('stepConsent') },
    { screen: 'converse', label: t('stepConverse') },
    { screen: 'scan', label: t('stepScan') },
    { screen: 'confirm', label: t('stepConfirm') }
  ];

  const screenContent = (
    <>
      {currentScreen === 'language' && <LanguageSelect />}
      {currentScreen === 'identify' && <IdentifyPatient />}
      {currentScreen === 'consent' && <AudioConsent />}
      {currentScreen === 'converse' && <SOCRATESConverse />}
      {currentScreen === 'scan' && <DocumentScan />}
      {currentScreen === 'confirm' && <ConfirmSummary />}
      {currentScreen === 'doctor' && <DoctorView />}
      {currentScreen === 'staff' && <StaffDashboard />}
    </>
  );

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

      {isKioskFlow && <StepProgress currentStepIndex={stepIndex} />}

      <main className="flex-1 pb-10">
        {isKioskFlow ? (
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
            <section className="min-w-0">{screenContent}</section>

            <aside className="hidden flex-col gap-5 lg:flex" aria-label={t('visitOverview')}>
              <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-sky-800 p-6 text-white shadow-xl shadow-blue-950/15">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <HeartPulse className="h-6 w-6 text-sky-300" />
                  </div>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200">
                    {t('visitSecure')}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">{t('visitOverview')}</p>
                <h2 className="mt-2 text-2xl font-bold">{steps[stepIndex]?.label}</h2>
                <p className="mt-1 text-sm text-blue-100/75">
                  {t('stepCount')} {stepIndex + 1} / {steps.length}
                </p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">{t('visitProgress')}</h3>
                <ol className="space-y-3">
                  {steps.map((step, index) => {
                    const isComplete = index < stepIndex;
                    const isCurrent = index === stepIndex;

                    return (
                      <li key={step.screen} className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                            isComplete
                              ? 'bg-emerald-100 text-emerald-700'
                              : isCurrent
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isComplete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </span>
                        <span className={`text-sm ${isCurrent ? 'font-bold text-sky-800' : isComplete ? 'font-medium text-slate-600' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                  <HeartPulse className="mb-3 h-5 w-5 text-sky-600" />
                  <p className="text-2xl font-bold text-slate-900">{interviewTurns.length}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{t('visitAnswers')}</p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                  <FileText className="mb-3 h-5 w-5 text-violet-600" />
                  <p className="text-2xl font-bold text-slate-900">{scannedDocs.length}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{t('visitRecords')}</p>
                </div>
              </div>

              <section className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-relaxed text-emerald-800">{t('visitPrivacyNote')}</p>
              </section>
            </aside>
          </div>
        ) : (
          screenContent
        )}
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
