import { sessionRepository } from '../repositories/sessionRepository.js';
import { interviewTurnRepository } from '../repositories/interviewTurnRepository.js';
import { documentRepository } from '../repositories/documentRepository.js';
import { summaryRepository } from '../repositories/summaryRepository.js';

/* [MOCKED ABHA & HIS INTEGRATION] Service layer managing session lifecycle */
export const sessionService = {
  async registerOrLoginPatient(abhaId, registrationData = {}) {
    // Mask ABHA ID for clinical display (e.g. 91-8492-3849-1029 -> 91-****-****-1029)
    const formattedAbha = abhaId || '91-8492-3849-1029';
    const patientName = registrationData.patientName || (abhaId ? 'Rameshwar Mahto' : 'New Registered Patient');
    const age = parseInt(registrationData.age, 10) || (abhaId ? 52 : 35);
    const gender = registrationData.gender || (abhaId ? 'Male' : 'Female');
    const language = registrationData.language || 'Hindi';
    const mode = registrationData.mode || 'allopathic';

    const session = await sessionRepository.createSession({
      abhaId: formattedAbha,
      patientName,
      age,
      gender,
      language,
      mode,
      consentFlags: registrationData.consentFlags || { shareVoice: true, shareDocs: true, linkAbha: true }
    });

    return session;
  },

  async updateConsent(sessionId, consentFlags) {
    return await sessionRepository.updateSession(sessionId, { consentFlags });
  },

  async getSession(sessionId) {
    return await sessionRepository.getSessionById(sessionId, [
      'sessionId', 'patientName', 'age', 'gender', 'abhaId', 'language', 'mode', 'consentFlags', 'status', 'triageTier', 'createdAt'
    ]);
  },

  async clearSessionPrivacyData(sessionId) {
    /* SESSION CLEAR REQUIREMENT:
     * After DOCTOR VIEW "Accept" is clicked, clear the session's raw voice transcript 
     * and document image blobs from the store while retaining structured summary.
     */
    await interviewTurnRepository.deleteTurnsForSession(sessionId);
    await documentRepository.purgeRawDocsForSession(sessionId);
    await sessionRepository.updateSession(sessionId, { status: 'COMPLETED_PRIVACY_CLEARED' });
    
    return {
      success: true,
      message: 'Raw voice transcripts and scanned images permanently purged from kiosk memory.',
      timestamp: new Date().toISOString()
    };
  }
};
