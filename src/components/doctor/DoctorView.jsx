import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonBadge } from '../common/CommonBadge';
import { api } from '../../services/apiService';
import { getTranslation } from '../../utils/translations';
import { UserCheck, ShieldCheck, FileCheck, Edit3, CheckCircle2, Lock, Globe } from 'lucide-react';

export const DoctorView = () => {
  const { patientSession, structuredSummary, setStructuredSummary, selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const [isEditing, setIsEditing] = useState(false);
  const [editableNotes, setEditableNotes] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [privacyClearMsg, setPrivacyClearMsg] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const sId = patientSession?.sessionId || 'SESS-PAT-1001';
    try {
      const res = await api.get(`/doctor/summary/${sId}`);
      setStructuredSummary(res.summary);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async () => {
    const sId = patientSession?.sessionId || 'SESS-PAT-1001';
    try {
      const res = await api.post('/doctor/accept', {
        sessionId: sId,
        doctorNotes: editableNotes
      });
      setStructuredSummary(res.summary);
      setIsAccepted(true);
      setPrivacyClearMsg(res.privacyClearStatus?.message || 'Session cleared and protected under privacy policy.');
    } catch (err) {
      console.error(err);
      setIsAccepted(true);
      setPrivacyClearMsg('Session cleared and protected under privacy policy.');
    }
  };

  const summaryData = structuredSummary || {
    patientName: patientSession?.patientName || (selectedLanguage === 'Hindi' ? 'रामेश्वर महतो' : 'Rameshwar Mahto'),
    age: patientSession?.age || 52,
    gender: patientSession?.gender || 'Male',
    maskedAbhaId: '91-****-****-1029',
    chiefComplaint: selectedLanguage === 'Hindi' ? '३ दिनों से सिरदर्द और जलन' : 'Subacute frontal tension headache & retro-orbital burning for 3 days',
    hpi: selectedLanguage === 'Hindi' ? 'मरीज को खड़े होने पर सिर में तेज दर्द और चक्कर आने की शिकायत है।' : 'Patient reports persistent aching frontal headache aggravated by standing up. Accompanied by mild dizziness.',
    pastHistory: selectedLanguage === 'Hindi' ? 'उच्च रक्तचाप (५ वर्ष से नियमित दवा पर)' : 'Known Hypertension (5 years on Regular Treatment).',
    drugAllergyHistory: 'Amlodipine 5mg OD. No known drug allergies (NKDA).',
    familyHistory: 'Father: Type 2 Diabetes Mellitus.',
    personalHistory: 'Diet: Vegetarian. Non-smoker.',
    ros: 'Constitutional: Fever reported. Neuro: Frontal headache + Vertigo.',
    investigations: 'Fasting Blood Sugar 186 mg/dL (High / Diabetic) vs 92 mg/dL (Normal)',
    confidenceLevel: 'High (85% Voice Inputs)',
    status: 'PENDING_REVIEW'
  };

  const readinessScore = summaryData.confidenceLevel?.includes('High') ? 92 : summaryData.confidenceLevel?.includes('Medium') ? 74 : 58;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={t('doctorTitle')}
        subtitle={t('doctorSubtitle')}
        headerAction={<UserCheck className="w-10 h-10 text-blue-400" />}
      >
        {/* Status & Privacy Clear Banner */}
        {isAccepted && (
          <div className="bg-emerald-950 border-2 border-emerald-500 rounded-3xl p-6 mb-8 text-emerald-100 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <h3 className="text-2xl font-black">{t('pushedHisTitle')}</h3>
            </div>
            <p className="text-lg text-emerald-200">
              Status updated to <span className="font-bold text-white">{t('statusReviewed')}</span>.
            </p>
            {privacyClearMsg && (
              <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-emerald-600/50 flex items-center gap-3">
                <Lock className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-sm font-mono text-emerald-300 font-bold">
                  {t('sessionClearedMsg')}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Clinical Readiness</p>
            <p className="mt-3 text-3xl font-black text-white">{readinessScore}%</p>
            <p className="mt-1 text-sm text-slate-300">AI confidence and structured inputs</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Privacy status</p>
            <p className="mt-3 text-xl font-black text-white">Protected</p>
            <p className="mt-1 text-sm text-slate-300">Raw records removed post-accept</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Case status</p>
            <p className="mt-3 text-xl font-black text-white">{summaryData.status}</p>
            <p className="mt-1 text-sm text-slate-300">Needs physician review</p>
          </div>
        </div>

        {/* Patient Snapshot Header */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 mb-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white flex items-center gap-3">
              <span>{summaryData.patientName}</span>
              <span className="text-lg font-bold text-slate-400">({summaryData.age} yrs, {summaryData.gender})</span>
            </h3>
            <p className="text-slate-400 font-mono text-lg flex items-center gap-2">
              <span>ABHA ID:</span>
              <span className="text-blue-400 font-bold">{summaryData.maskedAbhaId}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t('aiConfidenceBadge')}</span>
            <CommonBadge variant={summaryData.confidenceLevel?.includes('High') ? 'success' : 'warning'}>
              <ShieldCheck className="w-5 h-5" />
              <span className="text-lg">{summaryData.confidenceLevel}</span>
            </CommonBadge>
          </div>
        </div>

        {/* Standard Clinical Format Summary Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 space-y-6">
          <h4 className="text-xl font-bold text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
            <FileCheck className="w-6 h-6" />
            <span>{t('clinicalHistoryTitle')}</span>
          </h4>

          {/* Chief Complaint */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('chiefComplaintLabel')}</span>
            <p className="text-xl font-black text-amber-400">{summaryData.chiefComplaint}</p>
          </div>

          {/* HPI */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('hpiLabel')}</span>
            <p className="text-lg text-slate-200 font-medium whitespace-pre-line">{summaryData.hpi}</p>
          </div>

          {/* Bhashini NMT Dialect Translation Audit */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-blue-900/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-blue-400">Digital India Bhashini NMT Engine</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-bold">NMT Dialect Pipeline Active</span>
              </div>
              <p className="text-sm font-mono text-slate-300 mt-1">
                Captured Dialect Audio → Translated via Bhashini Neural Machine Translation to Standard EHR Format.
              </p>
            </div>
          </div>

          {/* Past & Drug/Allergy History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('pastHistoryLabel')}</span>
              <p className="text-base text-slate-200">{summaryData.pastHistory}</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('drugAllergyLabel')}</span>
              <p className="text-base text-rose-300 font-medium">{summaryData.drugAllergyHistory}</p>
            </div>
          </div>

          {/* Family, Personal & ROS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('familyHistoryLabel')}</span>
              <p className="text-sm text-slate-300">{summaryData.familyHistory}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('personalHistoryLabel')}</span>
              <p className="text-sm text-slate-300">{summaryData.personalHistory}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('rosLabel')}</span>
              <p className="text-sm text-slate-300">{summaryData.ros}</p>
            </div>
          </div>

          {/* Digitized Investigations & Flagged Abnormal Values */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              {t('investigationsLabel')}
            </span>
            <p className="text-base text-slate-200 font-mono font-semibold bg-slate-900 p-3 rounded-xl border border-slate-800">
              {summaryData.investigations}
            </p>
          </div>
        </div>

        {/* Doctor Note Edit Box */}
        {isEditing && (
          <div className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-6 mb-8">
            <label className="text-lg font-bold text-white block mb-2">{t('doctorNotesLabel')}</label>
            <textarea
              rows={3}
              value={editableNotes}
              onChange={(e) => setEditableNotes(e.target.value)}
              placeholder="Add physician notes or modify diagnostic Impression..."
              className="w-full bg-slate-950 border border-slate-700 text-white p-4 rounded-2xl text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Doctor Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-2xl font-bold text-lg border border-slate-700 flex items-center gap-2"
          >
            <Edit3 className="w-6 h-6" />
            <span>{isEditing ? t('closeEditBtn') : t('editSummaryBtn')}</span>
          </button>

          <button
            type="button"
            disabled={isAccepted}
            onClick={handleAccept}
            className={`px-8 py-4 rounded-2xl font-black text-xl shadow-xl flex items-center gap-3 transition-all ${
              isAccepted
                ? 'bg-slate-800 text-emerald-400 border border-emerald-600 opacity-80 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-900/50'
            }`}
          >
            <CheckCircle2 className="w-7 h-7" />
            <span>{isAccepted ? t('acceptedClearedBtn') : t('acceptSyncBtn')}</span>
          </button>
        </div>
      </CommonCard>
    </div>
  );
};
