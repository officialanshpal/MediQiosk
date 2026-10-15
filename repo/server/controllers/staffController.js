import { redFlagService } from '../services/redFlagService.js';
import { sessionRepository } from '../repositories/sessionRepository.js';

/* Controller handling OPD Staff Dashboard & emergency alerts */
export const staffController = {
  async getDashboardData(req, res, next) {
    try {
      const activeSessions = await sessionRepository.getAllSessions([
        'sessionId', 'patientName', 'age', 'gender', 'triageTier', 'roomNumber', 'estimatedWait', 'status', 'createdAt'
      ]);

      const redFlags = await redFlagService.getActiveDashboardAlerts();

      res.json({
        success: true,
        queueCount: activeSessions.length,
        urgentAlerts: redFlags.filter(f => f.status === 'UNACKNOWLEDGED'),
        allRedFlags: redFlags,
        sessions: activeSessions
      });
    } catch (err) {
      next(err);
    }
  },

  async acknowledgeAlert(req, res, next) {
    try {
      const { eventId, staffName } = req.body;
      const updated = await redFlagService.acknowledgeAlert(eventId, staffName);
      res.json({ success: true, event: updated });
    } catch (err) {
      next(err);
    }
  }
};
