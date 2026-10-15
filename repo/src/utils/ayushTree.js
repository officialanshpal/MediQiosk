/**
 * AYUSH Mode Question Set (Ayurvedic clinical parameters)
 * Evaluates Prakriti, Vikriti, Agni, Koshtha, and Ahara-Vihara.
 */
export const ayushQuestions = {
  chiefComplaints: ['Agnimandya (Indigestion/Low Appetite)', 'Vata Vyadhi (Joint Pain/Body Ache)', 'Kasa-Swasa (Respiratory/Cough)', 'Jwara (Fever/Body Heat)', 'Sira Shoola (Headache)'],
  
  questions: [
    {
      id: 'q_prakriti',
      questionText: 'What is your primary body constitution (Prakriti)?',
      hindiText: 'आपकी स्वाभाविक शारीरिक प्रकृति क्या है?',
      options: ['Vata Dominant (Dry skin, light built, active)', 'Pitta Dominant (Warm body, sharp appetite, easily irritated)', 'Kapha Dominant (Heavy built, calm, solid immunity)']
    },
    {
      id: 'q_agni',
      questionText: 'How is your digestive fire (Agni)?',
      hindiText: 'आपकी पाचन अग्नि कैसी है?',
      options: ['Sama Agni (Balanced appetite & smooth digestion)', 'Vishama Agni (Irregular hunger & gas)', 'Tikshna Agni (Hyperacidic / Intense hunger)', 'Manda Agni (Low appetite & sluggish digestion)']
    },
    {
      id: 'q_koshtha',
      questionText: 'How are your bowel habits (Koshtha)?',
      hindiText: 'आपकी कोष्ठ स्थिति (पेट साफ होना) कैसी है?',
      options: ['Mridu Koshtha (Soft stools, easily affected by milk)', 'Krura Koshtha (Tendency towards constipation)', 'Madhyama Koshtha (Regular & normal bowel movements)']
    },
    {
      id: 'q_ahara_vihara',
      questionText: 'Describe your daily diet & routine (Ahara-Vihara):',
      hindiText: 'आपकी आहार और दिनचर्या कैसी है?',
      options: ['Irregular sleep & spicy food', 'Sedentary routine & oily diet', 'Healthy balanced diet & regular sleep', 'Night shifts & delayed meals']
    }
  ]
};
