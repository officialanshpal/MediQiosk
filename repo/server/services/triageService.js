import { interviewTurnRepository } from '../repositories/interviewTurnRepository.js';
import { redFlagService } from './redFlagService.js';
import { sessionRepository } from '../repositories/sessionRepository.js';

/* Service for handling SOCRATES / AYUSH triage interview turns */
export const triageService = {
  async processInterviewTurn(sessionId, turnData) {
    const savedTurn = await interviewTurnRepository.saveTurn({
      sessionId,
      questionId: turnData.questionId,
      questionText: turnData.questionText,
      inputMode: turnData.inputMode, // 'voice' | 'touch'
      rawTranscript: turnData.rawTranscript,
      structuredAnswer: turnData.structuredAnswer
    });

    const session = await sessionRepository.getSessionById(sessionId);
    const allTurns = await interviewTurnRepository.getTurnsBySession(sessionId);

    // Evaluate background red flags
    const { isRedFlag, ruleName } = redFlagService.evaluateRedFlags(
      sessionId,
      turnData.structuredAnswer || turnData.rawTranscript || '',
      allTurns
    );

    let redFlagAlert = null;
    if (isRedFlag) {
      redFlagAlert = await redFlagService.triggerRedFlagAlert(
        sessionId,
        session?.patientName || 'Kiosk Patient',
        ruleName,
        [turnData.structuredAnswer || turnData.questionText]
      );
    }

    return {
      savedTurn,
      redFlagAlert
    };
  },

  async getSessionTurns(sessionId) {
    return await interviewTurnRepository.getTurnsBySession(sessionId);
  }
};
