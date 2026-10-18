import { IDualPaneQuestion } from '@/models/Assessment';

// 5-Point Likert Options for OCEAN (Big Five)
export const LIKERT_OPTIONS_EN = [
  { id: '1', text: 'Strongly Disagree', points: 1, rationaleCategory: 'Low Alignment' },
  { id: '2', text: 'Disagree', points: 2, rationaleCategory: 'Mild Disagreement' },
  { id: '3', text: 'Neutral / Undecided', points: 3, rationaleCategory: 'Situational / Balanced' },
  { id: '4', text: 'Agree', points: 4, rationaleCategory: 'Moderate Alignment' },
  { id: '5', text: 'Strongly Agree', points: 5, rationaleCategory: 'High Alignment' },
];

export const LIKERT_OPTIONS_HI = [
  { id: '1', text: 'दृढ़ता से असहमत (Strongly Disagree)', points: 1, rationaleCategory: 'Low Alignment' },
  { id: '2', text: 'असहमत (Disagree)', points: 2, rationaleCategory: 'Mild Disagreement' },
  { id: '3', text: 'तटस्थ / अनिश्चित (Neutral)', points: 3, rationaleCategory: 'Situational / Balanced' },
  { id: '4', text: 'सहमत (Agree)', points: 4, rationaleCategory: 'Moderate Alignment' },
  { id: '5', text: 'दृढ़ता से सहमत (Strongly Agree)', points: 5, rationaleCategory: 'High Alignment' },
];

export const LIKERT_OPTIONS_KN = [
  { id: '1', text: 'ಖಂಡಿತ ಒಪ್ಪುವುದಿಲ್ಲ (Strongly Disagree)', points: 1, rationaleCategory: 'Low Alignment' },
  { id: '2', text: 'ಒಪ್ಪುವುದಿಲ್ಲ (Disagree)', points: 2, rationaleCategory: 'Mild Disagreement' },
  { id: '3', text: 'ತಟಸ್ಥ / ನಿರ್ಧಾರವಿಲ್ಲ (Neutral)', points: 3, rationaleCategory: 'Situational / Balanced' },
  { id: '4', text: 'ಒಪ್ಪುತ್ತೇನೆ (Agree)', points: 4, rationaleCategory: 'Moderate Alignment' },
  { id: '5', text: 'ಖಂಡಿತ ಒಪ್ಪುತ್ತೇನೆ (Strongly Agree)', points: 5, rationaleCategory: 'High Alignment' },
];

// ============================================================================
// CANDIDATE PROFILE CONTEXT & DOMAIN SPECIALIZATION
// ============================================================================

export interface ICandidateProfileContext {
  candidateName?: string;
  candidateEmail?: string;
  dob?: string;
  gender?: string;
  country?: string;
  stateRegion?: string;
  educationLevel?: string;
  degreeQualification?: string;
  careerStage?: string;
  workExperience?: string;
  targetRoleField?: string;
  currentRole?: string;
  targetIndustry?: string;
}

export type CandidateDomain = 'tech' | 'finance' | 'business' | 'operations' | 'design' | 'academic';

