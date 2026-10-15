/**
 * Hardcoded Branching Question Trees using the SOCRATES framework
 * (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving factors, Severity)
 */
export const socratesQuestions = {
  Fever: [
    {
      id: 'q_onset',
      questionText: 'How many days have you had this fever?',
      hindiText: 'आपको बुखार कितने दिनों से आ रहा है?',
      options: ['1-2 days', '3-5 days', 'More than 1 week', 'Intermittent (comes and goes)']
    },
    {
      id: 'q_character',
      questionText: 'Is the fever accompanied by chills or shivering?',
      hindiText: 'क्या बुखार के साथ ठंड या कपकपी भी महसूस होती है?',
      options: ['Yes, severe chills', 'Mild shivering', 'No chills']
    },
    {
      id: 'q_associations',
      questionText: 'Do you have any associated symptoms like cough, vomiting, or body pain?',
      hindiText: 'क्या आपको खांसी, उल्टी या शरीर में तेज दर्द भी है?',
      options: ['Cough & cold', 'Shortness of breath', 'Severe body ache', 'Vomiting & nausea', 'None']
    },
    {
      id: 'q_severity',
      questionText: 'How severe is your discomfort on a scale of 1 to 10?',
      hindiText: 'आप अपनी तकलीफ को 1 से 10 के पैमाने पर कितना आंकेंगे?',
      options: ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-10)']
    }
  ],

  'Chest pain': [
    {
      id: 'q_site',
      questionText: 'Where exactly is the pain located in your chest?',
      hindiText: 'छाती में दर्द बिल्कुल किस जगह हो रहा है?',
      options: ['Center of chest', 'Left side', 'Right side', 'Spread across entire chest']
    },
    {
      id: 'q_radiation',
      questionText: 'Does the pain spread to your left arm, jaw, or back?',
      hindiText: 'क्या यह दर्द आपके बाएं हाथ, जबड़े या पीठ की तरफ भी जाता है?',
      options: ['Spreads to left arm', 'Spreads to jaw/neck', 'Spreads to back', 'Does not spread']
    },
    {
      id: 'q_associations',
      questionText: 'Are you experiencing shortness of breath, sweating, or nausea?',
      hindiText: 'क्या आपको सांस फूलने, पसीना आने या घबराहट की शिकायत है?',
      options: ['Shortness of breath & Sweating', 'Nausea & dizziness', 'None']
    },
    {
      id: 'q_timecourse',
      questionText: 'Did the pain start suddenly or build up gradually?',
      hindiText: 'यह दर्द अचानक शुरू हुआ था या धीरे-धीरे बढ़ा है?',
      options: ['Sudden onset (Emergency)', 'Gradual build up over hours', 'Occurs after eating']
    }
  ],

  Cough: [
    {
      id: 'q_character',
      questionText: 'Is your cough dry or producing sputum/mucus?',
      hindiText: 'क्या आपकी खांसी सूखी है या बलगम आ रहा है?',
      options: ['Dry cough', 'Clear / White sputum', 'Yellow / Greenish sputum', 'Blood-tinged sputum']
    },
    {
      id: 'q_timecourse',
      questionText: 'How long have you been coughing?',
      hindiText: 'आपको कितने समय से खांसी हो रही है?',
      options: ['Less than 3 days', '1 to 2 weeks', 'More than 3 weeks']
    },
    {
      id: 'q_exacerbating',
      questionText: 'Does the cough get worse at night or during cold weather?',
      hindiText: 'क्या रात में या ठंड के समय आपकी खांसी बढ़ जाती है?',
      options: ['Worse at night', 'Worse in morning', 'Continuous all day', 'No pattern']
    }
  ],

  'Stomach ache': [
    {
      id: 'q_site',
      questionText: 'Which part of your abdomen is hurting?',
      hindiText: 'पेट के किस हिस्से में दर्द हो रहा है?',
      options: ['Upper abdomen (near stomach)', 'Lower right side', 'Lower left side', 'All over abdomen']
    },
    {
      id: 'q_character',
      questionText: 'What type of pain is it?',
      hindiText: 'दर्द किस तरह का महसूस हो रहा है?',
      options: ['Sharp cramping pain', 'Dull continuous ache', 'Burning sensation', 'Bloating / Gas']
    },
    {
      id: 'q_associations',
      questionText: 'Are you having diarrhea, vomiting, or fever?',
      hindiText: 'क्या आपको दस्त, उल्टी या बुखार भी आ रहा है?',
      options: ['Diarrhea / Loose motions', 'Vomiting & nausea', 'Fever', 'No associated symptoms']
    }
  ],

  Headache: [
    {
      id: 'q_site',
      questionText: 'Is the headache on one side or across your forehead?',
      hindiText: 'क्या सिरदर्द एक तरफ है या माथे के दोनों तरफ है?',
      options: ['One side (Left/Right)', 'Frontal forehead', 'Back of neck & head', 'Entire head']
    },
    {
      id: 'q_associations',
      questionText: 'Is there any nausea, sensitivity to light, or eye pressure?',
      hindiText: 'क्या आपको जी मिचलाना, रोशनी से तकलीफ या आंखों के पीछे जलन है?',
      options: ['Light & noise sensitivity', 'Eye pain & burning', 'Nausea', 'None']
    },
    {
      id: 'q_timecourse',
      questionText: 'How long has this headache lasted?',
      hindiText: 'यह सिरदर्द कितने समय से लगातार बना हुआ है?',
      options: ['Few hours', '1-3 days', 'Chronic / Recurring for months']
    }
  ],

  Other: [
    {
      id: 'q_general_1',
      questionText: 'How long have you been feeling unwell?',
      hindiText: 'आपको कितने समय से यह परेशानी महसूस हो रही है?',
      options: ['Since today', '2-3 days', 'More than a week']
    },
    {
      id: 'q_general_2',
      questionText: 'Have you taken any medicines for this complaint?',
      hindiText: 'क्या आपने इस बीमारी के लिए कोई दवा खाई है?',
      options: ['Yes, home remedy / OTC medicine', 'No, waiting for doctor']
    }
  ]
};
