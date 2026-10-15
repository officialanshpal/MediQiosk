import { dbManager } from '../config/db.js';

/* Repository for storing OCR Document Records */
export const documentRepository = {
  async saveDocument(docData) {
    const conn = await dbManager.pool.acquire();
    try {
      const docId = `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const record = {
        docId,
        sessionId: docData.sessionId,
        fileRef: docData.fileName || 'scanned_prescription.png',
        ocrText: docData.ocrText || '',
        extractedEntities: docData.extractedEntities || { medicines: [], labValues: [] },
        uploadedAt: new Date().toISOString()
      };

      dbManager.collections.documentRecords.set(docId, record);

      // Index update
      const existingDocs = dbManager.indexes.docsBySession.get(docData.sessionId) || [];
      existingDocs.push(docId);
      dbManager.indexes.docsBySession.set(docData.sessionId, existingDocs);

      // Meta Table Entry
      dbManager.collections.documentRecordMeta.set(docId, {
        docId,
        fileSizeBytes: docData.ocrText?.length * 2 || 1024,
        parsedEntityCount: (record.extractedEntities.medicines.length + record.extractedEntities.labValues.length),
        clearedRawData: false
      });

      return record;
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async getDocumentsBySession(sessionId, projectionFields = []) {
    const conn = await dbManager.pool.acquire();
    try {
      const docIds = dbManager.indexes.docsBySession.get(sessionId) || [];
      const docs = docIds.map(id => dbManager.collections.documentRecords.get(id)).filter(Boolean);
      return docs.map(d => dbManager.projectFields(d, projectionFields));
    } finally {
      dbManager.pool.release(conn);
    }
  },

  async purgeRawDocsForSession(sessionId) {
    const conn = await dbManager.pool.acquire();
    try {
      const docIds = dbManager.indexes.docsBySession.get(sessionId) || [];
      docIds.forEach(id => {
        const doc = dbManager.collections.documentRecords.get(id);
        if (doc) {
          doc.ocrText = '[RAW OCR PURGED FOR PRIVACY]';
          doc.fileRef = '[IMAGE DELETED]';
          dbManager.collections.documentRecords.set(id, doc);
        }
        const meta = dbManager.collections.documentRecordMeta.get(id);
        if (meta) {
          meta.clearedRawData = true;
          dbManager.collections.documentRecordMeta.set(id, meta);
        }
      });
      return true;
    } finally {
      dbManager.pool.release(conn);
    }
  }
};
