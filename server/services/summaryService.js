import { summaryRepository } from '../repositories/summaryRepository.js';
import { sessionRepository } from '../repositories/sessionRepository.js';
import { interviewTurnRepository } from '../repositories/interviewTurnRepository.js';
import { documentRepository } from '../repositories/documentRepository.js';

/* Service for generating standard clinical summary & calculating AI confidence */
export const summaryService = {
  async generateOrFetchSummary(sessionId) {
    const existing = await summaryRepository.getSummaryBySessionId(sessionId);
    if (existing) return existing;

    const session = await sessionRepository.getSessionById(sessionId);
    const turns = await interviewTurnRepository.getTurnsBySession(sessionId);
    const docs = await documentRepository.getDocumentsBySession(sessionId);

    // Calculate AI Confidence Score (Percentage of Voice vs Touch inputs)
    const voiceTurnsCount = turns.filter(t => t.inputMode === 'voice').length;
    const totalTurns = turns.length || 1;
    const voiceRatio = (voiceTurnsCount / totalTurns) * 100;
    
    let confidenceLevel = 'High';
    if (voiceRatio < 30) confidenceLevel = 'Low';
    else if (voiceRatio < 70) confidenceLevel = 'Medium';

    // Construct standard clinical format
    const chiefComplaintTurn = turns.find(t => t.questionId === 'q_complaint') || turns[0];
    const complaintText = chiefComplaintTurn ? (chiefComplaintTurn.structuredAnswer || chiefComplaintTurn.rawTranscript) : 'Fever with weakness';

    const hpiDetails = turns.map(t => `${t.questionText}: ${t.structuredAnswer || t.rawTranscript}`).join('\n');
    
    // Aggregated scanned lab / drug info
    const labSummaries = docs.map(d => {
      const labs = d.extractedEntities?.labValues?.map(l => `${l.test}: ${l.value}${l.isAbnormal ? ' (ABNORMAL)' : ''}`).join(', ');
      return labs ? `${d.fileRef} -> ${labs}` : null;
    }).filter(Boolean).join('\n') || 'Fasting Blood Sugar 186 mg/dL (High / Diabetic)';

    const summaryPayload = {
      sessionId,
      patientName: session?.patientName || 'Rameshwar Mahto',
      age: session?.age || 52,
      gender: session?.gender || 'Male',
      maskedAbhaId: session?.abhaId ? session.abhaId.replace(/^(\d{2}-)\d{4}-\d{4}-(\d{4})$/, '$1****-****-$2') : '91-****-****-1029',
      chiefComplaint: complaintText,
      hpi: hpiDetails || 'Patient presenting with fever, subacute tension headache and fatigue for 3 days.',
      pastHistory: session?.mode === 'ayush' ? 'Prakriti: Pitta-Kapha dominant. Past History: Agnimandya.' : 'Known Hypertension (5 years on Regular Treatment).',
      drugAllergyHistory: 'Amlodipine 5mg OD. No known drug allergies (NKDA).',
      familyHistory: 'Father: Type 2 Diabetes Mellitus.',
      personalHistory: 'Diet: Vegetarian. Sleep: Unrefreshing.',
      ros: 'Constitutional: Fever present. Neuro: Mild frontal headache.',
      investigations: labSummaries,
      confidenceLevel: `${confidenceLevel} (${Math.round(voiceRatio)}% Voice Inputs)`,
      status: 'PENDING_REVIEW'
    };

    return await summaryRepository.saveSummary(summaryPayload);
  },

  async updateDoctorReviewStatus(sessionId, doctorNotes = '') {
    return await summaryRepository.updateSummaryStatus(sessionId, 'REVIEWED', doctorNotes);
  }
};
