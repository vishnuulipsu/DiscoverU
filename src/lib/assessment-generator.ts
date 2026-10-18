import { IDualPaneQuestion } from '@/models/Assessment';
import { GoogleGenAI } from '@google/genai';
import { buildProfessionalQuestions, buildStudentQuestions } from '@/lib/assessment-tracks';
import fs from 'fs';
import path from 'path';

export interface GenerateAssessmentParams {
  candidateName: string;
  currentRole: string; // What candidate is currently doing
  targetIndustry: string; // Industry they want to work in
  testTrack?: 'full' | 'crisis' | 'cross_functional' | 'governance'; // Which test they want to take
  assessmentTrack?: 'professional' | 'student'; // 'professional' = OCEAN (30) + STAR (4); 'student' = MBTI (12) + HOLLAND (4)
  language?: 'en' | 'hi' | 'kn';
}

const INDUSTRY_CONTEXTS: Record<string, {
  name: string;
  domainTerm: string;
  crisisDilemma: string;
  scopeDilemma: string;
  accountabilityDilemma: string;
  complianceDilemma: string;
  prioritisationDilemma: string;
}> = {
  fintech: {
    name: 'Fintech & Digital Banking',
    domainTerm: 'payment settlement engine',
    crisisDilemma: 'During market opening hours, high-value UPI and wire transfer settlements experience a 2.4-second processing lag. Applying an unverified memory flush could clear the transaction backlog but might drop audit logs for 15 minutes.',
    scopeDilemma: 'Three days before fiscal year-end, the Business Banking Head requests integrating a new biometric payment authorization vendor. Your security review identifies an unpatched third-party token leakage risk.',
    accountabilityDilemma: 'An edge-case double-credit reconciliation defect you approved during code review was released to staging and slipped into live clearing, crediting 250 enterprise corporate accounts erroneously.',
    complianceDilemma: 'Midway through an urgent payment gateway upgrade sprint, the Central Banking Regulator enforces a strict data localization directive requiring an immediate overhaul of cloud data persistence.',
    prioritisationDilemma: 'Your engineering squad must simultaneously resolve a critical fraud-detection latency issue affecting 500,000 credit card accounts and resolve 4 urgent merchant onboarding blockages.',
  },
  saas: {
    name: 'Enterprise SaaS & Cloud Infrastructure',
    domainTerm: 'multi-tenant Kubernetes cluster',
    crisisDilemma: '30 minutes before a tier-1 customer executive demo, cross-tenant dashboard queries spike to 95% CPU utilization. A temporary container restart masks latency for 40 minutes but risks dropping active webhooks.',
    scopeDilemma: 'Four days before product launch, the VP of Product demands adding an unvetted real-time collaboration plugin that introduces an 80% regression risk to core document synchronization.',
    accountabilityDilemma: 'A subtle race condition in tenant access tokens that you approved during peer review slipped into production and affected session authorization for 120 client enterprise accounts.',
    complianceDilemma: 'Midway through an urgent quarterly delivery sprint, a surprise GDPR and enterprise data privacy audit mandates redesigning the customer authentication boundary within two weeks.',
    prioritisationDilemma: 'You have a high-priority deadline to patch an enterprise zero-day vulnerability affecting 500,000 active tenants while handling 4 urgent enterprise SLA escalation tickets.',
  },
  healthcare: {
    name: 'Healthcare & HealthTech',
    domainTerm: 'clinical electronic health records (EHR)',
    crisisDilemma: 'During peak morning clinic intake, the patient vitals synchronization pipeline slows down drastically. A quick cache flush can speed up doctor workstations but risks temporarily omitting allergy warnings.',
    scopeDilemma: 'Five days before a hospital system rollout, the Chief Medical Officer asks to add an untested remote prescription module that could destabilize existing pharmacy drug interaction checks.',
    accountabilityDilemma: 'A subtle timestamp ordering bug in patient lab results that you verified during peer review was deployed to staging and affected 85 outpatient diagnostic summaries.',
    complianceDilemma: 'Midway through a sprint, a surprise HIPAA privacy update requires immediate encryption-at-rest restructuring for all patient telehealth telemetry.',
    prioritisationDilemma: 'Your team must deploy a critical cardiac telemetry monitoring patch protecting 500,000 patient records while handling 4 urgent doctor workstation escalation tickets.',
  },
  ecommerce: {
    name: 'E-Commerce & Digital Retail',
    domainTerm: 'flash sale checkout pipeline',
    crisisDilemma: '20 minutes before a nationwide flash sale goes live, the cart inventory reservation service exhibits severe query latency. A quick database cache bypass speeds up cart loads but risks overselling limited inventory.',
    scopeDilemma: 'Four days before Black Friday, the Growth Director insists on injecting a new third-party checkout upsell modal with an 80% regression risk to mobile payment processing.',
    accountabilityDilemma: 'A coupon discounting race condition you approved during review slipped into production, allowing 120 customers to stack non-combinable promo codes.',
    complianceDilemma: 'Midway through a major quarterly release sprint, new international tax and consumer data regulation mandates re-architecting cross-border checkout calculations.',
    prioritisationDilemma: 'You face a hard deadline to secure customer payment card storage against a vulnerability affecting 500,000 buyers while handling 4 escalated logistics tracking incidents.',
  },
  ai: {
    name: 'AI & Autonomous Systems',
    domainTerm: 'enterprise LLM inference pipeline',
    crisisDilemma: '30 minutes before an enterprise keynote, the model inference pipeline begins timing out under load. Lowering precision quantization unblocks throughput immediately but increases hallucination risk.',
    scopeDilemma: 'Four days before deploying a customer support AI assistant, leadership demands wiring in an unvetted external knowledge scraper that could inject prompt vulnerabilities.',
    accountabilityDilemma: 'An edge-case guardrail filter you approved during code review allowed unsafe responses to slip through to 120 beta enterprise users.',
    complianceDilemma: 'Midway through an urgent fine-tuning sprint, a new AI Safety & Data Provenance regulation requires tracing training data lineage for all proprietary embeddings.',
    prioritisationDilemma: 'You must urgently patch a vector database security loophole safeguarding 500,000 enterprise queries while resolving 4 high-priority client model degradation tickets.',
  },
  edtech: {
    name: 'EdTech & Enterprise Learning',
    domainTerm: 'live interactive classroom & evaluation system',
    crisisDilemma: '30 minutes before a nationwide scholarship exam begins, the interactive video streaming server experiences severe bandwidth throttling. Lowering stream encryption unblocks connections but risks security.',
    scopeDilemma: 'Four days before school reopening, the Academic Dean demands adding an unverified automated proctoring module that risks blocking 30% of student webcams.',
    accountabilityDilemma: 'A grading computation edge-case you approved during peer review slipped into production and calculated inaccurate preliminary percentiles for 120 students.',
    complianceDilemma: 'Midway through a sprint, a state student data privacy act requires an immediate audit and restructuring of all student telemetry and behavioral analytics.',
    prioritisationDilemma: 'You have a deadline to patch a platform security vulnerability safeguarding 500,000 student profiles while handling 4 urgent classroom outage tickets.',
  },
};

