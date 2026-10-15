import { triageService } from '../services/triageService.js';

/* Controller handling SOCRATES & AYUSH triage interview turns */
export const triageController = {
  async submitTurn(req, res, next) {
    try {
      const { sessionId, questionId, questionText, inputMode, rawTranscript, structuredAnswer } = req.body;
      const result = await triageService.processInterviewTurn(sessionId, {
        questionId,
        questionText,
        inputMode,
        rawTranscript,
        structuredAnswer
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getSessionTurns(req, res, next) {
    try {
      const { sessionId } = req.params;
      const turns = await triageService.getSessionTurns(sessionId);
      res.json({ success: true, turns });
    } catch (err) {
      next(err);
    }
  }
};
