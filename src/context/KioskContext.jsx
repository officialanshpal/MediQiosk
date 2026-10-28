import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { stopSpeech } from '../utils/speechUtils';

const KioskContext = createContext();
const STORAGE_KEY = 'mediQiosk_session_state';
const DEFAULT_CONSENT_FLAGS = { shareVoice: false, shareDocs: false, linkAbha: false };

const getStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to restore kiosk state', error);
    return null;
  }
};

export const KioskProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isAyush, setIsAyush] = useState(false);
  const [patientSession, setPatientSession] = useState(null);
  const [consentFlags, setConsentFlags] = useState(DEFAULT_CONSENT_FLAGS);
  const [interviewTurns, setInterviewTurns] = useState([]);
  const [scannedDocs, setScannedDocs] = useState([]);
  const [redFlagAlert, setRedFlagAlert] = useState(null);
  const [structuredSummary, setStructuredSummary] = useState(null);

  useEffect(() => {
    const storedState = getStoredState();
    if (!storedState) return;

    if (storedState.selectedLanguage) setSelectedLanguage(storedState.selectedLanguage);
    if (storedState.isAyush !== undefined) setIsAyush(Boolean(storedState.isAyush));
    if (storedState.currentScreen) setCurrentScreen(storedState.currentScreen);
    if (storedState.patientSession) setPatientSession(storedState.patientSession);
    if (storedState.consentFlags) setConsentFlags(storedState.consentFlags);
    if (storedState.interviewTurns) setInterviewTurns(storedState.interviewTurns);
    if (storedState.scannedDocs) setScannedDocs(storedState.scannedDocs);
    if (storedState.redFlagAlert) setRedFlagAlert(storedState.redFlagAlert);
    if (storedState.structuredSummary) setStructuredSummary(storedState.structuredSummary);

    if (storedState.patientSession?.sessionId) {
      api.setSessionId(storedState.patientSession.sessionId);
    }
  }, []);

  useEffect(() => {
    const payload = {
      currentScreen,
      selectedLanguage,
      isAyush,
      patientSession,
      consentFlags,
      interviewTurns,
      scannedDocs,
      redFlagAlert,
      structuredSummary
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [currentScreen, selectedLanguage, isAyush, patientSession, consentFlags, interviewTurns, scannedDocs, redFlagAlert, structuredSummary]);

  const screenOrder = ['language', 'identify', 'consent', 'converse', 'scan', 'confirm'];

  const getStepIndex = () => {
    return screenOrder.indexOf(currentScreen);
  };

  const nextStep = () => {
    stopSpeech();
    const idx = getStepIndex();
    if (idx >= 0 && idx < screenOrder.length - 1) {
      setCurrentScreen(screenOrder[idx + 1]);
    }
  };

  const prevStep = () => {
    stopSpeech();
    const idx = getStepIndex();
    if (idx > 0) {
      setCurrentScreen(screenOrder[idx - 1]);
    }
  };

  const navigateToScreen = (screenName) => {
    stopSpeech();
    setCurrentScreen(screenName);
  };

  const resetSession = () => {
    stopSpeech();
    api.setSessionId(null);
    setPatientSession(null);
    setConsentFlags(DEFAULT_CONSENT_FLAGS);
    setInterviewTurns([]);
    setScannedDocs([]);
    setRedFlagAlert(null);
    setStructuredSummary(null);
    setIsAyush(false);
    setCurrentScreen('language');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <KioskContext.Provider
      value={{
        currentScreen,
        setCurrentScreen: navigateToScreen,
        selectedLanguage,
        setSelectedLanguage,
        isAyush,
        setIsAyush,
        patientSession,
        setPatientSession,
        consentFlags,
        setConsentFlags,
        interviewTurns,
        setInterviewTurns,
        scannedDocs,
        setScannedDocs,
        redFlagAlert,
        setRedFlagAlert,
        structuredSummary,
        setStructuredSummary,
        getStepIndex,
        nextStep,
        prevStep,
        resetSession
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => useContext(KioskContext);