export function buildIndustryAssessment(params: GenerateAssessmentParams): {
  title: string;
  roleTarget: string;
  description: string;
  questions: IDualPaneQuestion[];
} {
  const { currentRole, targetIndustry, testTrack, assessmentTrack } = params;
  const industryKey = (targetIndustry || 'saas').toLowerCase();
  const ind = INDUSTRY_CONTEXTS[industryKey] || INDUSTRY_CONTEXTS.saas;

  // 1. Student Track: MBTI (12) + Holland RIASEC (4)
  if (assessmentTrack === 'student') {
    const studentQuestions = buildStudentQuestions(currentRole, targetIndustry);
    return {
      title: `Student Aptitude & Personality Assessment (MBTI + Holland) - ${ind.name}`,
      roleTarget: `${currentRole || 'Student / Academic'} (${ind.name})`,
      description: `16 Option-based questions exploring Myers-Briggs Type Indicator (12) and Holland RIASEC Career Code (4) with non-mandatory rationale explanation.`,
      questions: studentQuestions,
    };
  }

  // 2. Working Professional Track: OCEAN Big Five (30) + STAR Subjective (4)
  if (assessmentTrack === 'professional') {
    const professionalQuestions = buildProfessionalQuestions(currentRole, targetIndustry);
    return {
      title: `Professional Leadership & Behavioral Assessment (OCEAN + STAR) - ${ind.name}`,
      roleTarget: `${currentRole || 'Software Professional'} (${ind.name})`,
      description: `30 Likert-scale Big Five (OCEAN) behavioral questions across 5 dimensions and 4 STAR subjective situational responses evaluating real-world leadership.`,
      questions: professionalQuestions,
    };
  }

  const roleTitle = `${currentRole || 'Software Professional'} (${ind.name})`;

  // Build tailored questions
  const qList: IDualPaneQuestion[] = [
    {
      questionId: 'q1',
      competencyKey: 'problem_solving',
      competencyName: 'Problem Solving',
      idealEvidenceCriteria: 'Systematic root-cause diagnosis, second-order impact consideration, structured trade-off evaluation.',
      en: {
        title: `Dilemma 1: High-Stakes Latency Crisis in ${ind.name}`,
        scenario: ind.crisisDilemma,
        mcqOptions: [
          { id: 'A', text: 'Apply the temporary quick patch immediately to ensure continuity, accepting the deferred data risks.', points: 2, rationaleCategory: 'Tactical Patching' },
          { id: 'B', text: 'Triage the underlying bottleneck with an emergency read-replica redirect, and brief stakeholders on expected timing.', points: 5, rationaleCategory: 'Systemic Resolution & Transparency' },
          { id: 'C', text: 'Disable the affected module entirely during the critical window and serve cached static responses.', points: 3, rationaleCategory: 'Risk Avoidance' },
          { id: 'D', text: 'Escalate immediately to executive leadership and request postponing the event until full root-cause investigation concludes.', points: 2, rationaleCategory: 'Over-Escalation' },
        ],
        writtenPrompt: `Explain why you chose this action for this ${ind.name} scenario. What trade-offs did you weigh, and what steps would you execute in the next 60 minutes?`,
        writtenPlaceholder: 'Describe your diagnostic thought process, trade-offs considered, and mitigation strategy...',
      },
      hi: {
        title: `दुविधा 1: ${ind.name} में संकट प्रबंधन`,
        scenario: ind.crisisDilemma,
        mcqOptions: [
          { id: 'A', text: 'तत्काल काम चलाने के लिए अस्थायी पैच लगाएं, भले ही बाद में जोखिम हो।', points: 2, rationaleCategory: 'तात्कालिक पैच' },
          { id: 'B', text: 'रीड-रेप्लिका रीडायरेक्ट के साथ मूल समस्या का समाधान करें और हितधारकों को स्थिति स्पष्ट करें।', points: 5, rationaleCategory: 'मूल कारण समाधान एवं पारदर्शिता' },
          { id: 'C', text: 'प्रभावित मॉड्यूल को बंद कर स्थिर (static) डेटा दिखाएं।', points: 3, rationaleCategory: 'जोखिम टालना' },
          { id: 'D', text: 'तुरंत उच्चतम प्रबंधन को सूचित कर कार्यक्रम रद्द करने की मांग करें।', points: 2, rationaleCategory: 'अनावश्यक एस्केलेशन' },
        ],
        writtenPrompt: 'आपने यह विकल्प क्यों चुना? आपने किन जोखिमों का विश्लेषण किया और अगले 60 मिनट में आपकी क्या कार्ययोजना होगी?',
        writtenPlaceholder: 'अपने विश्लेषण, विचार प्रक्रिया और संभावित परिणामों का विवरण यहाँ लिखें...',
      },
      kn: {
        title: `ಸನ್ನಿವೇಶ 1: ${ind.name} ಸಿಸ್ಟಮ್ ಬಿಕ್ಕಟ್ಟು`,
        scenario: ind.crisisDilemma,
        mcqOptions: [
          { id: 'A', text: 'ಡೆಮೊ ಸುಲಭವಾಗಿ ಸಾಗಲು ತಕ್ಷಣವೇ ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭ ಪರಿಹಾರವನ್ನು ಅನ್ವಯಿಸಿ.', points: 2, rationaleCategory: 'ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ' },
          { id: 'B', text: 'ಮೂಲ ಸಮಸ್ಯೆಯನ್ನು ಗುರುತಿಸಿ ಪರ್ಯಾಯ ಮಾರ್ಗ ಅನ್ವಯಿಸಿ, ಮತ್ತು ತಂಡಕ್ಕೆ ಮುಂಚಿತವಾಗಿ ಸ್ಪಷ್ಟಪಡಿಸಿ.', points: 5, rationaleCategory: 'ಮೂಲ ಕಾರಣ ಪರಿಹಾರ ಮತ್ತು ಪಾರದರ್ಶಕತೆ' },
          { id: 'C', text: 'ಆ ಮಾಡ್ಯೂಲ್ ಅನ್ನು ನಿಲ್ಲಿಸಿ ಹಿಂದಿನ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ.', points: 3, rationaleCategory: 'ಅಪಾಯ ತಪ್ಪಿಸುವಿಕೆ' },
          { id: 'D', text: 'ಕಾರ್ಯಕ್ರಮವನ್ನು ತಕ್ಷಣ ರದ್ದುಗೊಳಿಸಲು ಉನ್ನತ ಅಧಿಕಾರಿಗೆ ವಿನಂತಿಸಿ.', points: 2, rationaleCategory: 'ಅತಿಯಾದ ಎಸ್ಕಲೇಶನ್' },
        ],
        writtenPrompt: 'ನೀವು ಈ ಆಯ್ಕೆಯನ್ನು ಏಕೆ ಆರಿಸಿದ್ದೀರಿ? ನೀವು ಯಾವ ಅಪಾಯಗಳನ್ನು ಪರಿಗಣಿಸಿದ್ದೀರಿ ಮತ್ತು ಮುಂದಿನ 60 ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು ಯಾವುವು?',
        writtenPlaceholder: 'ನಿಮ್ಮ ಆಲೋಚನೆ, ನಿರ್ಧಾರದ ಹಿನ್ನೆಲೆ ಮತ್ತು ಪರಿಹಾರ ಕ್ರಮಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
      },
    },
    {
      questionId: 'q2',
      competencyKey: 'communication',
      competencyName: 'Communication',
      idealEvidenceCriteria: 'Stakeholder empathy, transparent risk framing, diplomatic boundary setting, constructive consensus building.',
      en: {
        title: `Dilemma 2: Cross-Functional Scope Pressure in ${ind.name}`,
        scenario: ind.scopeDilemma,
        mcqOptions: [
          { id: 'A', text: 'Agree immediately to the request and mandate weekend overtime across your team to build and test it.', points: 2, rationaleCategory: 'Passive Compliance' },
          { id: 'B', text: 'Refuse the request flatly over email, citing delivery risk and engineering boundary principles.', points: 2, rationaleCategory: 'Defensive Confrontation' },
          { id: 'C', text: 'Schedule a rapid alignment sync with the stakeholder, demonstrate the regression failure scenarios with data, and propose delivering a phased prototype behind feature flags.', points: 5, rationaleCategory: 'Constructive Negotiation & Risk-Aware Agility' },
          { id: 'D', text: 'Silently build a simplified mock version without alerting the stakeholder to changes in the requested scope.', points: 1, rationaleCategory: 'Opaque Execution' },
        ],
        writtenPrompt: `How do you structure this conversation with the business lead? What communication principles build alignment without compromising engineering integrity?`,
        writtenPlaceholder: 'Detail your communication approach, stakeholder framing, and negotiation technique...',
      },
      hi: {
        title: `दुविधा 2: हितधारकों के साथ प्राथमिकताओं का टकराव`,
        scenario: ind.scopeDilemma,
        mcqOptions: [
          { id: 'A', text: 'अनुरोध तुरंत स्वीकार करें और टीम से वीकेंड पर अतिरिक्त काम करवाएं।', points: 2, rationaleCategory: 'अंधानुकरण' },
          { id: 'B', text: 'ईमेल पर सीधे मना कर दें और डिलीवरी नियमों का हवाला दें।', points: 2, rationaleCategory: 'नकारात्मक टकराव' },
          { id: 'C', text: 'हितधारक के साथ त्वरित बैठक कर जोखिम दिखाएं और फीचर-फ्लैग के जरिए सुरक्षित चरणबद्ध विकल्प पेश करें।', points: 5, rationaleCategory: 'सकारात्मक संवाद व व्यावहारिक समाधान' },
          { id: 'D', text: 'बिना बताए एक छोटा संस्करण बनाकर रिलीज में शामिल कर दें।', points: 1, rationaleCategory: 'अस्पष्टता' },
        ],
        writtenPrompt: 'आप इस बातचीत की रूपरेखा कैसे बनाएंगे? हितधारकों का विश्वास बनाए रखते हुए सुरक्षा कैसे सुनिश्चित करेंगे?',
        writtenPlaceholder: 'अपनी बातचीत की रणनीति और समाधान का विवरण दें...',
      },
      kn: {
        title: `ಸನ್ನಿವೇಶ 2: ಪಾಲುದಾರರೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ`,
        scenario: ind.scopeDilemma,
        mcqOptions: [
          { id: 'A', text: 'ತಕ್ಷಣ ಒಪ್ಪಿಕೊಂಡು ತಂಡಕ್ಕೆ ರಜಾದಿನಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಆದೇಶಿಸಿ.', points: 2, rationaleCategory: 'ಅಂಧಾನುಕರಣೆ' },
          { id: 'B', text: 'ಇಮೇಲ್ ಮೂಲಕ ನೇರವಾಗಿ ನಿರಾಕರಿಸಿ ನಿಯಮಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ.', points: 2, rationaleCategory: 'ವಿವಾದಾತ್ಮಕ ನಿರಾಕರಣೆ' },
          { id: 'C', text: 'ಪಾಲುದಾರರೊಂದಿಗೆ ಚರ್ಚಿಸಿ ಅಪಾಯವನ್ನು ಮನದಟ್ಟು ಮಾಡಿ, ಮತ್ತು ಹಂತ ಹಂತವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿ ಜಾರಿಗೆ ತರಲು ಪ್ರಸ್ತಾಪಿಸಿ.', points: 5, rationaleCategory: 'ರಚನಾತ್ಮಕ ಸಂವಹನ' },
          { id: 'D', text: 'ಯಾರಿಗೂ ತಿಳಿಸದೆ ಸಣ್ಣ ಮಾದರಿಯನ್ನು ಬಿಡುಗಡೆ ಮಾಡಿ.', points: 1, rationaleCategory: 'ಅಪಾರದರ್ಶಕತೆ' },
        ],
        writtenPrompt: 'ನೀವು ಈ ಸಂವಾದವನ್ನು ಹೇಗೆ ಮುನ್ನಡೆಸುತ್ತೀರಿ? ನಂಬಿಕೆಯನ್ನು ಕಾಯ್ದುಕೊಂಡು ಸುರಕ್ಷತೆಯನ್ನು ಹೇಗೆ ಖಚಿತಪಡಿಸುತ್ತೀರಿ?',
        writtenPlaceholder: 'ನಿಮ್ಮ ಸಂವಹನ ತಂತ್ರ ಮತ್ತು ಯೋಜನೆಯನ್ನು ವಿವರಿಸಿ...',
      },
    },
    {
      questionId: 'q3',
      competencyKey: 'accountability',
      competencyName: 'Accountability',
      idealEvidenceCriteria: 'Ego-free ownership, prompt remediation, root-cause transparency, systemic preventive safeguards.',
      en: {
        title: `Dilemma 3: Critical Defect Escaped to Production`,
        scenario: ind.accountabilityDilemma,
        mcqOptions: [
          { id: 'A', text: 'Take explicit personal ownership of the review miss, coordinate the immediate hotfix, conduct transparent blameless incident communications, and implement automated regression tests.', points: 5, rationaleCategory: 'Radical Ownership & Systemic Prevention' },
          { id: 'B', text: 'Explain that the code was authored by another developer and the CI test pipeline failed to catch it, deflecting review culpability.', points: 1, rationaleCategory: 'Blame Deflection' },
          { id: 'C', text: 'Quietly push a midnight hotfix patch without logging an incident report to preserve the team reputation.', points: 2, rationaleCategory: 'Covert Remediation' },
          { id: 'D', text: 'Wait for customers or automated alerts to formally log tickets before acknowledging the issue.', points: 1, rationaleCategory: 'Passive Inaction' },
        ],
        writtenPrompt: 'Describe a past experience where you or your team took accountability for a release mistake. How did you handle communications and prevent future recurrence?',
        writtenPlaceholder: 'Reflect on personal accountability, transparency under pressure, and institutional learning...',
      },
      hi: {
        title: 'दुविधा 3: लाइव सिस्टम में चूक और व्यक्तिगत उत्तरदायित्व',
        scenario: ind.accountabilityDilemma,
        mcqOptions: [
          { id: 'A', text: 'समीक्षा में हुई चूक की पूरी जिम्मेदारी लें, तत्काल हॉटफिक्स लगाएं और भविष्य के लिए ऑटोमेटेड टेस्ट लिखें।', points: 5, rationaleCategory: 'पूर्ण उत्तरदायित्व एवं सुधार' },
          { id: 'B', text: 'दोष कोड लिखने वाले और ऑटोमेशन टूल पर मढ़ें।', points: 1, rationaleCategory: 'दोषारोपण' },
          { id: 'C', text: 'बिना किसी को बताए चुपचाप रात में पैच लगा दें।', points: 2, rationaleCategory: 'गोपनीय पैच' },
          { id: 'D', text: 'औपचारिक शिकायत आने तक प्रतीक्षा करें।', points: 1, rationaleCategory: 'उदासीनता' },
        ],
        writtenPrompt: 'किसी ऐसे अनुभव का वर्णन करें जहाँ आपने किसी गलती की पूरी जिम्मेदारी ली। आपने इसे कैसे संभाला?',
        writtenPlaceholder: 'अपने अनुभव, उठाए गए कदम और सीखी गई बातों का विवरण दें...',
      },
      kn: {
        title: 'ಸನ್ನಿವೇಶ 3: ಲೈವ್ ಸಿಸ್ಟಮ್ ದೋಷ ಮತ್ತು ವೈಯಕ್ತಿಕ ಹೊಣೆಗಾರಿಕೆ',
        scenario: ind.accountabilityDilemma,
        mcqOptions: [
          { id: 'A', text: 'ತಪ್ಪಿನ ಸಂಪೂರ್ಣ ವೈಯಕ್ತಿಕ ಜವಾಬ್ದಾರಿ ವಹಿಸಿ, ತಕ್ಷಣ ಪರಿಹಾರ ಒದಗಿಸಿ ಮತ್ತು ಭವಿಷ್ಯಕ್ಕಾಗಿ ಸ್ವಯಂಚಾಲಿತ ಪರೀಕ್ಷೆಗಳನ್ನು ಅಳವಡಿಸಿ.', points: 5, rationaleCategory: 'ಸಂಪೂರ್ಣ ಹೊಣೆಗಾರಿಕೆ' },
          { id: 'B', text: 'ಕೋಡ್ ಬರೆದ ಇತರ ಡೆವಲಪರ್ ಮೇಲೆ ದೋಷ ಹೊರಿಸಿ.', points: 1, rationaleCategory: 'ದೋಷಾರೋಪಣೆ' },
          { id: 'C', text: 'ಯಾರಿಗೂ ತಿಳಿಸದೆ ರಹಸ್ಯವಾಗಿ ತಿದ್ದಿಕೊಳ್ಳಿ.', points: 2, rationaleCategory: 'ರಹಸ್ಯ ಪರಿಹಾರ' },
          { id: 'D', text: 'ಗ್ರಾಹಕರು ದೂರು ನೀಡುವವರೆಗೆ ಕಾಯಿರಿ.', points: 1, rationaleCategory: 'ನಿಷ್ಕ್ರಿಯತೆ' },
        ],
        writtenPrompt: 'ನೀವು ಅಥವಾ ನಿಮ್ಮ ತಂಡವು ತಪ್ಪಿನ ಜವಾಬ್ದಾರಿ ತೆಗೆದುಕೊಂಡ ನೈಜ ಅನುಭವವನ್ನು ವಿವರಿಸಿ. ನೀವು ಅದನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸಿದಿರಿ?',
        writtenPlaceholder: 'ನಿಮ್ಮ ಅನುಭವ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆಯ ಹೆಜ್ಜೆಗಳನ್ನು ಬರೆಯಿರಿ...',
      },
    },
    {
      questionId: 'q4',
      competencyKey: 'adaptability',
      competencyName: 'Adaptability',
      idealEvidenceCriteria: 'Calm pivot management, pragmatic scope rebalancing, constructive resilience, morale stewardship.',
      en: {
        title: `Dilemma 4: Regulatory Mandate Disrupts Active Sprint in ${ind.name}`,
        scenario: ind.complianceDilemma,
        mcqOptions: [
          { id: 'A', text: 'Break down the mandate into minimal compliance primitives, de-scope non-critical feature deliverables, and restructure sprint stories collaboratively with the product team.', points: 5, rationaleCategory: 'Adaptive Re-Scoping & Collaborative Agility' },
          { id: 'B', text: 'Demand that the legal and compliance team delay enforcement until your quarterly roadmap completes.', points: 1, rationaleCategory: 'Rigid Resistance' },
          { id: 'C', text: 'Cancel the sprint entirely and initiate a complete panic rewrite of the entire architectural layer.', points: 2, rationaleCategory: 'Disproportionate Pivot' },
          { id: 'D', text: 'Ignore the compliance guidance until an external audit penalty is officially issued.', points: 1, rationaleCategory: 'Compliance Neglect' },
        ],
        writtenPrompt: 'How do you navigate sudden, disruptive requirement shifts without burning out your team or failing commitments?',
        writtenPlaceholder: 'Share how you maintain adaptability, recalibrate priorities, and lead teams through pivots...',
      },
      hi: {
        title: 'दुविधा 4: अचानक आए नए नियमों के अनुसार कार्ययोजना में बदलाव',
        scenario: ind.complianceDilemma,
        mcqOptions: [
          { id: 'A', text: 'नियमों को सरल भागों में बांटें, गैर-जरूरी फीचर्स स्थगित करें और टीम के साथ मिलकर कार्य पुनः व्यवस्थित करें।', points: 5, rationaleCategory: 'सकारात्मक अनुकूलन' },
          { id: 'B', text: 'कानूनी टीम से कहें कि जब तक प्रोजेक्ट पूरा न हो, नए नियम न लगाएं।', points: 1, rationaleCategory: 'जिद्दी रवैया' },
          { id: 'C', text: 'पूरा काम रोककर पूरे सिस्टम को नए सिरे से लिखना शुरू कर दें।', points: 2, rationaleCategory: 'अति-प्रतिक्रिया' },
          { id: 'D', text: 'जब तक नोटिस न आए, नए नियमों को नजरअंदाज करें।', points: 1, rationaleCategory: 'लापरवाही' },
        ],
        writtenPrompt: 'अचानक हुए बड़े बदलावों के दौरान आप प्राथमिकताओं को कैसे समायोजित करते हैं?',
        writtenPlaceholder: 'अपने लचीलेपन और टीम मार्गदर्शन का विवरण दें...',
      },
      kn: {
        title: 'ಸನ್ನಿವೇಶ 4: ಅನಿರೀಕ್ಷಿತ ನಿಯಮಗಳ ಬದಲಾವಣೆ ಮತ್ತು ಹೊಂದಾಣಿಕೆ',
        scenario: ind.complianceDilemma,
        mcqOptions: [
          { id: 'A', text: 'ನಿಯಮಗಳನ್ನು ಸರಳ ಹಂತಗಳಾಗಿ ವಿಂಗಡಿಸಿ, ಕಡಿಮೆ ಪ್ರಾಮುಖ್ಯತೆಯ ಕಾರ್ಯಗಳನ್ನು ಮುಂದೂಡಿ ತಂಡದೊಂದಿಗೆ ಮರುಹೊಂದಿಸಿ.', points: 5, rationaleCategory: 'ಹೊಂದಾಣಿಕೆಯ ಚುರುಕುತನ' },
          { id: 'B', text: 'ನಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಮುಗಿಯುವವರೆಗೆ ಹೊಸ ನಿಯಮ ಜಾರಿಗೆ ತರಬೇಡಿ ಎಂದು ಒತ್ತಾಯಿಸಿ.', points: 1, rationaleCategory: 'ಹೊಂದಿಕೊಳ್ಳದ ಮನೋಭಾವ' },
          { id: 'C', text: 'ಪ್ರಾಜೆಕ್ಟ್ ರದ್ದುಗೊಳಿಸಿ ಸಂಪೂರ್ಣ ಸಿಸ್ಟಮ್ ಅನ್ನು ಪುನಃ ಬರೆಯಲು ಮುಂದಾಗಿ.', points: 2, rationaleCategory: 'ಅತಿಯಾದ ಪ್ರತಿಕ್ರಿಯೆ' },
          { id: 'D', text: 'ದಂಡ ವಿಧಿಸುವವರೆಗೆ ಹೊಸ ನಿಯಮಗಳನ್ನು ಕಡೆಗಣಿಸಿ.', points: 1, rationaleCategory: 'ನಿರ್ಲಕ್ಷ್ಯ' },
        ],
        writtenPrompt: 'ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆಗಳನ್ನು ನೀವು ಹೇಗೆ ಎದುರಿಸುತ್ತೀರಿ ಮತ್ತು ತಂಡವನ್ನು ಹೇಗೆ ಮುನ್ನಡೆಸುತ್ತೀರಿ?',
        writtenPlaceholder: 'ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಆದ್ಯತೆಗಳ ನಿರ್ವಹಣೆಯನ್ನು ವಿವರಿಸಿ...',
      },
    },
    {
      questionId: 'q5',
      competencyKey: 'prioritisation',
      competencyName: 'Prioritisation',
      idealEvidenceCriteria: 'Structured urgency vs importance triage, blast radius evaluation, balanced stakeholder communication.',
      en: {
        title: `Dilemma 5: Competing Urgent Demands in ${ind.name}`,
        scenario: ind.prioritisationDilemma,
        mcqOptions: [
          { id: 'A', text: 'Drop the security vulnerability patch entirely to immediately resolve the 4 customer escalation tickets.', points: 2, rationaleCategory: 'Reactive Short-Termism' },
          { id: 'B', text: 'Provide immediate temporary operational workarounds to unblock the 4 escalation clients while keeping core engineering firepower focused on the enterprise security patch.', points: 5, rationaleCategory: 'Systemic Triage & Dual-Track Execution' },
          { id: 'C', text: 'Assign each engineer one ticket randomly without evaluating business risk or blast radius.', points: 1, rationaleCategory: 'Arbitrary Allocation' },
          { id: 'D', text: 'Ignore all customer escalation tickets for the rest of the week without sending any status updates.', points: 1, rationaleCategory: 'Customer Disregard' },
        ],
        writtenPrompt: 'Explain your decision framework for separating truly critical strategic deliverables from localized loud operational emergencies.',
        writtenPlaceholder: 'Explain your framework for urgency vs importance, blast radius estimation, and triage...',
      },
      hi: {
        title: 'दुविधा 5: प्रतिस्पर्धी प्राथमिकताओं के बीच संतुलन',
        scenario: ind.prioritisationDilemma,
        mcqOptions: [
          { id: 'A', text: 'सुरक्षा पैच को पूरी तरह रोककर सिर्फ 4 ग्राहकों की समस्याओं में लग जाएं।', points: 2, rationaleCategory: 'अल्पकालिक सोच' },
          { id: 'B', text: '4 ग्राहकों को तात्कालिक वर्कअराउंड देकर अनब्लॉक करें, जबकि मुख्य टीम सुरक्षा पैच पर केंद्रित रहे।', points: 5, rationaleCategory: 'संतुलित प्राथमिकता एवं समाधान' },
          { id: 'C', text: 'बिना जोखिम का विश्लेषण किए अंधाधुंध काम बांट दें।', points: 1, rationaleCategory: 'मनमाना आवंटन' },
          { id: 'D', text: 'ग्राहकों को कोई जवाब दिए बिना उनके टिकट नजरअंदाज करें।', points: 1, rationaleCategory: 'ग्राहकों की उपेक्षा' },
        ],
        writtenPrompt: 'अति-महत्वपूर्ण रणनीतिक कार्य और तात्कालिक समस्याओं के बीच आप प्राथमिकताएं कैसे तय करते हैं?',
        writtenPlaceholder: 'अपनी प्राथमिकताओं की रूपरेखा और निर्णय प्रक्रिया स्पष्ट करें...',
      },
      kn: {
        title: 'ಸನ್ನಿವೇಶ 5: ಸ್ಪರ್ಧಾತ್ಮಕ ಆದ್ಯತೆಗಳ ನಡುವೆ ಸಮತೋಲನ',
        scenario: ind.prioritisationDilemma,
        mcqOptions: [
          { id: 'A', text: 'ಸುರಕ್ಷತಾ ಪ್ಯಾಚ್ ಅನ್ನು ನಿಲ್ಲಿಸಿ ಕೇವಲ 4 ಗ್ರಾಹಕರ ಟಿಕೆಟ್‌ಗಳ ಮೇಲೆ ಗಮನಹರಿಸಿ.', points: 2, rationaleCategory: 'ಅಲ್ಪಾವಧಿ ಚಿಂತನೆ' },
          { id: 'B', text: '4 ಗ್ರಾಹಕರಿಗೆ ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ ನೀಡಿ, ಮುಖ್ಯ ತಂಡವನ್ನು ಸುರಕ್ಷತಾ ಪ್ಯಾಚ್ ಮುಗಿಸಲು ನಿಯೋಜಿಸಿ.', points: 5, rationaleCategory: 'ಸಮತೋಲಿತ ಆದ್ಯತೆ' },
          { id: 'C', text: 'ಯಾವುದೇ ವಿಶ್ಲೇಷಣೆ ಇಲ್ಲದೆ ಯಾದೃಚ್ಛಿಕವಾಗಿ ಕೆಲಸ ಹಂಚಿ.', points: 1, rationaleCategory: 'ಯಾದೃಚ್ಛಿಕ ಹಂಚಿಕೆ' },
          { id: 'D', text: 'ಗ್ರಾಹಕರ ಟಿಕೆಟ್‌ಗಳನ್ನು ಯಾವುದೇ ಉತ್ತರವಿಲ್ಲದೆ ನಿರ್ಲಕ್ಷಿಸಿ.', points: 1, rationaleCategory: 'ನಿರ್ಲಕ್ಷ್ಯ' },
        ],
        writtenPrompt: 'ತುರ್ತು ಸಮಸ್ಯೆಗಳು ಮತ್ತು ದೀರ್ಘಾವಧಿಯ ಮಹತ್ವದ ಗುರಿಗಳ ನಡುವೆ ನೀವು ಆದ್ಯತೆಯನ್ನು ಹೇಗೆ ನಿರ್ಧರಿಸುತ್ತೀರಿ?',
        writtenPlaceholder: 'ನಿಮ್ಮ ಆದ್ಯತಾ ಚೌಕಟ್ಟು ಮತ್ತು ನಿರ್ಧಾರ ಪ್ರಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸಿ...',
      },
    },
  ];

  // Filter questions based on testTrack if candidate chose a specialized track
  let selectedQuestions = qList;
  let trackTitle = 'Full 360° Behavioral & Situational Assessment';

  if (testTrack === 'crisis') {
    selectedQuestions = [qList[0], qList[4]]; // Crisis & Prioritization
    trackTitle = 'Crisis Management & Enterprise Resilience Track';
  } else if (testTrack === 'cross_functional') {
    selectedQuestions = [qList[1], qList[3]]; // Communication & Adaptability
    trackTitle = 'Stakeholder Alignment & Scope Negotiation Track';
  } else if (testTrack === 'governance') {
    selectedQuestions = [qList[2], qList[3]]; // Accountability & Governance
    trackTitle = 'Enterprise Governance & Regulatory Agility Track';
  }

  return {
    title: `${trackTitle} - ${ind.name}`,
    roleTarget: roleTitle,
    description: `Tailored assessment for ${params.candidateName || 'Candidate'} focusing on ${ind.name} enterprise scenarios.`,
    questions: selectedQuestions,
  };
}

