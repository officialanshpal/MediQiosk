import { dbManager } from '../config/db.js';

/* Background Task Scheduler Service */
export const schedulerService = {
  intervalId: null,

  startScheduler(intervalMs = 30000) {
    console.log(`[BACKGROUND SCHEDULER] Started MediQiosk cron task runner (Interval: ${intervalMs}ms)...`);
    
    this.intervalId = setInterval(() => {
      this.runPeriodicTasks();
    }, intervalMs);
  },

  stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('[BACKGROUND SCHEDULER] Task runner stopped.');
    }
  },

  runPeriodicTasks() {
    try {
      const now = Date.now();
      
      // 1. Audit Stale Active Sessions (>2 hours old)
      let staleCount = 0;
      dbManager.collections.sessions.forEach((session, id) => {
        const createdTime = new Date(session.createdAt).getTime();
        if (session.status === 'ACTIVE' && (now - createdTime > 7200000)) {
          session.status = 'TIMED_OUT';
          dbManager.collections.sessions.set(id, session);
          staleCount++;
        }
      });

      // 2. Clear old acknowledged red flag logs (>24h)
      let flagCleanCount = 0;
      dbManager.collections.redFlagEvents.forEach((flag, id) => {
        const flagTime = new Date(flag.timestamp).getTime();
        if (flag.status === 'ACKNOWLEDGED' && (now - flagTime > 86400000)) {
          dbManager.collections.redFlagEvents.delete(id);
          flagCleanCount++;
        }
      });

      if (staleCount > 0 || flagCleanCount > 0) {
        console.log(`[BACKGROUND SCHEDULER] Maintenance executed: ${staleCount} stale sessions timed out, ${flagCleanCount} old red flags archived.`);
      }
    } catch (err) {
      console.error('[BACKGROUND SCHEDULER ERROR]:', err);
    }
  }
};
