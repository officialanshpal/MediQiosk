import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { getTranslation } from '../../utils/translations';
import { Globe, UserCheck, ShieldAlert, MessageSquare, Camera, CheckCircle } from 'lucide-react';

export const StepProgress = ({ currentStepIndex }) => {
  const { selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 min-w-[560px]">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 min-w-0">
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
              </div>

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
  );
};
