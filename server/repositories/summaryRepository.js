import { dbManager } from '../config/db.js';

/* Repository for Structured Clinical Summaries */
export const summaryRepository = {
  async saveSummary(summaryData) {
    const conn = await dbManager.pool.acquire();
    try {
      const summaryId = summaryData.sessionId; // 1-to-1 mapping with session
      const record = {
        summaryId,
        sessionId: summaryData.sessionId,
        patientName: summaryData.patientName || 'Patient',
        age: summaryData.age || 40,
        gender: summaryData.gender || 'Unknown',
        maskedAbhaId: summaryData.maskedAbhaId || '91-****-****-0000',
        chiefComplaint: summaryData.chiefComplaint || 'Not specified',
        hpi: summaryData.hpi || 'No HPI details recorded',
        pastHistory: summaryData.pastHistory || 'Nil reported',
        drugAllergyHistory: summaryData.drugAllergyHistory || 'No known allergies reported',
        familyHistory: summaryData.familyHistory || 'Nil reported',
        personalHistory: summaryData.personalHistory || 'Nil reported',
        ros: summaryData.ros || 'Unremarkable',
        investigations: summaryData.investigations || 'No prior labs attached',
        confidenceLevel: summaryData.confidenceLevel || 'High',
        status: 'PENDING_REVIEW', // PENDING_REVIEW -> REVIEWED
        updatedAt: new Date().toISOString()
      };

      dbManager.collections.summaries.set(summaryId, record);

      // Meta Table
      dbManager.collections.summaryMeta.set(summaryId, {
        summaryId,
        reviewedByDoctorId: null,
        fhirExportStatus: 'READY_TO_PUSH', // MOCKED FHIR status
        hisPushTimestamp: null
      });

      return record;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getSummaryBySessionId(sessionId, projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const summary = dbManager.collections.summaries.get(sessionId);
      return dbManager.projectFields(summary, projectionFields);
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async updateSummaryStatus(sessionId, status, doctorNotes = '') {
    const conn = await dbManager.pool.acquire();
    try {
      const summary = dbManager.collections.summaries.get(sessionId);
      if (!summary) return null;
      summary.status = status;
      if (doctorNotes) {
        summary.hpi += `\n[Doctor Note]: ${doctorNotes}`;
      }
      summary.updatedAt = new Date().toISOString();
      dbManager.collections.summaries.set(sessionId, summary);

      const meta = dbManager.collections.summaryMeta.get(sessionId) || {};
      meta.reviewedByDoctorId = 'DOC-Dr-S-Sharma';
      meta.hisPushTimestamp = new Date().toISOString();
      dbManager.collections.summaryMeta.set(sessionId, meta);

      return summary;
    } finally {
      dbManager.pool.release(conn);
    }
  }
};
