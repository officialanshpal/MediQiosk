import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { stopSpeech } from '../utils/speechUtils';

const KioskContext = createContext();

export const KioskProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('language');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isAyush, setIsAyush] = useState(false);
  const [patientSession, setPatientSession] = useState(null);
  const [interviewTurns, setInterviewTurns] = useState([]);
  const [scannedDocs, setScannedDocs] = useState([]);
  const [redFlagAlert, setRedFlagAlert] = useState(null);
  const [structuredSummary, setStructuredSummary] = useState(null);

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
    setInterviewTurns([]);
    setScannedDocs([]);
    setRedFlagAlert(null);
    setStructuredSummary(null);
    setIsAyush(false);
    setCurrentScreen('language');
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
