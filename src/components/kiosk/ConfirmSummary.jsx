import React, { useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { speakText, stopSpeech } from '../../utils/speechUtils';
import { getTranslation } from '../../utils/translations';
import { api } from '../../services/apiService';
import { CheckCircle2, Edit3, Volume2 } from 'lucide-react';

export const ConfirmSummary = () => {
  const {
    patientSession,
    interviewTurns,
    scannedDocs,
    setCurrentScreen,
    setStructuredSummary,
    selectedLanguage
  } = useKiosk();

  const t = (key) => getTranslation(selectedLanguage, key);

  const chiefTurn = interviewTurns.find(t => t.questionId === 'q_complaint') || interviewTurns[0];
  const complaintText = chiefTurn ? (chiefTurn.structuredAnswer || chiefTurn.rawTranscript) : 'Fever & Headaches';

  const readbackScript = selectedLanguage === 'Hindi'
    ? `आपने हमें बताया: ${complaintText}। आपने ${interviewTurns.length} प्रश्नों के उत्तर दिए हैं और ${scannedDocs.length} दस्तावेज़ संलग्न किए हैं।`
    : `You told us: ${complaintText}. You have completed ${interviewTurns.length} interview questions and scanned ${scannedDocs.length} prior medical documents.`;

  useEffect(() => {
    speakText(readbackScript, selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');
    return () => stopSpeech();
  }, []);

  const handleSubmit = async () => {
    stopSpeech();
    if (patientSession?.sessionId) {
      try {
        const res = await api.get(`/doctor/summary/${patientSession.sessionId}`);
        setStructuredSummary(res.summary);
      } catch (err) {
        console.error(err);
      }
    }
    setCurrentScreen('doctor');
  };

  return (
    <div className="w-full min-w-0 animate-fadeIn">
      <CommonCard
        title={t('confirmTitle')}
        subtitle={t('confirmSubtitle')}
        headerAction={<CheckCircle2 className="w-10 h-10 text-emerald-400" />}
      >
        {/* Spoken Readback Card */}
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="w-7 h-7 text-emerald-400 animate-pulse" />
            <h4 className="text-xl font-bold text-white">{t('readbackTitle')}</h4>
          </div>
          <p className="text-xl font-bold text-slate-200 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800">
            "{readbackScript}"
          </p>
        </div>

        {/* Patient Snapshot Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-medium">{t('patientNameLabel')}</span>
            <span className="text-xl font-extrabold text-white">{patientSession?.patientName || (selectedLanguage === 'Hindi' ? 'रामेश्वर महतो' : 'Rameshwar Mahto')}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-medium">{t('abhaRefLabel')}</span>
            <span className="text-lg font-mono font-bold text-blue-400">{patientSession?.abhaId || '91-8492-3849-1029'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-medium">{t('chiefComplaintLabel')}</span>
            <span className="text-xl font-bold text-amber-400">{complaintText}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">{t('attachedRecordsLabel')}</span>
            <span className="text-lg font-bold text-emerald-400">{scannedDocs.length} Scanned Files</span>
          </div>
        </div>

        {/* Edit vs Submit Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setCurrentScreen('converse')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 kiosk-btn py-5 rounded-2xl font-bold text-xl transition-all"
          >
            <Edit3 className="w-7 h-7" />
            <span>{t('editHistoryBtn')}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white kiosk-btn py-5 rounded-2xl font-extrabold text-2xl shadow-xl transition-all shadow-emerald-900/50"
          >
            <CheckCircle2 className="w-8 h-8" />
            <span>{t('submitDoctorBtn')}</span>
          </button>
        </div>
      </CommonCard>
    </div>
  );
};
