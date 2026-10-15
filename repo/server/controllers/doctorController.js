import { summaryService } from '../services/summaryService.js';
import { sessionService } from '../services/sessionService.js';

/* Controller handling Physician EHR Doctor View & Accept/Review actions */
export const doctorController = {
  async getSummary(req, res, next) {
    try {
      const { sessionId } = req.params;
      const summary = await summaryService.generateOrFetchSummary(sessionId);
      res.json({ success: true, summary });
    } catch (err) {
      next(err);
    }
  },

  async acceptSummary(req, res, next) {
    try {
      const { sessionId, doctorNotes } = req.body;
      const updatedSummary = await summaryService.updateDoctorReviewStatus(sessionId, doctorNotes);
      
      // Trigger privacy session clear
      const clearResult = await sessionService.clearSessionPrivacyData(sessionId);

      res.json({
        success: true,
        summary: updatedSummary,
        privacyClearStatus: clearResult
      });
    } catch (err) {
      next(err);
    }
  }
};
