import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonChip } from '../common/CommonChip';
import { CommonAlert } from '../common/CommonAlert';
import { speakText, stopSpeech, createSpeechRecognizer } from '../../utils/speechUtils';
import { checkRedFlags } from '../../utils/redFlagRules';
import { socratesQuestions } from '../../utils/socratesTree';
import { ayushQuestions } from '../../utils/ayushTree';
import { api } from '../../services/apiService';
import { translateWithBhashini } from '../../utils/bhashiniUtils';
import { getTranslation } from '../../utils/translations';
import { Mic, MicOff, Volume2, ArrowRight, Sparkles, Globe, Clock } from 'lucide-react';

export const SOCRATESConverse = () => {
  const {
    patientSession,
    selectedLanguage,
    isAyush,
    interviewTurns,
    setInterviewTurns,
    redFlagAlert,
    setRedFlagAlert,
    nextStep
  } = useKiosk();

  const t = (key) => getTranslation(selectedLanguage, key);

  // Selected chief complaint
  const savedComplaint = interviewTurns.find(turn => turn.questionId === 'q_complaint');
  const [selectedComplaint, setSelectedComplaint] = useState(
    savedComplaint?.structuredAnswer || savedComplaint?.rawTranscript || null
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [recognizer, setRecognizer] = useState(null);
  const [bhashiniTranslation, setBhashiniTranslation] = useState(null);

  // Active question set
  const complaintOptions = isAyush
    ? ayushQuestions.chiefComplaints
    : ['Fever', 'Chest pain', 'Cough', 'Stomach ache', 'Headache', 'Other'];

  const questionSet = isAyush
    ? ayushQuestions.questions
    : selectedComplaint ? (socratesQuestions[selectedComplaint] || socratesQuestions.Other) : [];

  const currentQuestion = selectedComplaint ? questionSet[currentQuestionIdx] : null;

  // Read question prompt aloud whenever question changes in selected language
  useEffect(() => {
    if (!selectedComplaint) {
      const initPrompt = selectedLanguage === 'Hindi'
        ? 'आज आपको क्या तकलीफ परेशान कर रही है? कृपया बोलें या लक्षण चुनें।'
        : 'What is bothering you today? Please speak or tap a symptom chip.';
      speakText(initPrompt, selectedLanguage);
    } else if (currentQuestion) {
      const qPrompt = selectedLanguage === 'Hindi' && currentQuestion.hindiText
        ? currentQuestion.hindiText
        : currentQuestion.questionText;
      speakText(qPrompt, selectedLanguage);
    }
  }, [selectedComplaint, currentQuestionIdx, selectedLanguage]);

  // Setup Web Speech Recognition with 4-Second Silence Auto-Advance
  const startVoiceInput = () => {
    stopSpeech();
    setIsListening(true);
    setLiveTranscript(t('listeningStatus'));

    const rec = createSpeechRecognizer(
      selectedLanguage,
      (transcript, isFinal) => {
        setLiveTranscript(transcript);
        if (isFinal && transcript.trim()) {
          console.log('[SOCRATES] Auto-submitting speech after 4s silence:', transcript);
          setIsListening(false);
          handleAnswerReceived(transcript, 'voice');
        }
      },
      (err) => {
        setIsListening(false);
        setLiveTranscript(`[Voice Error: ${err}] - Tap options below.`);
      },
      () => {
        setIsListening(false);
      },
      4000 // 4-Second Silence Timeout
    );

    if (rec) {
      setRecognizer(rec);
      try {
        rec.start();
      } catch (e) {
        console.warn('Speech recognition start error', e);
      }
    } else {
      setIsListening(false);
      setLiveTranscript('Speech recognition unavailable on this device. Please tap options.');
    }
  };

  const stopVoiceInput = () => {
    if (recognizer) {
      recognizer.cancelSilenceTimer();
      try {
        recognizer.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleSelectComplaint = (complaint) => {
    stopSpeech();
    setSelectedComplaint(complaint);
    setCurrentQuestionIdx(0);
    recordTurn('q_complaint', t('whatBothering'), 'touch', complaint, complaint);
  };

  const handleSelectOption = (option) => {
    stopSpeech();
    if (!currentQuestion) return;
    handleAnswerReceived(option, 'touch');
  };

  const recordTurn = async (questionId, questionText, inputMode, rawTranscript, structuredAnswer) => {
    const newTurn = {
      sessionId: patientSession?.sessionId || 'SESS-PAT-1001',
      questionId,
      questionText,
      inputMode,
      rawTranscript,
      structuredAnswer,
      timestamp: new Date().toISOString()
    };

    const existingTurnIndex = interviewTurns.findIndex(turn => turn.questionId === questionId);
    const nextTurns = existingTurnIndex === -1
      ? [...interviewTurns, newTurn]
      : interviewTurns.map((turn, index) => index === existingTurnIndex ? newTurn : turn);
    setInterviewTurns(nextTurns);

    if (patientSession?.sessionId) {
      try {
        await api.post('/triage/turn', newTurn);
      } catch (err) {
        console.error('Failed to post turn to server', err);
      }
    }

    return nextTurns;
  };

  const handleAnswerReceived = async (answerText, mode = 'touch') => {
    const qId = currentQuestion ? currentQuestion.id : 'q_complaint';
    const qText = currentQuestion ? currentQuestion.questionText : t('whatBothering');

    let translatedClinical = answerText;
    try {
      const bhashiniRes = await translateWithBhashini(answerText, selectedLanguage === 'Hindi' ? 'hi' : 'en', 'en');
      if (bhashiniRes && bhashiniRes.translatedText) {
        translatedClinical = bhashiniRes.translatedText;
        setBhashiniTranslation(bhashiniRes);
      }
    } catch (e) {
      console.warn('Bhashini translate error', e);
    }

    const nextTurns = await recordTurn(qId, qText, mode, answerText, translatedClinical);
    const redFlagResult = checkRedFlags(selectedComplaint || answerText, nextTurns);

    if (redFlagResult.isRedFlag) {
      setRedFlagAlert(redFlagResult);
    } else {
      setRedFlagAlert(null);
    }

    if (currentQuestionIdx < questionSet.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      speakText(selectedLanguage === 'Hindi' ? 'धन्यवाद! आपका चिकित्सीय इतिहास दर्ज कर लिया गया है।' : 'Thank you! Clinical history recorded.', selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');
      nextStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={isAyush ? t('converseAyushTitle') : t('converseTitle')}
        subtitle={isAyush ? t('converseAyushSubtitle') : t('converseSubtitle')}
        headerAction={isAyush ? <Sparkles className="w-10 h-10 text-emerald-400" /> : <Mic className="w-10 h-10 text-blue-400" />}
      >
        {/* Urgent Red Flag Alert Banner */}
        {redFlagAlert?.isRedFlag && (
          <div className="mb-6">
            <CommonAlert
              variant="danger"
              title={t('priorityAlertSent')}
            >
              {redFlagAlert.alertMessage}
            </CommonAlert>
          </div>
        )}

        {/* Phase 1: Chief Complaint Selection */}
        {!selectedComplaint ? (
          <div>
            <div className="bg-slate-900 border-2 border-blue-500/60 rounded-3xl p-6 text-center mb-8 shadow-inner">
              <h3 className="text-3xl font-extrabold text-white mb-2">
                {t('whatBothering')}
              </h3>
              <p className="text-slate-400 text-lg">{t('speakOrTap')}</p>

              {/* Voice Mic Button */}
              <div className="my-6 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`p-8 rounded-full shadow-2xl transition-all flex items-center justify-center transform active:scale-90 ${
                    isListening
                      ? 'bg-rose-600 ring-8 ring-rose-500/40 animate-pulse text-white'
                      : 'bg-blue-600 hover:bg-blue-500 ring-8 ring-blue-500/20 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-14 h-14" /> : <Mic className="w-14 h-14" />}
                </button>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{t('silenceNotice')}</span>
                </div>
              </div>

              {/* Live Transcript Box */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left min-h-[60px] mb-3">
                <span className="text-xs uppercase font-bold text-slate-500 block mb-1">{t('liveTranscriptLabel')}</span>
                <p className="text-lg font-mono text-emerald-400">
                  {liveTranscript || t('pressMicToRecord')}
                </p>
              </div>

              {/* Digital India Bhashini NMT Translation Live Box */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-blue-900/60 text-left flex items-start gap-3">
                <Globe className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">{t('bhashiniEngineLabel')}</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-bold">{t('bhashiniActive')}</span>
                  </div>
                  <p className="text-sm font-mono text-slate-300 mt-1">
                    {bhashiniTranslation
                      ? `Translated: "${bhashiniTranslation.translatedText}" (${bhashiniTranslation.provider})`
                      : 'Automatic dialect-to-clinical English translation ready.'}
                  </p>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-300 mb-4">{t('orSelectPreset')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complaintOptions.map((chip) => (
                <CommonChip
                  key={chip}
                  label={chip}
                  colorScheme={isAyush ? 'ayush' : 'blue'}
                  onClick={() => handleSelectComplaint(chip)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Phase 2: Follow-up SOCRATES Adaptive Questions */
          <div>
            {/* Header / Selected Complaint Tag */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6">
              <span className="text-slate-300 font-medium">{t('complaintSelected')}</span>
              <span className="text-2xl font-black text-blue-400 bg-blue-950 px-4 py-1.5 rounded-xl border border-blue-800">
                {selectedComplaint}
              </span>
            </div>

            {currentQuestion && (
              <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
                    {t('socratesQ')} {currentQuestionIdx + 1} of {questionSet.length}
                  </span>
                  <button
                    onClick={() => speakText(selectedLanguage === 'Hindi' && currentQuestion.hindiText ? currentQuestion.hindiText : currentQuestion.questionText, selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-400 border border-slate-700 flex items-center gap-1.5 text-sm font-bold"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>{t('repeatAudio')}</span>
                  </button>
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  {selectedLanguage === 'Hindi' && currentQuestion.hindiText ? currentQuestion.hindiText : currentQuestion.questionText}
                </h3>
                {selectedLanguage !== 'Hindi' && currentQuestion.hindiText && (
                  <p className="text-xl font-bold text-blue-300 mb-6">{currentQuestion.hindiText}</p>
                )}

                {/* Voice Mic Button */}
                <div className="flex flex-col gap-3 my-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={isListening ? stopVoiceInput : startVoiceInput}
                      className={`p-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      <span>{isListening ? t('stopListening') : t('answerByVoice')}</span>
                    </button>

                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{t('silenceNotice')}</span>
                    </div>
                  </div>

                  <div className="text-sm text-emerald-400 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 truncate">
                    {liveTranscript || t('listeningStatus')}
                  </div>
                </div>

                {/* Touch Options */}
                <h4 className="text-lg font-bold text-slate-400 mb-3">{t('orChooseAnswer')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className="p-5 rounded-2xl bg-slate-800 hover:bg-blue-900/60 hover:border-blue-500 border-2 border-slate-700 text-white font-bold text-xl text-left transition-all shadow-md flex items-center justify-between group"
                    >
                      <span>{opt}</span>
                      <ArrowRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Skip to Scan Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-lg border border-slate-700 flex items-center gap-2"
              >
                <span>{t('skipScanBtn')}</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </CommonCard>
    </div>
  );
};
