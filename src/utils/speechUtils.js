/**
 * Web Speech API Utilities (SpeechSynthesis & SpeechRecognition)
 * Provides multi-dialect Indian language TTS & STT with 4-second silence auto-advance.
 */

/**
 * Maps language names/codes to standard BCP-47 language tags for Indian regional languages
 */
export const resolveLangTag = (lang) => {
  if (!lang) return 'hi-IN';
  const str = String(lang).toLowerCase();
  if (str.includes('hi') || str.includes('hindi') || str.includes('bhojpuri')) return 'hi-IN';
  if (str.includes('marathi') || str.includes('mr')) return 'mr-IN';
  if (str.includes('gujarati') || str.includes('gu')) return 'gu-IN';
  if (str.includes('bengali') || str.includes('bn')) return 'bn-IN';
  if (str.includes('tamil') || str.includes('ta')) return 'ta-IN';
  if (str.includes('telugu') || str.includes('te')) return 'te-IN';
  if (str.includes('kannada') || str.includes('kn')) return 'kn-IN';
  return 'en-IN';
};

/* [REAL & BROWSER NATIVE] Speech Synthesis (TTS) */
export const speakText = (text, lang = 'Hindi', onEndCallback = null) => {
  if (!('speechSynthesis' in window)) {
    console.warn('[TTS] Speech Synthesis not supported in this browser.');
    if (onEndCallback) onEndCallback();
    return null;
  }

  const speakWithPreparedVoices = () => {
    const langTag = resolveLangTag(lang);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = langTag;
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const availableVoices = window.speechSynthesis.getVoices();
    const directMatch = availableVoices.find(v => v.lang.toLowerCase() === langTag.toLowerCase());
    const fallbackMatch = availableVoices.find(v => v.lang.toLowerCase().startsWith(langTag.slice(0, 2).toLowerCase()));
    const defaultVoice = directMatch || fallbackMatch || availableVoices[0];

    if (defaultVoice) {
      utterance.voice = defaultVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = (e) => {
        console.warn('[TTS Error]', e);
        onEndCallback();
      };
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return utterance;
  };

  const availableVoices = window.speechSynthesis.getVoices();
  if (availableVoices.length === 0 && window.speechSynthesis.onvoiceschanged !== undefined) {
    const onVoicesReady = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
      speakWithPreparedVoices();
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesReady, { once: true });
    return null;
  }

  return speakWithPreparedVoices();
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/* [REAL & BROWSER NATIVE] Speech Recognition (STT) with 4-Second Silence Auto-Advance */
export const createSpeechRecognizer = (
  lang = 'Hindi',
  onResultCallback,
  onErrorCallback,
  onEndCallback,
  silenceTimeoutMs = 4000
) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('[STT] SpeechRecognition API not supported in this browser environment.');
    return null;
  }

  const langTag = resolveLangTag(lang);
  const recognizer = new SpeechRecognition();
  recognizer.continuous = true; // Continuous listening
  recognizer.interimResults = true;
  recognizer.lang = langTag;

  let accumulatedText = '';
  let silenceTimer = null;

  const resetSilenceTimer = () => {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    silenceTimer = setTimeout(() => {
      console.log(`[STT] ${silenceTimeoutMs / 1000}s silence detected in ${langTag}. Auto-submitting voice input...`);
      try {
        recognizer.stop();
      } catch (e) {}
      if (onResultCallback && accumulatedText.trim()) {
        onResultCallback(accumulatedText.trim(), true);
      }
      if (onEndCallback) {
        onEndCallback();
      }
    }, silenceTimeoutMs);
  };

  recognizer.onresult = (event) => {
    let interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        accumulatedText += ' ' + event.results[i][0].transcript;
      } else {
        interimText += event.results[i][0].transcript;
      }
    }

    const currentDisplay = (accumulatedText + ' ' + interimText).trim();
    if (onResultCallback) {
      onResultCallback(currentDisplay, false);
    }

    // Reset silence timer whenever patient speaks
    resetSilenceTimer();
  };

  recognizer.onerror = (event) => {
    console.warn('[STT Error]', event.error);
    if (silenceTimer) clearTimeout(silenceTimer);
    if (onErrorCallback) onErrorCallback(event.error);
  };

  recognizer.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (onEndCallback) onEndCallback();
  };

  recognizer.cancelSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
  };

  return recognizer;
};
