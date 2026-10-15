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
      : 'Welcome to MediKiosk. Please select your language to begin.';
    speakText(welcomeMsg, selectedLanguage);
  }, [selectedLanguage]);

  const handleSelectLanguage = (langObj) => {
    setSelectedLanguage(langObj.name);
    speakText(langObj.greeting, langObj.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={t('langTitle')}
        subtitle={t('langSubtitle')}
        headerAction={<Languages className="w-10 h-10 text-blue-400" />}
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
                className={`p-6 rounded-3xl border-3 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                  isSelected
                    ? 'bg-blue-600 border-blue-300 text-white ring-8 ring-blue-500/30 scale-105 shadow-blue-900/60'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500'
                }`}
              >
                <span className="text-4xl">{lang.icon}</span>
                <span className="text-2xl font-black">{lang.native}</span>
                <span className="text-sm font-semibold opacity-80">{lang.name}</span>
                {isSelected && <Volume2 className="w-6 h-6 text-white animate-bounce mt-1" />}
              </button>
            );
          })}
        </div>

        {/* Selected Banner */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold text-slate-200">
              {t('selectedLang')}: <span className="text-blue-400 font-extrabold">{selectedLanguage}</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Digital India Bhashini AI Enabled</span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white kiosk-btn py-6 rounded-3xl font-extrabold text-2xl shadow-2xl transition-all"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </CommonCard>
    </div>
  );
};
