import { sessionService } from '../services/sessionService.js';

/* Controller handling patient registration, ABHA login & session privacy clear */
export const sessionController = {
  async authenticateAbha(req, res, next) {
    try {
      const { abhaId, registrationData } = req.body;
      const session = await sessionService.registerOrLoginPatient(abhaId, registrationData);
      res.json({ success: true, session });
    } catch (err) {
      next(err);
    }
  },

  async updateConsent(req, res, next) {
    try {
      const { sessionId, consentFlags } = req.body;
      const updated = await sessionService.updateConsent(sessionId, consentFlags);
      res.json({ success: true, session: updated });
    } catch (err) {
      next(err);
    }
  },

  async getSession(req, res, next) {
    try {
      const { sessionId } = req.params;
      const session = await sessionService.getSession(sessionId);
      res.json({ success: true, session });
    } catch (err) {
      next(err);
    }
  },

  async clearSessionData(req, res, next) {
    try {
      const { sessionId } = req.body;
      const result = await sessionService.clearSessionPrivacyData(sessionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
