import { api } from '../services/apiService';

/**
 * Digital India Bhashini NMT & Speech Utility Helper
 */
export const translateWithBhashini = async (text, sourceLang = 'hi', targetLang = 'en') => {
  try {
    const res = await api.post('/bhashini/translate', {
      text,
      sourceLang,
      targetLang
    });
    return res;
  } catch (err) {
    console.warn('[BHASHINI TRANSLATION NOTICE]', err);
    return {
      translatedText: text,
      provider: 'local-fallback'
    };
  }
};
