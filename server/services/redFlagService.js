import { redFlagRepository } from '../repositories/redFlagRepository.js';
import { sessionRepository } from '../repositories/sessionRepository.js';

/* Emergency Red-Flag Evaluation Service */
export const redFlagService = {
  /**
   * Rule-based engine checking for emergency clinical combinations
   * e.g., "chest pain" + "shortness of breath" / "fever" + "stiff neck"
   */
  evaluateRedFlags(sessionId, complaintText, turns = []) {
    const combinedText = (complaintText + ' ' + turns.map(t => t.rawTranscript || t.structuredAnswer).join(' ')).toLowerCase();
    
    let isRedFlag = false;
    let ruleName = '';

    if ((combinedText.includes('chest pain') || combinedText.includes('chati me dard') || combinedText.includes('chhati')) &&
        (combinedText.includes('shortness of breath') || combinedText.includes('saas') || combinedText.includes('ghabrahata') || combinedText.includes('breathless'))) {
      isRedFlag = true;
      ruleName = 'ACUTE_CHEST_DISCOMFORT_WITH_DYSPNEA (ACS Suspicion)';
    } else if ((combinedText.includes('fever') || combinedText.includes('buhar') || combinedText.includes('bukhar')) &&
               (combinedText.includes('stiff neck') || combinedText.includes('gardan') || combinedText.includes('severe headache'))) {
      isRedFlag = true;
      ruleName = 'HIGH_FEVER_WITH_MENINGEAL_SIGNS (Meningitis Suspicion)';
    } else if (combinedText.includes('unconscious') || combinedText.includes('paralysis') || combinedText.includes('fainting')) {
      isRedFlag = true;
      ruleName = 'NEUROLOGICAL_EMERGENCY_FAINTING';
    }

    return { isRedFlag, ruleName };
  },

  async triggerRedFlagAlert(sessionId, patientName, ruleName, symptomsList) {
    const redFlag = await redFlagRepository.createRedFlag({
      sessionId,
      patientName,
      triggerRule: ruleName,
      symptoms: symptomsList
    });

    // Elevate session triage tier to RED TIER
    await sessionRepository.updateSession(sessionId, {
      triageTier: 'RED TIER (Immediate Emergency)',
      estimatedWait: 'Immediate Triage'
    });

    return redFlag;
  },

  async getActiveDashboardAlerts() {
    return await redFlagRepository.getActiveRedFlags([
      'eventId', 'sessionId', 'patientName', 'triggerRule', 'symptoms', 'severity', 'status', 'timestamp'
    ]);
  },

  async acknowledgeAlert(eventId, staffName) {
    return await redFlagRepository.acknowledgeRedFlag(eventId, staffName);
  }
};
