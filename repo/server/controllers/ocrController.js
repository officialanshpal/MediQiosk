import { ocrService } from '../services/ocrService.js';

/* Controller handling OCR document scan & regex entity parsing */
export const ocrController = {
  async processScan(req, res, next) {
    try {
      const { sessionId, fileName, ocrText } = req.body;
      const record = await ocrService.processDocumentScan(sessionId, fileName, ocrText);
      res.json({ success: true, document: record });
    } catch (err) {
      next(err);
    }
  },

  async getSessionDocuments(req, res, next) {
    try {
      const { sessionId } = req.params;
      const docs = await ocrService.getSessionDocuments(sessionId);
      res.json({ success: true, documents: docs });
    } catch (err) {
      next(err);
    }
  }
};
