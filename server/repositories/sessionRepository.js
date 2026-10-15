import { dbManager } from '../config/db.js';

/* [MOCKED] Database repository for Kiosk Sessions & sessionMeta */
export const sessionRepository = {
  async createSession(sessionData) {
    const conn = await dbManager.pool.acquire();
    try {
      const sessionId = sessionData.sessionId || `SESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newSession = {
        sessionId,
        abhaId: sessionData.abhaId || '91-9988-7766-5544',
        patientName: sessionData.patientName || 'Anonymous Kiosk Patient',
        age: sessionData.age || 35,
        gender: sessionData.gender || 'Other',
        language: sessionData.language || 'English',
        mode: sessionData.mode || 'allopathic',
        consentFlags: sessionData.consentFlags || { shareVoice: false, shareDocs: false, linkAbha: false },
        status: 'ACTIVE',
        triageTier: 'GREEN TIER (Standard OPD)',
        roomNumber: 'Room 04 (General Medicine)',
        estimatedWait: '15 Mins',
        createdAt: new Date().toISOString()
      };

      dbManager.collections.sessions.set(sessionId, newSession);

      // Meta Table Entry
      dbManager.collections.sessionMeta.set(sessionId, {
        sessionId,
        deviceType: 'Self-Service Tablet',
        createdIp: '127.0.0.1',
        turnCount: 0,
        docCount: 0,
        lastActivity: new Date().toISOString()
      });

      // Update Indexes
      if (newSession.abhaId) {
        dbManager.indexes.sessionsByAbha.set(newSession.abhaId, sessionId);
      }

      return newSession;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getSessionById(sessionId, projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const session = dbManager.collections.sessions.get(sessionId);
      return dbManager.projectFields(session, projectionFields);
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async updateSession(sessionId, updateData) {
    const conn = await dbManager.pool.acquire();
    try {
      const existing = dbManager.collections.sessions.get(sessionId);
      if (!existing) return null;
      const updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
      dbManager.collections.sessions.set(sessionId, updated);

      const meta = dbManager.collections.sessionMeta.get(sessionId) || {};
      meta.lastActivity = new Date().toISOString();
      dbManager.collections.sessionMeta.set(sessionId, meta);

      return updated;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getAllSessions(projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const list = Array.from(dbManager.collections.sessions.values());
      return list.map(s => dbManager.projectFields(s, projectionFields));
    } finally {
      dbManager.pool.release(conn);
    }
  }
};
