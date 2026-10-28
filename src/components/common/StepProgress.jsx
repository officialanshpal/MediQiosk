import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { getTranslation } from '../../utils/translations';
import { ArrowLeft, Globe, UserCheck, ShieldAlert, MessageSquare, Camera, CheckCircle } from 'lucide-react';

export const StepProgress = ({ currentStepIndex }) => {
  const { selectedLanguage, prevStep, setCurrentScreen } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);
  const screenOrder = ['language', 'identify', 'consent', 'converse', 'scan', 'confirm'];

  const steps = [
    { label: t('stepLanguage'), icon: <Globe className="w-4 h-4" /> },
    { label: t('stepIdentify'), icon: <UserCheck className="w-4 h-4" /> },
    { label: t('stepConsent'), icon: <ShieldAlert className="w-4 h-4" /> },
    { label: t('stepConverse'), icon: <MessageSquare className="w-4 h-4" /> },
    { label: t('stepScan'), icon: <Camera className="w-4 h-4" /> },
    { label: t('stepConfirm'), icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStepIndex <= 0}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('backBtn')}
          </span>
        </button>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-[560px] items-center justify-between gap-2">
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const content = (
                <>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                      isCurrent
                        ? 'bg-sky-600 text-white border-sky-600'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-[11px] md:text-xs font-medium whitespace-nowrap ${
                      isCurrent ? 'text-sky-700' : isDone ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </>
              );

              return (
                <React.Fragment key={idx}>
                  {isDone ? (
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(screenOrder[idx])}
                      className="flex min-w-0 items-center gap-2 rounded-lg text-left hover:opacity-75 focus-visible:outline-sky-600"
                      title={`${step.label} - ${t('editStep')}`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="flex min-w-0 items-center gap-2">{content}</div>
                  )}

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-px flex-1 ${idx < currentStepIndex ? 'bg-emerald-300' : 'bg-slate-200'}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
