import { dbManager } from '../config/db.js';

/* Repository for storing Emergency Red Flag events */
export const redFlagRepository = {
  async createRedFlag(flagData) {
    const conn = await dbManager.pool.acquire();
    try {
      const eventId = `RED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const record = {
        eventId,
        sessionId: flagData.sessionId,
        patientName: flagData.patientName || 'Kiosk Patient',
        triggerRule: flagData.triggerRule || 'Dangerous symptom combination detected',
        symptoms: flagData.symptoms || [],
        severity: 'HIGH_PRIORITY_ALERT',
        status: 'UNACKNOWLEDGED',
        timestamp: new Date().toISOString()
      };

      dbManager.collections.redFlagEvents.set(eventId, record);

      // Meta Table
      dbManager.collections.redFlagEventMeta.set(eventId, {
        eventId,
        notifiedStaffRoom: 'OPD Nurse Station 1',
        acknowledgedBy: null,
        resolvedAt: null
      });

      return record;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getActiveRedFlags(projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const list = Array.from(dbManager.collections.redFlagEvents.values());
      return list.map(r => dbManager.projectFields(r, projectionFields));
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async acknowledgeRedFlag(eventId, staffName = 'Duty Nurse') {
    const conn = await dbManager.pool.acquire();
    try {
      const event = dbManager.collections.redFlagEvents.get(eventId);
      if (!event) return null;
      event.status = 'ACKNOWLEDGED';
      dbManager.collections.redFlagEvents.set(eventId, event);

      const meta = dbManager.collections.redFlagEventMeta.get(eventId) || {};
      meta.acknowledgedBy = staffName;
      meta.resolvedAt = new Date().toISOString();
      dbManager.collections.redFlagEventMeta.set(eventId, meta);

      return event;
    } finally {
      dbManager.pool.release(conn);
    }
  }
};
