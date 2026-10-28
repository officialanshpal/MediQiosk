import React, { useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { speakText } from '../../utils/speechUtils';
import { getTranslation } from '../../utils/translations';
import { Languages, Volume2, ArrowRight } from 'lucide-react';

const languages = [
  { name: 'Hindi', native: 'हिन्दी', icon: '🇮🇳', greeting: 'नमस्ते! अपनी भाषा चुनें' },
  { name: 'English', native: 'English', icon: '🌐', greeting: 'Welcome! Select your language' },
  { name: 'Bhojpuri', native: 'भोजपुरी', icon: '🌾', greeting: 'राउर स्वागत बा! आपन भाषा चुनीं' },
  { name: 'Marathi', native: 'मराठी', icon: '🚩', greeting: 'नमस्कार! तुमची भाषा निवडा' },
  { name: 'Gujarati', native: 'ગુજરાતી', icon: '🪔', greeting: 'નમસ્તે! તમારી ભાષા પસંદ કરો' },
  { name: 'Bengali', native: 'বাংলা', icon: '🌺', greeting: 'নমস্কার! আপনার ভাষা নির্বাচন করুন' },
  { name: 'Tamil', native: 'தமிழ்', icon: '🛕', greeting: 'வணக்கம்! உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்' },
  { name: 'Telugu', native: 'తెలుగు', icon: '🕉️', greeting: 'నమస్కారం! మీ భాషను ఎంచుకోండి' }
];

export const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage, nextStep } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  useEffect(() => {
    // Read welcome audio prompt on mount in selected language
    const welcomeMsg = selectedLanguage === 'Hindi' 
      ? 'मेडीकियोस्क में आपका स्वागत है। शुरू करने के लिए अपनी भाषा चुनें।' 
      : 'Welcome to MediQiosk. Please select your language to begin.';
    speakText(welcomeMsg, selectedLanguage);
  }, [selectedLanguage]);

  const handleSelectLanguage = (langObj) => {
    setSelectedLanguage(langObj.name);
    speakText(langObj.greeting, langObj.name);
  };

  return (
    <div className="w-full min-w-0 animate-fadeIn">
      <CommonCard
        title={t('langTitle')}
        subtitle={t('langSubtitle')}
        headerAction={<Languages />}
      >
        {/* Language Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.name;
            return (
              <button
                key={lang.name}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={`group relative min-h-[150px] rounded-2xl border p-5 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-sky-600 to-blue-700 border-sky-500 text-white shadow-lg shadow-blue-900/20 ring-2 ring-sky-200'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-sky-50/60 hover:shadow-md'
                }`}
              >
                <span className="mb-1 text-3xl transition-transform group-hover:scale-110">{lang.icon}</span>
                <span className="text-xl font-extrabold">{lang.native}</span>
                <span className={`text-xs font-semibold ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>{lang.name}</span>
                {isSelected && <Volume2 className="absolute right-3 top-3 h-4 w-4 text-sky-100" />}
              </button>
            );
          })}
        </div>

        {/* Selected Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm"><Volume2 className="h-5 w-5" /></span>
            <span className="text-sm font-semibold text-slate-600">
              {t('selectedLang')}: <span className="font-extrabold text-sky-800">{selectedLanguage}</span>
            </span>
          </div>
          <span className="rounded-full border border-sky-100 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-sky-800">Digital India · Bhashini AI</span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white kiosk-btn py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-blue-900/20 transition-all"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </CommonCard>
    </div>
  );
};
