import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { getTranslation } from '../../utils/translations';
import { Stethoscope, ShieldCheck, UserCog, Sparkles, RefreshCw } from 'lucide-react';

export const KioskHeader = ({ currentScreen, onReset, onNavigateDoctor, onNavigateStaff, isAyush, onToggleAyush }) => {
  const { selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  return (
    <header className="bg-slate-950/90 border-b border-slate-800 p-4 md:px-8 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-md">
      {/* Brand Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Stethoscope className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-2">
            {t('appTitle')} <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">{t('opdSubtitle')}</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t('appDesc')}</p>
        </div>
      </div>

      {/* Center Navigation Shortcuts / AYUSH Switch */}
      <div className="flex items-center gap-3">
        {/* AYUSH Mode Toggle */}
        <button
          onClick={onToggleAyush}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
            isAyush
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{isAyush ? t('ayushActive') : t('switchAyush')}</span>
        </button>

        {/* Doctor Portal Button */}
        <button
          onClick={onNavigateDoctor}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
            currentScreen === 'doctor'
              ? 'bg-blue-600 text-white border-blue-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <UserCog className="w-4 h-4 text-blue-400" />
          <span>{t('doctorEhr')}</span>
        </button>

        {/* Staff Dashboard Button */}
        <button
          onClick={onNavigateStaff}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border transition-all ${
            currentScreen === 'staff'
              ? 'bg-amber-600 text-white border-amber-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{t('staffDashboard')}</span>
        </button>

        {/* Reset Session */}
        <button
          onClick={onReset}
          title={t('resetSession')}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
