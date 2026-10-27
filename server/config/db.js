/**
 * Database Layer & Connection Pool Simulation for MediQiosk
 * 
 * Supports:
 * 1. Primary document collections
 * 2. Meta tables for tracking audit/analytics per entity
 * 3. In-memory secondary indices for fast lookups (no foreign key constraints used)
 * 4. Data projection / selective field extraction
 * 5. Connection pool simulation manager
 */

class ConnectionPool {
  constructor(maxConnections = 10) {
    this.maxConnections = maxConnections;
    this.activeConnections = 0;
  }

  async acquire() {
    if (this.activeConnections >= this.maxConnections) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    this.activeConnections++;
    return {
      connId: `CONN_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date()
    };
  }

  release(conn) {
    if (this.activeConnections > 0) {
      this.activeConnections--;
    }
  }
}

const pool = new ConnectionPool(20);

// In-Memory Database Storage
const collections = {
  sessions: new Map(),
  interviewTurns: new Map(),
  documentRecords: new Map(),
  redFlagEvents: new Map(),
  summaries: new Map(),

  // Entity Meta Tables
  sessionMeta: new Map(),
  interviewTurnMeta: new Map(),
  documentRecordMeta: new Map(),
  redFlagEventMeta: new Map(),
  summaryMeta: new Map()
};

// Index Maps
const indexes = {
  sessionsByAbha: new Map(),
  sessionsByStatus: new Map(),
  redFlagsBySession: new Map(),
  turnsBySession: new Map(),
  docsBySession: new Map()
};

// Seed Mock Patient Database for Demonstration
const seedDatabase = () => {
  const seedSessionId = 'SESS-PAT-1001';
  const abhaId = '91-8492-3849-1029';

  const mockSession = {
    sessionId: seedSessionId,
    abhaId: abhaId,
    patientName: 'Rameshwar Mahto',
    age: 52,
    gender: 'Male',
    language: 'Hindi',
    mode: 'allopathic',
    consentFlags: { shareVoice: true, shareDocs: true, linkAbha: true },
    status: 'ACTIVE',
    triageTier: 'YELLOW TIER (Priority OPD)',
    roomNumber: 'Room 12 (Dr. S. Sharma)',
    estimatedWait: '14 Mins',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  };

  collections.sessions.set(seedSessionId, mockSession);
  collections.sessionMeta.set(seedSessionId, {
    sessionId: seedSessionId,
    deviceInfo: 'OPD Kiosk Tablet #4',
    ipAddress: '192.168.1.104',
    lastUpdated: new Date().toISOString()
  });

  indexes.sessionsByAbha.set(abhaId, seedSessionId);
  indexes.sessionsByStatus.set('ACTIVE', [seedSessionId]);

  const mockSummary = {
    sessionId: seedSessionId,
    patientName: 'Rameshwar Mahto',
    age: 52,
    gender: 'Male',
    maskedAbhaId: '91-****-****-1029',
    chiefComplaint: 'Subacute frontal tension headache & retro-orbital burning for 3 days',
    hpi: 'Patient reports persistent aching frontal headache aggravated by standing up. Accompanied by mild dizziness.',
    pastHistory: 'Known Hypertension (5 years on Medication).',
    drugAllergyHistory: 'Amlodipine 5mg daily. No known drug allergies.',
    familyHistory: 'Father had type 2 diabetes.',
    personalHistory: 'Non-smoker, vegetarian diet.',
    ros: 'Neurological: Dizziness present. Vision: Mild retro-orbital pressure.',
    investigations: 'Fasting Blood Sugar 186 mg/dL (Apollo, 15 days ago) vs 92 mg/dL (City Hosp, 3 days ago)',
    confidenceLevel: 'High (88% Voice Inputs)',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString()
  };

  collections.summaries.set(seedSessionId, mockSummary);
  collections.summaryMeta.set(seedSessionId, {
    sessionId: seedSessionId,
    generatedBy: 'MediQiosk Rule-Engine v1.2',
    inputTurnCount: 4,
    ocrDocCount: 2
  });
};

seedDatabase();

export const dbManager = {
  pool,
  collections,
  indexes,

  /**
   * Universal projection helper to extract only specific fields
   */
  projectFields(doc, fields) {
    if (!doc) return null;
    if (!fields || fields.length === 0) return { ...doc };
    const projected = {};
    fields.forEach(field => {
      if (doc[field] !== undefined) {
        projected[field] = doc[field];
      }
    });
    return projected;
  }
};
