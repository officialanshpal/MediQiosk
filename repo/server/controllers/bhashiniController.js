import { bhashiniService } from '../services/bhashiniService.js';

/* Controller handling Digital India Bhashini NMT, ASR, and TTS */
export const bhashiniController = {
  async translate(req, res, next) {
    try {
      const { text, sourceLang, targetLang } = req.body;
      const result = await bhashiniService.translateText(text, sourceLang || 'hi', targetLang || 'en');
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async asr(req, res, next) {
    try {
      const { audioBase64, language } = req.body;
      const result = await bhashiniService.speechToText(audioBase64, language || 'hi');
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async tts(req, res, next) {
    try {
      const { text, language } = req.body;
      const result = await bhashiniService.textToSpeech(text, language || 'hi');
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
};
