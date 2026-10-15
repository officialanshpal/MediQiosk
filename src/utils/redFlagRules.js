/**
 * Rule-based Red Flag Checker for emergency clinical combinations
 */
export const checkRedFlags = (complaint, turns = []) => {
  const allText = (complaint + ' ' + turns.map(t => t.rawTranscript || t.structuredAnswer).join(' ')).toLowerCase();

  if ((allText.includes('chest pain') || allText.includes('chhati') || allText.includes('seene me dard')) &&
      (allText.includes('shortness of breath') || allText.includes('saas') || allText.includes('breathless') || allText.includes('ghabrahata') || allText.includes('cough'))) {
    return {
      isRedFlag: true,
      alertMessage: 'CRITICAL ALERT: Acute Retrosternal Chest Pain + Respiratory Distress. Priority notification dispatched to OPD Emergency Staff.',
      ruleCode: 'ACUTE_CHEST_DISCOMFORT_DYSPNEA'
    };
  }

  if ((allText.includes('fever') || allText.includes('bukhar') || allText.includes('buhar')) &&
      (allText.includes('stiff neck') || allText.includes('gardan') || allText.includes('vomiting'))) {
    return {
      isRedFlag: true,
      alertMessage: 'PRIORITY ALERT: High Fever with Nuchal Rigidity / Vomiting. Priority notification dispatched.',
      ruleCode: 'FEVER_NUCHAL_RIGIDITY'
    };
  }

  return { isRedFlag: false, alertMessage: null, ruleCode: null };
};
