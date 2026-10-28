import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonToggle } from '../common/CommonToggle';
import { api } from '../../services/apiService';
import { speakText } from '../../utils/speechUtils';
import { getTranslation } from '../../utils/translations';
import { UserCheck, QrCode, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export const IdentifyPatient = () => {
  const { patientSession, setPatientSession, nextStep, isAyush, setIsAyush, selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const [activeTab, setActiveTab] = useState(patientSession?.abhaId ? 'abha' : 'register'); // 'abha' | 'register'
  const [abhaIdInput, setAbhaIdInput] = useState(patientSession?.abhaId || '91-8492-3849-1029');
  const [registerData, setRegisterData] = useState({
    patientName: patientSession?.patientName || (selectedLanguage === 'Hindi' ? 'रामेश्वर महतो' : 'Rameshwar Mahto'),
    age: String(patientSession?.age || 52),
    gender: patientSession?.gender || 'Male'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    speakText(
      selectedLanguage === 'Hindi'
        ? 'कृपया अपना आभा आईडी दर्ज करें या नए मरीज के रूप में पंजीकरण करें।'
        : 'Please enter your ABHA ID or register as a new patient.',
      selectedLanguage
    );
  }, [selectedLanguage]);

  const handleAbhaSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/abha', {
        abhaId: abhaIdInput,
        registrationData: { language: selectedLanguage, mode: isAyush ? 'ayush' : 'allopathic' }
      });
      if (res && res.session) {
        api.setSessionId(res.session.sessionId);
        setPatientSession(res.session);
      } else {
        const fallback = {
          sessionId: `SESS-${Date.now()}`,
          patientName: selectedLanguage === 'Hindi' ? 'रामेश्वर महतो' : 'Rameshwar Mahto',
          age: 52,
          gender: 'Male',
          abhaId: abhaIdInput || '91-8492-3849-1029',
          language: selectedLanguage,
          mode: isAyush ? 'ayush' : 'allopathic'
        };
        api.setSessionId(fallback.sessionId);
        setPatientSession(fallback);
      }
    } catch (err) {
      console.warn('ABHA Auth Notice:', err);
      const fallback = {
        sessionId: `SESS-${Date.now()}`,
        patientName: selectedLanguage === 'Hindi' ? 'रामेश्वर महतो' : 'Rameshwar Mahto',
        age: 52,
        gender: 'Male',
        abhaId: abhaIdInput || '91-8492-3849-1029',
        language: selectedLanguage,
        mode: isAyush ? 'ayush' : 'allopathic'
      };
      api.setSessionId(fallback.sessionId);
      setPatientSession(fallback);
    } finally {
      setIsLoading(false);
      nextStep();
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/abha', {
        abhaId: '',
        registrationData: {
          patientName: registerData.patientName,
          age: parseInt(registerData.age, 10),
          gender: registerData.gender,
          language: selectedLanguage,
          mode: isAyush ? 'ayush' : 'allopathic'
        }
      });
      if (res && res.session) {
        api.setSessionId(res.session.sessionId);
        setPatientSession(res.session);
      } else {
        const fallback = {
          sessionId: `SESS-${Date.now()}`,
          patientName: registerData.patientName,
          age: parseInt(registerData.age, 10),
          gender: registerData.gender,
          language: selectedLanguage,
          mode: isAyush ? 'ayush' : 'allopathic'
        };
        api.setSessionId(fallback.sessionId);
        setPatientSession(fallback);
      }
    } catch (err) {
      console.warn('Register Auth Notice:', err);
      const fallback = {
        sessionId: `SESS-${Date.now()}`,
        patientName: registerData.patientName,
        age: parseInt(registerData.age, 10),
        gender: registerData.gender,
        language: selectedLanguage,
        mode: isAyush ? 'ayush' : 'allopathic'
      };
      api.setSessionId(fallback.sessionId);
      setPatientSession(fallback);
    } finally {
      setIsLoading(false);
      nextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={t('identifyTitle')}
        subtitle={t('identifySubtitle')}
        headerAction={<UserCheck className="w-10 h-10 text-emerald-400" />}
      >
        {/* AYUSH OPD Toggle Banner */}
        <div className="mb-6">
          <CommonToggle
            label={t('ayushModeLabel')}
            description={t('ayushModeDesc')}
            checked={isAyush}
            onChange={(val) => setIsAyush(val)}
          />
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('abha')}
            className={`p-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 border-2 transition-all ${
              activeTab === 'abha'
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-6 h-6" />
            <span>{t('abhaTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`p-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 border-2 transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-6 h-6" />
            <span>{t('registerTab')}</span>
          </button>
        </div>

        {/* ABHA Login Form */}
        {activeTab === 'abha' ? (
          <form onSubmit={handleAbhaSubmit} className="space-y-6">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5">
              <label className="text-xl font-bold text-slate-200 block mb-3">
                {t('enterAbhaLabel')}
              </label>
              <input
                type="text"
                value={abhaIdInput}
                onChange={(e) => setAbhaIdInput(e.target.value)}
                placeholder="e.g. 91-8492-3849-1029"
                className="w-full bg-slate-950 border border-slate-700 text-white p-4 rounded-xl text-2xl font-mono tracking-widest focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAbhaIdInput('91-8492-3849-1029')}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl font-semibold text-sm border border-slate-700"
              >
                {t('demoPatient1')}
              </button>
              <button
                type="button"
                onClick={() => setAbhaIdInput('91-4402-1192-8821')}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl font-semibold text-sm border border-slate-700"
              >
                {t('demoPatient3')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white kiosk-btn py-5 rounded-2xl font-bold text-2xl shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <span>{t('verifyContinueBtn')}</span>
              <ArrowRight className="w-8 h-8" />
            </button>
          </form>
        ) : (
          /* New Patient Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="text-lg font-bold text-slate-200 block mb-2">{t('fullNameLabel')}</label>
              <input
                type="text"
                value={registerData.patientName}
                onChange={(e) => setRegisterData({ ...registerData, patientName: e.target.value })}
                className="w-full bg-slate-900 border-2 border-slate-700 text-white p-4 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-lg font-bold text-slate-200 block mb-2">{t('ageLabel')}</label>
                <input
                  type="number"
                  value={registerData.age}
                  onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                  className="w-full bg-slate-900 border-2 border-slate-700 text-white p-4 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-lg font-bold text-slate-200 block mb-2">{t('genderLabel')}</label>
                <select
                  value={registerData.gender}
                  onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                  className="w-full bg-slate-900 border-2 border-slate-700 text-white p-4 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="Male">{t('genderMale')}</option>
                  <option value="Female">{t('genderFemale')}</option>
                  <option value="Other">{t('genderOther')}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white kiosk-btn py-5 rounded-2xl font-bold text-2xl shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-8 h-8" />
              <span>{t('registerStartBtn')}</span>
            </button>
          </form>
        )}
      </CommonCard>
    </div>
  );
};