export function resolveDomain(ctx?: ICandidateProfileContext): CandidateDomain {
  if (!ctx) return 'tech';
  const combined = [
    ctx.targetRoleField,
    ctx.currentRole,
    ctx.degreeQualification,
    ctx.educationLevel,
    ctx.careerStage,
    ctx.targetIndustry,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Finance / Banking / Accounting / Commerce
  if (
    /finance|banking|fintech|accounting|taxation|audit|chartered|ca|cfa|b\.?com|m\.?com|commerce|equity|investment|wealth/i.test(combined)
  ) {
    return 'finance';
  }

  // Design / Creative / UI/UX / Architecture
  if (
    /design|ui\/ux|ux\/ui|creative|graphic|b\.?des|m\.?des|multimedia|visual|product design|interior|architecture/i.test(combined)
  ) {
    return 'design';
  }

  // Operations / Supply Chain / Logistics / Retail
  if (
    /operation|supply chain|logistics|warehouse|inventory|procurement|shipping|retail management|plant|manufacturing/i.test(combined)
  ) {
    return 'operations';
  }

  // Business / Management / Consulting / Sales / Marketing / Strategy / HR
  if (
    /business|consulting|strategy|management|sales|marketing|mba|bba|pgdm|human resources|hr|product manager|executive/i.test(combined)
  ) {
    return 'business';
  }

  // Academic / Research / Science / PhD
  if (
    /academic|research|ph\.?d|scholar|faculty|lecturer|professor|curriculum|teaching|pure science/i.test(combined)
  ) {
    return 'academic';
  }

  // Default is Tech / Engineering / IT
  return 'tech';
}

export function isEarlyCareer(ctx?: ICandidateProfileContext): boolean {
  if (!ctx) return false;
  const stage = (ctx.careerStage || '').toLowerCase();
  const exp = (ctx.workExperience || '').toLowerCase();
  const edu = (ctx.educationLevel || '').toLowerCase();

  if (stage.includes('student') || stage.includes('intern') || stage.includes('fresher') || stage.includes('entry')) {
    return true;
  }
  if (exp.includes('0') || exp.includes('fresher') || exp.includes('< 1') || exp.includes('none') || exp.includes('intern')) {
    return true;
  }
  if (edu.includes('pursuing') || edu.includes('student')) {
    return true;
  }
  return false;
}

interface DomainVariantText {
  titleEn?: string;
  scenarioEn?: string;
  titleHi?: string;
  scenarioHi?: string;
  titleKn?: string;
  scenarioKn?: string;
}

const DOMAIN_QUESTION_VARIANTS: Record<string, Partial<Record<CandidateDomain, DomainVariantText>>> = {
  ocean_o1: {
    finance: {
      titleEn: 'Openness 1: Financial Modeling & Analytical Innovation',
      scenarioEn: 'I actively seek out and advocate for testing novel financial models, automated analytics, or algorithmic spreadsheets, even when current reporting workflows are stable.',
      titleHi: 'खुलापन 1: वित्तीय मॉडलिंग और विश्लेषणात्मक नवाचार',
      scenarioHi: 'जब मौजूदा वित्तीय रिपोर्टिंग प्रणाली स्थिर हो, तब भी मैं नए वित्तीय मॉडल, स्वचालित विश्लेषण और उन्नत टूल्स तलाशने का प्रयास करता/करती हूँ।',
      titleKn: 'ಮುಕ್ತತೆ 1: ಹಣಕಾಸು ಮಾದರಿ ಮತ್ತು ನವೀನ ವಿಶ್ಲೇಷಣೆ',
      scenarioKn: 'ಪ್ರಸ್ತುತ ಹಣಕಾಸು ವರದಿ ವ್ಯವಸ್ಥೆ ಸ್ಥಿರವಾಗಿದ್ದರೂ, ನಾನು ಹೊಸ ಹಣಕಾಸು ಮಾದರಿಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ವಿಶ್ಲೇಷಣಾ ವಿಧಾನಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಆಸಕ್ತಿ ವಹಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Openness 1: Strategic Frameworks & Growth Tools',
      scenarioEn: 'I actively seek out and advocate for testing novel strategic frameworks or business management platforms, even when current operations are stable.',
      titleHi: 'खुलापन 1: रणनीतिक ढांचे और प्रबंधन नवाचार',
      scenarioHi: 'जब मौजूदा व्यावसायिक प्रक्रियाएं स्थिर हों, तब भी मैं नए रणनीतिक ढांचे और प्रबंधन टूल्स को आजमाने के लिए तत्पर रहता/रहती हूँ।',
      titleKn: 'ಮುಕ್ತತೆ 1: ಕಾರ್ಯತಂತ್ರ ಮತ್ತು ನವೀನ ನಿರ್ವಹಣಾ ವಿಧಾನಗಳು',
      scenarioKn: 'ಪ್ರಸ್ತುತ ವ್ಯವಹಾರ ತಂತ್ರಗಳು ಸ್ಥಿರವಾಗಿದ್ದರೂ, ನಾನು ಹೊಸ ಮಾರುಕಟ್ಟೆ ತಂತ್ರಜ್ಞಾನಗಳು ಮತ್ತು ನಿರ್ವಹಣಾ ವಿಧಾನಗಳನ್ನು ಜಾರಿಗೆ ತರಲು ಮುಂದಾಗುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Openness 1: Workflow Automation & Logistics Tools',
      scenarioEn: 'I actively seek out and advocate for testing novel workflow automation, tracking systems, or logistics platforms, even when current processes are stable.',
      titleHi: 'खुलापन 1: परिचालन तकनीक और लॉजिस्टिक्स टूल्स',
      scenarioHi: 'जब वर्तमान परिचालन प्रक्रियाएं स्थिर हों, तब भी मैं नई वर्कफ़्लो तकनीकों, ट्रैकिंग सिस्टम और लॉजिस्टिक्स टूल्स की तलाश करता/करती हूँ।',
      titleKn: 'ಮುಕ್ತತೆ 1: ಕಾರ್ಯಾಚರಣೆ ಆಟೋಮೇಷನ್ ಮತ್ತು ಸಾಗಾಟ ವ್ಯವಸ್ಥೆ',
      scenarioKn: 'ಪ್ರಸ್ತುತ ಕಾರ್ಯಾಚರಣೆ ಪ್ರಕ್ರಿಯೆಗಳು ಸುಗಮವಾಗಿದ್ದರೂ, ನಾನು ಹೊಸ ವರ್ಕ್‌ಫ್ಲೋ ಆಟೋಮೇಷನ್ ಮತ್ತು ಸಾಗಾಟ ನಿರ್ವಹಣಾ ವಿಧಾನಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಲು ಉತ್ಸುಕನಾಗಿರುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Openness 1: Novel Design Systems & Creative Tools',
      scenarioEn: 'I actively seek out and advocate for testing novel design systems, generative tools, or interaction patterns, even when current UI/UX libraries are stable.',
      titleHi: 'खुलापन 1: नए डिज़ाइन सिस्टम और रचनात्मक टूल्स',
      scenarioHi: 'जब मौजूदा डिज़ाइन लाइब्रेरी स्थिर हो, तब भी मैं नए डिज़ाइन सिस्टम, प्रोटोटाइपिंग टूल्स और नवीन शैलियों के प्रयोग की तलाश करता/करती हूँ।',
      titleKn: 'ಮುಕ್ತತೆ 1: ಹೊಸ ವಿನ್ಯಾಸ ವ್ಯವಸ್ಥೆಗಳು ಮತ್ತು ಪರಿಕರಗಳು',
      scenarioKn: 'ಪ್ರಸ್ತುತ ವಿನ್ಯಾಸ ವ್ಯವಸ್ಥೆ ಸ್ಥಿರವಾಗಿದ್ದರೂ, ನಾನು ಹೊಸ ವಿನ್ಯಾಸ ಪರಿಕರಗಳು, ಪ್ರೋಟೋಟೈಪಿಂಗ್ ಸಾಧನಗಳು ಮತ್ತು ನವೀನ ಸಂವಹನ ಶೈಲಿಗಳನ್ನು ಅನ್ವೇಷಿಸುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Openness 1: Novel Research Paradigms & Methodologies',
      scenarioEn: 'I actively seek out and advocate for exploring novel research methodologies or interdisciplinary analytical frameworks, even when traditional methods are established.',
      titleHi: 'खुलापन 1: नई शोध पद्धतियाँ और अंतःविषय विश्लेषण',
      scenarioHi: 'जब पारंपरिक शोध पद्धतियाँ स्थापित हों, तब भी मैं नई शोध पद्धतियों और अंतःविषय विश्लेषण प्रणालियों को अपनाने की वकालत करता/करती हूँ।',
      titleKn: 'ಮುಕ್ತತೆ 1: ನವೀನ ಸಂಶೋಧನಾ ವಿಧಾನಗಳು ಮತ್ತು ತತ್ವಗಳು',
      scenarioKn: 'ಸಾಂಪ್ರದಾಯಿಕ ಸಂಶೋಧನಾ ವಿಧಾನಗಳು ಸುಸ್ಥಿರವಾಗಿದ್ದರೂ, ನಾನು ಹೊಸ ವಿಶ್ಲೇಷಣಾ ವಿಧಾನಗಳು ಮತ್ತು ಅಂತರಶಿಸ್ತೀಯ ತತ್ವಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಆಸಕ್ತಿ ವಹಿಸುತ್ತೇನೆ.',
    },
  },
  ocean_c1: {
    finance: {
      titleEn: 'Conscientiousness 1: Meticulous Reconciliation & Accuracy',
      scenarioEn: 'I double-check financial reconciliations, balance trails, and regulatory compliance thoroughly before considering any account closing completed.',
      titleHi: 'कर्तव्यनिष्ठा 1: वित्तीय मिलान और सूक्ष्म सटीकता',
      scenarioHi: 'मैं किसी भी वित्तीय कार्य या खाता मिलान को पूरा मानने से पहले लेजर, बैलेंस और नियमों की गहराई से दोबारा जांच करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ಹಣಕಾಸಿನ ಸಮನ್ವಯ ಮತ್ತು ನಿಖರತೆ',
      scenarioKn: 'ಯಾವುದೇ ಲೆಕ್ಕಪತ್ರವನ್ನು ಮುಕ್ತಾಯಗೊಳಿಸುವ ಮುನ್ನ ಲೆಡ್ಜರ್ ಹೊಂದಾಣಿಕೆ, ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಮತ್ತು ನಿಯಮಾವಳಿಗಳನ್ನು ನಾನು ಕೂಲಂಕಷವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Conscientiousness 1: Rigorous Proposal & Projection Vetting',
      scenarioEn: 'I double-check market assumptions, financial projections, and deliverables thoroughly before considering any strategic proposal completed.',
      titleHi: 'कर्तव्यनिष्ठा 1: व्यावसायिक प्रस्तावों की गहन समीक्षा',
      scenarioHi: 'मैं किसी भी रणनीतिक प्रस्ताव को अंतिम रूप देने से पहले बाजार के अनुमानों, वित्तीय आंकड़ों और प्रदेयों की गहराई से जांच करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ಕಾರ್ಯತಂತ್ರ ಪ್ರಸ್ತಾಪಗಳ ಕರಾರುವಾಕ್ ಪರಿಶೀಲನೆ',
      scenarioKn: 'ಯಾವುದೇ ಕಾರ್ಯತಂತ್ರ ಪ್ರಸ್ತಾಪವನ್ನು ಅಂತಿಮಗೊಳಿಸುವ ಮೊದಲು ಮಾರುಕಟ್ಟೆ ಅಂದಾಜುಗಳು, ಬಜೆಟ್ ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ನಾನು ಕರಾರುವಾಕ್ಕಾಗಿ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Conscientiousness 1: Rigorous Manifest & Quality Checks',
      scenarioEn: 'I double-check inventory counts, dispatch manifests, and safety checklists thoroughly before approving any operational handover.',
      titleHi: 'कर्तव्यनिष्ठा 1: इन्वेंटरी और परिचालन सटीकता',
      scenarioHi: 'मैं किसी भी परिचालन या आपूर्ति कार्य को पूरा मानने से पहले इन्वेंटरी, प्रेषण प्रपत्र और सुरक्षा मानकों की बारीकी से जांच करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ದಾಸ್ತಾನು ಮತ್ತು ಗುಣಮಟ್ಟದ ಕಟ್ಟುನಿಟ್ಟಿನ ಪರಿಶೀಲನೆ',
      scenarioKn: 'ಯಾವುದೇ ಕಾರ್ಯಾಚರಣೆ ಅಥವಾ ಸರಬರಾಜು ಅನುಮೋದಿಸುವ ಮುನ್ನ ದಾಸ್ತಾನು ವಿವರ, ರವಾನೆ ಪಟ್ಟಿ ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ನಾನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Conscientiousness 1: Pixel Precision & Accessibility Standards',
      scenarioEn: 'I double-check responsive breakpoints, accessibility guidelines (WCAG), and visual design tokens before handing off assets to production.',
      titleHi: 'कर्तव्यनिष्ठा 1: डिज़ाइन सटीकता और एक्सेसिबिलिटी मानक',
      scenarioHi: 'मैं किसी भी डिज़ाइन को अंतिम रूप देने से पहले एक्सेसिबिलिटी मानकों, विभिन्न स्क्रीन साइज़ और विज़ुअल घटकों की सूक्ष्मता से जांच करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ವಿನ್ಯಾಸದ ನಿಖರತೆ ಮತ್ತು ಗುಣಮಟ್ಟ',
      scenarioKn: 'ಯಾವುದೇ ವಿನ್ಯಾಸವನ್ನು ಅಂತಿಮಗೊಳಿಸುವ ಮುನ್ನ ಎಲ್ಲಾ ಪರದೆಯ ಹೊಂದಾಣಿಕೆಗಳು, ಪ್ರವೇಶ್ಯತೆ ಮಾನದಂಡಗಳು ಮತ್ತು ದೃಶ್ಯ ಅಂಶಗಳನ್ನು ನಾನು ಕೂಲಂಕಷವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Conscientiousness 1: Methodological Rigor & Data Integrity',
      scenarioEn: 'I double-check citation sources, statistical validity, and dataset anomalies thoroughly before submitting any academic manuscript or report.',
      titleHi: 'कर्तव्यनिष्ठा 1: शोध पद्धतियों और डेटा की कठोर जांच',
      scenarioHi: 'मैं किसी भी शोध पत्र या रिपोर्ट को प्रस्तुत करने से पहले संदर्भ स्रोतों, सांख्यिकीय वैधता और डेटासेट विसंगतियों की कठोरता से जांच करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ಸಂಶೋಧನಾ ಸತ್ಯಾಸತ್ಯತೆ ಮತ್ತು ನಿಖರತೆ',
      scenarioKn: 'ಯಾವುದೇ ಸಂಶೋಧನಾ ವರದಿ ಸಲ್ಲಿಸುವ ಮುನ್ನ ಮೂಲ ಉಲ್ಲೇಖಗಳು, ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ನಿಖರತೆ ಮತ್ತು ದತ್ತಾಂಶದ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ನಾನು ಆಳವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
    },
  },
  ocean_c5: {
    finance: {
      titleEn: 'Conscientiousness 5: Statutory & Compliance Governance',
      scenarioEn: 'I adhere strictly to statutory regulations and internal audit controls, even when taking procedural shortcuts could speed up transactions.',
      titleHi: 'कर्तव्यनिष्ठा 5: वैधानिक और ऑडिट नियमों का अनुपालन',
      scenarioHi: 'मैं वैधानिक नियमों और आंतरिक ऑडिट प्रक्रियाओं का कड़ाई से पालन करता/करती हूँ, भले ही शॉर्टकट से लेन-देन तेजी से हो सकता हो।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಶಾಸನಬದ್ಧ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ನಿಯಮ ಪಾಲನೆ',
      scenarioKn: 'ಶಾರ್ಟ್‌ಕಟ್‌ಗಳಿಂದ ಕೆಲಸ ಬೇಗ ಮುಗಿಯಬಹುದಾದರೂ, ನಾನು ಶಾಸನಬದ್ಧ ನಿಯಮಗಳು ಮತ್ತು ಆಂತರಿಕ ಲೆಕ್ಕಪರಿಶೋಧನಾ ಮಾನದಂಡಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Conscientiousness 5: Corporate Governance & Policy Adherence',
      scenarioEn: 'I adhere strictly to corporate policies and governance guidelines, even when bypassing approvals could accelerate deal closures.',
      titleHi: 'कर्तव्यनिष्ठा 5: कॉर्पोरेट नीतियां और अनुपालन',
      scenarioHi: 'मैं कॉर्पोरेट नीतियों और अनुमोदन प्रक्रियाओं का निष्ठापूर्वक पालन करता/करती हूँ, भले ही नियमों की अनदेखी से काम तेजी से हो सकता हो।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಸಾಂಸ್ಥಿಕ ನಿಯಮ ಮತ್ತು ನೀತಿ ಪಾಲನೆ',
      scenarioKn: 'ಅನುಮೋದನೆಗಳನ್ನು ಬೈಪಾಸ್ ಮಾಡುವುದರಿಂದ ಒಪ್ಪಂದಗಳು ಬೇಗ ಆಗಬಹುದಾದರೂ, ನಾನು ಸಾಂಸ್ಥಿಕ ನೀತಿಗಳು ಮತ್ತು ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Conscientiousness 5: SOP & Safety Compliance',
      scenarioEn: 'I adhere strictly to standard operating procedures (SOPs) and safety protocols, even when shortcutting steps could clear operational backlogs faster.',
      titleHi: 'कर्तव्यनिष्ठा 5: मानक संचालन प्रक्रियाएं (SOP) और सुरक्षा',
      scenarioHi: 'मैं मानक प्रक्रियाओं (SOP) और सुरक्षा प्रोटोकॉल का कड़ाई से पालन करता/करती हूँ, भले ही शॉर्टकट से बैकलॉग तेजी से साफ हो सकता हो।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಕಾರ್ಯಾಚರಣೆ ನಿಯಮಾವಳಿ ಮತ್ತು ಸುರಕ್ಷತಾ ಮಾನದಂಡ',
      scenarioKn: 'ಶಾರ್ಟ್‌ಕಟ್ ಬಳಸಿ ಕೆಲಸ ಮುಗಿಸಬಹುದಾದರೂ, ನಾನು ಪ್ರಮಾಣಿತ ಕಾರ್ಯವಿಧಾನಗಳು (SOP) ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Conscientiousness 5: Design Systems & Brand Standards',
      scenarioEn: 'I adhere strictly to brand style guides and design system tokens, even when improvising custom styles could speed up asset delivery.',
      titleHi: 'कर्तव्यनिष्ठा 5: ब्रांड दिशानिर्देश और डिज़ाइन मानक',
      scenarioHi: 'मैं ब्रांड गाइडलाइंस और डिज़ाइन सिस्टम का पूर्ण अनुपालन करता/करती हूँ, भले ही कस्टम शॉर्टकट से काम जल्दी हो सकता हो।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ವಿನ್ಯಾಸ ಶೈಲಿ',
      scenarioKn: 'ತಾತ್ಕಾಲಿಕ ವಿನ್ಯಾಸಗಳಿಂದ ಕೆಲಸ ಬೇಗ ಮುಗಿಯಬಹುದಾದರೂ, ನಾನು ಬ್ರ್ಯಾಂಡ್ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ವಿನ್ಯಾಸ ವ್ಯವಸ್ಥೆಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Conscientiousness 5: Academic Integrity & Ethical Clearance',
      scenarioEn: 'I adhere strictly to research ethics, institutional review board (IRB) standards, and attribution protocols, even under tight publication deadlines.',
      titleHi: 'कर्तव्यनिष्ठा 5: अकादमिक सत्यनिष्ठा और नैतिक मानक',
      scenarioHi: 'प्रकाशन की समय-सीमा का दबाव होने पर भी मैं शोध नैतिकता और संस्थागत समीक्षा बोर्ड के मानकों का कड़ाई से पालन करता/करती हूँ।',
      titleKn: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಶೈಕ್ಷಣಿಕ ಪ್ರಾಮಾಣಿಕತೆ ಮತ್ತು ನೀತಿ ಸಂಹಿತೆ',
      scenarioKn: 'ಪ್ರಕಟಣೆಯ ಗಡುವು ಹತ್ತಿರವಿದ್ದರೂ ಸಹ, ನಾನು ಸಂಶೋಧನಾ ನೀತಿಗಳು ಮತ್ತು ಸಂಸ್ಥೆಯ ಕಟ್ಟುನಿಟ್ಟಿನ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸುತ್ತೇನೆ.',
    },
  },
  ocean_e2: {
    finance: {
      titleEn: 'Extraversion 2: Collaborative Financial Analysis',
      scenarioEn: 'I feel most energized solving complex financial challenges through collaborative reviews, cross-table modeling, and team syncs.',
      titleHi: 'बहिर्मुखता 2: सामूहिक वित्तीय विश्लेषण',
      scenarioHi: 'जटिल वित्तीय चुनौतियों और मॉडल तैयार करते समय मैं सहकर्मियों के साथ मिलकर सामूहिक विश्लेषण और समीक्षा में सबसे अधिक ऊर्जावान महसूस करता/करती हूँ।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 2: ಜಂಟಿ ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ',
      scenarioKn: 'ಸಂಕೀರ್ಣ ಹಣಕಾಸು ಸಮಸ್ಯೆಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ ನಡೆಸುವಾಗ ತಂಡದ ಸದಸ್ಯರೊಂದಿಗೆ ಮುಕ್ತವಾಗಿ ಸಹಕರಿಸಿ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳುವುದರಲ್ಲಿ ನನಗೆ ಹೆಚ್ಚಿನ ಉತ್ಸಾಹವಿರುತ್ತದೆ.',
    },
    business: {
      titleEn: 'Extraversion 2: Interactive Strategy Brainstorming',
      scenarioEn: 'I feel most energized cracking complex strategic problems through live cross-functional workshops and collaborative brainstorming.',
      titleHi: 'बहिर्मुखता 2: रणनीतिक कार्यशालाओं से ऊर्जा',
      scenarioHi: 'जटिल व्यावसायिक रणनीतियों को हल करने के लिए सहकर्मियों के साथ सामूहिक कार्यशालाओं और लाइव विचार-मंथन में मुझे सबसे अधिक ऊर्जा मिलती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 2: ಕಾರ್ಯತಂತ್ರ ರೂಪಿಸುವ ಜಂಟಿ ಸಭೆಗಳು',
      scenarioKn: 'ಸಂಕೀರ್ಣ ವ್ಯಾಪಾರ ಸವಾಲುಗಳಿಗೆ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಲು ವಿವಿಧ ತಂಡಗಳೊಂದಿಗೆ ಒಟ್ಟಾಗಿ ಚರ್ಚಿಸಿ ಕಾರ್ಯತಂತ್ರ ರೂಪಿಸುವುದರಲ್ಲಿ ನನಗೆ ಹೆಚ್ಚಿನ ಉತ್ಸಾಹವಿರುತ್ತದೆ.',
    },
    operations: {
      titleEn: 'Extraversion 2: Operational Floor Alignment',
      scenarioEn: 'I feel most energized resolving operational bottlenecks through live floor huddles and rapid cross-functional war rooms.',
      titleHi: 'बहिर्मुखता 2: ऑन-ग्राउंड टीम समन्वय',
      scenarioHi: 'परिचालन रुकावटों को हल करने के लिए ऑन-ग्राउंड टीम बैठकों और त्वरित समस्या-निवारण चर्चाओं में मुझे सबसे अधिक ऊर्जा मिलती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 2: ನೇರ ಚರ್ಚೆ ಮತ್ತು ತಂಡದ ಸಮನ್ವಯ',
      scenarioKn: 'ಕಾರ್ಯಾಚರಣೆಯ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಲು ತಂಡದೊಂದಿಗೆ ನೇರ ಚರ್ಚೆ ನಡೆಸಿ ಜಂಟಿಯಾಗಿ ಪರಿಹಾರ ರೂಪಿಸುವುದರಲ್ಲಿ ನನಗೆ ಅಪಾರ ತೃಪ್ತಿ ಸಿಗುತ್ತದೆ.',
    },
    design: {
      titleEn: 'Extraversion 2: Co-Design & Collaborative Sprints',
      scenarioEn: 'I feel most energized solving user experience challenges through collaborative design sprints, sticky-note sessions, and co-design workshops.',
      titleHi: 'बहिर्मुखता 2: सामूहिक डिज़ाइन स्प्रिंट्स',
      scenarioHi: 'उपयोगकर्ता अनुभव की समस्याओं को सुलझाने के लिए डिज़ाइन स्प्रिंट्स, सामूहिक स्केचिंग और सहकर्मियों के साथ कार्यशालाओं में मुझे सबसे अधिक ऊर्जा मिलती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 2: ಸಹ-ವಿನ್ಯಾಸ ಮತ್ತು ಸೃಜನಾತ್ಮಕ ಕಾರ್ಯಾಗಾರಗಳು',
      scenarioKn: 'ಬಳಕೆದಾರ ಅನುಭವದ (UX) ಸವಾಲುಗಳನ್ನು ಪರಿಹರಿಸಲು ಸಹ-ವಿನ್ಯಾಸ ಕಾರ್ಯಾಗಾರಗಳು ಮತ್ತು ಸಾಮೂಹಿಕ ಸ್ಪ್ರಿಂಟ್‌ಗಳಲ್ಲಿ ಭಾಗವಹಿಸುವುದರಲ್ಲಿ ನನಗೆ ಅಪಾರ ಆಸಕ್ತಿ.',
    },
    academic: {
      titleEn: 'Extraversion 2: Seminar Debates & Scholarly Colloquiums',
      scenarioEn: 'I feel most energized exploring intellectual challenges through department colloquiums, seminar debates, and co-author brainstorming.',
      titleHi: 'बहिर्मुखता 2: बौद्धिक विचार-विमर्श और सेमिनार',
      scenarioHi: 'जटिल बौद्धिक प्रश्नों पर विचार करने के लिए विभाग के सम्मेलनों, सेमिनार चर्चाओं और साथी शोधकर्ताओं के साथ विचार-मंथन में मुझे सबसे अधिक प्रेरणा मिलती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 2: ವಿಚಾರಗೋಷ್ಠಿಗಳು ಮತ್ತು ಸಹ-ಸಂಶೋಧಕರ ಚರ್ಚೆ',
      scenarioKn: 'ಬೌದ್ಧಿಕ ಸವಾಲುಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಇಲಾಖೆಯ ವಿಚಾರಗೋಷ್ಠಿಗಳು ಮತ್ತು ಸಹ-ಸಂಶೋಧಕರೊಂದಿಗೆ ಮುಕ್ತ ಚರ್ಚೆಗಳಲ್ಲಿ ಭಾಗವಹಿಸುವುದು ನನಗೆ ಅತ್ಯಂತ ಪ್ರೇರಣಾದಾಯಕ.',
    },
  },
  ocean_e6: {
    finance: {
      titleEn: 'Extraversion 6: Executive Financial Presentations',
      scenarioEn: 'I look forward to presenting budget forecasts, quarterly financial briefings, and investor reviews in front of executive audiences.',
      titleHi: 'बहिर्मुखता 6: वरिष्ठ प्रबंधन के समक्ष वित्तीय प्रस्तुति',
      scenarioHi: 'वरिष्ठ नेतृत्व और हितधारकों के सामने बजट पूर्वानुमान, वित्तीय परिणाम और विश्लेषण प्रस्तुत करने में मुझे प्रसन्नता होती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 6: ಹಣಕಾಸು ಪ್ರಸ್ತುತಿ ಮತ್ತು ವರದಿ',
      scenarioKn: 'ಹಿರಿಯ ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಷೇರುದಾರರ ಮುಂದೆ ಬಜೆಟ್ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ ಪ್ರಸ್ತುತಪಡಿಸಲು ನಾನು ಸಂತೋಷದಿಂದ ಮುಂದೆ ಬರುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Extraversion 6: Strategic Pitching & Business Reviews',
      scenarioEn: 'I look forward to pitching strategic initiatives, quarterly business reviews, and executive proposals in front of sizable audiences.',
      titleHi: 'बहिर्मुखता 6: रणनीतिक प्रस्तावों की सार्वजनिक प्रस्तुति',
      scenarioHi: 'बड़े समूहों और नेतृत्व के सामने व्यावसायिक प्रस्ताव, रणनीतिक योजनाएं और तिमाही समीक्षा प्रस्तुत करने में मुझे उत्साह मिलता है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 6: ಕಾರ್ಯತಂತ್ರ ಪ್ರಸ್ತಾಪಗಳ ಪ್ರಸ್ತುತಿ',
      scenarioKn: 'ದೊಡ್ಡ ಸಭೆಗಳ ಮುಂದೆ ಕಾರ್ಯತಂತ್ರ ಪ್ರಸ್ತಾಪಗಳು ಮತ್ತು ತ್ರೈಮಾಸಿಕ ವ್ಯಾಪಾರ ವಿಮರ್ಶೆಗಳನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಲು ನಾನು ಯಾವಾಗಲೂ ಉತ್ಸುಕನಾಗಿರುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Extraversion 6: Operational Briefings & Scorecard Reviews',
      scenarioEn: 'I look forward to briefing stakeholders on logistics metrics, operational scorecards, and process retrospectives in front of leadership.',
      titleHi: 'बहिर्मुखता 6: लॉजिस्टिक्स और परिचालन समीक्षा',
      scenarioHi: 'वरिष्ठ अधिकारियों और टीम के सामने लॉजिस्टिक्स मेट्रिक्स, परिचालन रिपोर्ट और प्रक्रिया सुधार के परिणाम प्रस्तुत करने में मुझे गर्व महसूस होता है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 6: ಸರಬರಾಜು ಮತ್ತು ಪ್ರಗತಿ ವಿವರಣೆ',
      scenarioKn: 'ನಾಯಕತ್ವದ ಮುಂದೆ ಕಾರ್ಯಾಚರಣೆ ಪ್ರಗತಿ ಪಟ್ಟಿ, ಸರಬರಾಜು ವರದಿ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ ಸುಧಾರಣೆಯ ವಿವರಣೆ ನೀಡಲು ನನಗೆ ಹೆಮ್ಮೆ ಎನಿಸುತ್ತದೆ.',
    },
    design: {
      titleEn: 'Extraversion 6: UX Critiques & Design Walkthroughs',
      scenarioEn: 'I look forward to leading design walkthroughs, UX concept critiques, and visual pitches in front of broad stakeholder audiences.',
      titleHi: 'बहिर्मुखता 6: डिज़ाइन वॉकथ्रू और प्रस्तुतियाँ',
      scenarioHi: 'व्यापक हितधारकों और उत्पाद टीमों के सामने नए डिज़ाइन प्रोटोटाइप, उपयोगकर्ता अनुभव के विचार और विज़ुअल प्रस्तुतियां देने में मुझे आनंद आता है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 6: ವಿನ್ಯಾಸ ಪ್ರದರ್ಶನ ಮತ್ತು ಚರ್ಚೆ',
      scenarioKn: 'ವಿವಿಧ ಪಾಲುದಾರರ ಮುಂದೆ ನವೀನ ಯುಐ/ಯುಎಕ್ಸ್ ಪರಿಕಲ್ಪನೆಗಳು ಮತ್ತು ವಿನ್ಯಾಸ ಪ್ರದರ್ಶನಗಳನ್ನು ನೀಡಲು ನಾನು ಉತ್ಸುಕನಾಗಿರುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Extraversion 6: Academic Symposium & Conference Lectures',
      scenarioEn: 'I look forward to delivering research symposium presentations, conference lectures, and thesis defenses in front of academic peers.',
      titleHi: 'बहिर्मुखता 6: संगोष्ठी व्याख्यान और शोध प्रस्तुति',
      scenarioHi: 'अकादमिक साथियों और विशेषज्ञों के सम्मुख अपने शोध निष्कर्ष, संगोष्ठी व्याख्यान और सम्मेलन प्रस्तुतियाँ देने में मुझे प्रसन्नता होती है।',
      titleKn: 'ಬಹಿರ್ಮುಖತೆ 6: ವಿಚಾರಸಂಕಿರಣ ಭಾಷಣ ಮತ್ತು ಸಂಶೋಧನಾ ಪ್ರಸ್ತುತಿ',
      scenarioKn: 'ಶೈಕ್ಷಣಿಕ ಪರಿಣಿತರ ಮುಂದೆ ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳು, ವಿಚಾರಸಂಕಿರಣ ಭಾಷಣಗಳು ಮತ್ತು ಸಂಶೋಧನಾ ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಸ್ತುತಪಡಿಸಲು ನನಗೆ ತೃಪ್ತಿ ನೀಡುತ್ತದೆ.',
    },
  },
  ocean_a1: {
    finance: {
      titleEn: 'Agreeableness 1: Constructive Resolution in Audits',
      scenarioEn: 'When debating financial forecasts, budget allocations, or audit findings, I prioritize empathy and seek consensus rather than aggressively asserting my personal views.',
      titleHi: 'सहमतिशीलता 1: ऑडिट और बजट चर्चा में सौहार्द',
      scenarioHi: 'बजट आवंटन या वित्तीय समीक्षा पर चर्चा करते समय, मैं अपने विचार थोपने के बजाय सहानुभूति और आम सहमति बनाने को प्राथमिकता देता/देती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 1: ಲೆಕ್ಕಪರಿಶೋಧನಾ ಚರ್ಚೆಯಲ್ಲಿ ಒಮ್ಮತ',
      scenarioKn: 'ಬಜೆಟ್ ಹಂಚಿಕೆ ಅಥವಾ ಹಣಕಾಸು ಪರಿಶೀಲನೆಯ ಸಮಯದಲ್ಲಿ, ನನ್ನ ವೈಯಕ್ತಿಕ ನಿರ್ಧಾರವನ್ನು ಒತ್ತಾಯಿಸುವ ಬದಲು ಸೌಹಾರ್ದಯುತ ಒಮ್ಮತ ಮೂಡಿಸಲು ಪ್ರಾಶಸ್ತ್ಯ ನೀಡುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Agreeableness 1: Alignment in Strategic Roadmaps',
      scenarioEn: 'When debating strategic roadmaps or target priorities, I prioritize active listening and consensus-building rather than aggressively pushing my own proposal.',
      titleHi: 'सहमतिशीलता 1: रणनीतिक प्राथमिकताओं में साझा सहमति',
      scenarioHi: 'रणनीतिक प्राथमिकताओं या व्यावसायिक लक्ष्यों पर चर्चा करते समय, मैं अपने प्रस्ताव पर अड़े रहने के बजाय सहकर्मियों के साथ सहमति बनाने को प्राथमिकता देता/देती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 1: ಕಾರ್ಯತಂತ್ರ ಆದ್ಯತೆಗಳಲ್ಲಿ ಸಹಮತ',
      scenarioKn: 'ವ್ಯಾಪಾರ ಯೋಜನೆಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ಚರ್ಚಿಸುವಾಗ, ನನ್ನ ಅಭಿಪ್ರಾಯವನ್ನೇ ಸಮರ್ಥಿಸುವ ಬದಲು ಎಲ್ಲರ ಸಹಮತದೊಂದಿಗೆ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳಲು ಬಯಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Agreeableness 1: Resolution in Operational Handovers',
      scenarioEn: 'When debating shift handovers, inventory priorities, or resource distribution, I prioritize collaborative problem-solving over defensive dispute.',
      titleHi: 'सहमतिशीलता 1: परिचालन विवादों का शांतिपूर्ण समाधान',
      scenarioHi: 'शिफ्ट हैंडओवर या संसाधनों के वितरण पर मतभेद होने पर, मैं विवाद करने के बजाय सहानुभूतिपूर्वक सहयोग और व्यावहारिक समाधान को प्राथमिकता देता/देती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 1: ಸರಬರಾಜು ಮತ್ತು ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆಯಲ್ಲಿ ಸೌಹಾರ್ದ',
      scenarioKn: 'ಪಾಳಿ ಹಸ್ತಾಂತರ ಅಥವಾ ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆಯ ವಿಷಯದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಬಂದಾಗ, ವಾದ ಮಾಡದೆ ಒಮ್ಮತದ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಲು ನಾನು ಶ್ರಮಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Agreeableness 1: Empathy in Design Critiques',
      scenarioEn: 'When debating design directions or creative critiques, I prioritize constructive user empathy and alignment over defending my personal aesthetic choices.',
      titleHi: 'सहमतिशीलता 1: डिज़ाइन समीक्षा में उपयोगकर्ता-सहानुभूति',
      scenarioHi: 'डिज़ाइन समीक्षा या कलात्मक दृष्टिकोण पर चर्चा के दौरान, मैं अपनी व्यक्तिगत पसंद का बचाव करने के बजाय उपयोगकर्ता की जरूरतों और टीम की सहमति को प्राथमिकता देता/देती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 1: ವಿನ್ಯಾಸ ಚರ್ಚೆಯಲ್ಲಿ ಬಳಕೆದಾರರ ಹಿತಾಸಕ್ತಿ',
      scenarioKn: 'ವಿನ್ಯಾಸದ ಮೇಲಿನ ಚರ್ಚೆಯಲ್ಲಿ, ನನ್ನ ವೈಯಕ್ತಿಕ ಶೈಲಿಯನ್ನು ಸಮರ್ಥಿಸುವ ಬದಲು ಬಳಕೆದಾರರ ಅಗತ್ಯತೆ ಮತ್ತು ತಂಡದ ಒಮ್ಮತಕ್ಕೆ ನಾನು ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Agreeableness 1: Scholarly Respect in Peer Reviews',
      scenarioEn: 'When debating theoretical frameworks or manuscript peer evaluations, I prioritize scholarly respect and open inquiry over dogmatic defense of my thesis.',
      titleHi: 'सहमतिशीलता 1: सहकर्मी समीक्षा में अकादमिक सम्मान',
      scenarioHi: 'सैद्धांतिक दृष्टिकोण या समकक्ष समीक्षा पर चर्चा के दौरान, मैं अपने विचार पर अड़े रहने के बजाय अकादमिक सम्मान और साझा समझ को प्राथमिकता देता/देती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 1: ಸಂಶೋಧನಾ ವಿಮರ್ಶೆಯಲ್ಲಿ ಪರಸ್ಪರ ಗೌರವ',
      scenarioKn: 'ಸೈದ್ಧಾಂತಿಕ ಚರ್ಚೆಗಳಲ್ಲಿ, ನನ್ನ ನಿಲುವನ್ನೇ ಬಲವಂತಪಡಿಸುವ ಬದಲು ವಿದ್ವತ್ಪೂರ್ಣ ಗೌರವ ಮತ್ತು ತೆರೆದ ಮನಸ್ಸಿನ ಸಹಯೋಗಕ್ಕೆ ನಾನು ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ.',
    },
  },
  ocean_a4: {
    finance: {
      titleEn: 'Agreeableness 4: Humility to Concede Financial Points',
      scenarioEn: 'If a colleague presents a sounder financial model or cost-optimization approach during planning, I readily concede and champion their approach without pride.',
      titleHi: 'सहमतिशीलता 4: बेहतर वित्तीय विचारों का सम्मान',
      scenarioHi: 'यदि कोई सहकर्मी योजना के दौरान अधिक सटीक वित्तीय मॉडल या लागत बचत का विचार प्रस्तुत करता है, तो मैं सहर्ष उसे स्वीकार करता/करती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 4: ಉತ್ತಮ ಹಣಕಾಸು ಸಲಹೆಗಳ ನಮ್ರ ಸ್ವೀಕಾರ',
      scenarioKn: 'ಯೋಜನೆಯ ಸಮಯದಲ್ಲಿ ಸಹೋದ್ಯೋಗಿಯೊಬ್ಬರು ಹೆಚ್ಚು ನಿಖರವಾದ ಹಣಕಾಸು ಮಾದರಿಯನ್ನು ಸೂಚಿಸಿದರೆ, ನಾನು ಯಾವುದೇ ಹಿಂಜರಿಕೆಯಿಲ್ಲದೆ ಅವರ ಆಲೋಚನೆಯನ್ನು ಸ್ವಾಗತಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Agreeableness 4: Embracing Superior Business Proposals',
      scenarioEn: 'If a colleague presents a stronger market hypothesis or commercial strategy, I readily concede and champion their direction without pride.',
      titleHi: 'सहमतिशीलता 4: बेहतर व्यावसायिक रणनीतियों का समर्थन',
      scenarioHi: 'यदि कोई सहकर्मी अधिक प्रभावी बाजार रणनीति या व्यावसायिक दृष्टिकोण प्रस्तुत करता है, तो मैं खुशी से उनका समर्थन करता/करती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 4: ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ ತಂತ್ರಜ್ಞಾನಗಳ ಪ್ರೋತ್ಸಾಹ',
      scenarioKn: 'ಸಹೋದ್ಯೋಗಿಯೊಬ್ಬರು ಹೆಚ್ಚು ಪರಿಣಾಮಕಾರಿ ಮಾರುಕಟ್ಟೆ ಕಾರ್ಯತಂತ್ರವನ್ನು ಮುಂದಿಟ್ಟಾಗ, ನಾನು ಮುಕ್ತ ಮನಸ್ಸಿನಿಂದ ಅದನ್ನು ಒಪ್ಪಿಕೊಂಡು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Agreeableness 4: Adopting Better Logistics Workflows',
      scenarioEn: 'If a colleague proposes a more efficient logistical routing or dispatch procedure, I readily concede and help implement their plan without ego.',
      titleHi: 'सहमतिशीलता 4: बेहतर परिचालन सुझावों का स्वागत',
      scenarioHi: 'यदि कोई सहकर्मी अधिक कुशल आपूर्ति या लॉजिस्टिक्स प्रक्रिया का सुझाव देता है, तो मैं तुरंत उनके सुझाव को स्वीकार कर लागू करने में मदद करता/करती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 4: ವೇಗದ ಸರಬರಾಜು ಯೋಜನೆಗಳ ಬೆಂಬಲ',
      scenarioKn: 'ಸಹೋದ್ಯೋಗಿಯೊಬ್ಬರು ಹೆಚ್ಚು ವೇಗದ ಸಾಗಾಟ ಅಥವಾ ದಾಸ್ತಾನು ನಿರ್ವಹಣಾ ವಿಧಾನವನ್ನು ಪ್ರಸ್ತಾಪಿಸಿದರೆ, ನಾನು ಸಂತೋಷದಿಂದ ಅವರ ವಿಧಾನವನ್ನು ಬೆಂಬಲಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Agreeableness 4: Embracing Superior UX Solutions',
      scenarioEn: 'If a peer designs a more intuitive user interaction pattern or visual hierarchy, I readily concede and embrace their solution without ego.',
      titleHi: 'सहमतिशीलता 4: बेहतर यूआई/यूएक्स समाधानों का स्वागत',
      scenarioHi: 'यदि कोई सहकर्मी अधिक सहज और आकर्षक इंटरैक्शन डिज़ाइन प्रस्तुत करता है, तो मैं बिना किसी संकोच के उनके विचार को अपनाता/करती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 4: ಉತ್ತಮ ವಿನ್ಯಾಸ ಪರಿಹಾರಗಳ ಸಂತಸದ ಸ್ವೀಕಾರ',
      scenarioKn: 'ಸಹೋದ್ಯೋಗಿ ಬಳಕೆದಾರರಿಗೆ ಹೆಚ್ಚು ಸುಲಭವಾದ ವಿನ್ಯಾಸ ಶೈಲಿಯನ್ನು ರಚಿಸಿದಾಗ, ನಾನು ಯಾವುದೇ ಅಹಂಕಾರವಿಲ್ಲದೆ ಅವರ ವಿನ್ಯಾಸವನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Agreeableness 4: Openness to Rigorous Peer Critique',
      scenarioEn: 'If a peer or reviewer points out a more rigorous analytical proof or experimental control, I readily concede and integrate their refinement without ego.',
      titleHi: 'सहमतिशीलता 4: सूक्ष्म वैज्ञानिक सुधारों का सहर्ष स्वागत',
      scenarioHi: 'यदि कोई समीक्षक या साथी शोधकर्ता अधिक सटीक सांख्यिकीय विधि या तर्क प्रस्तुत करता है, तो मैं तुरंत उसे स्वीकार कर अपने शोध में शामिल करता/करती हूँ।',
      titleKn: 'ಸೌಹಾರ್ದತೆ 4: ನಿಖರ ವೈಜ್ಞಾನಿಕ ಸಲಹೆಗಳ ಮುಕ್ತ ಸ್ವಾಗತ',
      scenarioKn: 'ಸಹ-ಸಂಶೋಧಕರು ಹೆಚ್ಚು ಸೂಕ್ತವಾದ ವಿಶ್ಲೇಷಣಾ ವಿಧಾನವನ್ನು ಸೂಚಿಸಿದಾಗ, ನಾನು ಸಂತೋಷದಿಂದ ಅದನ್ನು ಸ್ವೀಕರಿಸಿ ಸಂಶೋಧನೆಯಲ್ಲಿ ಅಳವಡಿಸುತ್ತೇನೆ.',
    },
  },
  ocean_n1: {
    finance: {
      titleEn: 'Emotional Stability 1: Composure During Fiscal Emergencies',
      scenarioEn: 'When high-stakes financial discrepancies or critical audit emergencies arise, I stay emotionally calm and think clearly without panic.',
      titleHi: 'भावनात्मक स्थिरता 1: वित्तीय संकट में शांत मन',
      scenarioHi: 'जब किसी महत्वपूर्ण वित्तीय विसंगति या आपातकालीन ऑडिट की स्थिति आती है, तो मैं घबराने के बजाय पूरी तरह शांत रहकर स्पष्ट रूप से सोचता/सोचती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ಹಣಕಾಸಿನ ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿ ಸಂಯಮ',
      scenarioKn: 'ಅನಿರೀಕ್ಷಿತ ಹಣಕಾಸು ವ್ಯತ್ಯಾಸಗಳು ಅಥವಾ ತುರ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ ಎದುರಾದಾಗ, ನಾನು ಆತಂಕಗೊಳ್ಳದೆ ಶಾಂತರಾಗಿ ಯೋಚಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Emotional Stability 1: Composure During Client Escalations',
      scenarioEn: 'When major client escalations or business emergencies threaten high-value deals, I stay emotionally calm and think clearly without panic.',
      titleHi: 'भावनात्मक स्थिरता 1: व्यावसायिक संकट में शांति',
      scenarioHi: 'जब कोई बड़ा क्लाइंट संकट या व्यावसायिक आपातकाल उत्पन्न होता है, तो मैं घबराने के बजाय संयम से तर्कसंगत निर्णय लेता/लेती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ವ್ಯಾಪಾರ ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿ ಸ್ಥಿರತೆ',
      scenarioKn: 'ಪ್ರಮುಖ ಕ್ಲೈಂಟ್ ಸಮಸ್ಯೆಗಳು ಅಥವಾ ತುರ್ತು ವ್ಯಾಪಾರ ಸವಾಲುಗಳು ಎದುರಾದಾಗ, ನಾನು ಆತಂಕಗೊಳ್ಳದೆ ಸ್ಪಷ್ಟವಾಗಿ ಯೋಚಿಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Emotional Stability 1: Composure During Supply Disruptions',
      scenarioEn: 'When major supply disruptions or distribution bottlenecks paralyze the workflow, I stay emotionally calm and think clearly without panic.',
      titleHi: 'भावनात्मक स्थिरता 1: परिचालन रुकावटों में धैर्य',
      scenarioHi: 'जब आपूर्ति श्रृंखला में बड़ा व्यवधान या गंभीर लॉजिस्टिक्स संकट आता है, तो मैं घबराने के बजाय शांत रहकर परिचालन बहाल करने पर ध्यान देता/देती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ಸರಬರಾಜು ಅಡೆತಡೆಗಳಲ್ಲಿ ಧೈರ್ಯ',
      scenarioKn: 'ಪೂರೈಕೆ ಸರಪಳಿಯಲ್ಲಿ ದಿಢೀರ್ ಅಡಚಣೆ ಅಥವಾ ವಿತರಣಾ ಬಿಕ್ಕಟ್ಟು ಉಂಟಾದಾಗ, ನಾನು ಶಾಂತರಾಗಿ ಪರಿಸ್ಥಿತಿ ನಿಭಾಯಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Emotional Stability 1: Composure During Launch Defects',
      scenarioEn: 'When critical user flow defects or client design rejections occur right before launch, I stay emotionally calm and think clearly without panic.',
      titleHi: 'भावनात्मक स्थिरता 1: डिज़ाइन संकट में संतुलन',
      scenarioHi: 'जब लॉन्च से ठीक पहले कोई गंभीर यूआई समस्या या क्लाइंट की अस्वीकृति सामने आती है, तो मैं घबराने के बजाय शांत रहकर सुधार करता/करती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ಬಿಡುಗಡೆ ಮುನ್ನ ಎದುರಾಗುವ ಸವಾಲುಗಳಲ್ಲಿ ಸಂಯಮ',
      scenarioKn: 'ಪ್ರಾಜೆಕ್ಟ್ ಬಿಡುಗಡೆಗೆ ಮುನ್ನ ಪ್ರಮುಖ ವಿನ್ಯಾಸ ದೋಷಗಳು ಕಂಡುಬಂದಾಗ, ನಾನು ಗಲಿಬಿಲಿಗೊಳ್ಳದೆ ಶಾಂತರಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Emotional Stability 1: Composure During Research Crises',
      scenarioEn: 'When experimental anomalies occur or tight grant submission deadlines collapse, I stay emotionally calm and think clearly without panic.',
      titleHi: 'भावनात्मक स्थिरता 1: शोध संकट में मानसिक संतुलन',
      scenarioHi: 'जब प्रयोग में अप्रत्याशित विसंगति आ जाए या ग्रांट जमा करने की समय-सीमा संकट में हो, तो मैं घबराने के बजाय शांत मन से समाधान निकालता/निकालती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ಸಂಶೋಧನಾ ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿ ಸಮಾಧಾನ',
      scenarioKn: 'ಸಂಶೋಧನಾ ಪ್ರಯೋಗಗಳಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ದೋಷಗಳು ಅಥವಾ ಅನುದಾನ ಸಲ್ಲಿಕೆಯ ತುರ್ತು ಗಡುವು ಎದುರಾದಾಗ, ನಾನು ಧೃತಿಗೆಡದೆ ಸಮಾಧಾನದಿಂದ ಯೋಚಿಸುತ್ತೇನೆ.',
    },
  },
  ocean_n2: {
    finance: {
      titleEn: 'Emotional Stability 2: Constructive Audit Feedback Resilience',
      scenarioEn: 'When an auditor or senior leader delivers blunt criticism on my financial reports or models, I process it objectively without feeling defensive.',
      titleHi: 'भावनात्मक स्थिरता 2: वित्तीय समीक्षा को सकारात्मक लेना',
      scenarioHi: 'जब कोई ऑडिटर या वरिष्ठ अधिकारी मेरे वित्तीय मॉडल या रिपोर्ट पर कड़ी समीक्षा करता है, तो मैं बचाव करने के बजाय उसे निष्पक्ष रूप से सुधार के लिए अपनाता/करती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 2: ಹಣಕಾಸು ವಿಮರ್ಶೆ ಸ್ವೀಕಾರ',
      scenarioKn: 'ನನ್ನ ಹಣಕಾಸು ವರದಿಗಳು ಅಥವಾ ಲೆಕ್ಕಪತ್ರದ ಮೇಲೆ ಹಿರಿಯರು ಕಟುವಾದ ಟೀಕೆ ಮಾಡಿದಾಗ, ನಾನು ಅಸಮಾಧಾನಗೊಳ್ಳದೆ ವಾಸ್ತವಿಕವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Emotional Stability 2: Constructive Business Critique Reception',
      scenarioEn: 'When stakeholders deliver blunt criticism on my business proposal or performance numbers, I process it objectively without feeling defensive.',
      titleHi: 'भावनात्मक स्थिरता 2: व्यावसायिक समीक्षा को निष्पक्ष लेना',
      scenarioHi: 'जब हितधारक मेरे व्यावसायिक प्रस्ताव या रणनीति पर कड़ी आलोचना करते हैं, तो मैं नाराज होने के बजाय उसे वस्तुनिष्ठ रूप से स्वीकार करता/करती हूँ।',
      titleKn: 'भावनात्मक स्थिरता 2: ವ್ಯಾಪಾರ ಪ್ರಸ್ತಾಪಗಳ ಮೇಲಿನ ಟೀಕೆ ಸ್ವೀಕಾರ',
      scenarioKn: 'ನನ್ನ ವ್ಯಾಪಾರ ಪ್ರಸ್ತಾಪ ಅಥವಾ ಕಾರ್ಯತಂತ್ರದ ಬಗ್ಗೆ ನಾಯಕರು ಕಟು ಟೀಕೆ ಮಾಡಿದಾಗ, ನಾನು ಆತ್ಮರಕ್ಷಣೆಗೆ ಇಳಿಯದೆ ವಸ್ತುನಿಷ್ಠವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Emotional Stability 2: Operational Feedback Resilience',
      scenarioEn: 'When management or safety officers deliver blunt feedback on my operational workflows or plant logistics, I process it objectively without feeling defensive.',
      titleHi: 'भावनात्मक स्थिरता 2: परिचालन प्रतिक्रिया में संतुलन',
      scenarioHi: 'जब प्रबंधन या सुरक्षा अधिकारी मेरी परिचालन प्रक्रिया या लॉजिस्टिक्स योजना पर कड़ी प्रतिक्रिया देते हैं, तो मैं उसे सुधार के अवसर के रूप में स्वीकार करता/करती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 2: ಕಾರ್ಯಾಚರಣೆ ತಿದ್ದುಪಡಿಗಳ ಸ್ವೀಕಾರ',
      scenarioKn: 'ನನ್ನ ಕಾರ್ಯಾಚರಣೆ ಅಥವಾ ಸರಬರಾಜು ಯೋಜನೆಗಳ ಮೇಲೆ ಕಟ್ಟುನಿಟ್ಟಿನ ಟೀಕೆಗಳು ಬಂದಾಗ, ನಾನು ಕೋಪಗೊಳ್ಳದೆ ಸಕಾರಾತ್ಮಕವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Emotional Stability 2: Design Critique Resilience',
      scenarioEn: 'When clients or teammates deliver blunt criticism on my visual concepts or UX wireframes, I process it objectively without feeling defensive.',
      titleHi: 'भावनात्मक स्थिरता 2: कलात्मक आलोचना में संतुलन',
      scenarioHi: 'जब क्लाइंट या टीम के सदस्य मेरे डिज़ाइन या यूआई वायरफ्रेम पर कड़ी आलोचना करते हैं, तो मैं आहत होने के बजाय उसे उपयोगिता सुधारने का माध्यम मानता/मानती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 2: ವಿನ್ಯಾಸ ವಿಮರ್ಶೆಗಳನ್ನು ಸಕಾರಾತ್ಮಕವಾಗಿ ಸ್ವೀಕರಿಸುವುದು',
      scenarioKn: 'ನನ್ನ ವಿನ್ಯಾಸಗಳು ಅಥವಾ ಯುಐ ಪರಿಕಲ್ಪನೆಗಳ ಬಗ್ಗೆ ಕ್ಲೈಂಟ್‌ಗಳು ಕಟು ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿದಾಗ, ನಾನು ಬೇಸರಗೊಳ್ಳದೆ ಸುಧಾರಣೆಗೆ ಬಳಸಿಕೊಳ್ಳುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Emotional Stability 2: Peer Review Resilience',
      scenarioEn: 'When anonymous peer reviewers or thesis advisors deliver harsh critiques of my manuscript methodology, I process it objectively without feeling defensive.',
      titleHi: 'भावनात्मक स्थिरता 2: शोध समीक्षा को परिपक्वता से लेना',
      scenarioHi: 'जब शोध समीक्षक या सलाहकार मेरे शोध पत्र और कार्यपद्धति पर कड़ी आपत्ति जताते हैं, तो मैं रक्षात्मक होने के बजाय अकादमिक सुधार के रूप में देखता/देखती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 2: ಸಂಶೋಧನಾ ವಿಮರ್ಶೆಗಳ ಪ್ರಬುದ್ಧ ಸ್ವೀಕಾರ',
      scenarioKn: 'ನನ್ನ ಸಂಶೋಧನಾ ಪ್ರಬಂಧ ಅಥವಾ ವಿಧಾನದ ಮೇಲೆ ತಜ್ಞರು ಕಠಿಣ ಟೀಕೆಗಳನ್ನು ನೀಡಿದಾಗ, ನಾನು ಅಸಮಾಧಾನಗೊಳ್ಳದೆ ವಿದ್ವತ್ಪೂರ್ಣವಾಗಿ ಸರಿಪಡಿಸಿಕೊಳ್ಳುತ್ತೇನೆ.',
    },
  },
  ocean_n6: {
    finance: {
      titleEn: 'Emotional Stability 6: Patience with Compliance Queues',
      scenarioEn: 'I maintain an even temper when dealing with sluggish banking portals, multi-tier compliance clearances, or slow audit sign-offs.',
      titleHi: 'भावनात्मक स्थिरता 6: अनुपालन औपचारिकताओं में धैर्य',
      scenarioHi: 'धीमे बैंकिंग पोर्टल, बहुस्तरीय अनुपालन औपचारिकताओं या ऑडिट की देरी का सामना करते हुए भी मेरा धैर्य और स्वभाव संतुलित रहता है।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ಬ್ಯಾಂಕಿಂಗ್ ಪ್ರಕ್ರಿಯೆಗಳಲ್ಲಿ ತಾಳ್ಮೆ',
      scenarioKn: 'ನಿಧಾನಗತಿಯ ಬ್ಯಾಂಕಿಂಗ್ ಪೋರ್ಟಲ್‌ಗಳು ಅಥವಾ ಬಹು-ಹಂತದ ಅನುಮೋದನೆಗಳಿದ್ದರೂ ಸಹ ನಾನು ಸಂಯಮ ಮತ್ತು ಸಹನೆಯಿಂದ ವರ್ತಿಸುತ್ತೇನೆ.',
    },
    business: {
      titleEn: 'Emotional Stability 6: Navigating Red Tape with Equanimity',
      scenarioEn: 'I maintain an even temper when navigating administrative red tape, sluggish contract sign-offs, or delayed partner responses.',
      titleHi: 'भावनात्मक स्थिरता 6: प्रशासनिक देरी में संयम',
      scenarioHi: 'कागजी औपचारिकताओं, अनुबंधों में देरी या भागीदारों की सुस्त प्रतिक्रिया के बीच भी मैं शांत और संयमित बना/बनी रहती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ಆಡಳಿತಾತ್ಮಕ ವಿಳಂಬಗಳಲ್ಲಿ ಸಂಯಮ',
      scenarioKn: 'ಆಡಳಿತಾತ್ಮಕ ವಿಳಂಬಗಳು ಅಥವಾ ನಿಧಾನಗತಿಯ ಒಪ್ಪಂದ ಪ್ರಕ್ರಿಯೆಗಳ ನಡುವೆಯೂ ನಾನು ತಾಳ್ಮೆ ಮತ್ತು ಸಮಾಧಾನ ಕಾಯ್ದುಕೊಳ್ಳುತ್ತೇನೆ.',
    },
    operations: {
      titleEn: 'Emotional Stability 6: Patience with Logistics Delays',
      scenarioEn: 'I maintain an even temper when handling vendor dispatch delays, customs paperwork holdups, or slow logistics partners.',
      titleHi: 'भावनात्मक स्थिरता 6: लॉजिस्टिक्स देरी में धैर्य',
      scenarioHi: 'विक्रेताओं की डिलीवरी में देरी, सीमा शुल्क की कागजी कार्रवाई या लॉजिस्टिक्स समस्याओं के दौरान भी मैं धैर्यपूर्वक काम करता/करती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ಸಾಗಾಟ ವಿಳಂಬಗಳ ನಡುವೆ ಸಮಾಧಾನ',
      scenarioKn: 'ಸರಕು ವಿಳಂಬಗಳು ಅಥವಾ ಕಸ್ಟಮ್ಸ್ ದಾಖಲೆಗಳ ತೊಡಕುಗಳ ನಡುವೆಯೂ ನಾನು ತಾಳ್ಮೆ ಕಳೆದುಕೊಳ್ಳದೆ ಶಾಂತರಾಗಿ ಕೆಲಸ ಮುಂದುವರಿಸುತ್ತೇನೆ.',
    },
    design: {
      titleEn: 'Emotional Stability 6: Patience with Iterative Revisions',
      scenarioEn: 'I maintain an even temper when handling multi-round stakeholder change requests, delayed assets, or rendering bottlenecks.',
      titleHi: 'भावनात्मक स्थिरता 6: बार-बार बदलाव के अनुरोधों में धैर्य',
      scenarioHi: 'हितधारकों के बार-बार बदलाव के अनुरोध, धीमी रेंडरिंग या सामग्री में देरी के बावजूद मैं धैर्य और सकारात्मक रुख बनाए रखता/रहती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ಪುನರಾವರ್ತಿತ ಬದಲಾವಣೆಗಳಲ್ಲಿ ತಾಳ್ಮೆ',
      scenarioKn: 'ಪಾಲುದಾರರ ಪದೇ ಪದೇ ಬದಲಾಗುವ ಬೇಡಿಕೆಗಳು ಅಥವಾ ಪ್ರಕ್ರಿಯೆ ವಿಳಂಬಗಳಿದ್ದರೂ ಸಹ ನಾನು ತಾಳ್ಮೆ ಮತ್ತು ಉತ್ಸಾಹದಿಂದ ಕೆಲಸ ಮಾಡುತ್ತೇನೆ.',
    },
    academic: {
      titleEn: 'Emotional Stability 6: Patience with Academic Cycles',
      scenarioEn: 'I maintain an even temper when dealing with prolonged peer-review cycles, institutional ethics delays, or slow grant disbursements.',
      titleHi: 'भावनात्मक स्थिरता 6: शोध समीक्षा के लंबे दौर में धैर्य',
      scenarioHi: 'शोध समीक्षा के लंबे दौर, संस्थागत अनुमतियों में देरी या अनुदान मिलने में विलंब के दौरान भी मैं धैर्यपूर्वक निरंतरता बनाए रखता/रहती हूँ।',
      titleKn: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ದೀರ್ಘ ಸಂಶೋಧನಾ ಪ್ರಕ್ರಿಯೆಗಳಲ್ಲಿ ತಾಳ್ಮೆ',
      scenarioKn: 'ದೀರ್ಘ ಸಂಶೋಧನಾ ಪರಿಶೀಲನೆ ಅಥವಾ ಸಾಂಸ್ಥಿಕ ಅನುಮೋದನೆಗಳ ವಿಳಂಬದ ನಡುವೆಯೂ ನಾನು ತಾಳ್ಮೆ ಮತ್ತು ಸಮಾಧಾನದಿಂದ ಮುನ್ನಡೆಯುತ್ತೇನೆ.',
    },
  },
};

// ============================================================================
// 1. WORKING PROFESSIONAL TRACK: OCEAN (30 Questions: 6 per Category) + STAR (4 Questions)
// ============================================================================

export function buildProfessionalQuestions(
  roleTarget: string,
  targetIndustry: string,
  scenarioContext?: string,
  profileContext?: ICandidateProfileContext
): IDualPaneQuestion[] {
  const domain = resolveDomain(profileContext || { currentRole: roleTarget, targetIndustry });
  const earlyCareer = isEarlyCareer(profileContext);
  const oceanQuestions: IDualPaneQuestion[] = [
    // -------------------------------------------------------------
    // OPENNESS TO EXPERIENCE (6 Questions: O1 - O6)
    // -------------------------------------------------------------
    {
      questionId: 'ocean_o1',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Novel Approaches)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Receptiveness to emerging technologies and experimenting with novel paradigms.',
      en: {
        title: 'Openness 1: Novel Frameworks & Paradigms',
        scenario: 'I actively seek out and advocate for testing novel frameworks or experimental tools, even when the current tech stack is stable.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 1: नई तकनीकें और विचार',
        scenario: 'जब मौजूदा सिस्टम स्थिर हो, तब भी मैं नई तकनीकों और नए प्रयोगों की तलाश करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 1: ಹೊಸ ಪರಿಕಲ್ಪನೆಗಳು ಮತ್ತು ಪ್ರಯೋಗಗಳು',
        scenario: 'ಪ್ರಸ್ತುತ ವ್ಯವಸ್ಥೆಯು ಸ್ಥಿರವಾಗಿದ್ದರೂ ಸಹ, ನಾನು ಹೊಸ ಸಾಧನಗಳು ಅಥವಾ ವಿಧಾನಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಉತ್ಸುಕನಾಗಿರುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_o2',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Ambiguity & Exploration)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Comfort working within ambiguous boundaries without predefined roadmaps.',
      en: {
        title: 'Openness 2: Thriving in Ambiguity',
        scenario: 'I feel energized rather than frustrated when tackling open-ended business problems that lack rigid specifications or established precedents.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 2: अस्पष्ट समस्याओं का समाधान',
        scenario: 'जब किसी प्रोजेक्ट में स्पष्ट नियम या पूर्व उदाहरण न हों, तो मुझे बेचैनी के बजाय नया सोचने की प्रेरणा मिलती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 2: ಅಸ್ಪಷ್ಟತೆಯ ನಡುವೆ ಕಾರ್ಯನಿರ್ವಹಣೆ',
        scenario: 'ಸ್ಪಷ್ಟವಾದ ನಿಯಮಗಳಿಲ್ಲದ ತೆರೆದ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುವಾಗ ನಾನು ನಿರಾಶರಾಗದೆ ಹೊಸ ಮಾರ್ಗಗಳನ್ನು ಕಂಡುಕೊಳ್ಳುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_o3',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Challenging Convention)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Constructive willingness to challenge conventional standard operating procedures.',
      en: {
        title: 'Openness 3: Challenging Standard Practices',
        scenario: 'I frequently question standard operating procedures to uncover whether legacy practices are slowing down agility.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 3: पुरानी कार्यप्रणाली पर सवाल उठाना',
        scenario: 'मैं नियमित रूप से पारंपरिक नियमों और प्रक्रियाओं की समीक्षा करता/करती हूँ ताकि कार्यकुशलता बढ़ाई जा सके।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 3: ರೂಢಿಗತ ಪದ್ಧತಿಗಳನ್ನು ಪ್ರಶ್ನಿಸುವುದು',
        scenario: 'ಹಳೆಯ ಪದ್ಧತಿಗಳು ವೇಗವನ್ನು ಕುಂಠಿತಗೊಳಿಸುತ್ತಿವೆಯೇ ಎಂದು ತಿಳಿಯಲು ನಾನು ನಿಯಮಿತವಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನಗಳನ್ನು ಮರುಪರಿಶೀಲಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_o4',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Cross-Domain Curiosity)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Interdisciplinary synthesis and applying outside concepts to work problems.',
      en: {
        title: 'Openness 4: Cross-Disciplinary Synthesis',
        scenario: 'I enjoy drawing insights from fields outside my immediate domain (such as psychology, design, or economics) to solve operational challenges.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 4: विविध क्षेत्रों से सीखना',
        scenario: 'मैं कार्यस्थल की समस्याओं को सुलझाने के लिए अपने डोमेन से बाहर (जैसे डिजाइन या अर्थशास्त्र) के सिद्धांतों का उपयोग करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 4: ವಿಭಿನ್ನ ಕ್ಷೇತ್ರಗಳ ಜ್ಞಾನ ಬಳಕೆ',
        scenario: 'ನನ್ನ ಕಾರ್ಯಕ್ಷೇತ್ರದ ಹೊರಗಿನ (ವಿನ್ಯಾಸ ಅಥವಾ ಅರ್ಥಶಾಸ್ತ್ರ) ಜ್ಞಾನವನ್ನು ಬಳಸಿಕೊಂಡು ಸಂಕೀರ್ಣ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ನನಗೆ ಸಂತೋಷವೆನಿಸುತ್ತದೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_o5',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Strategic Adaptability)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Enthusiastic adaptation when organizational or product direction pivots unexpectedly.',
      en: {
        title: 'Openness 5: Receptive to Strategic Pivots',
        scenario: 'When strategic priorities shift abruptly, I quickly embrace the pivot as an opportunity for learning rather than resisting the disruption.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 5: रणनीतिक बदलाव को स्वीकारना',
        scenario: 'जब प्राथमिकताओं में अचानक बदलाव आता है, तो मैं इसका विरोध करने के बजाय इसे सीखने का नया अवसर मानता/मानती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 5: ದಿಢೀರ್ ಬದಲಾವಣೆಗಳಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವುದು',
        scenario: 'ಯೋಜನೆಯ ಆದ್ಯತೆಗಳು ದಿಢೀರನೆ ಬದಲಾದಾಗ, ನಾನು ನಿರಾಶೆಗೊಳ್ಳದೆ ಅದನ್ನು ಹೊಸ ಕಲಿಕೆಯ ಅವಕಾಶವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_o6',
      competencyKey: 'ocean_openness',
      competencyName: 'Openness to Experience',
      category: 'ocean',
      subCategory: 'Openness (Creative Brainstorming)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Divergent thinking and brainstorming innovative alternatives when conventional steps stall.',
      en: {
        title: 'Openness 6: Lateral Problem Solving',
        scenario: 'When standard troubleshooting reaches a dead end, I thrive on facilitating non-linear, unorthodox brainstorming brainstorms.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'खुलापन 6: रचनात्मक विचार-मंथन',
        scenario: 'जब सामान्य तरीके विफल हो जाते हैं, तो मैं लीक से हटकर नए और रचनात्मक समाधान निकालने में आनंद लेता/लेती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಮುಕ್ತತೆ 6: ಸೃಜನಾತ್ಮಕ ಪರಿಹಾರ ಶೋಧ',
        scenario: 'ಸಾಮಾನ್ಯ ನಿಯಮಗಳು ವಿಫಲವಾದಾಗ, ನಾನು ಹೊಸ ರೀತಿಯ ಸೃಜನಾತ್ಮಕ ಆಲೋಚನೆಗಳ ಮೂಲಕ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಲು ಮುಂಚೂಣಿಯಲ್ಲಿರುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },

    // -------------------------------------------------------------
    // CONSCIENTIOUSNESS (6 Questions: C1 - C6)
    // -------------------------------------------------------------
    {
      questionId: 'ocean_c1',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Rigorous Quality)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Uncompromising attention to detail, code quality, and edge-case testing.',
      en: {
        title: 'Conscientiousness 1: Meticulous Execution',
        scenario: 'I double-check edge cases, test coverage, and documentation thoroughly before considering any work item completed.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 1: काम में सूक्ष्म सटीकता',
        scenario: 'मैं किसी भी काम को पूरा मानने से पहले उसकी गुणवत्ता, त्रुटियों और विवरणों की गहराई से दोबारा जांच करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 1: ಕರಾರುವಾಕ್ ಕೆಲಸ',
        scenario: 'ಯಾವುದೇ ಕೆಲಸವನ್ನು ಪೂರ್ಣಗೊಳಿಸುವ ಮೊದಲು ಅದರ ಗುಣಮಟ್ಟ, ದೋಷಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ನಾನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_c2',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Commitment Integrity)',
      questionType: 'likert',
      idealEvidenceCriteria: 'High dependability and honoring project commitments ahead of deadlines.',
      en: {
        title: 'Conscientiousness 2: Reliable Commitment Delivery',
        scenario: 'If I commit to a delivery milestone, stakeholders can rely on it being delivered on time without needing supervision.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 2: समयबद्ध प्रतिबद्धता',
        scenario: 'जब मैं किसी समय-सीमा की प्रतिबद्धता करता/करती हूँ, तो टीम बिना किसी निगरानी के मेरे काम पर पूरा भरोसा कर सकती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 2: ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸುವುದು',
        scenario: 'ನಾನು ನೀಡಿದ ಗಡುವಿನೊಳಗೆ ಯಾವುದೇ ಮೇಲ್ವಿಚಾರಣೆಯಿಲ್ಲದೆ ಜವಾಬ್ದಾರಿಯುತವಾಗಿ ಕೆಲಸವನ್ನು ಮುಗಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_c3',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Systematic Organization)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Structured organization of workflows, logs, and task tracking.',
      en: {
        title: 'Conscientiousness 3: Structured Workflow Organization',
        scenario: 'I maintain meticulous organization in my workspace, documentation, and backlog tasks to prevent cognitive overload.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 3: व्यवस्थित कार्यशैली',
        scenario: 'मैं अपने काम, दस्तावेजों और कार्यों की सूची को हमेशा सुव्यवस्थित रखता/रखती हूँ ताकि भ्रम की स्थिति न बने।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 3: ಸಂಘಟಿತ ಕಾರ್ಯವಿಧಾನ',
        scenario: 'ನನ್ನ ಕಾರ್ಯಕ್ಷೇತ್ರ, ದಾಖಲೆಗಳು ಮತ್ತು ದೈನಂದಿನ ಕೆಲಸಗಳನ್ನು ನಾನು ವ್ಯವಸ್ಥಿತವಾಗಿ ನಿರ್ವಹಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_c4',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Disciplined Prioritization)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Focus on high-value priority tasks while minimizing distractions.',
      en: {
        title: 'Conscientiousness 4: Focus & Impulse Control',
        scenario: 'I consistently resist distractions and finish high-priority, difficult tasks before attending to easier, low-impact chores.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 4: उच्च प्राथमिकताओं पर ध्यान',
        scenario: 'मैं ध्यान भटकाने वाली चीजों से बचते हुए पहले सबसे जरूरी और कठिन कार्यों को पूरा करने को प्राथमिकता देता/देती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 4: ಪ್ರಮುಖ ಆದ್ಯತೆಗಳ ಮೇಲೆ ಏಕಾಗ್ರತೆ',
        scenario: 'ಗೊಂದಲಗಳಿಗೆ ಒಳಗಾಗದೆ, ಮೊದಲು ಕಠಿಣ ಹಾಗೂ ಮಹತ್ವದ ಕಾರ್ಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ನಾನು ಶ್ರಮಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_c5',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Standard Adherence)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Commitment to governance, security benchmarks, and quality standards.',
      en: {
        title: 'Conscientiousness 5: Governance & Compliance Respect',
        scenario: 'I adhere strictly to security policies, architectural standards, and compliance guidelines even when under tight schedule pressure.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 5: नियमों और मानकों का पालन',
        scenario: 'समय की कमी होने पर भी मैं सुरक्षा मानकों, नीतियों और गुणवत्ता के नियमों से कोई समझौता नहीं करता/करती।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 5: ಸುರಕ್ಷತೆ ಮತ್ತು ನೀತಿಗಳ ಪಾಲನೆ',
        scenario: 'ಸಮಯದ ಒತ್ತಡವಿದ್ದರೂ ಸಹ ಸುರಕ್ಷತಾ ನಿಯಮಗಳು ಮತ್ತು ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳನ್ನು ನಾನು ತಪ್ಪದೇ ಪಾಲಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_c6',
      competencyKey: 'ocean_conscientiousness',
      competencyName: 'Conscientiousness',
      category: 'ocean',
      subCategory: 'Conscientiousness (Proactive Contingency)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Foresight in identifying potential blockers and building rollback/mitigation plans.',
      en: {
        title: 'Conscientiousness 6: Proactive Contingency Planning',
        scenario: 'Before kicking off a major initiative, I proactively formulate fallback options and disaster recovery plans for likely failure points.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'कर्तव्यनिष्ठा 6: पूर्व आपदा प्रबंधन योजना',
        scenario: 'किसी बड़े प्रोजेक्ट को शुरू करने से पहले मैं संभावित विफलताओं के लिए बैकअप और आपातकालीन योजना तैयार करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ 6: ಮುಂಚಿತ ಪರ್ಯಾಯ ಯೋಜನೆ',
        scenario: 'ಯಾವುದೇ ದೊಡ್ಡ ಯೋಜನೆಯನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮುನ್ನವೇ ಸಂಭವನೀಯ ಅಡೆತಡೆಗಳಿಗೆ ಪರ್ಯಾಯ ಪರಿಹಾರಗಳನ್ನು ನಾನು ಸಿದ್ಧಪಡಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },

    // -------------------------------------------------------------
    // EXTRAVERSION (6 Questions: E1 - E6)
    // -------------------------------------------------------------
    {
      questionId: 'ocean_e1',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Facilitation & Initiative)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Willingness to take the initiative and lead group discussions.',
      en: {
        title: 'Extraversion 1: Stepping Up to Facilitate',
        scenario: 'When a cross-functional discussion stalls or lacks direction, I naturally step forward to moderate and align the group.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 1: चर्चा का नेतृत्व करना',
        scenario: 'जब टीम की बैठक में असमंजस हो, तो मैं आगे बढ़कर बातचीत को सही दिशा देने और सभी को सहमत करने की पहल करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 1: ಮುಂಚೂಣಿಯಲ್ಲಿ ನಿಂತು ಸಂವಾದ',
        scenario: 'ತಂಡದ ಸಭೆಯಲ್ಲಿ ಸ್ಪಷ್ಟತೆ ಇಲ್ಲದಿದ್ದಾಗ, ನಾನು ಮುಂದೆ ಬಂದು ಎಲ್ಲರನ್ನೂ ಒಂದುಗೂಡಿಸಿ ದಿಕ್ಕು ತೋರಿಸಲು ಸಿದ್ಧನಾಗುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_e2',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Social Energy & Collaboration)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Drawing energy from active team interactions and collaborative work.',
      en: {
        title: 'Extraversion 2: Collaborative Momentum',
        scenario: 'I produce my best thinking through real-time group debates and collaborative pair sessions rather than working in isolation for days.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 2: सामूहिक कार्य से ऊर्जा',
        scenario: 'अकेले लंबे समय तक काम करने के मुकाबले, टीम के साथ विचार-विमर्श और संवाद में मेरी सोच अधिक तेज और रचनात्मक होती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 2: ಸಹಯೋಗದಲ್ಲಿ ಉತ್ತಮ ಸಾಧನೆ',
        scenario: 'ದಿನಗಟ್ಟಲೆ ಏಕಾಂಗಿಯಾಗಿ ಕೆಲಸ ಮಾಡುವುದಕ್ಕಿಂತ ತಂಡದೊಂದಿಗೆ ಚರ್ಚಿಸಿ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳುವುದು ನನ್ನ ಕೆಲಸವನ್ನು ಚುರುಕುಗೊಳಿಸುತ್ತದೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_e3',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Voice & Assertiveness)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Comfort expressing strong convictions in senior or high-visibility forums.',
      en: {
        title: 'Extraversion 3: Candid Professional Assertiveness',
        scenario: 'I feel completely comfortable raising contrarian viewpoints in meetings with senior executives or key customers.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 3: बेबाक और स्पष्ट संवाद',
        scenario: 'वरिष्ठ अधिकारियों या ग्राहकों की बैठकों में अपनी असहमत राय को स्पष्ट और आत्मविश्वास से रखने में मुझे कोई संकोच नहीं होता।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 3: ಮುಕ್ತ ಹಾಗೂ ಸ್ಪಷ್ಟ ಅಭಿಪ್ರಾಯ',
        scenario: 'ಹಿರಿಯ ನಾಯಕರು ಅಥವಾ ಗ್ರಾಹಕರೊಂದಿಗಿನ ಸಭೆಯಲ್ಲಿ ನನ್ನ ವಿಭಿನ್ನ ನಿಲುವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ವ್ಯಕ್ತಪಡಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_e4',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Stakeholder Engagement)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Proactive networking and establishing trust across disparate teams.',
      en: {
        title: 'Extraversion 4: Proactive Stakeholder Outreach',
        scenario: 'I regularly connect with colleagues across different departments to understand their goals, even when not working on an active project together.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 4: सहकर्मियों से सक्रिय संपर्क',
        scenario: 'मैं अन्य विभागों के सहकर्मियों से समय-समय पर संपर्क स्थापित करता/करती हूँ ताकि उनके दृष्टिकोण को समझ सकूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 4: ಸಕ್ರಿಯ ಸಹಯೋಗ ಮತ್ತು ಸಂಬಂಧ',
        scenario: 'ವಿವಿಧ ಇಲಾಖೆಗಳ ಸಹೋದ್ಯೋಗಿಗಳೊಂದಿಗೆ ನಿರಂತರ ಸಂಪರ್ಕದಲ್ಲಿರಲು ಮತ್ತು ಉತ್ತಮ ವೃತ್ತಿಪರ ಸಂಬಂಧ ಕಾಪಾಡಿಕೊಳ್ಳಲು ನಾನು ಉತ್ಸುಕನಾಗಿರುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_e5',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Morale & Motivation)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Injecting enthusiasm and positive momentum into team environments.',
      en: {
        title: 'Extraversion 5: Uplifting Team Energy',
        scenario: 'I make an intentional effort to bring positivity, celebrate wins, and elevate team morale during challenging sprints.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 5: टीम का उत्साह बढ़ाना',
        scenario: 'कठिन प्रोजेक्ट्स के दौरान मैं टीम का मनोबल बढ़ाने, सकारात्मक माहौल बनाने और छोटी जीतों का जश्न मनाने का प्रयास करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 5: ತಂಡದ ಉತ್ಸಾಹ ಹೆಚ್ಚಿಸುವುದು',
        scenario: 'ಒತ್ತಡದ ಸಮಯದಲ್ಲಿಯೂ ತಂಡದ ನೈತಿಕ ಸ್ಥೈರ್ಯವನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಸಕಾರಾತ್ಮಕ ವಾತಾವರಣ ಸೃಷ್ಟಿಸಲು ನಾನು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_e6',
      competencyKey: 'ocean_extraversion',
      competencyName: 'Extraversion',
      category: 'ocean',
      subCategory: 'Extraversion (Public Advocacy)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Comfort presenting ideas to large groups and championing technical projects publicly.',
      en: {
        title: 'Extraversion 6: Public Project Presentation',
        scenario: 'I look forward to presenting product demos, tech talks, and project retrospectives in front of sizable company audiences.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'बहिर्मुखता 6: सार्वजनिक मंच पर प्रस्तुति',
        scenario: 'कंपनी के बड़े समूहों के सामने प्रोजेक्ट के नतीजे, डेमो या तकनीकी प्रस्तुतियाँ देने में मुझे प्रसन्नता होती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಬಹಿರ್ಮುಖತೆ 6: ಸಾರ್ವಜನಿಕ ಪ್ರಸ್ತುತಿ',
        scenario: 'ದೊಡ್ಡ ತಂಡಗಳ ಮುಂದೆ ಯೋಜನೆಯ ಡೆಮೊ ಅಥವಾ ಪ್ರಸ್ತುತಿಗಳನ್ನು ನೀಡಲು ನಾನು ಸಂತೋಷದಿಂದ ಮುಂದೆ ಬರುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },

    // -------------------------------------------------------------
    // AGREEABLENESS (6 Questions: A1 - A6)
    // -------------------------------------------------------------
    {
      questionId: 'ocean_a1',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Empathetic De-escalation)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Diplomacy, active listening, and resolving interpersonal friction constructively.',
      en: {
        title: 'Agreeableness 1: Constructive Conflict De-escalation',
        scenario: 'When heated technical disagreements break out in code reviews or planning, my instinct is to seek underlying common ground.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 1: विवादों का शांतिपूर्ण समाधान',
        scenario: 'जब योजना या कोड समीक्षा के दौरान तीखी बहस होती है, तो मेरा पहला प्रयास मतभेदों को शांत कर साझा सहमति बनाना होता है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 1: ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳ ಸೌಹಾರ್ದ ಪರಿಹಾರ',
        scenario: 'ಯೋಜನೆಯ ಚರ್ಚೆಯಲ್ಲಿ ವಾದ-ವಿವಾದಗಳು ಉಂಟಾದಾಗ, ನಾನು ಶಾಂತರಾಗಿ ಎಲ್ಲರನ್ನೂ ಒಗ್ಗೂಡಿಸಲು ಶ್ರಮಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_a2',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Mentorship & Generosity)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Patience in mentoring junior peers and sharing knowledge unselfishly.',
      en: {
        title: 'Agreeableness 2: Patient Mentorship',
        scenario: 'I willingly invest my personal sprint hours to help unblock a struggling teammate or coach a junior colleague without feeling annoyed.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 2: सहकर्मियों का मार्गदर्शन',
        scenario: 'मैं किसी उलझे हुए साथी की मदद करने या कनिष्ठ सहयोगियों को सिखाने के लिए खुशी से अपना समय समर्पित करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 2: ಸಹೋದ್ಯೋಗಿಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ',
        scenario: 'ಕಷ್ಟದಲ್ಲಿರುವ ಸಹೋದ್ಯೋಗಿಗೆ ಸಹಾಯ ಮಾಡಲು ಅಥವಾ ಕಿರಿಯ ಸದಸ್ಯರಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನನ್ನ ಅಮೂಲ್ಯ ಸಮಯವನ್ನು ಸಂತೋಷದಿಂದ ನೀಡುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_a3',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Psychological Safety)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Fostering an open, non-judgmental environment where team members feel safe admitting mistakes.',
      en: {
        title: 'Agreeableness 3: Cultivating Psychological Safety',
        scenario: 'When a teammate makes a production blunder, I focus entirely on collaborative blameless remediation rather than pinpointing individual fault.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 3: दोषमुक्त सुरक्षित वातावरण',
        scenario: 'जब किसी साथी से बड़ी गलती हो जाती है, तो मैं उसे दोष देने के बजाय मिलकर समस्या का समाधान करने पर जोर देता/देती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 3: ದೋಷಮುಕ್ತ ಸಹಕಾರ ಮನೋಭಾವ',
        scenario: 'ಸಹೋದ್ಯೋಗಿಯಿಂದ ತಪ್ಪು ಸಂಭವಿಸಿದಾಗ, ದೂಷಿಸುವ ಬದಲು ಒಟ್ಟಾಗಿ ಸಮಸ್ಯೆಯನ್ನು ಸರಿಪಡಿಸಲು ನಾನು ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_a4',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Humility & Subordination of Ego)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Ego subordination and accepting consensus when a peer offers a superior solution.',
      en: {
        title: 'Agreeableness 4: Gracious Intellectual Humility',
        scenario: 'I easily concede and adopt someone else’s technical architecture if it solves the problem better than my own proposal.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 4: विनम्रता और बेहतर विचारों का सम्मान',
        scenario: 'यदि किसी सहकर्मी का समाधान मेरे प्रस्ताव से बेहतर साबित होता है, तो मैं बिना किसी अहंकार के उसे तुरंत स्वीकार कर लेता/लेती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 4: ನಮ್ರತೆ ಹಾಗೂ ಒಮ್ಮತದ ಸ್ವೀಕಾರ',
        scenario: 'ನನ್ನ ಪ್ರಸ್ತಾಪಕ್ಕಿಂತ ಸಹೋದ್ಯೋಗಿಯ ತಾಂತ್ರಿಕ ಪರಿಹಾರ ಉತ್ತಮವಾಗಿದ್ದಲ್ಲಿ, ನಾನು ಸಂತೋಷದಿಂದ ಅದನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_a5',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Trust & Good Faith)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Assuming positive intent and operating from a baseline of professional trust.',
      en: {
        title: 'Agreeableness 5: Assuming Positive Intent',
        scenario: 'I naturally assume colleagues have good intentions, even when their initial communication seems abrupt or unpolished.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 5: सकारात्मक इरादे का विश्वास',
        scenario: 'यदि किसी सहकर्मी की बातचीत थोड़ी सख्त लगे, तब भी मैं मानता/मानती हूँ कि उनका उद्देश्य काम को बेहतर बनाना ही है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 5: ಸಕಾರಾತ್ಮಕ ನಂಬಿಕೆ',
        scenario: 'ಸಹೋದ್ಯೋಗಿಯ ಸಂವಹನ ಕಟುವಾಗಿದ್ದರೂ ಸಹ, ಅವರ ಉದ್ದೇಶ ಒಳ್ಳೆಯದೇ ಆಗಿರುತ್ತದೆ ಎಂದು ನಾನು ನಂಬುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_a6',
      competencyKey: 'ocean_agreeableness',
      competencyName: 'Agreeableness',
      category: 'ocean',
      subCategory: 'Agreeableness (Team First Mindset)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Prioritizing team goals over personal accolades or visibility.',
      en: {
        title: 'Agreeableness 6: Team Over Personal Spotlight',
        scenario: 'I am completely content letting team accomplishments be recognized as a collective achievement without spotlighting my individual role.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'सहमतिशीलता 6: व्यक्तिगत श्रेय से ऊपर टीम',
        scenario: 'व्यक्तिगत प्रशंसा पाने के बजाय प्रोजेक्ट की सफलता का श्रेय पूरी टीम को मिलने से मुझे सच्ची खुशी होती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಸೌಹಾರ್ದತೆ 6: ತಂಡದ ಯಶಸ್ಸಿಗೆ ಪ್ರಾಶಸ್ತ್ಯ',
        scenario: 'ವೈಯಕ್ತಿಕ ಮೆಚ್ಚುಗೆಗಿಂತ ಇಡೀ ತಂಡದ ಸಾಮೂಹಿಕ ಯಶಸ್ಸು ನನ್ನ ಮೊದಲ ಆದ್ಯತೆಯಾಗಿರುತ್ತದೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },

    // -------------------------------------------------------------
    // EMOTIONAL STABILITY (6 Questions: N1 - N6)
    // -------------------------------------------------------------
    {
      questionId: 'ocean_n1',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (Crisis Composure)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Maintaining rational calmness and clear-headed decision making during live production outages.',
      en: {
        title: 'Emotional Stability 1: Composure During Outages',
        scenario: 'When a critical production incident occurs and alarms are firing, I stay emotionally calm and think clearly without panic.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 1: संकट में शांत मन',
        scenario: 'जब सिस्टम में कोई बड़ी खराबी आ जाए, तो मैं घबराने के बजाय पूरी तरह शांत रहकर तार्किक रूप से समाधान सोचता/सोचती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 1: ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಸಂಯಮ',
        scenario: 'ತಂತ್ರಜ್ಞಾನ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಗಂಭೀರ ದೋಷ ಉಂಟಾದಾಗ ನಾನು ಆತಂಕಗೊಳ್ಳದೆ ಶಾಂತರಾಗಿ ಯೋಚಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_n2',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (Constructive Critique Reception)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Absorbing blunt or critical peer reviews without becoming defensive or resentful.',
      en: {
        title: 'Emotional Stability 2: Constructive Feedback Resilience',
        scenario: 'When someone delivers blunt or critical feedback on my code or architecture, I process it objectively without feeling defensive.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 2: आलोचना को सकारात्मक लेना',
        scenario: 'जब मेरे काम पर सख्त आलोचना की जाती है, तो मैं बुरा मानने या बचाव करने के बजाय उसे सुधार के अवसर के रूप में देखता/देखती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 2: ರಚನಾತ್ಮಕ ವಿಮರ್ಶೆ ಸ್ವೀಕಾರ',
        scenario: 'ನನ್ನ ಕೆಲಸದ ಮೇಲೆ ಕಟುವಾದ ಟೀಕೆಗಳು ಬಂದಾಗ, ನಾನು ಕೋಪಗೊಳ್ಳದೆ ವಾಸ್ತವಿಕವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_n3',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (High-Pressure Endurance)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Sustained focus and stamina during crunch periods without emotional exhaustion.',
      en: {
        title: 'Emotional Stability 3: Sustained Pressure Focus',
        scenario: 'During intense delivery sprints with tight deadlines, my work quality and attention remain steady rather than degrading under pressure.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 3: अत्यधिक दबाव में निरंतरता',
        scenario: 'कड़े समय-सीमा वाले तनावपूर्ण दिनों में भी मेरी एकाग्रता और काम की गुणवत्ता स्थिर बनी रहती है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 3: ಒತ್ತಡದಲ್ಲಿಯೂ ಉತ್ತಮ ಗುಣಮಟ್ಟ',
        scenario: 'ಅತ್ಯಂತ ಬಿಡುವಿಲ್ಲದ ಮತ್ತು ಒತ್ತಡದ ದಿನಗಳಲ್ಲಿಯೂ ನನ್ನ ಕೆಲಸದ ಗುಣಮಟ್ಟ ಮತ್ತು ಗಮನ ಕಡಿಮೆಯಾಗುವುದಿಲ್ಲ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_n4',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (Rapid Bounce-Back)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Fast recovery after a failed launch, rejected proposal, or major setback.',
      en: {
        title: 'Emotional Stability 4: Rapid Post-Failure Recovery',
        scenario: 'If an initiative I spearheaded fails or is canceled after weeks of effort, I quickly reset and refocus on the next objective.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 4: असफलता से तुरंत उबरना',
        scenario: 'यदि मेरी मेहनत का कोई प्रोजेक्ट रद्द या असफल हो जाए, तो मैं निराश होने के बजाय तुरंत अगले लक्ष्य पर ध्यान केंद्रित करता/करती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 4: ಹಿನ್ನಡೆಯಿಂದ ಶೀಘ್ರವಾಗಿ ಚೇತರಿಸಿಕೊಳ್ಳುವುದು',
        scenario: 'ನನ್ನ ಯೋಜನೆ ಅನಿರೀಕ್ಷಿತವಾಗಿ ರದ್ದಾದರೂ, ನಾನು ಕುಗ್ಗದೆ ತಕ್ಷಣವೇ ಮುಂದಿನ ಗುರಿಯತ್ತ ಮುನ್ನಡೆಯುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_n5',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (Equanimity in Uncertainty)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Comfort with organizational restructuring, reorgs, and leadership changes.',
      en: {
        title: 'Emotional Stability 5: Steadiness Amid Uncertainty',
        scenario: 'When rumors of leadership changes or company restructuring circulate, I stay grounded on my commitments rather than becoming anxious.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 5: अनिश्चितता में स्थिरता',
        scenario: 'कंपनी में पुनर्गठन या नेतृत्व परिवर्तन की अफवाहों के दौरान, मैं चिंतित होने के बजाय अपने काम पर अडिग रहता/रहती हूँ।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 5: ಅನಿಶ್ಚಿತತೆಯ ನಡುವೆ ಸ್ಥಿರತೆ',
        scenario: 'ಸಂಸ್ಥೆಯಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆಗಳ ಚರ್ಚೆ ನಡೆದಾಗ, ನಾನು ಆತಂಕಕ್ಕೆ ಒಳಗಾಗದೆ ನನ್ನ ಕೆಲಸದ ಮೇಲೆ ಗಮನವಿಡುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
    {
      questionId: 'ocean_n6',
      competencyKey: 'ocean_emotional_stability',
      competencyName: 'Emotional Stability',
      category: 'ocean',
      subCategory: 'Emotional Stability (Patience with Daily Friction)',
      questionType: 'likert',
      idealEvidenceCriteria: 'Patience dealing with bureaucracy, flaky third-party APIs, and slow processes.',
      en: {
        title: 'Emotional Stability 6: Patience with Systemic Friction',
        scenario: 'I maintain an even temper when dealing with sluggish tools, bureaucratic approval queues, or unresponsive third-party APIs.',
        mcqOptions: LIKERT_OPTIONS_EN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      hi: {
        title: 'भावनात्मक स्थिरता 6: धीमी प्रक्रियाओं में धैर्य',
        scenario: 'धीमे सिस्टम, कागजी औपचारिकताओं या अप्रत्याशित देरी का सामना करते हुए भी मेरा धैर्य और स्वभाव संतुलित रहता है।',
        mcqOptions: LIKERT_OPTIONS_HI,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
      kn: {
        title: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ 6: ವ್ಯವಸ್ಥೆಯ ಅಡೆತಡೆಗಳ ನಡುವೆ ಸಹನೆ',
        scenario: 'ನಿಧಾನಗತಿಯ ಪ್ರಕ್ರಿಯೆಗಳು ಅಥವಾ ತಾಂತ್ರಿಕ ವಿಳಂಬಗಳಿದ್ದರೂ ಸಹ ನಾನು ಸಂಯಮ ಮತ್ತು ಸಹನೆಯಿಂದ ವರ್ತಿಸುತ್ತೇನೆ.',
        mcqOptions: LIKERT_OPTIONS_KN,
        writtenPrompt: '',
        writtenPlaceholder: '',
      },
    },
  ];

  // Enrich OCEAN questions with dimension, mandatory/optional status, and localized behavioral reasoning prompts
  const enrichedOceanQuestions: IDualPaneQuestion[] = oceanQuestions.map((q) => {
    const dim = q.questionId.startsWith('ocean_o') ? 'O'
      : q.questionId.startsWith('ocean_c') ? 'C'
      : q.questionId.startsWith('ocean_e') ? 'E'
      : q.questionId.startsWith('ocean_a') ? 'A'
      : 'N';

    // Exactly 1 question per dimension has mandatory Step 2 behavioural reasoning (6th question in each dimension)
    const isRationaleRequired = q.questionId.endsWith('6');
    const isOptionalExplanation = !isRationaleRequired;

    // Apply domain variant if available for this question
    const variant = DOMAIN_QUESTION_VARIANTS[q.questionId]?.[domain];
    const finalEnTitle = variant?.titleEn || q.en.title;
    const finalEnScenario = variant?.scenarioEn || q.en.scenario;
    const finalHiTitle = variant?.titleHi || q.hi.title;
    const finalHiScenario = variant?.scenarioHi || q.hi.scenario;
    const finalKnTitle = variant?.titleKn || q.kn.title;
    const finalKnScenario = variant?.scenarioKn || q.kn.scenario;

    // Neutral prompts without leaking internal dimension labels (OCEAN) or STAR frameworks
    // Calibrated dynamically for Students/Freshers (academic/internship) vs Experienced Professionals (workplace)
    const enPrompt = isRationaleRequired
      ? earlyCareer
        ? 'Reflect on your rating for this statement. Share a concrete academic project, internship, or collaborative team experience that demonstrates why you chose this response—what was the challenge, how did you respond, and what was the outcome?'
        : 'Reflect on your rating for this statement. Share a concrete real-world workplace experience that demonstrates why you chose this response—what was the challenge, how did you respond, and what was the outcome?'
      : 'Share a brief real-world example or context explaining why you chose this rating (optional).';

    const enPlaceholder = isRationaleRequired
      ? earlyCareer
        ? 'Required: Detail what happened in your project/internship, the action you took, and the outcome (at least 15 characters)...'
        : 'Required: Detail what happened in your workplace, the action you took, and the outcome (at least 15 characters)...'
      : 'Optional: Share a brief real-life example or reason explaining your rating...';

    const hiPrompt = isRationaleRequired
      ? earlyCareer
        ? 'इस कथन पर अपनी रेटिंग पर विचार करें और कॉलेज प्रोजेक्ट, इंटर्नशिप या टीम वर्क का एक वास्तविक अनुभव साझा करें—चुनौती क्या थी, आपने कैसे संभाला, और उसका क्या परिणाम रहा?'
        : 'इस कथन पर अपनी रेटिंग पर विचार करें और कार्यस्थल का एक वास्तविक अनुभव साझा करें—चुनौती क्या थी, आपने कैसे संभाला, और उसका क्या परिणाम रहा?'
      : 'अपनी रेटिंग को स्पष्ट करने के लिए यदि चाहें तो कार्यस्थल का कोई संक्षिप्त वास्तविक उदाहरण या संदर्भ साझा करें (ऐच्छिक)।';

    const hiPlaceholder = isRationaleRequired
      ? earlyCareer
        ? 'अनिवार्य: अपने प्रोजेक्ट/इंटर्नशिप का अनुभव, उठाए गए कदम और परिणाम यहाँ लिखें (कम से कम 15 अक्षर)...'
        : 'अनिवार्य: अपने वास्तविक अनुभव, उठाए गए कदम और परिणाम का विवरण यहाँ लिखें (कम से कम 15 अक्षर)...'
      : 'वैकल्पिक: अपनी रेटिंग के पीछे का संक्षिप्त कारण या उदाहरण यहाँ लिखें...';

    const knPrompt = isRationaleRequired
      ? earlyCareer
        ? 'ಈ ಹೇಳಿಕೆಗೆ ನೀಡಿದ ರೇಟಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸಲು ನಿಮ್ಮ ಕಾಲೇಜು ಪ್ರಾಜೆಕ್ಟ್, ಇಂಟರ್ನ್‌ಶಿಪ್ ಅಥವಾ ತಂಡದ ನೈಜ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ—ಸವಾಲು ಏನಾಗಿತ್ತು, ನೀವು ಹೇಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿದಿರಿ ಮತ್ತು ಫಲಿತಾಂಶವೇನು?'
        : 'ಈ ಹೇಳಿಕೆಗೆ ನೀಡಿದ ರೇಟಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸಲು ನಿಮ್ಮ ಕೆಲಸದ ಸ್ಥಳದ ನೈಜ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ—ಸವಾಲು ಏನಾಗಿತ್ತು, ನೀವು ಹೇಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿದಿರಿ ಮತ್ತು ಫಲಿತಾಂಶವೇನು?'
      : 'ನಿಮ್ಮ ರೇಟಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸಲು ಕೆಲಸದ ಸ್ಥಳದ ಯಾವುದೇ ಸಂಕ್ಷಿಪ್ತ ನೈಜ ಉದಾಹರಣೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ (ಐಚ್ಛಿಕ).';

    const knPlaceholder = isRationaleRequired
      ? earlyCareer
        ? 'ಕಡ್ಡಾಯ: ಪ್ರಾಜೆಕ್ಟ್/ಇಂಟರ್ನ್‌ಶಿಪ್ ಸನ್ನಿವೇಶ, ನಿಮ್ಮ ಕಾರ್ಯ ಮತ್ತು ಅಂತಿಮ ಫಲಿತಾಂಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು)...'
        : 'ಕಡ್ಡಾಯ: ಸನ್ನಿವೇಶ, ನಿಮ್ಮ ಕಾರ್ಯ ಮತ್ತು ಅಂತಿಮ ಫಲಿತಾಂಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು)...'
      : 'ಐಚ್ಛಿಕ: ನಿಮ್ಮ ರೇಟಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸುವ ಸಂಕ್ಷಿಪ್ತ ವಿವರವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...';

    return {
      ...q,
      dimension: dim as 'O' | 'C' | 'E' | 'A' | 'N',
      isRationaleRequired,
      isOptionalExplanation,
      en: {
        ...q.en,
        title: finalEnTitle,
        scenario: finalEnScenario,
        writtenPrompt: enPrompt,
        writtenPlaceholder: enPlaceholder,
      },
      hi: {
        ...q.hi,
        title: finalHiTitle,
        scenario: finalHiScenario,
        writtenPrompt: hiPrompt,
        writtenPlaceholder: hiPlaceholder,
      },
      kn: {
        ...q.kn,
        title: finalKnTitle,
        scenario: finalKnScenario,
        writtenPrompt: knPrompt,
        writtenPlaceholder: knPlaceholder,
      },
    };
  });

  // Strictly 30 questions for Working Professionals (STAR subjective case study removed)
  return enrichedOceanQuestions;
}

// ============================================================================
// 2. STUDENT TRACK: MBTI (12 Questions) + HOLLAND (4 Questions)
// Option-based approach with limited text length, subtle/non-obvious options,
// and an optional explanation box for each question.
// ============================================================================

export function buildStudentQuestions(
  roleTarget?: string,
  targetIndustry?: string,
  profileContext?: ICandidateProfileContext
): IDualPaneQuestion[] {
  const mbtiQuestions: IDualPaneQuestion[] = [
    // -------------------------------------------------------------
    // EXTRAVERSION (E) vs INTROVERSION (I) - 3 Questions
    // -------------------------------------------------------------
    {
      questionId: 'mbti_ei_1',
      competencyKey: 'mbti_energy',
      competencyName: 'MBTI: Energy Direction (E vs I)',
      category: 'mbti',
      subCategory: 'Extraversion vs Introversion',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Preference for external interactive stimulation versus internal focused reflection.',
      en: {
        title: 'MBTI 1: Collaborative Brainstorming vs Solitary Focus',
        scenario: 'When launching a new semester capstone project, which work environment helps you generate your most inspired ideas?',
        mcqOptions: [
          { id: 'E', text: 'Live group debates with teammates bouncing spontaneous ideas back and forth.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'Quiet independent deep-dive research before gathering to share synthesized conclusions.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly share why this environment fits you better (optional)...',
      },
      hi: {
        title: 'MBTI 1: सामूहिक विचार-मंथन बनाम एकाग्रता',
        scenario: 'किसी नए प्रोजेक्ट की शुरुआत में आप कैसे विचार विकसित करना पसंद करते हैं?',
        mcqOptions: [
          { id: 'E', text: 'टीम के साथ त्वरित चर्चा और बातचीत के माध्यम से नए विचार बनाना।', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'पहले अकेले शांत वातावरण में गहन शोध कर निष्कर्ष निकालना।', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'संक्षेप में बताएं कि यह विकल्प आपको क्यों भाता है (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 1: ಗುಂಪು ಚರ್ಚೆ ಅಥವಾ ವೈಯಕ್ತಿಕ ಚಿಂತನೆ',
        scenario: 'ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್ ಪ್ರಾರಂಭಿಸುವಾಗ ನಿಮಗೆ ಹೆಚ್ಚು ಸ್ಪೂರ್ತಿ ನೀಡುವ ವಿಧಾನ ಯಾವುದು?',
        mcqOptions: [
          { id: 'E', text: 'ತಂಡದ ಸಹಪಾಠಿಗಳೊಂದಿಗೆ ಮುಕ್ತವಾಗಿ ಚರ್ಚಿಸಿ ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'ಮೊದಲು ಏಕಾಂತದಲ್ಲಿ ಆಳವಾಗಿ ಅಧ್ಯಯನ ಮಾಡಿ ನಂತರ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_ei_2',
      competencyKey: 'mbti_energy',
      competencyName: 'MBTI: Energy Direction (E vs I)',
      category: 'mbti',
      subCategory: 'Extraversion vs Introversion',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Recharging energy after demanding academic periods.',
      en: {
        title: 'MBTI 2: Recharging After Demanding Exams',
        scenario: 'After completing a high-stress final exam week, how do you naturally regain your mental clarity and stamina?',
        mcqOptions: [
          { id: 'E', text: 'Going out and socializing with friends in vibrant, active social gatherings.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'Spending uninterrupted solitary downtime relaxing with books, games, or hobbies.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly share your perspective (optional)...',
      },
      hi: {
        title: 'MBTI 2: तनाव के बाद ऊर्जा प्राप्त करना',
        scenario: 'कठिन परीक्षाओं के बाद आप अपनी मानसिक ऊर्जा को दोबारा कैसे तरोताजा करते हैं?',
        mcqOptions: [
          { id: 'E', text: 'दोस्तों के साथ बाहर जाकर मिलना-जुलना और सामाजिक गतिविधियों में शामिल होना।', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'अकेले रहकर अपनी पसंदीदा हॉबी, पढ़ाई या संगीत में समय बिताना।', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी बात साझा करें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 2: ಪರೀಕ್ಷೆಯ ನಂತರ ಮನಸ್ಸನ್ನು ವಿಶ್ರಾಂತಿಗೊಳಿಸುವುದು',
        scenario: 'ಪರೀಕ್ಷೆಗಳ ಒತ್ತಡ ಮುಗಿದ ನಂತರ ನಿಮ್ಮ ಮಾನಸಿಕ ಶಾಂತಿಯನ್ನು ನೀವು ಹೇಗೆ ಮರಳಿ ಪಡೆಯುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'E', text: 'ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹೊರಗೆ ಸುತ್ತಾಡುವುದು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಕೂಟಗಳಲ್ಲಿ ಭಾಗವಹಿಸುವುದು.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'ಮನೆಯಲ್ಲೇ ಶಾಂತವಾಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯುವುದು, ಓದುವುದು ಅಥವಾ ಹವ್ಯಾಸಗಳಲ್ಲಿ ತೊಡಗುವುದು.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_ei_3',
      competencyKey: 'mbti_energy',
      competencyName: 'MBTI: Energy Direction (E vs I)',
      category: 'mbti',
      subCategory: 'Extraversion vs Introversion',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Spoken expression and formulation of ideas.',
      en: {
        title: 'MBTI 3: Formulating Thoughts During Discussions',
        scenario: 'When participating in a seminar or group meeting, how do your thoughts usually take shape?',
        mcqOptions: [
          { id: 'E', text: 'I think aloud, shaping and refining my arguments as I converse with others.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'I prefer formulating clear conclusions internally before speaking up to the room.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share why you prefer this communication approach (optional)...',
      },
      hi: {
        title: 'MBTI 3: बातचीत में विचार व्यक्त करना',
        scenario: 'सेमिनार या समूह चर्चा में आपके विचार किस प्रकार रूप लेते हैं?',
        mcqOptions: [
          { id: 'E', text: 'बोलते-बोलते विचार विकसित करना और बातचीत के साथ तर्क को तराशना।', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'पहले मन में बात को पूरी तरह सोच-समझ लेना, फिर स्पष्ट रूप से बोलना।', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी सोच लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 3: ಚರ್ಚೆಯಲ್ಲಿ ಅಭಿಪ್ರಾಯ ರಚನೆ',
        scenario: 'ಸಭೆ ಅಥವಾ ವಿಚಾರಸಂಕಿರಣದಲ್ಲಿ ನಿಮ್ಮ ಆಲೋಚನೆಗಳು ಹೇಗೆ ಹೊರಹೊಮ್ಮುತ್ತವೆ?',
        mcqOptions: [
          { id: 'E', text: 'ಮಾತನಾಡುತ್ತಲೇ ಹೊಸ ವಿಚಾರಗಳನ್ನು ರೂಪಿಸಿಕೊಳ್ಳುವುದು ಮತ್ತು ಸ್ಪಷ್ಟಪಡಿಸುವುದು.', points: 4, rationaleCategory: 'Extraverted Energy' },
          { id: 'I', text: 'ಮೊದಲು ಮನಸ್ಸಿನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಯೋಚಿಸಿ ನಂತರ ಖಚಿತವಾಗಿ ಮಾತನಾಡುವುದು.', points: 4, rationaleCategory: 'Introverted Energy' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ (ಐಚ್ಛಿಕ)...',
      },
    },

    // -------------------------------------------------------------
    // SENSING (S) vs INTUITION (N) - 3 Questions
    // -------------------------------------------------------------
    {
      questionId: 'mbti_sn_1',
      competencyKey: 'mbti_information',
      competencyName: 'MBTI: Information Processing (S vs N)',
      category: 'mbti',
      subCategory: 'Sensing vs Intuition',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Focus on grounded practical realities versus theoretical future possibilities.',
      en: {
        title: 'MBTI 4: Practical Facts vs Conceptual Patterns',
        scenario: 'When studying a complex technical or academic subject, what gives you the clearest confidence?',
        mcqOptions: [
          { id: 'S', text: 'Tangible real-world examples, verified step-by-step facts, and practical case studies.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'Underlying abstract theories, future implications, and overarching patterns.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly explain your study preference (optional)...',
      },
      hi: {
        title: 'MBTI 4: व्यावहारिक तथ्य बनाम सैद्धांतिक रूपरेखा',
        scenario: 'किसी जटिल विषय को सीखते समय आपको किस बात से अधिक स्पष्टता मिलती है?',
        mcqOptions: [
          { id: 'S', text: 'ठोस व्यावहारिक उदाहरण, वास्तविक आंकड़े और चरणबद्ध तरीके।', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'मूल सिद्धांत, भविष्य की संभावनाएं और व्यापक वैचारिक पैटर्न।', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'संक्षेप में लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 4: ವಾಸ್ತವಿಕ ವಿವರಗಳು ಅಥವಾ ಸೈದ್ಧಾಂತಿಕ ಮಾದರಿಗಳು',
        scenario: 'ಕಠಿಣ ವಿಷಯವನ್ನು ಕಲಿಯುವಾಗ ನಿಮಗೆ ಯಾವುದು ಹೆಚ್ಚು ಸ್ಪಷ್ಟತೆ ನೀಡುತ್ತದೆ?',
        mcqOptions: [
          { id: 'S', text: 'ನಿಜವಾದ ಪ್ರಾಯೋಗಿಕ ಉದಾಹರಣೆಗಳು ಮತ್ತು ಹಂತ-ಹಂತದ ವಾಸ್ತವಿಕ ವಿವರಗಳು.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'ಆಳವಾದ ಸಿದ್ಧಾಂತಗಳು, ಭವಿಷ್ಯದ ಸಾಧ್ಯತೆಗಳು ಮತ್ತು ವೈಚಾರಿಕ ಕಲ್ಪನೆಗಳು.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_sn_2',
      competencyKey: 'mbti_information',
      competencyName: 'MBTI: Information Processing (S vs N)',
      category: 'mbti',
      subCategory: 'Sensing vs Intuition',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Present reality focus versus future innovation orientation.',
      en: {
        title: 'MBTI 5: Proven Track Records vs Experimental Frontiers',
        scenario: 'If assigned to architect an experimental prototype, which direction would you naturally advocate?',
        mcqOptions: [
          { id: 'S', text: 'Building with proven, battle-tested tools that reliably achieve immediate deliverables.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'Pioneering cutting-edge approaches that explore uncharted possibilities and innovations.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share your perspective (optional)...',
      },
      hi: {
        title: 'MBTI 5: परखे हुए तरीके बनाम नए प्रयोग',
        scenario: 'किसी प्रोटोटाइप को बनाते समय आप किस रास्ते को प्राथमिकता देंगे?',
        mcqOptions: [
          { id: 'S', text: 'विश्वसनीय और परखे हुए टूल्स का उपयोग करना जो निश्चित परिणाम दें।', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'अत्याधुनिक और नए तरीकों की खोज करना जो नवाचार के नए द्वार खोलें।', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपना दृष्टिकोण साझा करें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 5: ಸಾಬೀತಾದ ವಿಧಾನಗಳು ಅಥವಾ ಹೊಸ ಆವಿಷ್ಕಾರಗಳು',
        scenario: 'ಹೊಸ ಯೋಜನೆಯಲ್ಲಿ ಕೆಲಸ ಮಾಡುವಾಗ ನೀವು ಯಾವುದನ್ನು ಆರಿಸಿಕೊಳ್ಳುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'S', text: 'ಈಗಾಗಲೇ ಸಾಬೀತಾಗಿರುವ, ನಂಬಿಕಸ್ಥ ವಿಧಾನಗಳ ಮೂಲಕ ಫಲಿತಾಂಶ ಪಡೆಯುವುದು.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'ಹೊಸತನದಿಂದ ಕೂಡಿದ, ಅತ್ಯಾಧುನಿಕ ಆವಿಷ್ಕಾರಗಳನ್ನು ಪ್ರಯೋಗಿಸುವುದು.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_sn_3',
      competencyKey: 'mbti_information',
      competencyName: 'MBTI: Information Processing (S vs N)',
      category: 'mbti',
      subCategory: 'Sensing vs Intuition',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Attention to precise literal instructions versus reading between the lines.',
      en: {
        title: 'MBTI 6: Precise Step Execution vs Intuitive Exploration',
        scenario: 'When given a complex project brief, what describes your typical working style?',
        mcqOptions: [
          { id: 'S', text: 'Carefully following the explicit guidelines to ensure every required specification is met.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'Interpreting the overarching vision and exploring unconventional ways to achieve it.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly explain (optional)...',
      },
      hi: {
        title: 'MBTI 6: सटीक निर्देशों का पालन बनाम स्वतंत्र दृष्टिकोण',
        scenario: 'किसी प्रोजेक्ट की रूपरेखा मिलने पर आपकी स्वाभाविक कार्यशैली क्या होती है?',
        mcqOptions: [
          { id: 'S', text: 'दिशानिर्देशों का कड़ाई से पालन करना ताकि हर आवश्यकता सटीकता से पूरी हो।', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'मूल उद्देश्य को समझकर उसे पूरा करने के नए और अलग तरीकों की तलाश करना।', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी राय लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 6: ನಿಖರ ಮಾರ್ಗಸೂಚಿ ಪಾಲನೆ ಅಥವಾ ವಿಶಾಲ ದೃಷ್ಟಿಕೋನ',
        scenario: 'ಪ್ರಾಜೆಕ್ಟ್‌ನ ಸೂಚನೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿದಾಗ ನಿಮ್ಮ ಕೆಲಸದ ವಿಧಾನ ಹೇಗಿರುತ್ತದೆ?',
        mcqOptions: [
          { id: 'S', text: 'ಎಲ್ಲಾ ನಿಯಮಗಳನ್ನು ಸರಿಯಾಗಿ ಪಾಲಿಸಿ ನಿಖರವಾಗಿ ಕೆಲಸವನ್ನು ಪೂರ್ಣಗೊಳಿಸುವುದು.', points: 4, rationaleCategory: 'Sensing Practicality' },
          { id: 'N', text: 'ಮೂಲ ಗುರಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಅದನ್ನು ಸಾಧಿಸಲು ವಿಭಿನ್ನ ಹೊಸ ವಿಧಾನಗಳನ್ನು ಬಳಸುವುದು.', points: 4, rationaleCategory: 'Intuitive Possibilities' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ (ಐಚ್ಛಿಕ)...',
      },
    },

    // -------------------------------------------------------------
    // THINKING (T) vs FEELING (F) - 3 Questions
    // -------------------------------------------------------------
    {
      questionId: 'mbti_tf_1',
      competencyKey: 'mbti_decision',
      competencyName: 'MBTI: Decision Making (T vs F)',
      category: 'mbti',
      subCategory: 'Thinking vs Feeling',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Objective logical criteria versus interpersonal empathy and team harmony.',
      en: {
        title: 'MBTI 7: Objective Logic vs Team Consensus & Harmony',
        scenario: 'When a student project team disagrees on which proposal to submit, what is your primary decision anchor?',
        mcqOptions: [
          { id: 'T', text: 'Evaluating which idea has the highest logical merit, feasibility, and technical rigor.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'Ensuring every member feels valued, heard, and that team cohesion is maintained.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share how you weigh logic vs team feelings (optional)...',
      },
      hi: {
        title: 'MBTI 7: तार्किक विश्लेषण बनाम टीम का तालमेल',
        scenario: 'जब किसी प्रोजेक्ट में टीम के सदस्यों के बीच मतभेद हो, तो आप किस आधार पर निर्णय लेते हैं?',
        mcqOptions: [
          { id: 'T', text: 'यह देखना कि कौन सा विचार तार्किक, व्यावहारिक और तकनीकी रूप से सबसे मजबूत है।', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'यह सुनिश्चित करना कि सभी सदस्यों की भावनाओं का सम्मान हो और टीम का तालमेल बना रहे।', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपना दृष्टिकोण लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 7: ತಾರ್ಕಿಕ ಸತ್ಯ ಅಥವಾ ತಂಡದ ಭಾವನೆಗಳು',
        scenario: 'ತಂಡದ ಪ್ರಾಜೆಕ್ಟ್‌ನಲ್ಲಿ ಆಯ್ಕೆಯ ವಿಷಯದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯವಿದ್ದಾಗ ನೀವು ಯಾವುದಕ್ಕೆ ಪ್ರಾಮುಖ್ಯತೆ ನೀಡುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'T', text: 'ಯಾವ ಕಲ್ಪನೆಯು ತಾಂತ್ರಿಕವಾಗಿ ಮತ್ತು ತಾರ್ಕಿಕವಾಗಿ ಹೆಚ್ಚು ಶ್ರೇಷ್ಠವಾಗಿದೆ ಎಂಬುದನ್ನು ನೋಡುವುದು.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'ಎಲ್ಲಾ ಸದಸ್ಯರ ಭಾವನೆಗಳನ್ನು ಗೌರವಿಸಿ ತಂಡದ ಐಕ್ಯತೆಯನ್ನು ಕಾಪಾಡುವುದು.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_tf_2',
      competencyKey: 'mbti_decision',
      competencyName: 'MBTI: Decision Making (T vs F)',
      category: 'mbti',
      subCategory: 'Thinking vs Feeling',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Direct constructive candor versus empathetic and encouraging peer review.',
      en: {
        title: 'MBTI 8: Delivering Critical Peer Feedback',
        scenario: 'When reviewing a classmate’s work that contains notable oversights, how do you communicate feedback?',
        mcqOptions: [
          { id: 'T', text: 'Providing direct, clear, and unvarnished technical critique focused on accuracy.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'Framing observations gently with encouragement to preserve their morale and confidence.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly share your feedback philosophy (optional)...',
      },
      hi: {
        title: 'MBTI 8: निष्पक्ष आलोचना बनाम उत्साहवर्धक प्रतिक्रिया',
        scenario: 'जब किसी सहपाठी के काम में गलतियाँ हों, तो आप उन्हें फीडबैक कैसे देते हैं?',
        mcqOptions: [
          { id: 'T', text: 'सटीकता पर ध्यान केंद्रित करते हुए स्पष्ट और सीधी तकनीकी प्रतिक्रिया देना।', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'उनकी भावनाओं का ध्यान रखते हुए उत्साहजनक शब्दों में सुधार के सुझाव देना।', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी राय लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 8: ನೇರ ವಿಮರ್ಶೆ ಅಥವಾ ಪ್ರೋತ್ಸಾಹದಾಯಕ ಪ್ರತಿಕ್ರಿಯೆ',
        scenario: 'ಸಹಪಾಠಿಯ ಕೆಲಸದಲ್ಲಿ ತಪ್ಪುಗಳಿದ್ದಾಗ ನೀವು ಹೇಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'T', text: 'ಸತ್ಯ ಮತ್ತು ನಿಖರತೆಗೆ ಪ್ರಾಶಸ್ತ್ಯ ನೀಡಿ ನೇರವಾಗಿ ನ್ಯೂನತೆಗಳನ್ನು ತಿಳಿಸುವುದು.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'ಅವರ ಆತ್ಮವಿಶ್ವಾಸ ಕುಗ್ಗದಂತೆ ಸೌಮ್ಯವಾಗಿ ತಿದ್ದಿಕೊಳ್ಳಲು ಸಲಹೆ ನೀಡುವುದು.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_tf_3',
      competencyKey: 'mbti_decision',
      competencyName: 'MBTI: Decision Making (T vs F)',
      category: 'mbti',
      subCategory: 'Thinking vs Feeling',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Fairness through consistent standard rules versus fairness through individualized context.',
      en: {
        title: 'MBTI 9: Standard Universal Rules vs Individual Compassion',
        scenario: 'If a project contributor faces personal troubles right before a submission deadline, how do you handle grading splits?',
        mcqOptions: [
          { id: 'T', text: 'Follow established grading rubrics impartially based strictly on output delivered.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'Make compassionate allowances and absorb extra workload to protect their standing.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share your perspective on fairness (optional)...',
      },
      hi: {
        title: 'MBTI 9: एक समान नियम बनाम व्यक्तिगत सहानुभूति',
        scenario: 'यदि किसी टीम सदस्य को व्यक्तिगत कठिनाई हो, तो आप काम और अंकों के बंटवारे को कैसे देखते हैं?',
        mcqOptions: [
          { id: 'T', text: 'नियमों और वास्तव में किए गए काम के आधार पर निष्पक्ष रूप से निर्णय लेना।', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'सहानुभूति दिखाते हुए उनका काम खुद संभालना ताकि उन्हें नुकसान न हो।', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी सोच लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 9: ಸಮಾನ ನಿಯಮಗಳು ಅಥವಾ ಮಾನವೀಯ ಕಾಳಜಿ',
        scenario: 'ಸಹಪಾಠಿಗೆ ವೈಯಕ್ತಿಕ ತೊಂದರೆ ಎದುರಾದಾಗ ಪ್ರಾಜೆಕ್ಟ್ ಜವಾಬ್ದಾರಿಯನ್ನು ನೀವು ಹೇಗೆ ನಿರ್ವಹಿಸುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'T', text: 'ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ ನಿಷ್ಪಕ್ಷಪಾತವಾಗಿ ಕೆಲಸದ ಫಲಿತಾಂಶದ ಮೇಲೆ ನಿರ್ಣಯ ಕೈಗೊಳ್ಳುವುದು.', points: 4, rationaleCategory: 'Thinking Rationality' },
          { id: 'F', text: 'ಮಾನವೀಯತೆಯಿಂದ ಅವರ ಕೆಲಸದ ಹೊರೆಯನ್ನು ನಾವೇ ಹೊತ್ತು ಅವರಿಗೆ ಸಹಾಯ ಮಾಡುವುದು.', points: 4, rationaleCategory: 'Feeling Values' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },

    // -------------------------------------------------------------
    // JUDGING (J) vs PERCEIVING (P) - 3 Questions
    // -------------------------------------------------------------
    {
      questionId: 'mbti_jp_1',
      competencyKey: 'mbti_lifestyle',
      competencyName: 'MBTI: Lifestyle Orientation (J vs P)',
      category: 'mbti',
      subCategory: 'Judging vs Perceiving',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Structured scheduled planning versus spontaneous emergent execution.',
      en: {
        title: 'MBTI 10: Structured Roadmaps vs Spontaneous Agility',
        scenario: 'How do you approach preparing for academic semester milestones and project submissions?',
        mcqOptions: [
          { id: 'J', text: 'Creating an early, structured schedule with firm intermediate milestones and deadlines.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'Keeping my options flexible, allowing spontaneous flow and adapting near the finish line.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share how you organize your workflow (optional)...',
      },
      hi: {
        title: 'MBTI 10: सुनियोजित योजना बनाम लचीली कार्यशैली',
        scenario: 'आप अपने प्रोजेक्ट्स और पढ़ाई की समय-सीमा को कैसे व्यवस्थित करते हैं?',
        mcqOptions: [
          { id: 'J', text: 'पहले से एक निश्चित समय-सारणी बनाना और चरणबद्ध तरीके से काम पूरा करना।', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'योजना को लचीला रखना और समय के साथ आवश्यकतानुसार बदलाव करते हुए काम करना।', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'संक्षेप में बताएं (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 10: ಮುಂಚಿತ ಯೋಜನೆ ಅಥವಾ ಹೊಂದಿಕೊಳ್ಳುವ ಕಾರ್ಯಶೈಲಿ',
        scenario: 'ಅಂತಿಮ ಗಡುವಿನೊಳಗೆ ಪ್ರಾಜೆಕ್ಟ್ ಮುಗಿಸಲು ನಿಮ್ಮ ಯೋಜನೆ ಹೇಗಿರುತ್ತದೆ?',
        mcqOptions: [
          { id: 'J', text: 'ಮೊದಲೇ ವ್ಯವಸ್ಥಿತ ವೇಳಾಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ ಹಂತ-ಹಂತವಾಗಿ ಕೆಲಸ ಮುಗಿಸುವುದು.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'ಯೋಜನೆಯನ್ನು ಮುಕ್ತವಾಗಿಟ್ಟುಕೊಂಡು ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ಬದಲಾವಣೆಗಳೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವುದು.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_jp_2',
      competencyKey: 'mbti_lifestyle',
      competencyName: 'MBTI: Lifestyle Orientation (J vs P)',
      category: 'mbti',
      subCategory: 'Judging vs Perceiving',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Comfort with closure versus preference for keeping possibilities open.',
      en: {
        title: 'MBTI 11: Decisive Closure vs Keeping Doors Open',
        scenario: 'When selecting an elective track or specialized domain focus, how do you prefer to decide?',
        mcqOptions: [
          { id: 'J', text: 'Making a firm decision early to gain peace of mind and focus entirely on execution.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'Delaying final commitment to sample different subjects and keep all options open.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share how you approach life commitments (optional)...',
      },
      hi: {
        title: 'MBTI 11: शीघ्र निर्णय बनाम विकल्पों को खुला रखना',
        scenario: 'अपने करियर या विषय का चयन करते समय आपकी क्या प्राथमिकता होती है?',
        mcqOptions: [
          { id: 'J', text: 'जल्दी और पक्का फैसला लेना ताकि मानसिक शांति मिले और पूरा ध्यान काम पर रहे।', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'फैसले को कुछ समय तक खुला रखना ताकि सभी नए विकल्पों को आजमाया जा सके।', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी बात साझा करें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 11: ಶೀಘ್ರ ನಿರ್ಧಾರ ಅಥವಾ ಅವಕಾಶಗಳನ್ನು ಮುಕ್ತವಾಗಿಡುವುದು',
        scenario: 'ವಿಷಯ ಅಥವಾ ವೃತ್ತಿ ಆಯ್ಕೆಯ ಸಂದರ್ಭದಲ್ಲಿ ನೀವು ಹೇಗೆ ನಿರ್ಧರಿಸುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'J', text: 'ಆರಂಭದಲ್ಲೇ ಖಚಿತ ನಿರ್ಧಾರ ಕೈಗೊಂಡು ಸಂಪೂರ್ಣ ಗಮನವನ್ನು ಅದರ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುವುದು.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'ಎಲ್ಲಾ ಹೊಸ ಅವಕಾಶಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ನಿರ್ಧಾರವನ್ನು ಮುಕ್ತವಾಗಿಡುವುದು.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'mbti_jp_3',
      competencyKey: 'mbti_lifestyle',
      competencyName: 'MBTI: Lifestyle Orientation (J vs P)',
      category: 'mbti',
      subCategory: 'Judging vs Perceiving',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Response to unexpected schedule disruptions.',
      en: {
        title: 'MBTI 12: Reaction to Unexpected Scope Changes',
        scenario: 'When a professor or project lead abruptly alters requirements two days before a deadline, what is your initial reflex?',
        mcqOptions: [
          { id: 'J', text: 'Discomfort with the disruption, followed by immediately rewriting a formal new plan.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'Excitement at the curveball, quickly adapting and improvising without much friction.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share how you handle unexpected shifts (optional)...',
      },
      hi: {
        title: 'MBTI 12: अचानक हुए बदलावों पर प्रतिक्रिया',
        scenario: 'अंतिम समय पर प्रोजेक्ट के नियमों में अचानक बदलाव आने पर आपकी पहली प्रतिक्रिया क्या होती है?',
        mcqOptions: [
          { id: 'J', text: 'योजना बिगड़ने से असहजता, लेकिन तुरंत नया संरचित प्लान तैयार करना।', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'बदलाव को एक चुनौती के रूप में लेना और तत्परता से नए समाधान तलाशना।', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी राय लिखें (वैकल्पिक)...',
      },
      kn: {
        title: 'MBTI 12: ದಿಢೀರ್ ಬದಲಾವಣೆಗಳಿಗೆ ಹೊಂದಾಣಿಕೆ',
        scenario: 'ಗಡುವಿನ ಸಮೀಪದಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್‌ನ ನಿಯಮಗಳು ಬದಲಾದಾಗ ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಹೇಗಿರುತ್ತದೆ?',
        mcqOptions: [
          { id: 'J', text: 'ಯೋಜನೆ ಬದಲಾಗಿದ್ದಕ್ಕೆ ಸ್ವಲ್ಪ ಅಸಮಾಧಾನವಾದರೂ, ತಕ್ಷಣವೇ ಹೊಸ ವೇಳಾಪಟ್ಟಿ ರಚಿಸುವುದು.', points: 4, rationaleCategory: 'Judging Structure' },
          { id: 'P', text: 'ಬದಲಾವಣೆಯನ್ನು ಸಕಾರಾತ್ಮಕವಾಗಿ ಸ್ವೀಕರಿಸಿ ಉತ್ಸಾಹದಿಂದ ಹೊಸ ಹಾದಿ ಹಿಡಿಯುವುದು.', points: 4, rationaleCategory: 'Perceiving Flexibility' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
  ];

  const hollandQuestions: IDualPaneQuestion[] = [
    // -------------------------------------------------------------
    // HOLLAND RIASEC (4 Questions)
    // -------------------------------------------------------------
    {
      questionId: 'holland_1',
      competencyKey: 'holland_realistic_investigative',
      competencyName: 'Holland: Realistic vs Investigative',
      category: 'holland',
      subCategory: 'Realistic (Hands-on) vs Investigative (Analytical)',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Inclination towards tangible physical execution versus intellectual abstract research.',
      en: {
        title: 'Holland 1: Hands-on Building vs Analytical Investigation',
        scenario: 'If choosing a core project or internship, which assignment excites your natural curiosity?',
        mcqOptions: [
          { id: 'R', text: 'Hands-on hardware assembly, network rigging, and tangible instrument deployment.', points: 4, rationaleCategory: 'Realistic' },
          { id: 'I', text: 'Mathematical modeling, algorithmic data analysis, and root-cause research.', points: 4, rationaleCategory: 'Investigative' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Explain which flavor appeals to you more (optional)...',
      },
      hi: {
        title: 'हॉलैंड 1: व्यावहारिक निर्माण बनाम विश्लेषणात्मक शोध',
        scenario: 'इंटर्नशिप के दौरान आप किस प्रकार के कार्य को प्राथमिकता देंगे?',
        mcqOptions: [
          { id: 'R', text: 'हार्डवेयर जोड़ना, नेटवर्क सेटअप करना और भौतिक उपकरणों पर सीधा काम करना।', points: 4, rationaleCategory: 'Realistic' },
          { id: 'I', text: 'डेटा विश्लेषण, गणितीय मॉडल बनाना और जटिल तकनीकी समस्याओं का शोध करना।', points: 4, rationaleCategory: 'Investigative' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी पसंद बताएं (वैकल्पिक)...',
      },
      kn: {
        title: 'ಹಾಲೆಂಡ್ 1: ಪ್ರಾಯೋಗಿಕ ಕೆಲಸ ಅಥವಾ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಸಂಶೋಧನೆ',
        scenario: 'ಇಂಟರ್ನ್‌ಶಿಪ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುವಾಗ ನಿಮಗೆ ಹೆಚ್ಚು ಆಸಕ್ತಿ ನೀಡುವ ಕ್ಷೇತ್ರ ಯಾವುದು?',
        mcqOptions: [
          { id: 'R', text: 'ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ನಿರ್ವಹಿಸುವುದು ಮತ್ತು ಭೌತಿಕ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವುದು.', points: 4, rationaleCategory: 'Realistic' },
          { id: 'I', text: 'ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣೆ, ಗಣಿತೀಯ ಮಾದರಿಗಳು ಮತ್ತು ಆಳವಾದ ಸಂಶೋಧನಾ ಕಾರ್ಯಗಳು.', points: 4, rationaleCategory: 'Investigative' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'holland_2',
      competencyKey: 'holland_artistic_social',
      competencyName: 'Holland: Artistic vs Social',
      category: 'holland',
      subCategory: 'Artistic (Creative) vs Social (Community/Teaching)',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Creative expressive inclination versus supportive interpersonal guidance.',
      en: {
        title: 'Holland 2: Creative Expression vs Community Impact',
        scenario: 'When contributing to a campus society or startup initiative, which role gives you deeper meaning?',
        mcqOptions: [
          { id: 'A', text: 'Designing visual identity, interactive UI/UX, and expressive multimedia content.', points: 4, rationaleCategory: 'Artistic' },
          { id: 'S', text: 'Mentoring peers, community organizing, and facilitating student well-being workshops.', points: 4, rationaleCategory: 'Social' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share your personal career inclination (optional)...',
      },
      hi: {
        title: 'हॉलैंड 2: रचनात्मक अभिव्यक्ति बनाम सामाजिक सेवा',
        scenario: 'कॉलेज क्लब या स्टार्टअप में आपको किस भूमिका में सबसे अधिक संतुष्टि मिलेगी?',
        mcqOptions: [
          { id: 'A', text: 'आकर्षक डिजाइन, यूआई/यूएक्स और रचनात्मक मल्टीमीडिया सामग्री तैयार करना।', points: 4, rationaleCategory: 'Artistic' },
          { id: 'S', text: 'सहपाठियों का मार्गदर्शन करना, समुदाय का आयोजन और आपसी सहयोग कार्यशालाएं चलाना।', points: 4, rationaleCategory: 'Social' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी पसंद साझा करें (वैकल्पिक)...',
      },
      kn: {
        title: 'ಹಾಲೆಂಡ್ 2: ಸೃಜನಶೀಲ ಕಲೆ ಅಥವಾ ಸಮಾಜಮುಖಿ ಸೇವೆ',
        scenario: 'ಕಾಲೇಜು ಕ್ಲಬ್ ಅಥವಾ ಸಮಾಜದಲ್ಲಿ ನಿಮಗೆ ಹೆಚ್ಚು ತೃಪ್ತಿ ನೀಡುವ ಪಾತ್ರ ಯಾವುದು?',
        mcqOptions: [
          { id: 'A', text: 'ಸುಂದರ ವಿನ್ಯಾಸಗಳು, ಯುಐ/ಯುಎಕ್ಸ್ ಮತ್ತು ಸೃಜನಾತ್ಮಕ ವಿಷಯಗಳನ್ನು ರಚಿಸುವುದು.', points: 4, rationaleCategory: 'Artistic' },
          { id: 'S', text: 'ಸಹಪಾಠಿಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುವುದು ಮತ್ತು ಸಮಾಜದ ಏಳಿಗೆಗಾಗಿ ಕಾರ್ಯಕ್ರಮ ನಡೆಸುವುದು.', points: 4, rationaleCategory: 'Social' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'holland_3',
      competencyKey: 'holland_enterprising_conventional',
      competencyName: 'Holland: Enterprising vs Conventional',
      category: 'holland',
      subCategory: 'Enterprising (Leadership/Pitch) vs Conventional (Organization/Finance)',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Entrepreneurial persuasion versus meticulous procedural accuracy.',
      en: {
        title: 'Holland 3: Entrepreneurial Leadership vs Systematic Precision',
        scenario: 'In an annual university entrepreneurship fest, which department would you eagerly choose to lead?',
        mcqOptions: [
          { id: 'E', text: 'Pitching to angel investors, sponsor acquisition, and leading promotional campaigns.', points: 4, rationaleCategory: 'Enterprising' },
          { id: 'C', text: 'Managing financial ledgers, auditing compliance, and ensuring logistical accuracy.', points: 4, rationaleCategory: 'Conventional' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Share what drives your professional focus (optional)...',
      },
      hi: {
        title: 'हॉलैंड 3: उद्यमशील नेतृत्व बनाम व्यवस्थित सटीकता',
        scenario: 'कॉलेज के व्यावसायिक उत्सव में आप किस विभाग का नेतृत्व करना पसंद करेंगे?',
        mcqOptions: [
          { id: 'E', text: 'निवेशकों को पिच करना, प्रायोजक जुटाना और नए विचारों का प्रचार-प्रसार करना।', points: 4, rationaleCategory: 'Enterprising' },
          { id: 'C', text: 'बजट और वित्तीय खातों का प्रबंधन, नियमों का पालन और व्यवस्थित संचालन।', points: 4, rationaleCategory: 'Conventional' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपनी पसंद बताएं (वैकल्पिक)...',
      },
      kn: {
        title: 'ಹಾಲೆಂಡ್ 3: ಉದ್ಯಮಶೀಲ ನಾಯಕತ್ವ ಅಥವಾ ವ್ಯವಸ್ಥಿತ ನಿರ್ವಹಣೆ',
        scenario: 'ಕಾಲೇಜು ಸಮ್ಮೇಳನದಲ್ಲಿ ನೀವು ಯಾವ ಜವಾಬ್ದಾರಿಯನ್ನು ಹೊರಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?',
        mcqOptions: [
          { id: 'E', text: 'ಹೂಡಿಕೆದಾರರೊಂದಿಗೆ ಸಂವಹನ, ಪ್ರಾಯೋಜಕತ್ವ ಪಡೆಯುವುದು ಮತ್ತು ಪ್ರಚಾರದ ನೇತೃತ್ವ ವಹಿಸುವುದು.', points: 4, rationaleCategory: 'Enterprising' },
          { id: 'C', text: 'ಹಣಕಾಸಿನ ಲೆಕ್ಕಪತ್ರ, ನಿಯಮಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ವ್ಯವಸ್ಥಿತ ನಿರ್ವಹಣೆಯ ಹೊಣೆ ಹೊರುವುದು.', points: 4, rationaleCategory: 'Conventional' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ವಿವರಣೆ (ಐಚ್ಛಿಕ)...',
      },
    },
    {
      questionId: 'holland_4',
      competencyKey: 'holland_career_pathway',
      competencyName: 'Holland: Long-Term Pathway Alignment',
      category: 'holland',
      subCategory: 'Vocational Inclination Synthesis',
      questionType: 'option_explain',
      isOptionalExplanation: true,
      idealEvidenceCriteria: 'Holistic career ambition and intrinsic work motivation.',
      en: {
        title: 'Holland 4: Long-Term Career Milestone',
        scenario: 'Looking 5 years into your post-graduation journey, which professional milestone brings you the deepest pride?',
        mcqOptions: [
          { id: 'A', text: 'Creating an impactful technical product or leading an innovative startup initiative.', points: 4, rationaleCategory: 'Investigative & Enterprising' },
          { id: 'B', text: 'Becoming a trusted expert mentor recognized for ethics, quality, and human impact.', points: 4, rationaleCategory: 'Social & Conventional' },
        ],
        writtenPrompt: 'Explain your reasoning (Optional / Not Mandatory):',
        writtenPlaceholder: 'Briefly share your future aspiration (optional)...',
      },
      hi: {
        title: 'हॉलैंड 4: दीर्घकालिक करियर लक्ष्य',
        scenario: 'भविष्य में 5 साल बाद, कौन सी उपलब्धि आपको सबसे अधिक गर्व और संतोष देगी?',
        mcqOptions: [
          { id: 'A', text: 'एक प्रभावशाली तकनीकी उत्पाद बनाना या किसी अभिनव स्टार्टअप का नेतृत्व करना।', points: 4, rationaleCategory: 'Investigative & Enterprising' },
          { id: 'B', text: 'एक प्रतिष्ठित विशेषज्ञ बनना जिसे नैतिक मूल्यों, गुणवत्ता और मार्गदर्शन के लिए जाना जाए।', points: 4, rationaleCategory: 'Social & Conventional' },
        ],
        writtenPrompt: 'अपना कारण समझाएं (वैकल्पिक / अनिवार्य नहीं):',
        writtenPlaceholder: 'अपने सपने साझा करें (वैकल्पिक)...',
      },
      kn: {
        title: 'ಹಾಲೆಂಡ್ 4: ದೀರ್ಘಕಾಲೀನ ವೃತ್ತಿಜೀವನದ ಮೈಲಿಗಲ್ಲು',
        scenario: 'ಮುಂದಿನ 5 ವರ್ಷಗಳಲ್ಲಿ, ಯಾವ ಸಾಧನೆಯು ನಿಮಗೆ ಅತ್ಯಂತ ಹೆಮ್ಮೆ ಮತ್ತು ಸಾರ್ಥಕತೆ ನೀಡುತ್ತದೆ?',
        mcqOptions: [
          { id: 'A', text: 'ಪ್ರಭಾವಶಾಲಿ ತಂತ್ರಜ್ಞಾನ ಉತ್ಪನ್ನ ನಿರ್ಮಿಸುವುದು ಅಥವಾ ಹೊಸ ಸ್ಟಾರ್ಟಪ್ ಮುನ್ನಡೆಸುವುದು.', points: 4, rationaleCategory: 'Investigative & Enterprising' },
          { id: 'B', text: 'ಉತ್ತಮ ಗುಣಮಟ್ಟ, ನೈತಿಕತೆ ಮತ್ತು ಸಮಾಜಕ್ಕೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುವ ಶ್ರೇಷ್ಠ ಪರಿಣಿತರಾಗುವುದು.', points: 4, rationaleCategory: 'Social & Conventional' },
        ],
        writtenPrompt: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಐಚ್ಛಿಕ / ಕಡ್ಡಾಯವಲ್ಲ):',
        writtenPlaceholder: 'ನಿಮ್ಮ ಕನಸನ್ನು ಹಂಚಿಕೊಳ್ಳಿ (ಐಚ್ಛಿಕ)...',
      },
    },
  ];

  return [...mbtiQuestions, ...hollandQuestions];
}