function getMasterPromptGuidelines(): string {
  try {
    const promptPath = path.join(process.cwd(), 'prompts', 'DiscoverU_Master_Prompt_Multilingual_Simplification.txt');
    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, 'utf-8');
    }
  } catch (err) {
    console.warn('Could not load DiscoverU master prompt file:', err);
  }
  return '';
}

export async function generateAssessmentWithGemini(params: GenerateAssessmentParams): Promise<{
  title: string;
  roleTarget: string;
  description: string;
  questions: IDualPaneQuestion[];
  generatedByAi: boolean;
}> {
  // If a track is explicitly specified ('professional' or 'student'), serve the comprehensive psychometric suite
  if (params.assessmentTrack === 'professional' || params.assessmentTrack === 'student') {
    const trackAssessment = buildIndustryAssessment(params);
    return {
      ...trackAssessment,
      generatedByAi: true,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const masterGuidelines = getMasterPromptGuidelines();
      const prompt = `${masterGuidelines ? `${masterGuidelines.slice(0, 3500)}\n\n---\n\n` : ''}You are an expert Industrial Psychologist and Enterprise Situational Assessment Designer for DiscoverU.
Candidate Profile:
- Name: ${params.candidateName || 'Candidate'}
- Current Role / Background: ${params.currentRole}
- Target Industry: ${params.targetIndustry}
- Test Track: ${params.testTrack} (${params.testTrack === 'crisis' ? 'Crisis Management & System Resilience (2 high-stakes dilemmas)' : params.testTrack === 'cross_functional' ? 'Stakeholder Alignment & Scope Negotiation (2 dilemmas)' : params.testTrack === 'governance' ? 'Enterprise Governance & Regulatory Agility (2 dilemmas)' : 'Full 360° Comprehensive Assessment (5 dilemmas across Problem Solving, Communication, Accountability, Adaptability, Prioritization)'})

Task:
Generate a tailored situational judgment assessment with realistic, nuanced workplace dilemmas according to DiscoverU assessment rules. Each dilemma should challenge someone with background "${params.currentRole}" who wants to work in "${params.targetIndustry}".
Each question MUST follow the dual-perspective design: an objective situational choice (4 options A, B, C, D) followed by a prompt requiring a structured written justification of trade-offs and rationale.
Avoid trivial or obvious answers. Include trilingual translations (English, Hindi, Kannada) for global accessibility, with writtenPrompt and writtenPlaceholder fully populated in all three languages (en, hi, kn).

Return ONLY a valid JSON object matching this schema:
{
  "title": "${params.testTrack === 'full' ? 'Full 360° Assessment' : params.testTrack} - ${params.targetIndustry}",
  "roleTarget": "${params.currentRole} (${params.targetIndustry})",
  "description": "Customized situational judgment assessment for ${params.candidateName} targeting ${params.targetIndustry}.",
  "questions": [
    {
      "questionId": "q1",
      "competencyKey": "problem_solving",
      "competencyName": "Problem Solving",
      "idealEvidenceCriteria": "Systematic root-cause diagnosis, second-order impact consideration, structured trade-off evaluation.",
      "en": {
        "title": "Dilemma 1 Title",
        "scenario": "Detailed workplace scenario...",
        "mcqOptions": [
          { "id": "A", "text": "Option A text", "points": 2, "rationaleCategory": "Short-term patch" },
          { "id": "B", "text": "Option B text", "points": 5, "rationaleCategory": "Root-cause solution" },
          { "id": "C", "text": "Option C text", "points": 3, "rationaleCategory": "Risk aversion" },
          { "id": "D", "text": "Option D text", "points": 1, "rationaleCategory": "Over-escalation" }
        ],
        "writtenPrompt": "Why did you choose this option? What trade-offs did you consider?",
        "writtenPlaceholder": "Detail your reasoning..."
      },
      "hi": {
        "title": "शीर्षक (Hindi)",
        "scenario": "परिदृश्य (Hindi)...",
        "mcqOptions": [
          { "id": "A", "text": "विकल्प A", "points": 2, "rationaleCategory": "श्रेणी" },
          { "id": "B", "text": "विकल्प B", "points": 5, "rationaleCategory": "श्रेणी" },
          { "id": "C", "text": "विकल्प C", "points": 3, "rationaleCategory": "श्रेणी" },
          { "id": "D", "text": "विकल्प D", "points": 1, "rationaleCategory": "श्रेणी" }
        ],
        "writtenPrompt": "आपने यह विकल्प क्यों चुना?",
        "writtenPlaceholder": "अपना तर्क यहाँ लिखें..."
      },
      "kn": {
        "title": "ಶೀರ್ಷಿಕೆ (Kannada)",
        "scenario": "ಸನ್ನಿವೇಶ (Kannada)...",
        "mcqOptions": [
          { "id": "A", "text": "ಆಯ್ಕೆ A", "points": 2, "rationaleCategory": "ವಿಭಾಗ" },
          { "id": "B", "text": "ಆಯ್ಕೆ B", "points": 5, "rationaleCategory": "ವಿಭಾಗ" },
          { "id": "C", "text": "ಆಯ್ಕೆ C", "points": 3, "rationaleCategory": "ವಿಭಾಗ" },
          { "id": "D", "text": "ಆಯ್ಕೆ D", "points": 1, "rationaleCategory": "ವಿಭಾಗ" }
        ],
        "writtenPrompt": "ನೀವು ಈ ಆಯ್ಕೆಯನ್ನು ಏಕೆ ಆರಿಸಿದ್ದೀರಿ?",
        "writtenPlaceholder": "ನಿಮ್ಮ ವಿವರಣೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
      }
    }
  ]
}`;

      const timeoutMs = 15000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini generation timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
        timeoutPromise,
      ]);

      const responseText = response.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          const sanitizedQuestions = parsed.questions.map((q: any, idx: number) => {
            const rawKey = (q.competencyKey || `competency_${idx + 1}`).toString().toLowerCase().trim().replace(/[\s-]+/g, '_');
            const normalizedKey = rawKey === 'prioritization' ? 'prioritisation' : rawKey;
            
            const enContent = q.en || q;
            const hiContent = q.hi || q.en || q;
            const knContent = q.kn || q.en || q;

            return {
              questionId: q.questionId || `q${idx + 1}`,
              competencyKey: normalizedKey,
              competencyName: q.competencyName || 'Core Competency',
              questionType: q.questionType || 'dual_pane',
              category: q.category || 'dilemma',
              subCategory: q.subCategory || '',
              dimension: q.dimension || '',
              isRationaleRequired: Boolean(q.isRationaleRequired),
              isOptionalExplanation: q.isOptionalExplanation ?? !q.isRationaleRequired,
              idealEvidenceCriteria: q.idealEvidenceCriteria || 'Demonstrates structured analytical and behavioral trade-off reasoning.',
              en: {
                ...enContent,
                writtenPrompt: enContent.writtenPrompt || 'Explain why you chose this action. What trade-offs did you consider?',
                writtenPlaceholder: enContent.writtenPlaceholder || 'Detail your reasoning and situational context...',
              },
              hi: {
                ...hiContent,
                writtenPrompt: hiContent.writtenPrompt || 'आपने यह विकल्प क्यों चुना? अपनी विचार प्रक्रिया साझा करें।',
                writtenPlaceholder: hiContent.writtenPlaceholder || 'अपना तर्क और कार्ययोजना यहाँ लिखें...',
              },
              kn: {
                ...knContent,
                writtenPrompt: knContent.writtenPrompt || 'ನೀವು ಈ ಆಯ್ಕೆಯನ್ನು ಏಕೆ ಆರಿಸಿದ್ದೀರಿ? ನಿಮ್ಮ ನಿರ್ಧಾರವನ್ನು ವಿವರಿಸಿ.',
                writtenPlaceholder: knContent.writtenPlaceholder || 'ನಿಮ್ಮ ವಿವರಣೆ ಮತ್ತು ಕಾರ್ಯತಂತ್ರವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
              },
            };
          });

          return {
            title: parsed.title || `Custom Assessment - ${params.targetIndustry}`,
            roleTarget: parsed.roleTarget || `${params.currentRole} (${params.targetIndustry})`,
            description: parsed.description || `AI-generated assessment for ${params.candidateName}`,
            questions: sanitizedQuestions,
            generatedByAi: true,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini assessment generation failed, using verified domain template:', err);
    }
  }

  // Graceful fallback to verified template synthesizer
  const fallback = buildIndustryAssessment(params);
  return {
    ...fallback,
    generatedByAi: false,
  };
}
