import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { getTranslation } from '../../utils/translations';
import { Globe, UserCheck, ShieldAlert, MessageSquare, Camera, CheckCircle } from 'lucide-react';

export const StepProgress = ({ currentStepIndex }) => {
  const { selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const steps = [
    { label: t('stepLanguage'), icon: <Globe className="w-5 h-5" /> },
    { label: t('stepIdentify'), icon: <UserCheck className="w-5 h-5" /> },
    { label: t('stepConsent'), icon: <ShieldAlert className="w-5 h-5" /> },
    { label: t('stepConverse'), icon: <MessageSquare className="w-5 h-5" /> },
    { label: t('stepScan'), icon: <Camera className="w-5 h-5" /> },
    { label: t('stepConfirm'), icon: <CheckCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 py-3 px-4 overflow-x-auto">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[600px] gap-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 font-extrabold scale-110'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold tracking-wide ${
                    isCurrent ? 'text-blue-400 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    idx < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
