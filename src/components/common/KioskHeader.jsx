import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { getTranslation } from '../../utils/translations';
import { Stethoscope, ShieldCheck, UserCog, Sparkles, RefreshCw } from 'lucide-react';

export const KioskHeader = ({ currentScreen, onReset, onNavigateDoctor, onNavigateStaff, isAyush, onToggleAyush }) => {
  const { selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  return (
    <header className="border-b border-slate-200 bg-white/90 p-4 md:px-8 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              {t('appTitle')}
              <span className="text-[10px] bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full uppercase">{t('opdSubtitle')}</span>
            </h1>
            <p className="text-xs text-slate-500">{t('appDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleAyush}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border ${
              isAyush
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAyush ? t('ayushActive') : t('switchAyush')}</span>
          </button>

          <button
            onClick={onNavigateDoctor}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border ${
              currentScreen === 'doctor'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>{t('doctorEhr')}</span>
          </button>

          <button
            onClick={onNavigateStaff}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border ${
              currentScreen === 'staff'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('staffDashboard')}</span>
          </button>

          <button
            onClick={onReset}
            title={t('resetSession')}
            className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
