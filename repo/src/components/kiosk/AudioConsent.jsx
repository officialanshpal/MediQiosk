import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonToggle } from '../common/CommonToggle';
import { speakText, stopSpeech } from '../../utils/speechUtils';
import { getTranslation } from '../../utils/translations';
import { api } from '../../services/apiService';
import { ShieldCheck, Volume2, CheckCircle, XCircle, Play, Square } from 'lucide-react';

export const AudioConsent = () => {
  const { patientSession, setPatientSession, nextStep, resetSession, selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const [toggles, setToggles] = useState({
    shareVoice: false,
    shareDocs: false,
    linkAbha: false
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    handlePlayAudio();
    return () => stopSpeech();
  }, []);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    const textToRead = t('consentScript');
    speakText(textToRead, selectedLanguage, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleStopAudio = () => {
    stopSpeech();
    setIsPlayingAudio(false);
  };

  const allTogglesChecked = toggles.shareVoice && toggles.shareDocs && toggles.linkAbha;

  const handleAgree = async () => {
    stopSpeech();
    if (!patientSession) return;
    try {
      const res = await api.post('/session/consent', {
        sessionId: patientSession.sessionId,
        consentFlags: toggles
      });
      setPatientSession(res.session);
      nextStep();
    } catch (err) {
      console.error(err);
      nextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={t('consentTitle')}
        subtitle={t('consentSubtitle')}
        headerAction={<ShieldCheck className="w-10 h-10 text-blue-400" />}
      >
        {/* Audio Narration Card */}
        <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 flex items-center justify-center text-blue-400 shrink-0">
              <Volume2 className={`w-8 h-8 ${isPlayingAudio ? 'animate-bounce text-blue-300' : ''}`} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{t('audioNarrationActive')}</h4>
              <p className="text-slate-300 text-sm md:text-base mt-0.5">
                {t('consentScript')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={isPlayingAudio ? handleStopAudio : handlePlayAudio}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 shrink-0 shadow-lg"
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>{t('pauseAudio')}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{t('playConsent')}</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Independent Required Toggles */}
        <div className="space-y-4 mb-8">
          <CommonToggle
            label={t('toggle1Label')}
            description={t('toggle1Desc')}
            checked={toggles.shareVoice}
            onChange={(val) => setToggles({ ...toggles, shareVoice: val })}
          />

          <CommonToggle
            label={t('toggle2Label')}
            description={t('toggle2Desc')}
            checked={toggles.shareDocs}
            onChange={(val) => setToggles({ ...toggles, shareDocs: val })}
          />

          <CommonToggle
            label={t('toggle3Label')}
            description={t('toggle3Desc')}
            checked={toggles.linkAbha}
            onChange={(val) => setToggles({ ...toggles, linkAbha: val })}
          />
        </div>

        {/* Action Buttons (I Agree vs Decline) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={resetSession}
            className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 kiosk-btn py-5 rounded-2xl font-bold text-xl transition-all"
          >
            <XCircle className="w-7 h-7" />
            <span>{t('declineBtn')}</span>
          </button>

          <button
            type="button"
            disabled={!allTogglesChecked}
            onClick={handleAgree}
            className={`w-full kiosk-btn py-5 rounded-2xl font-extrabold text-2xl transition-all shadow-xl ${
              allTogglesChecked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/50'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle className="w-8 h-8" />
            <span>{t('agreeBtn')}</span>
          </button>
        </div>

        {!allTogglesChecked && (
          <p className="text-center text-amber-400 text-sm font-semibold mt-4">
            {t('consentWarning')}
          </p>
        )}
      </CommonCard>
    </div>
  );
};
