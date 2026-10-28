import { dbManager } from '../config/db.js';

/* Repository for storing conversational Q&A turns */
export const interviewTurnRepository = {
  async saveTurn(turnData) {
    const conn = await dbManager.pool.acquire();
    try {
      const existingTurns = dbManager.indexes.turnsBySession.get(turnData.sessionId) || [];
      const existingTurnId = existingTurns.find(id => {
        const turn = dbManager.collections.interviewTurns.get(id);
        return turn?.questionId === turnData.questionId;
      });

      if (existingTurnId) {
        const record = {
          ...dbManager.collections.interviewTurns.get(existingTurnId),
          ...turnData,
          turnId: existingTurnId,
          inputMode: turnData.inputMode || 'touch',
          rawTranscript: turnData.rawTranscript || '',
          structuredAnswer: turnData.structuredAnswer || '',
          timestamp: new Date().toISOString()
        };
        dbManager.collections.interviewTurns.set(existingTurnId, record);
        const metadata = dbManager.collections.interviewTurnMeta.get(existingTurnId) || {};
        dbManager.collections.interviewTurnMeta.set(existingTurnId, { ...metadata, isEdited: true });
        return record;
      }

      const turnId = `TURN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const record = {
        turnId,
        sessionId: turnData.sessionId,
        questionId: turnData.questionId,
        questionText: turnData.questionText,
        inputMode: turnData.inputMode || 'touch', // 'voice' | 'touch'
        rawTranscript: turnData.rawTranscript || '',
        structuredAnswer: turnData.structuredAnswer || '',
        timestamp: new Date().toISOString()
      };

      dbManager.collections.interviewTurns.set(turnId, record);

      existingTurns.push(turnId);
      dbManager.indexes.turnsBySession.set(turnData.sessionId, existingTurns);

      // Meta Table Entry
      dbManager.collections.interviewTurnMeta.set(turnId, {
        turnId,
        audioLengthSec: turnData.inputMode === 'voice' ? (turnData.rawTranscript?.length || 0) / 10 : 0,
        isEdited: false
      });

      return record;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getTurnsBySession(sessionId, projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const turnIds = dbManager.indexes.turnsBySession.get(sessionId) || [];
      const turns = turnIds.map(id => dbManager.collections.interviewTurns.get(id)).filter(Boolean);
      return turns.map(t => dbManager.projectFields(t, projectionFields));
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async deleteTurnsForSession(sessionId) {
    const conn = await dbManager.pool.acquire();
    try {
      const turnIds = dbManager.indexes.turnsBySession.get(sessionId) || [];
      turnIds.forEach(id => {
        dbManager.collections.interviewTurns.delete(id);
        dbManager.collections.interviewTurnMeta.delete(id);
      });
      dbManager.indexes.turnsBySession.delete(sessionId);
      return true;
    } finally {
      dbManager.pool.release(conn);
    }
  }
};
