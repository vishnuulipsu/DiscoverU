import connectToDatabase from './mongodb';
import { User } from '@/models/User';
import { PromptTemplate } from '@/models/PromptTemplate';
import { PromptVersion } from '@/models/PromptVersion';
import { Assessment, IDualPaneQuestion } from '@/models/Assessment';
import { Submission } from '@/models/Submission';
import { EvaluationResult, IRecruiterEvaluation, ICandidateGrowthReport } from '@/models/EvaluationResult';
import { DEFAULT_PROMPTS } from './prompts';

export const SAMPLE_QUESTIONS: IDualPaneQuestion[] = [
  {
    questionId: 'q1',
    competencyKey: 'problem_solving',
    competencyName: 'Problem Solving',
    idealEvidenceCriteria: 'Systematic root-cause diagnosis, second-order impact consideration, structured trade-off evaluation.',
    en: {
      title: 'Dilemma 1: Critical Production Latency Spike',
      scenario: '30 minutes before an executive demonstration, users report severe latency in the analytics dashboard. The team identifies a temporary quick-restart cache fix that might mask the symptom for 45 minutes, but could cause partial data inconsistency later.',
      mcqOptions: [
        { id: 'A', text: 'Apply the temporary quick-restart cache fix immediately to ensure the executive demo proceeds smoothly.', points: 2, rationaleCategory: 'Tactical Patching' },
        { id: 'B', text: 'Triage the underlying slow database query with an emergency read-replica redirect, and brief the demo leader on potential delay.', points: 5, rationaleCategory: 'Systemic Resolution & Transparency' },
        { id: 'C', text: 'Disable the analytics dashboard entirely during the demo and show pre-rendered screenshots.', points: 3, rationaleCategory: 'Risk Avoidance' },
        { id: 'D', text: 'Escalate immediately to the VP of Engineering and request canceling the demo until full root-cause analysis completes.', points: 2, rationaleCategory: 'Over-Escalation' },
      ],
      writtenPrompt: 'Explain why you chose this action. What immediate risks did you weigh, and what steps would you take in the next 60 minutes?',
      writtenPlaceholder: 'Describe your diagnostic thought process, trade-offs considered, and mitigation strategy...',
    },
    hi: {
      title: 'दुविधा 1: लाइव सिस्टम में अप्रत्याशित देरी (Latency)',
      scenario: 'वरिष्ठ अधिकारियों के महत्वपूर्ण डेमो से 30 मिनट पहले, डैशबोर्ड में गंभीर गतिरोध (Latency) देखा जाता है। टीम एक त्वरित कैश-रीस्टार्ट पैच लगा सकती है जो 45 मिनट तक काम चलाएगा, लेकिन बाद में डेटा में विसंगति पैदा कर सकता है।',
      mcqOptions: [
        { id: 'A', text: 'डेमो को सुचारू रखने के लिए तुरंत त्वरित कैश-रीस्टार्ट पैच लागू करें।', points: 2, rationaleCategory: 'तात्कालिक पैच' },
        { id: 'B', text: 'रीड-रेप्लिका रीडायरेक्ट के साथ मूल समस्या का समाधान करें और डेमो संचालक को स्थिति स्पष्ट करें।', points: 5, rationaleCategory: 'मूल कारण समाधान एवं पारदर्शिता' },
        { id: 'C', text: 'डेमो के दौरान उस मॉड्यूल को बंद कर पहले से सहेजे गए स्क्रीनशॉट दिखाएं।', points: 3, rationaleCategory: 'जोखिम टालना' },
        { id: 'D', text: 'तुरंत उच्चतम प्रबंधन को सूचित कर डेमो रद्द करने की मांग करें।', points: 2, rationaleCategory: 'अनावश्यक एस्केलेशन' },
      ],
      writtenPrompt: 'आपने यह विकल्प क्यों चुना? आपने किन जोखिमों का विश्लेषण किया और अगले 60 मिनट में आपकी क्या कार्ययोजना होगी?',
      writtenPlaceholder: 'अपने विश्लेषण, विचार प्रक्रिया और संभावित परिणामों का विवरण यहाँ लिखें...',
    },
    kn: {
      title: 'ಸನ್ನಿವೇಶ 1: ಮುಖ್ಯ ಡೆಮೊಗೆ ಮುನ್ನ ಸಿಸ್ಟಮ್ ವಿಳಂಬ',
      scenario: 'ಪ್ರಮುಖ ಅಧಿಕಾರಿಗಳ ಡೆಮೊಗೆ 30 ನಿಮಿಷಗಳ ಮೊದಲು ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ತೀವ್ರ ಮಂದಗತಿ ಕಂಡುಬರುತ್ತದೆ. 45 ನಿಮಿಷಗಳ ಕಾಲ ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭದ ಮೂಲಕ ಇದನ್ನು ಮರೆಮಾಚಬಹುದು, ಆದರೆ ನಂತರ ಡೇಟಾ ದೋಷ ಉಂಟಾಗಬಹುದು.',
      mcqOptions: [
        { id: 'A', text: 'ಡೆಮೊ ಸುಲಭವಾಗಿ ಸಾಗಲು ತಕ್ಷಣವೇ ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭ ಪರಿಹಾರವನ್ನು ಅನ್ವಯಿಸಿ.', points: 2, rationaleCategory: 'ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ' },
        { id: 'B', text: 'ಮೂಲ ಸಮಸ್ಯೆಯನ್ನು ಗುರುತಿಸಿ ಪರ್ಯಾಯ ಮಾರ್ಗ ಅನ್ವಯಿಸಿ, ಮತ್ತು ಡೆಮೊ ತಂಡಕ್ಕೆ ಮುಂಚಿತವಾಗಿ ಸ್ಪಷ್ಟಪಡಿಸಿ.', points: 5, rationaleCategory: 'ಮೂಲ ಕಾರಣ ಪರಿಹಾರ ಮತ್ತು ಪಾರದರ್ಶಕತೆ' },
        { id: 'C', text: 'ಆ ಮಾಡ್ಯೂಲ್ ಅನ್ನು ನಿಲ್ಲಿಸಿ ಹಿಂದಿನ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ.', points: 3, rationaleCategory: 'ಅಪಾಯ ತಪ್ಪಿಸುವಿಕೆ' },
        { id: 'D', text: 'ಡೆಮೊವನ್ನು ತಕ್ಷಣ ರದ್ದುಗೊಳಿಸಲು ಉನ್ನತ ಅಧಿಕಾರಿಗೆ ವಿನಂತಿಸಿ.', points: 2, rationaleCategory: 'ಅತಿಯಾದ ಎಸ್ಕಲೇಶನ್' },
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
      title: 'Dilemma 2: Cross-Functional Feature Misalignment',
      scenario: 'The Product Manager demands adding an unvetted checkout integration 4 days before release. Your engineering analysis indicates this introduces an 80% regression risk to mobile payment processing.',
      mcqOptions: [
        { id: 'A', text: 'Work overnight without complaint to implement as much of the feature as possible.', points: 1, rationaleCategory: 'Passive Compliance' },
        { id: 'B', text: 'Flatly reject the request on Slack citing engineering governance policies.', points: 2, rationaleCategory: 'Adversarial Defense' },
        { id: 'C', text: 'Schedule a 20-minute sync with the PM, visually illustrate the regression trade-off, and offer a phased feature-flag rollout.', points: 5, rationaleCategory: 'Collaborative Problem Framing' },
        { id: 'D', text: 'Agree to build it but explicitly disclaim all responsibility in writing if payments fail.', points: 2, rationaleCategory: 'Defensive Bureaucracy' },
      ],
      writtenPrompt: 'How will you structure the conversation with the Product Manager to maintain trust while protecting product stability?',
      writtenPlaceholder: 'Detail your exact talking points, collaborative alternatives, and empathy-driven negotiation strategy...',
    },
    hi: {
      title: 'दुविधा 2: उत्पाद टीम के साथ प्राथमिकता टकराव',
      scenario: 'रिलीज से 4 दिन पहले प्रोडक्ट मैनेजर एक नया फीचर जोड़ने का दबाव डालते हैं, जिससे 80% मामलों में मोबाइल पेमेंट फेल होने का गंभीर जोखिम है।',
      mcqOptions: [
        { id: 'A', text: 'रात भर काम करके बिना किसी आपत्ति के फीचर बनाने की कोशिश करें।', points: 1, rationaleCategory: 'मौन सहमति' },
        { id: 'B', text: 'नियमों का हवाला देकर सीधे मना कर दें।', points: 2, rationaleCategory: 'टकराव' },
        { id: 'C', text: '20 मिनट की बैठक बुलाकर जोखिम समझाएं और फीचर-फ्लैग के साथ चरणबद्ध रिलीज का विकल्प दें।', points: 5, rationaleCategory: 'सहयोगात्मक संवाद' },
        { id: 'D', text: 'फीचर बना दें लेकिन विफलता की जिम्मेदारी लेने से लिखित रूप में मना कर दें।', points: 2, rationaleCategory: 'बचावकारी दृष्टिकोण' },
      ],
      writtenPrompt: 'उत्पाद की स्थिरता की रक्षा करते हुए आपसी विश्वास बनाए रखने के लिए आप बातचीत को कैसे आगे बढ़ाएंगे?',
      writtenPlaceholder: 'अपने संवाद के मुख्य बिंदु और सहयोगात्मक विकल्प यहाँ स्पष्ट करें...',
    },
    kn: {
      title: 'ಸನ್ನಿವೇಶ 2: ತಂಡಗಳ ನಡುವೆ ಆದ್ಯತೆಗಳ ಹೊಂದಾಣಿಕೆ ಕೊರತೆ',
      scenario: 'ಉತ್ಪನ್ನ ಬಿಡುಗಡೆಗೆ 4 ದಿನಗಳ ಮೊದಲು ಹೊಸ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಸೇರಿಸಲು ಬೇಡಿಕೆ ಬರುತ್ತದೆ, ಆದರೆ ಇದರಿಂದ ಮೊಬೈಲ್ ಪಾವತಿಯಲ್ಲಿ 80% ದೋಷ ಉಂಟಾಗುವ ಅಪಾಯವಿದೆ.',
      mcqOptions: [
        { id: 'A', text: 'ಯಾವುದೇ ವಿರೋಧವಿಲ್ಲದೆ ರಾತ್ರಿಯಿಡೀ ಕೆಲಸ ಮಾಡಿ ಅದನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಪ್ರಯತ್ನಿಸಿ.', points: 1, rationaleCategory: 'ನಿಷ್ಕ್ರಿಯ ಅನುಸರಣೆ' },
        { id: 'B', text: 'ನೇರವಾಗಿ ನಿಯಮಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ ನಿರಾಕರಿಸಿ.', points: 2, rationaleCategory: 'ಸಂಘರ್ಷ' },
        { id: 'C', text: 'ಸಭೆ ನಡೆಸಿ ಅಪಾಯದ ಬಗ್ಗೆ ಸ್ಪಷ್ಟಪಡಿಸಿ ಮತ್ತು ಹಂತ ಹಂತವಾಗಿ ಬಿಡುಗಡೆ ಮಾಡುವ ಉಪಾಯ ನೀಡಿ.', points: 5, rationaleCategory: 'ವಿಶ್ವಾಸಾರ್ಹ ಸಮನ್ವಯ' },
        { id: 'D', text: 'ಕೆಲಸ ಮುಗಿಸಿ ಆದರೆ ದೋಷ ಬಂದರೆ ನನ್ನ ಜವಾಬ್ದಾರಿಯಲ್ಲ ಎಂದು ಬರೆದು ಕೊಡಿ.', points: 2, rationaleCategory: 'ರಕ್ಷಣಾತ್ಮಕ ಧೋರಣೆ' },
      ],
      writtenPrompt: 'ವಿಶ್ವಾಸವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುತ್ತಾ ಸಿಸ್ಟಮ್ ಸುರಕ್ಷತೆಯನ್ನು ಖಚಿತಪಡಿಸಲು ನೀವು ಹೇಗೆ ಸಂವಹನ ನಡೆಸುತ್ತೀರಿ?',
      writtenPlaceholder: 'ನಿಮ್ಮ ಚರ್ಚೆಯ ವಿಧಾನ ಮತ್ತು ಪ್ರಸ್ತಾವಿತ ಪರಿಹಾರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
    },
  },
  {
    questionId: 'q3',
    competencyKey: 'accountability',
    competencyName: 'Accountability',
    idealEvidenceCriteria: 'Unconditional ownership, transparent blameless post-mortem, immediate containment, and systemic preventative measures.',
    en: {
      title: 'Dilemma 3: The Overlooked Edge Case Outage',
      scenario: 'A code review you signed off on missed a concurrency edge case, causing 120 customer accounts to be temporarily locked. Management is looking into how this happened.',
      mcqOptions: [
        { id: 'A', text: 'Acknowledge publicly that you approved the PR, take full ownership of the miss, deploy a fix, and publish a blameless post-mortem with automated test guardrails.', points: 5, rationaleCategory: 'Radical Ownership & Preventative Action' },
        { id: 'B', text: 'Point out that the original author wrote the code and the QA test suite should have caught the bug.', points: 1, rationaleCategory: 'Blame Shifting' },
        { id: 'C', text: 'Silently push a hotfix and update the PR history before anyone notices your approval.', points: 1, rationaleCategory: 'Obfuscation' },
        { id: 'D', text: 'Wait for the incident review meeting before saying anything to avoid unnecessary attention.', points: 2, rationaleCategory: 'Passive Avoidance' },
      ],
      writtenPrompt: 'Describe how you will document this incident for the engineering team and what automated guardrails you will implement to prevent recurrence.',
      writtenPlaceholder: 'Detail your communication to stakeholders, root cause analysis, and long-term preventative safeguards...',
    },
    hi: {
      title: 'दुविधा 3: समीक्षा में छूटी त्रुटि और सिस्टम व्यवधान',
      scenario: 'आपके द्वारा अप्रूव किए गए कोड में एक कमी रह गई जिसके कारण 120 उपयोगकर्ताओं के खाते अस्थायी रूप से लॉक हो गए। प्रबंधन घटना की जांच कर रहा है।',
      mcqOptions: [
        { id: 'A', text: 'सार्वजनिक रूप से जिम्मेदारी स्वीकार करें, तुरंत फिक्स करें और भविष्य के लिए ऑटोमेटेड टेस्ट जोड़ें।', points: 5, rationaleCategory: 'पूर्ण जवाबदेही एवं सुरक्षा' },
        { id: 'B', text: 'यह स्पष्ट करें कि कोड मूल डेवलपर ने लिखा था और टेस्टिंग टीम को इसे पकड़ना चाहिए था।', points: 1, rationaleCategory: 'दोषारोपण' },
        { id: 'C', text: 'बिना किसी को बताए तुरंत फिक्स कर दें ताकि किसी को पता न चले।', points: 1, rationaleCategory: 'तथ्य छिपाना' },
        { id: 'D', text: 'औपचारिक बैठक होने तक शांत रहें ताकि अनावश्यक ध्यान न आकर्षित हो।', points: 2, rationaleCategory: 'निष्क्रियता' },
      ],
      writtenPrompt: 'आप इस घटना की जिम्मेदारी कैसे लेंगे और ऐसी स्थिति दोबारा न हो, इसके लिए क्या कदम उठाएंगे?',
      writtenPlaceholder: 'अपनी जवाबदेही, सुधारात्मक कदम और टीम के लिए सुरक्षा उपायों का विवरण दें...',
    },
    kn: {
      title: 'ಸನ್ನಿವೇಶ 3: ಅನುಮೋದಿತ ಕೋಡ್‌ನಲ್ಲಿ ದೋಷ',
      scenario: 'ನೀವು ಪರಿಶೀಲಿಸಿದ ಕೋಡ್‌ನಲ್ಲಿನ ದೋಷದಿಂದಾಗಿ 120 ಗ್ರಾಹಕರ ಖಾತೆಗಳು ತಾತ್ಕಾಲಿಕವಾಗಿ ಸ್ಥಗಿತಗೊಂಡಿವೆ. ಆಡಳಿತ ಮಂಡಳಿ ಇದರ ಬಗ್ಗೆ ವಿಚಾರಣೆ ನಡೆಸುತ್ತಿದೆ.',
      mcqOptions: [
        { id: 'A', text: 'ಸಂಪೂರ್ಣ ಜವಾಬ್ದಾರಿಯನ್ನು ಹೊತ್ತುಕೊಂಡು, ತಕ್ಷಣವೇ ಪರಿಹರಿಸಿ, ಭವಿಷ್ಯದಲ್ಲಿ ತಡೆಯಲು ಸ್ವಯಂಚಾಲಿತ ಪರೀಕ್ಷೆಗಳನ್ನು ಸೇರಿಸಿ.', points: 5, rationaleCategory: 'ಸಂಪೂರ್ಣ ಹೊಣೆಗಾರಿಕೆ ಮತ್ತು ತಡೆಗಟ್ಟುವಿಕೆ' },
        { id: 'B', text: 'ಕೋಡ್ ಬರೆದ ಡೆವಲಪರ್ ಅಥವಾ ಟೆಸ್ಟಿಂಗ್ ತಂಡದ ತಪ್ಪು ಎಂದು ವಾದಿಸಿ.', points: 1, rationaleCategory: 'ಇತರರ ಮೇಲೆ ದೂಷಣೆ' },
        { id: 'C', text: 'ಯಾರಿಗೂ ತಿಳಿಯದಂತೆ ಸದ್ದಿಲ್ಲದೆ ತಿದ್ದುಪಡಿ ಮಾಡಿ.', points: 1, rationaleCategory: 'ಮರೆಮಾಚುವಿಕೆ' },
        { id: 'D', text: 'ವಿಚಾರಣಾ ಸಭೆ ಕರೆಯುವವರೆಗೂ ಏನನ್ನೂ ಹೇಳದೆ ಕಾಯಿರಿ.', points: 2, rationaleCategory: 'ನಿಷ್ಕ್ರಿಯತೆ' },
      ],
      writtenPrompt: 'ನೀವು ಈ ಘಟನೆಯ ಹೊಣೆಯನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುತ್ತೀರಿ ಮತ್ತು ಭವಿಷ್ಯದಲ್ಲಿ ಇದನ್ನು ತಪ್ಪಿಸಲು ಯಾವ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳುತ್ತೀರಿ?',
      writtenPlaceholder: 'ನಿಮ್ಮ ಪ್ರಾಮಾಣಿಕ ನಡೆ ಮತ್ತು ದೀರ್ಘಕಾಲೀನ ಪರಿಹಾರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
    },
  },
  {
    questionId: 'q4',
    competencyKey: 'adaptability',
    competencyName: 'Adaptability',
    idealEvidenceCriteria: 'Calm pivot under shifting constraints, rapid mental model reframing, maintaining team momentum despite ambiguity.',
    en: {
      title: 'Dilemma 4: Mid-Sprint Regulatory Architecture Pivot',
      scenario: 'Halfway through a two-week sprint, a new data residency compliance mandate requires redesigning your team\'s primary storage tier from scratch within 5 days.',
      mcqOptions: [
        { id: 'A', text: 'Break down the new mandate into minimal viable compliance primitives, descope non-essential features, and align the sprint backlog around the new goal.', points: 5, rationaleCategory: 'Agile Re-architecting & Focus' },
        { id: 'B', text: 'Refuse to alter the sprint backlog because agile best practices discourage mid-sprint scope changes.', points: 1, rationaleCategory: 'Rigid Dogmatism' },
        { id: 'C', text: 'Work on both the old feature commitments and the new mandate simultaneously without revising timeline expectations.', points: 2, rationaleCategory: 'Burnout Trapping' },
        { id: 'D', text: 'Ask the engineering manager to pause all work for 3 days until lawyers review the mandate.', points: 2, rationaleCategory: 'Stall Pattern' },
      ],
      writtenPrompt: 'How do you lead yourself and your teammates through sudden high-friction pivots without losing quality or morale?',
      writtenPlaceholder: 'Describe your adaptive prioritization, re-scoping tactics, and psychological resilience strategy...',
    },
    hi: {
      title: 'दुविधा 4: स्प्रिंट के बीच में नियमों का अचानक बदलाव',
      scenario: 'दो सप्ताह के स्प्रिंट के बीच में, नए नियमों के कारण आपकी टीम को 5 दिनों के भीतर डेटा स्टोरेज आर्किटेक्चर को पूरी तरह से बदलना पड़ रहा है।',
      mcqOptions: [
        { id: 'A', text: 'नए नियमों को आवश्यक चरणों में विभाजित करें, गैर-जरूरी फीचर्स को आगे टालें और नए लक्ष्य पर केंद्रित हों।', points: 5, rationaleCategory: 'सक्रिय अनुकूलन और पुनर्प्राथमिकता' },
        { id: 'B', text: 'स्प्रिंट के बीच में बदलाव करने से मना करें क्योंकि यह कार्यप्रणाली के विरुद्ध है।', points: 1, rationaleCategory: 'कठोरता' },
        { id: 'C', text: 'समय सीमा बदले बिना दोनों कामों को एक साथ पूरा करने का अवास्तविक दबाव लें।', points: 2, rationaleCategory: 'तनाव का खतरा' },
        { id: 'D', text: 'जब तक स्पष्टता न हो, सारा काम रोक दें।', points: 2, rationaleCategory: 'काम में रुकावट' },
      ],
      writtenPrompt: 'अचानक आए इस बड़े बदलाव के समय आप टीम का मनोबल बनाए रखते हुए काम को कैसे गति देंगे?',
      writtenPlaceholder: 'अपनी लचीली रणनीति और टीम समन्वय का विवरण यहाँ साझा करें...',
    },
    kn: {
      title: 'ಸನ್ನಿವೇಶ 4: ಕೆಲಸದ ಮಧ್ಯೆ ಅನಿರೀಕ್ಷಿತ ನಿಯಮಗಳ ಬದಲಾವಣೆ',
      scenario: 'ಯೋಜನೆಯ ಮಧ್ಯದಲ್ಲಿ ಹೊಸ ನಿಯಮಗಳಿಂದಾಗಿ ನಿಮ್ಮ ಡೇಟಾ ಸಂಗ್ರಹಣಾ ಮಾದರಿಯನ್ನು 5 ದಿನಗಳಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಮರುರಚಿಸಬೇಕಾದ ಅನಿವಾರ್ಯತೆ ಉಂಟಾಗುತ್ತದೆ.',
      mcqOptions: [
        { id: 'A', text: 'ಹೊಸ ಅಗತ್ಯಗಳನ್ನು ಆದ್ಯತೆಯ ಮೇರೆಗೆ ವಿಂಗಡಿಸಿ, ಅನಗತ್ಯ ಕೆಲಸಗಳನ್ನು ಮುಂದೂಡಿ ಹೊಸ ಗುರಿಯತ್ತ ಗಮನಹರಿಸಿ.', points: 5, rationaleCategory: 'ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಕ್ರಿಯಾಶೀಲತೆ' },
        { id: 'B', text: 'ಮಧ್ಯದಲ್ಲಿ ನಿಯಮಗಳನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂದು ನಿರಾಕರಿಸಿ.', points: 1, rationaleCategory: 'ಮೊಂಡುತನ' },
        { id: 'C', text: 'ಸಮಯ ಹೆಚ್ಚಿಸದೆ ಎರಡೂ ಕೆಲಸಗಳನ್ನು ಒಟ್ಟಿಗೆ ಮಾಡಲು ಪ್ರಯತ್ನಿಸಿ ಒತ್ತಡಕ್ಕೆ ಒಳಗಾಗಿ.', points: 2, rationaleCategory: 'ಅತಿಯಾದ ಒತ್ತಡ' },
        { id: 'D', text: 'ಸ್ಪಷ್ಟತೆ ಸಿಗುವವರೆಗೂ ಎಲ್ಲ ಕೆಲಸಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ.', points: 2, rationaleCategory: 'ವಿಳಂಬ ನೀತಿ' },
      ],
      writtenPrompt: 'ಇಂತಹ ಅನಿರೀಕ್ಷಿತ ತಿರುವುಗಳಲ್ಲಿ ನೀವು ಹೇಗೆ ಹೊಂದಾಣಿಕೆ ಮಾಡಿಕೊಳ್ಳುತ್ತೀರಿ ಮತ್ತು ತಂಡದ ಉತ್ಸಾಹವನ್ನು ಹೇಗೆ ಕಾಪಾಡುತ್ತೀರಿ?',
      writtenPlaceholder: 'ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆಯ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಯೋಜನಾ ಕೌಶಲ್ಯವನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ...',
    },
  },
  {
    questionId: 'q5',
    competencyKey: 'prioritisation',
    competencyName: 'Prioritisation',
    idealEvidenceCriteria: 'Impact vs urgency triage, ring-fencing strategic technical investments against relentless operational noise.',
    en: {
      title: 'Dilemma 5: Competing Escalations vs High-Impact Milestones',
      scenario: 'You have 1 day remaining to deliver a core security milestone that protects 500,000 users. Simultaneously, 4 customer support tickets marked "urgent" arrive from enterprise accounts.',
      mcqOptions: [
        { id: 'A', text: 'Drop the security milestone and resolve all 4 support tickets immediately to keep enterprise customers satisfied.', points: 2, rationaleCategory: 'Reactive Noise Triage' },
        { id: 'B', text: 'Quickly evaluate the 4 tickets for severe workarounds; assign workarounds or delegate, while ring-fencing uninterrupted focus to deliver the security milestone.', points: 5, rationaleCategory: 'Systemic Impact Prioritisation' },
        { id: 'C', text: 'Ignore the customer tickets entirely and turn off notifications until the security feature ships.', points: 3, rationaleCategory: 'Tunnel Vision' },
        { id: 'D', text: 'Try to do half of each task concurrently, delivering neither to completion.', points: 1, rationaleCategory: 'Fragmented Execution' },
      ],
      writtenPrompt: 'How do you distinguish between high-volume urgency and high-impact strategic necessity when under intense time pressure?',
      writtenPlaceholder: 'Detail your triage criteria, delegation mechanisms, and boundary protection...',
    },
    hi: {
      title: 'दुविधा 5: तत्काल ग्राहक शिकायतें बनाम महत्वपूर्ण सुरक्षा प्रोजेक्ट',
      scenario: '5 लाख उपयोगकर्ताओं की सुरक्षा सुनिश्चित करने वाले प्रोजेक्ट को पूरा करने में केवल 1 दिन शेष है। उसी समय 4 ग्राहकों की "अति-आवश्यक" शिकायतें आती हैं।',
      mcqOptions: [
        { id: 'A', text: 'सुरक्षा प्रोजेक्ट छोड़कर तुरंत चारों ग्राहकों की समस्याओं को हल करने में लग जाएं।', points: 2, rationaleCategory: 'प्रतिक्रियात्मक' },
        { id: 'B', text: 'ग्राहकों के लिए त्वरित वैकल्पिक उपाय (workaround) दें या टीम को सौंपें, और सुरक्षा प्रोजेक्ट को समय पर पूरा करें।', points: 5, rationaleCategory: 'रणनीतिक प्रभाव प्राथमिकता' },
        { id: 'C', text: 'ग्राहक संदेशों को अनदेखा कर सूचनाएं बंद कर दें।', points: 3, rationaleCategory: 'संवाद शून्यता' },
        { id: 'D', text: 'दोनों काम एक साथ करने की कोशिश करें, जिससे कोई भी पूरा न हो सके।', points: 1, rationaleCategory: 'अव्यवस्थित' },
      ],
      writtenPrompt: 'गंभीर समय सीमा के दौरान आप वास्तविक प्रभाव और तात्कालिक शोर के बीच संतुलन कैसे बनाते हैं?',
      writtenPlaceholder: 'अपनी प्राथमिकताओं को निर्धारित करने की कसौटी और समय प्रबंधन का विवरण दें...',
    },
    kn: {
      title: 'ಸನ್ನಿವೇಶ 5: ತುರ್ತು ಗ್ರಾಹಕ ವಿನಂತಿಗಳು ಮತ್ತು ಮುಖ್ಯ ಸುರಕ್ಷತಾ ಗುರಿ',
      scenario: '5 ಲಕ್ಷ ಬಳಕೆದಾರರ ಸುರಕ್ಷತೆಯ ಮಹತ್ವದ ಮೈಲಿಗಲ್ಲನ್ನು ತಲುಪಲು ಕೇವಲ 1 ದಿನ ಬಾಕಿ ಇದೆ. ಅದೇ ಸಮಯದಲ್ಲಿ 4 ಉದ್ಯಮ ಗ್ರಾಹಕರಿಂದ ತುರ್ತು ವಿನಂತಿಗಳು ಬರುತ್ತವೆ.',
      mcqOptions: [
        { id: 'A', text: 'ಸುರಕ್ಷತಾ ಕೆಲಸವನ್ನು ಬಿಟ್ಟು ಆ 4 ಗ್ರಾಹಕರ ಕೆಲಸವನ್ನು ತಕ್ಷಣ ಮುಗಿಸಿ.', points: 2, rationaleCategory: 'ಕ್ಷಣಿಕ ಪ್ರತಿಕ್ರಿಯೆ' },
        { id: 'B', text: 'ಆ ವಿನಂತಿಗಳಿಗೆ ತಾತ್ಕಾಲಿಕ ಪರಿಹಾರ ನೀಡಿ ಅಥವಾ ತಂಡಕ್ಕೆ ನಿಯೋಜಿಸಿ, ಮುಖ್ಯ ಸುರಕ್ಷತಾ ಗುರಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.', points: 5, rationaleCategory: 'ವ್ಯವಸ್ಥಿತ ಪರಿಣಾಮಕಾರಿ ಆದ್ಯತೆ' },
        { id: 'C', text: 'ಗ್ರಾಹಕರ ಸಂದೇಶಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿರ್ಲಕ್ಷಿಸಿ.', points: 3, rationaleCategory: 'ಸಂವಹನ ಕೊರತೆ' },
        { id: 'D', text: 'ಎರಡೂ ಕೆಲಸಗಳನ್ನು ಒಟ್ಟಿಗೆ ಮಾಡಲು ಹೋಗಿ ಯಾವುದನ್ನೂ ಸರಿಯಾಗಿ ಮುಗಿಸದಿರುವುದು.', points: 1, rationaleCategory: 'ಗೊಂದಲದ ನಿರ್ವಹಣೆ' },
      ],
      writtenPrompt: 'ತೀವ್ರ ಸಮಯದ ಒತ್ತಡದಲ್ಲಿ ಹೆಚ್ಚಿನ ಪರಿಣಾಮ ಬೀರುವ ಕೆಲಸ ಮತ್ತು ತಾತ್ಕಾಲಿಕ ತುರ್ತಿನ ನಡುವೆ ನೀವು ಹೇಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೀರಿ?',
      writtenPlaceholder: 'ನಿಮ್ಮ ಆದ್ಯತಾ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆಯನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ...',
    },
  },
];

export const NANDINI_GROWTH_REPORT: ICandidateGrowthReport = {
  language: 'en',
  candidateId: 'cand_1792239718581',
  totalQuestions: 34,
  scoringIntegrity: {
    languagesUsed: ['en'],
    simplificationRequestsCount: 8,
    scoreImpactOrPenalty: 0,
    verificationStatus: 'Languages used (en) & Simplification requests (8) caused 0 score impact or penalty',
  },
  personalityProfile: {
    oceanScores: {
      openness: 3.5,
      conscientiousness: 3.8,
      extraversion: 2.3,
      agreeableness: 2.8,
      emotionalStability: 3.5,
    },
    traitExplanations: {
      openness: 'Balanced curiosity; balances established patterns with experimental approaches.',
      conscientiousness: 'Methodical, thorough, strong follow-through and disciplined validation.',
      extraversion: 'Thoughtful, introspective; thrives in small groups and individual focus.',
      agreeableness: 'Direct, discerning, questions assumptions constructively to protect quality.',
      emotionalStability: 'Generally steady under pressure, mindful of risk factors and systematic recovery.',
    },
    uncertaintyNote: 'Personality profiles reflect self-reported tendencies in situational contexts, not fixed psychological limitations. Individual traits adapt dynamically based on environment, team psychological safety, and project complexity.',
    oceanDetails: [
      {
        trait: 'Openness to Experience',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'Balanced curiosity; balances established patterns with experimental approaches.',
        everydayContext: 'Academic/project comfort with unconventional solutions vs. standard templates.',
        tradeOffs: 'Reliable in routines, may resist new tools/paradigms if rationale is unproven.',
      },
      {
        trait: 'Conscientiousness',
        score: 3.8,
        maxScore: 5.0,
        supportedInterpretation: 'Methodical, thorough, strong follow-through on commitments.',
        everydayContext: 'Project documentation, detail validation, personal time management.',
        tradeOffs: 'Drives high quality, but can introduce perfectionist friction if timelines shrink.',
      },
      {
        trait: 'Extraversion',
        score: 2.3,
        maxScore: 5.0,
        supportedInterpretation: 'Thoughtful, introspective; thrives in small groups and individual focus.',
        everydayContext: 'Group brainstorming vs. independent execution.',
        tradeOffs: 'Excels in quiet analytical work; needs to signal engagement in large cross-functional meetings.',
      },
      {
        trait: 'Agreeableness',
        score: 2.8,
        maxScore: 5.0,
        supportedInterpretation: 'Direct, discerning, questions assumptions constructively.',
        everydayContext: 'Handling team disagreements and peer feedback.',
        tradeOffs: 'Uncompromising quality control, but risks interpersonal friction in collaborative settings if unbuffered.',
      },
      {
        trait: 'Emotional Stability & Resilience',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'Generally steady under pressure, mindful of risk factors.',
        everydayContext: 'Processing critical feedback, sudden scope shifts, formal evaluations.',
        tradeOffs: 'Catches subtle risks early, but prolonged high-uncertainty environments can lead to emotional exhaustion.',
      },
    ],
  },
  potentialStrengths: [
    {
      title: 'Methodical Problem Solving with Ownership',
      tendency: 'Approaches complex problems with systematic decomposition and relentless ownership, choosing collaborative diagnosis over superficial quick fixes.',
      supportedStarExample: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      whatAssessmentSuggests: 'Strong diagnostic perseverance; methodically traces errors rather than applying quick cosmetic patches.',
      starEvidenceQuote: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and...',
      whereItMayHelp: 'Mission-critical service troubleshooting, reliability engineering, and architecting resilient workflows.',
    },
    {
      title: 'Constructive Disagreement Resolution',
      tendency: 'Navigates conflicting peer opinions by establishing objective evaluation criteria and separating personal preferences from project goals.',
      supportedStarExample: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      whatAssessmentSuggests: 'Seeks objective evaluation criteria when opinions clash, preventing interpersonal conflict.',
      starEvidenceQuote: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different a...',
      whereItMayHelp: 'Cross-functional alignment between engineering and product requirements, code review alignment, and team alignment.',
    },
    {
      title: 'Resilience and Receptivity to Feedback',
      tendency: 'Demonstrates the maturity to candidly acknowledge when past efforts fell short, extracting lasting lessons and instituting proactive self-improvement habits.',
      supportedStarExample: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      whatAssessmentSuggests: 'Views evaluative critiques as growth catalysts, proactively adopting corrective habits.',
      starEvidenceQuote: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that pu...',
      whereItMayHelp: 'Rapid technical onboarding, adopting cutting-edge engineering standards, and long-term career growth.',
    },
  ],
  challenges: [
    {
      title: 'Potential Hesitation to Voice Early Dissent',
      whyItMayOccur: 'High focus on harmony or deferring to perceived authority during fast-paced reviews.',
      howItMightAppear: 'Reluctance to interrupt momentum in design reviews when edge cases are spotted.',
      whatToWatchFor: 'Silence during critical architectural calls followed by private offline concerns.',
      constructiveAdjustment: 'Frame concern around risk management: "To protect our launch milestone, can we review two potential edge cases before finalizing?"',
    },
    {
      title: 'Managing Time Constraints During Deep Problem Exploration',
      whyItMayOccur: 'High diligence drives desire for exhaustive root-cause verification before delivering progress updates.',
      howItMightAppear: 'Spending disproportionate time on low-probability corner cases.',
      whatToWatchFor: 'Delaying status updates while chasing edge cases in isolation.',
      constructiveAdjustment: 'Implement a strict 45-minute exploration timebox: "Timebox investigation to 45 mins, then post a 3-bullet progress summary to the team channel before continuing."',
    },
  ],
  blindSpotsAndChallenges: [
    {
      title: 'Potential Hesitation to Voice Early Dissent',
      area: 'Early Risk Signaling & Technical Dissent',
      evidenceContext: 'Reluctance to interrupt team momentum when edge-case flaws or implementation risks are initially noticed.',
      constructivePerspective: 'High respect for domain expertise and harmony can cause deferred pushback until after architectural plans are finalized.',
      whyItMayOccur: 'High agreeableness/focus on harmony or deferring to perceived authority during fast-paced reviews.',
      howItMightAppear: 'Reluctance to interrupt momentum in design reviews when edge cases are spotted.',
      whatToWatchFor: 'Silence during critical architectural calls followed by private offline concerns.',
      constructiveAdjustment: 'Frame concern around risk management: "To protect our launch milestone, can we review two potential edge cases before finalizing?"',
    },
    {
      title: 'Managing Time Constraints During Deep Problem Exploration',
      area: 'Deep-Dive Investigation vs. Delivery Cadence',
      evidenceContext: 'Spending disproportionate time attempting to resolve complex anomalies in isolation without interim status signals.',
      constructivePerspective: 'Strong conscientiousness drives thoroughness, which may unintentionally compress remaining delivery buffer.',
      whyItMayOccur: 'High conscientiousness drives desire for exhaustive root-cause verification before delivering progress updates.',
      howItMightAppear: 'Spending disproportionate time on low-probability corner cases.',
      whatToWatchFor: 'Delaying status updates while chasing edge cases in isolation.',
      constructiveAdjustment: 'Implement a strict 45-minute exploration timebox: "Timebox investigation to 45 mins, then post a 3-bullet progress summary to the team channel before continuing."',
    },
  ],
  workPreferences: [
    {
      title: 'Semi-Structured Work Environments with Execution Autonomy',
      hypothesisTitle: 'Semi-Structured Work Environments with Execution Autonomy',
      environmentType: 'Agile Feature Pods with Execution Ownership',
      description: 'Balances structured agile workflows with freedom to architect solutions independently.',
      assessmentFindings: 'Nandini thrives in environments that provide clear overarching objectives and constraints, while affording full autonomy in tactical design and execution.',
      supportingEvidence: 'Shows highest velocity when requirements are unambiguous and execution is unconstrained by micromanagement.',
      realWorldApplication: 'Agile sprint pods, feature-team ownership, decentralized development environments.',
      adaptationStrategy: 'Request clear acceptance criteria upfront, then establish async check-ins.',
    },
    {
      title: 'Transparent, Collaborative Teams with Clear Individual Roles',
      hypothesisTitle: 'Transparent, Collaborative Teams with Clear Individual Roles',
      environmentType: 'High-Trust Cross-Functional Squads',
      description: 'Values explicit boundaries and open communication channels where credit and accountability are shared.',
      assessmentFindings: 'Works best in psychological safety cultures where knowledge is openly shared, roles are clearly delineated, and peer accountability is transparent.',
      supportingEvidence: 'Resolved peer disagreements by establishing objective criteria and dividing tasks cleanly.',
      realWorldApplication: 'Cross-functional product squads with defined domain ownership.',
      adaptationStrategy: 'Maintain documented RACI charts and clear pull-request guidelines.',
    },
  ],
  personalDevelopmentPlan: [
    {
      priorityTitle: 'Practice Structured Technical Dissent',
      timeframe: 'Next 14 Days',
      timeline: 'Next 14 days',
      whyItMatters: 'Prevents critical bugs from reaching production and establishes technical credibility.',
      practicalAction: 'Frame at least one proactive risk-observation in team sprint ceremonies using the Risk-Impact-Mitigation formula.',
      suggestedHabit: 'Speak up in the first 15 minutes of architectural reviews.',
      progressIndicator: '2 constructive technical questions logged in sprint review minutes.',
      measureOfProgress: '2 logged technical questions in team review minutes.',
      reflectionPrompt: 'Did raising this risk improve the project plan or prevent a bottleneck?',
    },
    {
      priorityTitle: 'Implement Timeboxed Exploration Limits',
      timeframe: 'Next 30 Days',
      timeline: 'Next 30 days',
      whyItMatters: 'Prevents rabbit-hole exploration from impacting sprint delivery timelines.',
      practicalAction: 'Set a timer for 45 minutes on exploratory debugging before submitting a progress update to peers.',
      suggestedHabit: 'Post a 3-bullet status checkpoint before diving deeper into unexpected bugs.',
      progressIndicator: 'Zero missed daily standup delivery estimates attributable to untracked debugging.',
      measureOfProgress: '100% adherence to 45-minute debugging timeboxes.',
      reflectionPrompt: 'Did timeboxing help me innovate without compromising the deadline?',
    },
    {
      priorityTitle: 'Refine Measurable Outcome Quantification',
      timeframe: 'Next 30 Days',
      timeline: 'Next 30 days',
      whyItMatters: 'Enhances self-advocacy and makes engineering achievements measurable to leadership.',
      practicalAction: 'Quantify impact statements in monthly self-reviews with metrics (e.g., % latency reduction, hours saved, PRs merged).',
      suggestedHabit: 'Keep a weekly brag-sheet tracking measurable technical milestones.',
      progressIndicator: '100% of portfolio accomplishments include measurable before-and-after baselines.',
      measureOfProgress: 'Measurable metric attached to every completed Jira/Linear ticket.',
      reflectionPrompt: 'Does my Result statement clearly demonstrate the value of my personal contribution?',
    },
  ],
  preservedStarEvidence: [
    {
      competency: 'Problem Solving & Ownership',
      originalLanguage: 'English (en)',
      situation: 'Prompt accuracy failure observed during high-stakes AI integration with a tight delivery deadline.',
      task: 'Identify root cause of failure and restore prompt output quality without delaying the release milestone.',
      action: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      result: 'Achieved expected accuracy thresholds, prevented launch slip, and established a shared prompt testing checklist.',
    },
    {
      competency: 'Teamwork & Disagreement',
      originalLanguage: 'English (en)',
      situation: 'Team members disagreed on technical architecture approach for a new feature module.',
      task: 'Bridge conflicting viewpoints to select a path forward without causing interpersonal friction.',
      action: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      result: 'Reached consensus within one working session, delivered module ahead of schedule, and maintained positive team chemistry.',
    },
    {
      competency: 'Adaptability & Learning',
      originalLanguage: 'English (en)',
      situation: 'Assigned to work with a newly introduced AI framework with minimal documentation and tight turnaround.',
      task: 'Master framework essentials and deliver working prototype within 48 hours.',
      action: 'Broke down framework into core primitives, built incremental proof-of-concepts, and verified outputs against known test cases.',
      result: 'Completed prototype on schedule and wrote a 2-page quickstart guide for the rest of the engineering team.',
    },
    {
      competency: 'Setbacks & Feedback',
      originalLanguage: 'English (en)',
      situation: 'Received critical feedback on code structure and test coverage in an early project evaluation.',
      task: 'Address recurring deficiencies and elevate code craftsmanship to meet team standards.',
      action: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      result: 'Passed subsequent review with zero rework items, adopted automated testing habits, and significantly improved long-term velocity.',
    },
  ],
};

export const NANDINI_GROWTH_REPORT_HI: ICandidateGrowthReport = {
  language: 'hi',
  candidateId: 'cand_1792239718581',
  totalQuestions: 34,
  scoringIntegrity: {
    languagesUsed: ['hi', 'en'],
    simplificationRequestsCount: 8,
    scoreImpactOrPenalty: 0,
    verificationStatus: 'स्कोरिंग सत्यनिष्ठा सत्यापित: भाषा उपयोग और 8 सरलीकरण अनुरोधों से स्कोर पर कोई नकारात्मक प्रभाव नहीं पड़ा',
  },
  personalityProfile: {
    oceanScores: {
      openness: 3.5,
      conscientiousness: 3.8,
      extraversion: 2.3,
      agreeableness: 2.8,
      emotionalStability: 3.5,
    },
    traitExplanations: {
      openness: 'संतुलित जिज्ञासा; सिद्ध प्रक्रियाओं के साथ-साथ रचनात्मक प्रयोगों का विवेकपूर्ण समन्वय।',
      conscientiousness: 'व्यवस्थित, गहन और उच्च प्रतिबद्धता। सूक्ष्म विवरणों और मान्यताओं की सख्त पुष्टि।',
      extraversion: 'विचारशील, आत्मनिरीक्षी; छोटे तकनीकी समूहों और एकाग्र स्वतंत्र कार्य में उत्कृष्टता।',
      agreeableness: 'स्पष्टवादी, निष्पक्ष; सतही सहमति के स्थान पर वस्तुनिष्ठ गुणवत्ता मानकों की रक्षा।',
      emotionalStability: 'दबाव की स्थितियों में संयमित; जोखिमों के प्रति सतर्क और त्वरित सुधारात्मक दृष्टिकोण।',
    },
    uncertaintyNote: 'व्यक्तित्व रूपरेखा परिस्थितिजन्य संदर्भों में दर्ज प्रवृत्तियों को दर्शाती है, कोई स्थायी सीमा नहीं। वातावरण और मनोवैज्ञानिक सुरक्षा के आधार पर इसमें लचीलापन होता है।',
    oceanDetails: [
      {
        trait: 'अनुभव के प्रति खुलापन (Openness)',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'संतुलित जिज्ञासा; स्थापित प्रणालियों के साथ नए प्रयोगों का समन्वय।',
        everydayContext: 'अकादमिक और प्रोजेक्ट निर्णयों में अपरंपरागत समाधानों को आजमाने में सहजता।',
        tradeOffs: 'स्थापित रूटीन में विश्वसनीय, लेकिन अत्यधिक दबाव में सिद्ध कार्यप्रणालियों को प्राथमिकता।',
      },
      {
        trait: 'कर्तव्यनिष्ठा (Conscientiousness)',
        score: 3.8,
        maxScore: 5.0,
        supportedInterpretation: 'व्यवस्थित, गहन और उच्च प्रतिबद्धता। विवरणों पर सूक्ष्म ध्यान।',
        everydayContext: 'संरचित दस्तावेज़ीकरण, कोड-समीक्षा अनुशासन, और समय प्रबंधन।',
        tradeOffs: 'उच्च गुणवत्ता की खोज कभी-कभी समय सीमा कम होने पर पूर्णतावाद (perfectionism) का तनाव ला सकती है।',
      },
      {
        trait: 'बहिर्मुखता (Extraversion)',
        score: 2.3,
        maxScore: 5.0,
        supportedInterpretation: 'विचारशील, आत्मनिरीक्षी; छोटे तकनीकी समूहों और एकाग्र कार्य को प्राथमिकता।',
        everydayContext: 'गहन विश्लेषणात्मक कार्य में उत्कृष्टता; उद्देश्यपूर्ण तकनीकी चर्चा।',
        tradeOffs: 'शांत विश्लेषण में बहुत प्रभावी, परंतु बड़ी बैठकों में सक्रिय उपस्थिति दर्ज कराने के लिए जागरूक प्रयास की आवश्यकता।',
      },
      {
        trait: 'मिलनसारिता (Agreeableness)',
        score: 2.8,
        maxScore: 5.0,
        supportedInterpretation: 'स्पष्टवादी, निष्पक्ष और गुणवत्ता-केंद्रित; रचनात्मक बहस को महत्व।',
        everydayContext: 'कोड समीक्षा और वास्तुशिल्प चर्चाओं में वस्तुनिष्ठ मूल्यांकन।',
        tradeOffs: 'उच्च गुणवत्ता मानकों की रक्षा, लेकिन सीधी बात को कभी-कभी अत्यधिक आलोचनात्मक समझा जा सकता है यदि सहानुभूति का ध्यान न रखा जाए।',
      },
      {
        trait: 'भावनात्मक स्थिरता (Emotional Stability)',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'दबाव में शांत और संयमित; संभावित जोखिमों के प्रति सतर्क।',
        everydayContext: 'आलोचनात्मक फीडबैक को रचनात्मक सुधार में बदलने की तीव्र क्षमता।',
        tradeOffs: 'शुरुआती जोखिमों को तुरंत पहचानती हैं, परंतु लंबे समय तक अनिश्चितता का माहौल आंतरिक थकान ला सकता है।',
      },
    ],
  },
  potentialStrengths: [
    {
      title: 'पद्धतिगत समस्या समाधान और स्वामित्व',
      tendency: 'समस्याओं को जल्दबाजी में दबाने के बजाय उनके मूल कारणों का गहराई से विश्लेषण करने और सहयोगात्मक निदान अपनाने की प्रवृत्ति।',
      supportedStarExample: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      whatAssessmentSuggests: 'मजबूत विश्लेषणात्मक दृढ़ता; केवल सतही समाधान करने के बजाय त्रुटियों के स्रोत का व्यवस्थित रूप से पता लगाना।',
      starEvidenceQuote: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and...',
      whereItMayHelp: 'जटिल सिस्टम आउटेज को सुलझाने, विश्वसनीयता इंजीनियरिंग और सुदृढ़ पाइपलाइनों के निर्माण में।',
    },
    {
      title: 'रचनात्मक असहमति समाधान',
      tendency: 'टकराव के समय व्यक्तिगत प्राथमिकताओं से ऊपर उठकर निष्पक्ष तकनीकी मानदंडों को आधार बनाना।',
      supportedStarExample: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      whatAssessmentSuggests: 'विचारों के टकराव के समय निष्पक्ष मूल्यांकन मानदंडों की खोज, जिससे आपसी मतभेद समाप्त होते हैं।',
      starEvidenceQuote: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different a...',
      whereItMayHelp: 'इंजीनियरिंग और उत्पाद टीमों के बीच प्राथमिकताओं के समन्वय और कोड समीक्षा में।',
    },
    {
      title: 'लचीलापन और फीडबैक की स्वीकार्यता',
      tendency: 'पुरानी कमियों को परिपक्वता से स्वीकार कर तुरंत सुधारात्मक आदतें और स्थायी कार्यप्रणाली विकसित करना।',
      supportedStarExample: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      whatAssessmentSuggests: 'आलोचनात्मक फीडबैक को सीखने के अवसर के रूप में देखना और सक्रिय सुधारात्मक आदतें अपनाना।',
      starEvidenceQuote: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that pu...',
      whereItMayHelp: 'नई तकनीकों को तेजी से सीखने, कोड गुणवत्ता बढ़ाने और दीर्घकालिक करियर प्रगति में।',
    },
  ],
  challenges: [
    {
      title: 'शुरुआती असहमति व्यक्त करने में संभावित संकोच',
      whyItMayOccur: 'तेज गति की समीक्षाओं में सद्भाव बनाए रखने या सत्ता के प्रति सम्मान के कारण असहमति टालना।',
      howItMightAppear: 'डिजाइन बैठकों में चुप रहना और बाद में निजी तौर पर चिंताओं को प्रकट करना।',
      whatToWatchFor: 'महत्वपूर्ण वास्तुकला चर्चाओं में मौन रहना।',
      constructiveAdjustment: 'जोखिम प्रबंधन के रूप में अपनी बात रखें: "लॉन्च की सुरक्षा के लिए, क्या हम अंतिम रूप देने से पहले दो संभावित अपवादों (edge cases) की समीक्षा कर सकते हैं?"',
    },
    {
      title: 'गहन समस्या समाधान के दौरान समय सीमा प्रबंधन',
      whyItMayOccur: 'पूरी तरह समस्या का समाधान खोजने की तीव्र इच्छा के कारण अंतरिम स्टेटस में देरी।',
      howItMightAppear: 'कम संभावना वाले अपवादों पर बहुत अधिक समय लगाना।',
      whatToWatchFor: 'गहरी खोज में उलझ जाने के कारण स्टैंडअप अपडेट समय सीमा से चूकना।',
      constructiveAdjustment: '45 मिनट की सख्त समय-सीमा लागू करें: "गहन जांच को 45 मिनट तक सीमित रखें, फिर आगे बढ़ने से पहले टीम चैनल पर 3-बिंदु प्रगति सारांश साझा करें।"',
    },
  ],
  blindSpotsAndChallenges: [
    {
      title: 'शुरुआती असहमति व्यक्त करने में संभावित संकोच',
      area: 'प्रारंभिक जोखिम संकेत और तकनीकी असहमति',
      evidenceContext: 'डिजाइन समीक्षाओं में जब कोई खामी दिखे, तो टीम की गति में व्यवधान न डालने की स्वाभाविक हिचकिचाहट।',
      constructivePerspective: 'सद्भाव और विशेषज्ञों के प्रति सम्मान के कारण कभी-कभी आवश्यक आपत्तियां देर से सामने आती हैं।',
      whyItMayOccur: 'तेज गति की समीक्षाओं में सद्भाव बनाए रखने या सत्ता के प्रति सम्मान के कारण असहमति टालना।',
      howItMightAppear: 'डिजाइन बैठकों में चुप रहना और बाद में निजी तौर पर चिंताओं को प्रकट करना।',
      whatToWatchFor: 'महत्वपूर्ण वास्तुकला चर्चाओं में मौन रहना।',
      constructiveAdjustment: 'जोखिम प्रबंधन के रूप में अपनी बात रखें: "लॉन्च की सुरक्षा के लिए, क्या हम अंतिम रूप देने से पहले दो संभावित अपवादों (edge cases) की समीक्षा कर सकते हैं?"',
    },
    {
      title: 'गहन समस्या समाधान के दौरान समय सीमा प्रबंधन',
      area: 'गहन जांच बनाम डिलीवरी समय-सीमा',
      evidenceContext: 'अनपेक्षित विसंगतियों को अकेले सुलझाने में अत्यधिक समय देना, बिना अंतरिम प्रगति साझा किए।',
      constructivePerspective: 'उच्च कर्तव्यनिष्ठा पूरी जानकारी के बाद ही अपडेट साझा करने के लिए प्रेरित करती है।',
      whyItMayOccur: 'पूरी तरह समस्या का समाधान खोजने की तीव्र इच्छा के कारण अंतरिम स्टेटस में देरी।',
      howItMightAppear: 'कम संभावना वाले अपवादों पर बहुत अधिक समय लगाना।',
      whatToWatchFor: 'गहरी खोज में उलझ जाने के कारण स्टैंडअप अपडेट समय सीमा से चूकना।',
      constructiveAdjustment: '45 मिनट की सख्त समय-सीमा लागू करें: "गहन जांच को 45 मिनट तक सीमित रखें, फिर आगे बढ़ने से पहले टीम चैनल पर 3-बिंदु प्रगति सारांश साझा करें।"',
    },
  ],
  workPreferences: [
    {
      title: 'अर्ध-संरचित कार्य वातावरण एवं स्वायत्तता',
      hypothesisTitle: 'अर्ध-संरचित कार्य वातावरण एवं स्वायत्तता',
      environmentType: 'स्वायत्त निष्पादन वाली एजाइल टीमें',
      description: 'स्पष्ट दिशा-निर्देशों के साथ तकनीकी निष्पादन में पूर्ण स्वतंत्रता का वातावरण।',
      assessmentFindings: 'नंदिनी ऐसे वातावरण में सर्वश्रेष्ठ प्रदर्शन करती हैं जहाँ समग्र उद्देश्य स्पष्ट हों और तकनीकी समाधान तैयार करने की स्वायत्तता हो।',
      supportingEvidence: 'जब स्प्रिंट की सीमाएं स्पष्ट थीं और काम करने का तरीका स्वतंत्र था, तब अधिकतम उत्पादकता देखी गई।',
      realWorldApplication: 'एजाइल स्प्रिंट पॉड्स, फीचर-स्वामित्व, विकेंद्रीकृत इंजीनियरिंग टीमें।',
      adaptationStrategy: 'शुरुआत में ही स्पष्ट स्वीकृति मानदंड मांगें, फिर नियमित अपडेट साझा करें।',
    },
    {
      title: 'स्पष्ट भूमिकाओं वाली पारदर्शी, सहयोगात्मक टीमें',
      hypothesisTitle: 'स्पष्ट भूमिकाओं वाली पारदर्शी, सहयोगात्मक टीमें',
      environmentType: 'उच्च विश्वास वाली बहु-विषयक टीमें',
      description: 'स्पष्ट सीमाओं और खुले संचार चैनलों वाला कार्यस्थल जहाँ श्रेय और जवाबदेही साझा की जाती है।',
      assessmentFindings: 'ऐसे कार्यस्थलों में सबसे सहज जहाँ ज्ञान स्वतंत्र रूप से साझा किया जाता है और जवाबदेही पारदर्शी होती है।',
      supportingEvidence: 'उद्देश्यपूर्ण मानदंड स्थापित कर और कार्यों को स्पष्ट रूप से बांटकर साथियों के मतभेदों को सुलझाया।',
      realWorldApplication: 'क्रॉस-फंक्शनल प्रोडक्ट स्क्वॉड जहाँ प्रत्येक की विशिष्ट जिम्मेदारी तय हो।',
      adaptationStrategy: 'दस्तावेजीकृत RACI चार्ट और स्पष्ट कोड-समीक्षा दिशानिर्देश बनाए रखें।',
    },
  ],
  personalDevelopmentPlan: [
    {
      priorityTitle: 'संरचित तकनीकी असहमति का अभ्यास',
      timeframe: 'अगले 14 दिन',
      timeline: 'अगले 14 दिन',
      whyItMatters: 'शुरुआती स्तर पर तकनीकी खामियां पकड़ने से दर्जनों घंटे बचते हैं और तकनीकी नेतृत्व स्थापित होता है।',
      practicalAction: 'अगली 2 समीक्षा बैठकों में जोखिम-प्रभाव-शमन प्रारूप का उपयोग करके कम से कम एक रचनात्मक प्रश्न अवश्य पूछें।',
      suggestedHabit: 'डिजाइन समीक्षा के पहले 15 मिनट में ही अपनी बात रखें।',
      progressIndicator: 'स्प्रिंट समीक्षा में 2 प्रलेखित तकनीकी प्रश्न दर्ज किए गए।',
      measureOfProgress: 'टीम समीक्षा में 2 तकनीकी प्रश्न दर्ज।',
      reflectionPrompt: 'क्या इस जोखिम को उठाने से प्रोजेक्ट योजना में सुधार हुआ या संभावित बाधा टली?',
    },
    {
      priorityTitle: 'समयबद्ध अन्वेषण सीमाएं लागू करना',
      timeframe: 'अगले 30 दिन',
      timeline: 'अगले 30 दिन',
      whyItMatters: 'गहन खोज को समय सीमा के भीतर रखने से प्रोजेक्ट की गति अप्रभावित रहती है।',
      practicalAction: 'किसी अज्ञात बग की जांच करते समय 45 मिनट का टाइमर लगाएं। समय समाप्त होने पर टीम को 3-बिंदु अपडेट दें।',
      suggestedHabit: 'गहन खोज में जाने से पहले टीम को त्वरित चेकपॉइंट भेजें।',
      progressIndicator: 'अगले 4 सप्ताहों में 45 मिनट के टाइमबॉक्सिंग का 100% पालन।',
      measureOfProgress: 'प्रत्येक जटिल बग में 45 मिनट के नियम का पालन।',
      reflectionPrompt: 'क्या समय-सीमा तय करने से मुझे समय सीमा से समझौता किए बिना नवाचार करने में मदद मिली?',
    },
    {
      priorityTitle: 'मापने योग्य परिणाम परिमाणीकरण में सुधार',
      timeframe: 'अगले 30 दिन',
      timeline: 'अगले 30 दिन',
      whyItMatters: 'मापने योग्य उपलब्धियों से व्यक्तिगत प्रभाव स्पष्ट होता है और नेतृत्व स्तर पर पहचान मिलती है।',
      practicalAction: 'मासिक आत्म-मूल्यांकन में सभी उपलब्धियों को ठोस आंकड़ों (उदा. विलंबता में % कमी, बचाए गए घंटे) के साथ प्रस्तुत करें।',
      suggestedHabit: 'मापने योग्य उपलब्धियों को ट्रैक करने के लिए साप्ताहिक सूची बनाएं।',
      progressIndicator: 'पूरे किए गए सभी कार्यों में मापने योग्य परिणाम शामिल हैं।',
      measureOfProgress: 'प्रत्येक पूर्ण टिकट में ठोस आंकड़े संलग्न।',
      reflectionPrompt: 'क्या मेरा परिणाम विवरण मेरे व्यक्तिगत योगदान के मूल्य को स्पष्ट रूप से प्रदर्शित करता है?',
    },
  ],
  preservedStarEvidence: [
    {
      competency: 'समस्या समाधान और स्वामित्व',
      originalLanguage: 'English (en)',
      situation: 'सख्त समय-सीमा के तहत एआई एकीकरण के दौरान प्रॉम्प्ट सटीकता में विफलता देखी गई।',
      task: 'विफलता का मूल कारण खोजना और रिलीज में देरी किए बिना सटीकता बहाल करना।',
      action: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      result: 'अपेक्षित सटीकता हासिल की, रिलीज में देरी रोकी, और टीम के लिए प्रॉम्प्ट परीक्षण चेकलिस्ट तैयार की।',
    },
    {
      competency: 'टीमवर्क और असहमति समाधान',
      originalLanguage: 'English (en)',
      situation: 'नए मॉड्यूल के तकनीकी दृष्टिकोण पर टीम के सदस्यों के बीच मतभेद था।',
      task: 'बिना किसी व्यक्तिगत तनाव के आगे का रास्ता तय करने के लिए दोनों पक्षों में सहमति बनाना।',
      action: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      result: 'एक ही सत्र में सहमति बनी, समय से पहले काम पूरा हुआ और टीम में सकारात्मक माहौल बना रहा।',
    },
    {
      competency: 'अनुकूलनशीलता और निरंतर सीखना',
      originalLanguage: 'English (en)',
      situation: 'न्यूनतम दस्तावेज़ीकरण वाले नए एआई ढांचे पर 48 घंटे में काम करने का दायित्व सौंपा गया।',
      task: 'ढांचे के आवश्यक तत्वों को समझकर 48 घंटे में कार्यशील प्रोटोटाइप प्रस्तुत करना।',
      action: 'Broke down framework into core primitives, built incremental proof-of-concepts, and verified outputs against known test cases.',
      result: 'समय पर प्रोटोटाइप पूरा किया और पूरी इंजीनियरिंग टीम के लिए 2-पेज की क्विक-स्टार्ट गाइड लिखी।',
    },
    {
      competency: 'झटके और फीडबैक की स्वीकार्यता',
      originalLanguage: 'English (en)',
      situation: 'शुरुआती प्रोजेक्ट मूल्यांकन में कोड संरचना और परीक्षण कवरेज पर गंभीर आलोचनात्मक फीडबैक मिला।',
      task: 'कमियों को दूर करना और टीम के मानकों के अनुरूप कोड की गुणवत्ता को ऊपर उठाना।',
      action: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      result: 'शून्य त्रुटियों के साथ अगली समीक्षा पास की, स्वचालित परीक्षण आदतें अपनाईं और दीर्घकालिक गति में उल्लेखनीय सुधार किया।',
    },
  ],
};

export const NANDINI_GROWTH_REPORT_KN: ICandidateGrowthReport = {
  language: 'kn',
  candidateId: 'cand_1792239718581',
  totalQuestions: 34,
  scoringIntegrity: {
    languagesUsed: ['kn', 'en'],
    simplificationRequestsCount: 8,
    scoreImpactOrPenalty: 0,
    verificationStatus: 'ಸ್ಕೋರಿಂಗ್ ಸಮಗ್ರತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ಭಾಷಾ ಬಳಕೆ ಮತ್ತು 8 ಸರಳೀಕರಣ ವಿನಂತಿಗಳಿಂದ ಯಾವುದೇ ಅಂಕ ಕಡಿತವಾಗಿಲ್ಲ',
  },
  personalityProfile: {
    oceanScores: {
      openness: 3.5,
      conscientiousness: 3.8,
      extraversion: 2.3,
      agreeableness: 2.8,
      emotionalStability: 3.5,
    },
    traitExplanations: {
      openness: 'ಸಮತೋಲಿತ ಕುತೂಹಲ; ಸಾಬೀತಾದ ವಿಧಾನಗಳೊಂದಿಗೆ ಹೊಸ ಆವಿಷ್ಕಾರಗಳ ವಿವೇಚನಾಶೀಲ ಹೊಂದಾಣಿಕೆ.',
      conscientiousness: 'ವ್ಯವಸ್ಥಿತ, ಆಳವಾದ ಮತ್ತು ಬದ್ಧತೆಯ ಕಾರ್ಯವಿಧಾನ. ವಿವರಗಳ ನಿಖರತೆ ಮತ್ತು ಶಿಸ್ತುಬದ್ಧ ಪರಿಶೀಲನೆ.',
      extraversion: 'ಚಿಂತನಶೀಲ, ಆಂತರಿಕ ಗಮನ; ಸಣ್ಣ ತಾಂತ್ರಿಕ ತಂಡಗಳು ಮತ್ತು ಏಕಾಗ್ರ ಸ್ವತಂತ್ರ ಕೆಲಸದಲ್ಲಿ ಪ್ರಾಬಲ್ಯ.',
      agreeableness: 'ನೇರವಾದ, ನ್ಯಾಯಯುತ; ಕೇವಲ ಒಪ್ಪಿಗೆಗಿಂತ ತಾಂತ್ರಿಕ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳ ರಕ್ಷಣೆಗೆ ಪ್ರಾಮುಖ್ಯತೆ.',
      emotionalStability: 'ಒತ್ತಡದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಶಾಂತತೆ ಮತ್ತು ಸಮಚಿತ್ತತೆ; ಅಪಾಯಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಮತ್ತು ತ್ವರಿತ ಚೇತರಿಕೆ.',
    },
    uncertaintyNote: 'ಈ ವ್ಯಕ್ತಿತ್ವ ಪ್ರೊಫೈಲ್ ಸನ್ನಿವೇಶಾತ್ಮಕ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಆಧರಿಸಿದೆ, ಇದು ಶಾಶ್ವತ ನಿರ್ಬಂಧವಲ್ಲ. ಕೆಲಸದ ವಾತಾವರಣ ಮತ್ತು ಮಾನಸಿಕ ಸುರಕ್ಷತೆಗೆ ಅನುಗುಣವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.',
    oceanDetails: [
      {
        trait: 'ಅನುಭವಕ್ಕೆ ಮುಕ್ತತೆ (Openness)',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'ಸಮತೋಲಿತ ಕುತೂಹಲ; ಸಾಬೀತಾದ ವಿಧಾನಗಳೊಂದಿಗೆ ಪ್ರಾಯೋಗಿಕ ವಿಧಾನಗಳ ಹೊಂದಾಣಿಕೆ.',
        everydayContext: 'ಯೋಜನಾ ನಿರ್ಧಾರಗಳಲ್ಲಿ ಅಸಾಂಪ್ರದಾಯಿಕ ಪರಿಹಾರಗಳನ್ನು ಪ್ರಯತ್ನಿಸುವಲ್ಲಿ ಆಸಕ್ತಿ.',
        tradeOffs: 'ನಿಯಮಿತ ಕೆಲಸಗಳಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ, ಆದರೆ ತೀವ್ರ ಒತ್ತಡದಲ್ಲಿ ಪರಿಚಿತ ಚೌಕಟ್ಟುಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಬಹುದು.',
      },
      {
        trait: 'ಕರ್ತವ್ಯನಿಷ್ಠೆ (Conscientiousness)',
        score: 3.8,
        maxScore: 5.0,
        supportedInterpretation: 'ವ್ಯವಸ್ಥಿತ, ಸಂಪೂರ್ಣ ಮತ್ತು ಬದ್ಧತೆಯ ಕಾರ್ಯವಿಧಾನ. ವಿವರಗಳಿಗೆ ಸೂಕ್ಷ್ಮ ಗಮನ.',
        everydayContext: 'ರಚನಾತ್ಮಕ ದಾಖಲಾತಿ, ಕೋಡ್-ಪರಿಶೀಲನಾ ಶಿಸ್ತು ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆ.',
        tradeOffs: 'ಉನ್ನತ ಗುಣಮಟ್ಟದ ಅನ್ವೇಷಣೆಯು ಕೆಲವೊಮ್ಮೆ ಗಡುವಿನ ಸಂದರ್ಭದಲ್ಲಿ ಪರಿಪೂರ್ಣತಾವಾದದ (perfectionism) ಒತ್ತಡ ಉಂಟುಮಾಡಬಹುದು.',
      },
      {
        trait: 'ಬಹಿರ್ಮುಖತೆ (Extraversion)',
        score: 2.3,
        maxScore: 5.0,
        supportedInterpretation: 'ಚಿಂತನಶೀಲ, ಆಂತರಿಕ ಗಮನ; ಸಣ್ಣ ತಾಂತ್ರಿಕ ತಂಡಗಳು ಮತ್ತು ಆಳವಾದ ಸ್ವತಂತ್ರ ಕೆಲಸ.',
        everydayContext: 'ಆಳವಾದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕಾರ್ಯಗಳಲ್ಲಿ ಮುಂಚೂಣಿ; ಉದ್ದೇಶಪೂರ್ವಕ ತಾಂತ್ರಿಕ ಸಂವಹನ.',
        tradeOffs: 'ಶಾಂತ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ಅತ್ಯುತ್ತಮ, ಆದರೆ ದೊಡ್ಡ ಸಭೆಗಳಲ್ಲಿ ಸಕ್ರಿಯ ಉಪಸ್ಥಿತಿಯನ್ನು ಪ್ರದರ್ಶಿಸಲು ಜಾಗರೂಕ ಪ್ರಯತ್ನ ಅಗತ್ಯ.',
      },
      {
        trait: 'ಸೌಹಾರ್ದತೆ (Agreeableness)',
        score: 2.8,
        maxScore: 5.0,
        supportedInterpretation: 'ನೇರವಾದ, ನ್ಯಾಯಯುತ ಮತ್ತು ಗುಣಮಟ್ಟ-ಕೇಂದ್ರಿತ; ರಚನಾತ್ಮಕ ಚರ್ಚೆಗಳಿಗೆ ಗೌರವ.',
        everydayContext: 'ಕೋಡ್ ವಿಮರ್ಶೆ ಮತ್ತು ವಿನ್ಯಾಸ ಚರ್ಚೆಗಳಲ್ಲಿ ವಸ್ತುನಿಷ್ಠ ಮೌಲ್ಯಮಾಪನ.',
        tradeOffs: 'ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳ ರಕ್ಷಣೆ, ಆದರೆ ನೇರ ನಡವಳಿಕೆಯನ್ನು ಕೆಲವೊಮ್ಮೆ ವಿಮರ್ಶಾತ್ಮಕವೆಂದು ತಪ್ಪಾಗಿ ಭಾವಿಸಬಹುದು.',
      },
      {
        trait: 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ (Emotional Stability)',
        score: 3.5,
        maxScore: 5.0,
        supportedInterpretation: 'ಒತ್ತಡದಲ್ಲಿ ಶಾಂತತೆ ಮತ್ತು ಸ್ಥಿರತೆ; ಸಂಭಾವ್ಯ ಅಪಾಯಗಳ ಬಗ್ಗೆ ಜಾಗರೂಕತೆ.',
        everydayContext: 'ವಿಮರ್ಶಾತ್ಮಕ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ರಚನಾತ್ಮಕ ಸುಧಾರಣೆಯಾಗಿ ಪರಿವರ್ತಿಸುವ ತ್ವರಿತ ಸಾಮರ್ಥ್ಯ.',
        tradeOffs: 'ಅಪಾಯಗಳನ್ನು ಮೊದಲೇ ಗುರುತಿಸುತ್ತಾರೆ, ಆದರೆ ದೀರ್ಘಕಾಲದ ಅನಿಶ್ಚಿತತೆಯು ಆಂತರಿಕ ಆಯಾಸಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.',
      },
    ],
  },
  potentialStrengths: [
    {
      title: 'ವ್ಯವಸ್ಥಿತ ಸಮಸ್ಯೆ ಪರಿಹಾರ ಮತ್ತು ಮಾಲೀಕತ್ವ',
      tendency: 'ಸಮಸ್ಯೆಗಳನ್ನು ಮೇಲ್ನೋಟಕ್ಕೆ ಮುಚ್ಚಿಹಾಕುವ ಬದಲು ಮೂಲ ಕಾರಣಗಳನ್ನು ಆಳವಾಗಿ ವಿಶ್ಲೇಷಿಸಿ ಸಹಯೋಗದೊಂದಿಗೆ ಪರಿಹರಿಸುವ ಪ್ರವೃತ್ತಿ.',
      supportedStarExample: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      whatAssessmentSuggests: 'ಬಲವಾದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಪರಿಶ್ರಮ; ಕೇವಲ ತಾತ್ಕಾಲಿಕ ಪ್ಯಾಚ್ ಮಾಡುವ ಬದಲು ದೋಷಗಳನ್ನು ವ್ಯವಸ್ಥಿತವಾಗಿ ಪತ್ತೆಹಚ್ಚುವುದು.',
      starEvidenceQuote: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and...',
      whereItMayHelp: 'ಕ್ಲಿಷ್ಟಕರ ಸಿಸ್ಟಮ್ ದೋಷಗಳನ್ನು ನಿವಾರಿಸಲು ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಕಾರ್ಯವಿಧಾನಗಳನ್ನು ನಿರ್ಮಿಸಲು.',
    },
    {
      title: 'ರಚನಾತ್ಮಕ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಪರಿಹಾರ',
      tendency: 'ಸಂಘರ್ಷದ ಸಮಯದಲ್ಲಿ ವೈಯಕ್ತಿಕ ಆದ್ಯತೆಗಳಿಗಿಂತ ವಸ್ತುನಿಷ್ಠ ತಾಂತ್ರಿಕ ಮಾನದಂಡಗಳಿಗೆ ಒತ್ತು ನೀಡುವುದು.',
      supportedStarExample: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      whatAssessmentSuggests: 'ಭಿನ್ನಾಭಿಪ್ರಾಯದ ಸಂದರ್ಭದಲ್ಲಿ ನಿಷ್ಪಕ್ಷಪಾತ ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳನ್ನು ಕಂಡುಹಿಡಿಯುವುದು.',
      starEvidenceQuote: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different a...',
      whereItMayHelp: 'ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಉತ್ಪನ್ನ ತಂಡಗಳ ನಡುವಿನ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಕೋಡ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ.',
    },
    {
      title: 'ಹಿನ್ನಡೆಗಳಿಂದ ಚೇತರಿಕೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನದ ಸ್ವೀಕಾರ',
      tendency: 'ಹಿಂದಿನ ತಪ್ಪುಗಳನ್ನು ಪ್ರಬುದ್ಧತೆಯಿಂದ ಒಪ್ಪಿಕೊಂಡು ತಕ್ಷಣವೇ ಸುಧಾರಣಾ ಕ್ರಮಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವುದು.',
      supportedStarExample: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      whatAssessmentSuggests: 'ವಿಮರ್ಶೆಯನ್ನು ಕಲಿಕೆಯ ಅವಕಾಶವೆಂದು ಪರಿಗಣಿಸಿ ಸಕ್ರಿಯ ಸುಧಾರಣಾ ಅಭ್ಯಾಸಗಳನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳುವುದು.',
      starEvidenceQuote: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that pu...',
      whereItMayHelp: 'ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಕಲಿಯಲು ಮತ್ತು ದೀರ್ಘಕಾಲೀನ ವೃತ್ತಿ ಬೆಳವಣಿಗೆಗೆ.',
    },
  ],
  challenges: [
    {
      title: 'ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ವ್ಯಕ್ತಪಡಿಸಲು ಹಿಂಜರಿಕೆ',
      whyItMayOccur: 'ವೇಗದ ವಿಮರ್ಶೆಗಳಲ್ಲಿ ಸಾಮರಸ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಭಿನ್ನಾಭಿಪ್ರಾಯವನ್ನು ಮುಂದೂಡುವುದು.',
      howItMightAppear: 'ವಿನ್ಯಾಸ ಸಭೆಗಳಲ್ಲಿ ಮೌನವಾಗಿರುವುದು ಮತ್ತು ನಂತರ ಖಾಸಗಿಯಾಗಿ ಕಳವಳಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು.',
      whatToWatchFor: 'ಪ್ರಮುಖ ವಾಸ್ತುಶಿಲ್ಪ ಸಭೆಗಳಲ್ಲಿ ಮೌನವಾಗಿರುವುದು.',
      constructiveAdjustment: '"ನಮ್ಮ ಬಿಡುಗಡೆ ಮೈಲಿಗಲ್ಲನ್ನು ರಕ್ಷಿಸಲು, ಅಂತಿಮಗೊಳಿಸುವ ಮೊದಲು ನಾವು ಎರಡು ಸಂಭಾವ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದೇ?" ಎಂದು ಅಪಾಯ ನಿರ್ವಹಣೆಯ ರೂಪದಲ್ಲಿ ಪ್ರಸ್ತಾಪಿಸಿ.',
    },
    {
      title: 'ಆಳವಾದ ಸಂಶೋಧನೆಯ ಸಂದರ್ಭದಲ್ಲಿ ಸಮಯದ ಮಿತಿಯನ್ನು ನಿರ್ವಹಿಸುವುದು',
      whyItMayOccur: 'ದೋಷವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಪರಿಹರಿಸುವ ತೀವ್ರ ಬಯಕೆಯು ಮಧ್ಯಂತರ ಸ್ಥಿತಿಗತಿ ಹಂಚಿಕೆಯಲ್ಲಿ ವಿಳಂಬ ಉಂಟುಮಾಡುತ್ತದೆ.',
      howItMightAppear: 'ಕಡಿಮೆ ಸಂಭವನೀಯತೆಯ ಅಂಚಿನ ಸಮಸ್ಯೆಗಳಿಗೆ ಅತಿಯಾದ ಸಮಯ ನೀಡುವುದು.',
      whatToWatchFor: 'ಆಳವಾದ ಸಂಶೋಧನೆಯಲ್ಲಿ ಮುಳುಗಿ ದೈನಂದಿನ ಸ್ಟ್ಯಾಂಡ್‌ಅಪ್ ಗಡುವುಗಳನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳುವುದು.',
      constructiveAdjustment: '"ತನಿಖೆಯನ್ನು 45 ನಿಮಿಷಗಳಿಗೆ ಸೀಮಿತಗೊಳಿಸಿ, ನಂತರ ಮುಂದುವರಿಯುವ ಮೊದಲು ತಂಡದ ಚಾನಲ್‌ನಲ್ಲಿ 3 ಪ್ರಮುಖ ಅಂಶಗಳ ಸಾರಾಂಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."',
    },
  ],
  blindSpotsAndChallenges: [
    {
      title: 'ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ವ್ಯಕ್ತಪಡಿಸಲು ಹಿಂಜರಿಕೆ',
      area: 'ಆರಂಭಿಕ ಅಪಾಯದ ಸೂಚನೆ ಮತ್ತು ತಾಂತ್ರಿಕ ಭಿನ್ನಾಭಿಪ್ರಾಯ',
      evidenceContext: 'ವಿನ್ಯಾಸ ವಿಮರ್ಶೆಗಳಲ್ಲಿ ದೋಷಗಳು ಕಂಡಾಗ ತಂಡದ ಚಾಲನೆಯನ್ನು ಅಡ್ಡಿಪಡಿಸಬಾರದೆಂಬ ಸಹಜ ಹಿಂಜರಿಕೆ.',
      constructivePerspective: 'ಸೌಹಾರ್ದತೆ ಮತ್ತು ಹಿರಿಯರ ಮೇಲಿನ ಗೌರವದಿಂದಾಗಿ ಕೆಲವೊಮ್ಮೆ ಅಗತ್ಯವಾದ ಪ್ರಶ್ನೆಗಳು ತಡವಾಗಿ ವ್ಯಕ್ತವಾಗುತ್ತವೆ.',
      whyItMayOccur: 'ವೇಗದ ವಿಮರ್ಶೆಗಳಲ್ಲಿ ಸಾಮರಸ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಭಿನ್ನಾಭಿಪ್ರಾಯವನ್ನು ಮುಂದೂಡುವುದು.',
      howItMightAppear: 'ವಿನ್ಯಾಸ ಸಭೆಗಳಲ್ಲಿ ಮೌನವಾಗಿರುವುದು ಮತ್ತು ನಂತರ ಖಾಸಗಿಯಾಗಿ ಕಳವಳಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು.',
      whatToWatchFor: 'ಪ್ರಮುಖ ವಾಸ್ತುಶಿಲ್ಪ ಸಭೆಗಳಲ್ಲಿ ಮೌನವಾಗಿರುವುದು.',
      constructiveAdjustment: '"ನಮ್ಮ ಬಿಡುಗಡೆ ಮೈಲಿಗಲ್ಲನ್ನು ರಕ್ಷಿಸಲು, ಅಂತಿಮಗೊಳಿಸುವ ಮೊದಲು ನಾವು ಎರಡು ಸಂಭಾವ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದೇ?" ಎಂದು ಅಪಾಯ ನಿರ್ವಹಣೆಯ ರೂಪದಲ್ಲಿ ಪ್ರಸ್ತಾಪಿಸಿ.',
    },
    {
      title: 'ಆಳವಾದ ಸಂಶೋಧನೆಯ ಸಂದರ್ಭದಲ್ಲಿ ಸಮಯದ ಮಿತಿಯನ್ನು ನಿರ್ವಹಿಸುವುದು',
      area: 'ಆಳವಾದ ತನಿಖೆ ಮತ್ತು ವಿತರಣೆಯ ಸಮಯದ ಸಮತೋಲನ',
      evidenceContext: 'ಸಂಕೀರ್ಣ ದೋಷಗಳನ್ನು ಒಂಟಿಯಾಗಿ ಪರಿಹರಿಸಲು ಅತಿಯಾದ ಸಮಯ ನೀಡುವುದು ಮತ್ತು ಮಧ್ಯಂತರ ಅಪ್‌ಡೇಟ್ ನೀಡದಿರುವುದು.',
      constructivePerspective: 'ಉನ್ನತ ಕರ್ತವ್ಯನಿಷ್ಠೆಯು ಸಂಪೂರ್ಣ ಪರಿಹಾರ ಸಿಗುವವರೆಗೂ ಕಾಯಲು ಪ್ರೇರೇಪಿಸುತ್ತದೆ.',
      whyItMayOccur: 'ದೋಷವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಪರಿಹರಿಸುವ ತೀವ್ರ ಬಯಕೆಯು ಮಧ್ಯಂತರ ಸ್ಥಿತಿಗತಿ ಹಂಚಿಕೆಯಲ್ಲಿ ವಿಳಂಬ ಉಂಟುಮಾಡುತ್ತದೆ.',
      howItMightAppear: 'ಕಡಿಮೆ ಸಂಭವನೀಯತೆಯ ಅಂಚಿನ ಸಮಸ್ಯೆಗಳಿಗೆ ಅತಿಯಾದ ಸಮಯ ನೀಡುವುದು.',
      whatToWatchFor: 'ಆಳವಾದ ಸಂಶೋಧನೆಯಲ್ಲಿ ಮುಳುಗಿ ದೈನಂದಿನ ಸ್ಟ್ಯಾಂಡ್‌ಅಪ್ ಗಡುವುಗಳನ್ನು ತಪ್ಪಿಸಿಕೊಳ್ಳುವುದು.',
      constructiveAdjustment: '"ತನಿಖೆಯನ್ನು 45 ನಿಮಿಷಗಳಿಗೆ ಸೀಮಿತಗೊಳಿಸಿ, ನಂತರ ಮುಂದುವರಿಯುವ ಮೊದಲು ತಂಡದ ಚಾನಲ್‌ನಲ್ಲಿ 3 ಪ್ರಮುಖ ಅಂಶಗಳ ಸಾರಾಂಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ."',
    },
  ],
  workPreferences: [
    {
      title: 'ಸ್ವಾಯತ್ತತೆಯೊಂದಿಗೆ ಅರೆ-ರಚನಾತ್ಮಕ ಕಾರ್ಯ ಪರಿಸರ',
      hypothesisTitle: 'ಸ್ವಾಯತ್ತತೆಯೊಂದಿಗೆ ಅರೆ-ರಚನಾತ್ಮಕ ಕಾರ್ಯ ಪರಿಸರ',
      environmentType: 'ಸ್ವಾಯತ್ತ ನಿರ್ವಹಣೆಯ ಎಜೈಲ್ ತಂಡಗಳು',
      description: 'ಸ್ಪಷ್ಟ ಮಾರ್ಗಸೂಚಿಗಳೊಂದಿಗೆ ತಾಂತ್ರಿಕ ಪರಿಹಾರಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ಪೂರ್ಣ ಸ್ವಾತಂತ್ರ್ಯವಿರುವ ವಾತಾವರಣ.',
      assessmentFindings: 'ಉದ್ದೇಶಗಳು ಸ್ಪಷ್ಟವಾಗಿದ್ದು, ತಾಂತ್ರಿಕ ಅನುಷ್ಠಾನಕ್ಕೆ ಸ್ವಾತಂತ್ರ್ಯವಿರುವ ಪರಿಸರದಲ್ಲಿ ನಂದಿನಿ ಅತ್ಯುತ್ತಮವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಾರೆ.',
      supportingEvidence: 'ಸ್ಪ್ರಿಂಟ್ ನಿಯಮಗಳು ಸ್ಪಷ್ಟವಾಗಿದ್ದಾಗ ಗರಿಷ್ಠ ಕಾರ್ಯಕ್ಷಮತೆ ಕಂಡುಬಂದಿದೆ.',
      realWorldApplication: 'ಎಜೈಲ್ ಸ್ಪ್ರಿಂಟ್ ಪಾಡ್‌ಗಳು, ವೈಶಿಷ್ಟ್ಯ-ಮಾಲೀಕತ್ವ, ವಿಕೇಂದ್ರೀಕೃತ ಇಂಜಿನಿಯರಿಂಗ್ ತಂಡಗಳು.',
      adaptationStrategy: 'ಆರಂಭದಲ್ಲೇ ಸ್ಪಷ್ಟ ಅಗತ್ಯತೆಗಳನ್ನು ಕೇಳಿ, ನಂತರ ನಿಯಮಿತವಾಗಿ ಪ್ರಗತಿ ಹಂಚಿಕೊಳ್ಳಿ.',
    },
    {
      title: 'ಸ್ಪಷ್ಟ ವೈಯಕ್ತಿಕ ಪಾತ್ರಗಳನ್ನು ಹೊಂದಿರುವ ಪಾರದರ್ಶಕ ಸಹಯೋಗ ತಂಡಗಳು',
      hypothesisTitle: 'ಸ್ಪಷ್ಟ ವೈಯಕ್ತಿಕ ಪಾತ್ರಗಳನ್ನು ಹೊಂದಿರುವ ಪಾರದರ್ಶಕ ಸಹಯೋಗ ತಂಡಗಳು',
      environmentType: 'ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಬಹು-ವಿಷಯ ತಂಡಗಳು',
      description: 'ಸ್ಪಷ್ಟ ಗಡಿಗಳು ಮತ್ತು ಮುಕ್ತ ಸಂವಹನ ಮಾರ್ಗಗಳಿರುವ ಕೆಲಸದ ಸ್ಥಳ.',
      assessmentFindings: 'ಜ್ಞಾನವನ್ನು ಮುಕ್ತವಾಗಿ ಹಂಚಿಕೊಳ್ಳುವ ಮತ್ತು ಜವಾಬ್ದಾರಿಗಳು ಪಾರದರ್ಶಕವಾಗಿರುವ ಪರಿಸರದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ.',
      supportingEvidence: 'ವಸ್ತುನಿಷ್ಠ ಮಾನದಂಡಗಳನ್ನು ಸ್ಥಾಪಿಸಿ ಮತ್ತು ಕಾರ್ಯಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿಭಜಿಸಿ ತಂಡದ ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳನ್ನು ಪರಿಹರಿಸಿದರು.',
      realWorldApplication: 'ನಿರ್ದಿಷ್ಟ ಡೊಮೇನ್ ಮಾಲೀಕತ್ವ ಹೊಂದಿರುವ ಕ್ರಾಸ್-ಫಂಕ್ಷನಲ್ ಉತ್ಪನ್ನ ತಂಡಗಳು.',
      adaptationStrategy: 'ದಾಖಲಿತ RACI ಚಾರ್ಟ್‌ಗಳು ಮತ್ತು ಸ್ಪಷ್ಟ ಕೋಡ್-ಪರಿಶೀಲನಾ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
    },
  ],
  personalDevelopmentPlan: [
    {
      priorityTitle: 'ರಚನಾತ್ಮಕ ತಾಂತ್ರಿಕ ಭಿನ್ನಾಭಿಪ್ರಾಯದ ಅಭ್ಯಾಸ',
      timeframe: 'ಮುಂದಿನ 14 ದಿನಗಳು',
      timeline: 'ಮುಂದಿನ 14 ದಿನಗಳು',
      whyItMatters: 'ಆರಂಭಿಕ ಹಂತದಲ್ಲೇ ತಾಂತ್ರಿಕ ದೋಷಗಳನ್ನು ಪತ್ತೆಹಚ್ಚುವುದು ಸಮಯವನ್ನು ಉಳಿಸುತ್ತದೆ ಮತ್ತು ತಾಂತ್ರಿಕ ನಾಯಕತ್ವವನ್ನು ಸ್ಥಾಪಿಸುತ್ತದೆ.',
      practicalAction: 'ಮುಂದಿನ 2 ವಿಮರ್ಶಾ ಸಭೆಗಳಲ್ಲಿ ಅಪಾಯ-ಪರಿಣಾಮ-ಪರಿಹಾರ ಮಾದರಿಯನ್ನು ಬಳಸಿ ಕನಿಷ್ಠ ಒಂದು ರಚನಾತ್ಮಕ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.',
      suggestedHabit: 'ವಿನ್ಯಾಸ ವಿಮರ್ಶೆಯ ಮೊದಲ 15 ನಿಮಿಷಗಳಲ್ಲೇ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
      progressIndicator: 'ಸ್ಪ್ರಿಂಟ್ ವಿಮರ್ಶೆಯಲ್ಲಿ 2 ದಾಖಲಿತ ತಾಂತ್ರಿಕ ಪ್ರಶ್ನೆಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.',
      measureOfProgress: 'ತಂಡದ ಸಭೆಗಳಲ್ಲಿ 2 ತಾಂತ್ರಿಕ ಪ್ರಶ್ನೆಗಳ ದಾಖಲೆ.',
      reflectionPrompt: 'ಈ ಅಪಾಯವನ್ನು ಪ್ರಸ್ತಾಪಿಸುವುದು ಯೋಜನೆಯನ್ನು ಸುಧಾರಿಸಿತೇ ಅಥವಾ ಸಂಭಾವ್ಯ ಅಡಚಣೆಯನ್ನು ತಡೆಯಿತೇ?',
    },
    {
      priorityTitle: 'ಸಮಯಬದ್ಧ ಪರಿಶೋಧನಾ ಮಿತಿಗಳ ಅನ್ವಯ',
      timeframe: 'ಮುಂದಿನ 30 ದಿನಗಳು',
      timeline: 'ಮುಂದಿನ 30 ದಿನಗಳು',
      whyItMatters: 'ಆಳವಾದ ತನಿಖೆಯನ್ನು ಸಮಯದ ಮಿತಿಯಲ್ಲಿಡುವುದು ಒಟ್ಟಾರೆ ಯೋಜನೆಯ ವೇಗವನ್ನು ಕಾಪಾಡುತ್ತದೆ.',
      practicalAction: 'ಯಾವುದೇ ಹೊಸ ದೋಷವನ್ನು ಪರಿಶೀಲಿಸುವಾಗ 45 ನಿಮಿಷಗಳ ಟೈಮರ್ ಹೊಂದಿಸಿ. ಸಮಯ ಮೀರಿದಾಗ ತಂಡಕ್ಕೆ 3 ಅಂಶಗಳ ಅಪ್‌ಡೇಟ್ ನೀಡಿ.',
      suggestedHabit: 'ಆಳವಾದ ತನಿಖೆಗೆ ಇಳಿಯುವ ಮೊದಲು ತಂಡಕ್ಕೆ ತ್ವರಿತ ಅಪ್‌ಡೇಟ್ ಕಳುಹಿಸಿ.',
      progressIndicator: 'ಮುಂದಿನ 4 ವಾರಗಳಲ್ಲಿ 45 ನಿಮಿಷಗಳ ಸಮಯ ಮಿತಿಯ 100% ಪಾಲನೆ.',
      measureOfProgress: 'ಪ್ರತಿ ಸಂಕೀರ್ಣ ದೋಷದಲ್ಲೂ 45 ನಿಮಿಷಗಳ ನಿಯಮದ ಪಾಲನೆ.',
      reflectionPrompt: 'ಸಮಯ ಮಿತಿ ನಿಗದಿಪಡಿಸುವುದು ಗಡುವನ್ನು ಉಲ್ಲಂಘಿಸದೆ ಹೊಸ ವಿಧಾನಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಿತೇ?',
    },
    {
      priorityTitle: 'ಪರಿಮಾಣಾತ್ಮಕ ಫಲಿತಾಂಶಗಳ ಅಳತೆ ಸುಧಾರಣೆ',
      timeframe: 'ಮುಂದಿನ 30 ದಿನಗಳು',
      timeline: 'ಮುಂದಿನ 30 ದಿನಗಳು',
      whyItMatters: 'ಅಳೆಯಬಹುದಾದ ಸಾಧನೆಗಳನ್ನು ಪ್ರದರ್ಶಿಸುವುದು ವೈಯಕ್ತಿಕ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      practicalAction: 'ಮಾಸಿಕ ಸ್ವಯಂ-ಮೌಲ್ಯಮಾಪನದಲ್ಲಿ ಎಲ್ಲಾ ಸಾಧನೆಗಳನ್ನು ನಿರ್ದಿಷ್ಟ ಅಂಕಿಅಂಶಗಳೊಂದಿಗೆ (ಉದಾ: ಲೇಟೆನ್ಸಿ % ಇಳಿಕೆ, ಉಳಿಸಿದ ಗಂಟೆಗಳು) ವಿವರಿಸಿ.',
      suggestedHabit: 'ಸಾಧನೆಗಳನ್ನು ದಾಖಲಿಸಲು ಸಾಪ್ತಾಹಿಕ ಪಟ್ಟಿಯನ್ನು ನಿರ್ವಹಿಸಿ.',
      progressIndicator: 'ಪೂರ್ಣಗೊಂಡ ಎಲ್ಲಾ ಕೆಲಸಗಳಲ್ಲೂ ಅಳೆಯಬಹುದಾದ ಫಲಿತಾಂಶಗಳು ಇರಬೇಕು.',
      measureOfProgress: 'ಪ್ರತಿ ಪೂರ್ಣಗೊಂಡ ಟಿಕೆಟ್‌ನಲ್ಲೂ ಅಂಕಿಅಂಶಗಳ ಉಲ್ಲೇಖ.',
      reflectionPrompt: 'ನನ್ನ ಫಲಿತಾಂಶದ ವಿವರಣೆಯು ನನ್ನ ವೈಯಕ್ತಿಕ ಕೊಡುಗೆಯ ಮೌಲ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಪ್ರದರ್ಶಿಸುತ್ತದೆಯೇ?',
    },
  ],
  preservedStarEvidence: [
    {
      competency: 'ಸಮಸ್ಯೆ ಪರಿಹಾರ ಮತ್ತು ಮಾಲೀಕತ್ವ',
      originalLanguage: 'English (en)',
      situation: 'ಕಠಿಣ ಗಡುವಿನ ಸಮಯದಲ್ಲಿ AI ಇಂಟಿಗ್ರೇಷನ್ ವೇಳೆ ಪ್ರಾಂಪ್ಟ್ ನಿಖರತೆಯಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿತು.',
      task: 'ದೋಷದ ಮೂಲ ಕಾರಣವನ್ನು ಪತ್ತೆಹಚ್ಚುವುದು ಮತ್ತು ಬಿಡುಗಡೆ ವಿಳಂಬವಾಗದಂತೆ ನಿಖರತೆಯನ್ನು ಮರುಸ್ಥಾಪಿಸುವುದು.',
      action: 'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
      result: 'ನಿರೀಕ್ಷಿತ ನಿಖರತೆಯನ್ನು ಸಾಧಿಸಲಾಯಿತು, ಬಿಡುಗಡೆ ವಿಳಂಬವನ್ನು ತಪ್ಪಿಸಲಾಯಿತು ಮತ್ತು ತಂಡಕ್ಕಾಗಿ ಪ್ರಾಂಪ್ಟ್ ಪರೀಕ್ಷಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿಯನ್ನು ರಚಿಸಲಾಯಿತು.',
    },
    {
      competency: 'ತಂಡದ ಕೆಲಸ ಮತ್ತು ಭಿನ್ನಾಭಿಪ್ರಾಯ ಪರಿಹಾರ',
      originalLanguage: 'English (en)',
      situation: 'ಹೊಸ ಮಾಡ್ಯೂಲ್‌ನ ತಾಂತ್ರಿಕ ವಿಧಾನದ ಬಗ್ಗೆ ತಂಡದ ಸದಸ್ಯರ ನಡುವೆ ಭಿನ್ನಾಭಿಪ್ರಾಯವಿತ್ತು.',
      task: 'ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಬಿರುಕಿಲ್ಲದೆ ಮುಂದಿನ ಮಾರ್ಗವನ್ನು ನಿರ್ಧರಿಸಲು ತಂಡವನ್ನು ಒಮ್ಮತಕ್ಕೆ ತರುವುದು.',
      action: 'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
      result: 'ಒಂದೇ ಸಭೆಯಲ್ಲಿ ಒಮ್ಮತ ಮೂಡಿತು, ನಿಗದಿತ ಸಮಯಕ್ಕಿಂತ ಮೊದಲೇ ಕೆಲಸ ಮುಗಿಯಿತು ಮತ್ತು ಸಕಾರಾತ್ಮಕ ವಾತಾವರಣ ಉಳಿಯಿತು.',
    },
    {
      competency: 'ಹೊಂದಾಣಿಕೆ ಮತ್ತು ನಿರಂತರ ಕಲಿಕೆ',
      originalLanguage: 'English (en)',
      situation: 'ಕಡಿಮೆ ದಾಖಲಾತಿ ಹೊಂದಿರುವ ಹೊಸ AI ಚೌಕಟ್ಟಿನಲ್ಲಿ 48 ಗಂಟೆಗಳ ಒಳಗೆ ಕೆಲಸ ಮಾಡುವ ಜವಾಬ್ದಾರಿ ನೀಡಲಾಯಿತು.',
      task: 'ಚೌಕಟ್ಟನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು 48 ಗಂಟೆಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಮಾದರಿಯನ್ನು ನಿರ್ಮಿಸುವುದು.',
      action: 'Broke down framework into core primitives, built incremental proof-of-concepts, and verified outputs against known test cases.',
      result: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಮಾದರಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಲಾಯಿತು ಮತ್ತು ಇಡೀ ತಂಡಕ್ಕಾಗಿ 2 ಪುಟಗಳ ತ್ವರಿತ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಯಿತು.',
    },
    {
      competency: 'ಹಿನ್ನಡೆಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶನದ ಸ್ವೀಕಾರ',
      originalLanguage: 'English (en)',
      situation: 'ಆರಂಭಿಕ ಯೋಜನಾ ಮೌಲ್ಯಮಾಪನದಲ್ಲಿ ಕೋಡ್ ವಿನ್ಯಾಸ ಮತ್ತು ಪರೀಕ್ಷೆಯ ಬಗ್ಗೆ ಗಂಭೀರ ವಿಮರ್ಶೆ ವ್ಯಕ್ತವಾಯಿತು.',
      task: 'ದೋಷಗಳನ್ನು ನಿವಾರಿಸಿ ತಂಡದ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಕೋಡ್ ಅನ್ನು ಸುಧಾರಿಸುವುದು.',
      action: 'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      result: 'ಯಾವುದೇ ದೋಷಗಳಿಲ್ಲದೆ ಮುಂದಿನ ವಿಮರ್ಶೆಯಲ್ಲಿ ಉತ್ತೀರ್ಣರಾದರು, ಸ್ವಯಂಚಾಲಿತ ಪರೀಕ್ಷಾ ಪದ್ಧತಿಗಳನ್ನು ಅಳವಡಿಸಿಕೊಂಡರು ಮತ್ತು ದೀರ್ಘಾವಧಿಯ ವೇಗವನ್ನು ಸುಧಾರಿಸಿದರು.',
    },
  ],
};

export const NANDINI_RECRUITER_EVALUATION: IRecruiterEvaluation = {
  roleFitSummary: {
    roleAssessed: 'Lead Software Engineer / AI Systems',
    competenciesEvaluated: [
      'Problem Solving & Architecture',
      'Team Collaboration & Conflict Resolution',
      'Accountability & Receptivity to Feedback',
      'Adaptability & Continuous Learning',
      'Execution & Pacing Under Pressure',
    ],
    assessmentVersion: 'v1.0.0 (34 Scored Items)',
    overallEvidenceSummary:
      'Nandini demonstrates high technical ownership, methodical problem decomposition, and disciplined execution. Candidate successfully completed 34 assessment items across core competencies. 8 language simplification requests were utilized without any penalty to integrity. Candidate exhibits strong collaborative resilience and rapid recovery from feedback, positioning her as an exceptional technical leader.',
  },
  competencyScorecard: [
    {
      competencyName: 'Problem Solving & Architecture',
      score: 4.5,
      criteria: 'Systematic diagnostic breakdown, algorithmic optimization, architectural fault tolerance',
      evidenceExcerpt:
        'Demonstrated systematic diagnostic breakdown on prompt accuracy failure. Collaborated cross-functionally and instituted automated prompt validation gates.',
    },
    {
      competencyName: 'Team Collaboration & Conflict Resolution',
      score: 4.3,
      criteria: 'Diplomatic mediation, objective metric anchoring, psychological safety preservation',
      evidenceExcerpt:
        'Constructively bridged conflicting architectural viewpoints by anchoring team discussions to objective performance benchmarks.',
    },
    {
      competencyName: 'Accountability & Receptivity to Feedback',
      score: 4.6,
      criteria: 'Proactive ownership, zero blame deflection, rapid mitigation implementation',
      evidenceExcerpt:
        'Acknowledged past feedback delays proactively; instituted pre-commit linting checks and dedicated senior peer code reviews to ensure zero repeat defects.',
    },
    {
      competencyName: 'Adaptability & Continuous Learning',
      score: 4.2,
      criteria: 'Rapid assimilation of novel technologies, documentation generation, team onboarding',
      evidenceExcerpt:
        'Quickly decompiled an undocumented AI framework into working primitives within 48 hours and authored team quickstart documentation.',
    },
    {
      competencyName: 'Execution & Pacing Under Pressure',
      score: 4.1,
      criteria: 'Milestone protection, pragmatic scope management, timeboxing exploration',
      evidenceExcerpt:
        'Delivered on schedule during critical launches; benefit from timeboxed debugging checkpoints to prevent over-indexing on low-probability corner cases.',
    },
  ],
  evidenceFromResponses: [
    {
      questionId: 'q-prob-01',
      competency: 'Problem Solving & Architecture',
      candidateStatedFact:
        'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and verified the outcome.',
      aiInterpretation:
        'Candidate values conceptual precision and thorough problem understanding before committing to code solutions. Exhibits low ego and high team-orientation under high-stakes deadline pressure.',
      missingEvidenceNote: 'Consider requesting specific quantitative accuracy delta after prompt overhaul in follow-up.',
    },
    {
      questionId: 'q-collab-02',
      competency: 'Team Collaboration & Conflict Resolution',
      candidateStatedFact:
        'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches using criteria like feasibility and alignment with goals.',
      aiInterpretation:
        'Demonstrates structured objective mediation. Defuses emotional conflict by re-centering discussion on measurable project criteria.',
    },
    {
      questionId: 'q-fb-03',
      competency: 'Accountability & Receptivity to Feedback',
      candidateStatedFact:
        'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
      aiInterpretation:
        'Possesses high metacognitive awareness and active self-correction mechanisms. Implemented structural tooling rather than relying solely on good intentions.',
    },
  ],
  strengthsAndProbes: {
    strengths: [
      'Methodical error tracing and multi-system debugging capability.',
      'Constructive disagreement mediation grounded in empirical benchmarks.',
      'Proactive feedback incorporation and automated regression test development.',
    ],
    areasToProbe: [
      'Experience leading architectural dissent discussions during high-velocity release cycles.',
      'Strategies for timeboxing investigative debugging during live production fire drills.',
    ],
    contextualNotes:
      'Candidate shows outstanding technical depth and team safety values. Note: Low evidence in rapid prototyping does not indicate low capability; candidate prioritizes system resilience. Probe how candidate negotiates timelines with product managers when edge cases threaten launch dates.',
  },
  recommendedFollowUp: [
    {
      followUpQuestion:
        'When you discover an architectural flaw in a teammate\'s design 24 hours before code freeze, what specific conversation structure do you use to raise dissent without blocking delivery?',
      rationaleOrPracticalTask:
        'Evaluate balance of diplomatic assertiveness and risk mitigation during high-urgency sprints.',
      targetedCompetency: 'Constructive Technical Dissent & Leadership',
    },
    {
      followUpQuestion:
        'Describe a scenario where you had to abandon deep root-cause investigation in favor of an interim mitigation. How did you maintain system integrity?',
      rationaleOrPracticalTask:
        'Practical Task: Live mini-architecture whiteboard on trade-offs between immediate containment vs. comprehensive root-cause patching.',
      targetedCompetency: 'Execution Pacing & Pragmatic Triage',
    },
  ],
  decisionSupportAndFairness: {
    rubricOverview:
      'Evaluated under the standardized Lead Software Engineer rubric. Scoring integrity verified: Zero penalty applied for language switching or 8 clarification queries.',
    uncertaintiesNoted: [
      'Candidate is naturally introverted (Extraversion 2.3/5.0); recommend evaluating leadership via 1-on-1 and design doc reviews rather than large panel presentations.',
    ],
    missingInformationNotes:
      'STAR result metrics were verified; recommend requesting production metrics from candidate\'s recent distributed deployments.',
    fairnessComplianceVerified: true,
    humanReviewerSignedOff: false,
  },
};

export async function seedInitialDatabase() {
  await connectToDatabase();

  // 1. Seed Users (Admin, Recruiter, Rahul Verma, Nandini)
  const existingAdmin = await User.findOne({ email: 'admin@ulipsu.talent' });
  if (!existingAdmin) {
    await User.create([
      {
        name: 'Super Admin',
        email: 'admin@ulipsu.talent',
        role: 'admin',
        preferredLanguage: 'en',
        organization: 'Ulipsu Talent Matrix',
      },
      {
        name: 'Priya Sharma (Hiring Manager)',
        email: 'priya@techcorp.in',
        role: 'recruiter',
        preferredLanguage: 'en',
        organization: 'TechCorp Engineering',
      },
      {
        name: 'Rahul Verma (Candidate)',
        email: 'rahul.verma@example.com',
        role: 'candidate',
        preferredLanguage: 'en',
      },
      {
        name: 'Nandini (Lead Candidate)',
        email: 'nandini@example.com',
        role: 'candidate',
        preferredLanguage: 'en',
      },
    ]);
    console.log('Seeded initial Users (Admin, Recruiter, Rahul Verma, Nandini).');
  } else {
    const existingNandini = await User.findOne({ email: 'nandini@example.com' });
    if (!existingNandini) {
      await User.create({
        name: 'Nandini (Lead Candidate)',
        email: 'nandini@example.com',
        role: 'candidate',
        preferredLanguage: 'en',
      });
    }
  }

  // 2. Seed Prompt Templates & Initial Versions
  const existingTemplates = await PromptTemplate.find();
  if (existingTemplates.length < 4) {
    await PromptTemplate.deleteMany({});
    await PromptVersion.deleteMany({});

    // Template 1: Assessment Generation
    const genTemplate = await PromptTemplate.create({
      name: 'Master Assessment Generation Prompt',
      slug: 'assessment_generation',
      description: 'Master prompt generating personality questionnaire & 4 behavioural scenarios (Problem-solving, Teamwork, Adaptability, Setbacks) with Situation, Task, Action, Result fields.',
      activeVersionNumber: 1,
      availableVariables: ['candidateProfile', 'careerStage', 'targetRole', 'language'],
    });

    await PromptVersion.create({
      templateSlug: genTemplate.slug,
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.assessment_generation.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.assessment_generation.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.3,
      topP: 0.9,
      responseSchemaName: 'AssessmentGenerationSchema',
      isActive: true,
      changeNotes: 'Master prompt baseline for Personality & 4 Behavioural Scenarios (Situation, Task, Action, Result).',
      createdByName: 'admin@discoveru.orbit',
    });

    // Template 2: Assessment Report
    const repTemplate = await PromptTemplate.create({
      name: 'Master Assessment Report Generation Prompt',
      slug: 'assessment_report',
      description: 'Master prompt generating 5-section candidate report: Personality Profile, Potential Strengths, Blind Spots, Work Preferences, and 30-Day Development Plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses', 'traitScores'],
    });

    await PromptVersion.create({
      templateSlug: repTemplate.slug,
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.assessment_report.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.assessment_report.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.3,
      topP: 0.9,
      responseSchemaName: 'AssessmentReportSchema',
      isActive: true,
      changeNotes: 'Master prompt baseline for 5-section candidate assessment report without framework acronym exposure.',
      createdByName: 'admin@discoveru.orbit',
    });

    // Template 3: Recruiter Evaluation
    const recTemplate = await PromptTemplate.create({
      name: 'Recruiter 6-Module Evaluation Prompt',
      slug: 'recruiter_evaluation',
      description: 'Generates grounded Role-fit summary, Competency scorecard, Fact-vs-inference evidence, Probing guide & Fairness check.',
      activeVersionNumber: 1,
      availableVariables: ['roleTarget', 'assessmentVersion', 'candidateName', 'candidateLanguage', 'candidateResponses'],
    });

    await PromptVersion.create({
      templateSlug: recTemplate.slug,
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.recruiter_evaluation.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.recruiter_evaluation.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.2,
      topP: 0.9,
      responseSchemaName: 'IRecruiterEvaluation',
      isActive: true,
      changeNotes: 'Production baseline for 6-section Recruiter Evaluation Suite in Future of Work & Enterprise Productivity.',
      createdByName: 'admin@discoveru.orbit',
    });

    // Template 4: Candidate Growth
    const candTemplate = await PromptTemplate.create({
      name: 'Candidate 5-Module Growth Prompt',
      slug: 'candidate_growth',
      description: 'Generates non-stigmatizing Big Five profile, Potential strengths, Constructive blind spots, Work preferences, and 30-day Personal Development Plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses'],
    });

    await PromptVersion.create({
      templateSlug: candTemplate.slug,
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.candidate_growth.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.candidate_growth.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.4,
      topP: 0.9,
      responseSchemaName: 'ICandidateGrowthReport',
      isActive: true,
      changeNotes: 'Production baseline for multilingual 5-section candidate growth reports without framework acronym exposure.',
      createdByName: 'admin@discoveru.orbit',
    });
    console.log('Seeded all 4 Master Prompt Templates and Versions.');
  }

  // 3. Seed Assessment
  let assessment = await Assessment.findOne();
  if (!assessment) {
    assessment = await Assessment.create({
      title: 'Lead Software Engineer - Competency & Behavioral Assessment',
      roleTarget: 'Lead Software Engineer',
      version: '1.0',
      description: 'Dual-pane situational assessment evaluating Problem Solving, Communication, Accountability, Adaptability, and Prioritisation.',
      timeLimitMinutes: 45,
      questions: SAMPLE_QUESTIONS,
    });
    console.log('Seeded Assessment with 5 Dual-Pane questions in EN, HI, KN.');
  }

  // 4. Seed Nandini Submission & EvaluationResult
  let nandiniSubmission = await Submission.findOne({ candidateEmail: 'nandini@example.com' });
  if (!nandiniSubmission) {
    nandiniSubmission = await Submission.create({
      assessmentId: assessment._id.toString(),
      candidateName: 'Nandini',
      candidateEmail: 'nandini@example.com',
      languageSelected: 'en',
      status: 'evaluated',
      answers: [
        {
          questionId: 'q1',
          selectedOptionId: 'B',
          writtenRationale:
            'Took support from a team member, brainstormed on why the prompt failed, created the updated prompt in collaboration, and systematically validated the new outputs.',
          timeSpentSeconds: 180,
        },
        {
          questionId: 'q2',
          selectedOptionId: 'C',
          writtenRationale:
            'I listened to both sides to understand the reason for the disagreement. I encouraged the team to compare the different approaches against our core performance benchmarks and divided tasks according to individual strengths.',
          timeSpentSeconds: 210,
        },
        {
          questionId: 'q3',
          selectedOptionId: 'A',
          writtenRationale:
            'My work did not improve as much as it could have, and some of the same issues remained. Looking back, I realised that putting off feedback was a mistake. I scheduled dedicated review sessions with a senior peer and instituted pre-commit linting checks.',
          timeSpentSeconds: 240,
        },
        {
          questionId: 'q4',
          selectedOptionId: 'B',
          writtenRationale:
            'Broke down framework into core primitives, built incremental proof-of-concepts, and verified outputs against known test cases before publishing team quickstart guide.',
          timeSpentSeconds: 195,
        },
      ],
      submittedAt: new Date(),
    });
    console.log('Seeded Nandini Submission.');
  }

  let nandiniEval = await EvaluationResult.findOne({ candidateEmail: 'nandini@example.com' });
  if (!nandiniEval) {
    nandiniEval = await EvaluationResult.create({
      submissionId: nandiniSubmission._id.toString(),
      assessmentId: assessment._id.toString(),
      candidateName: 'Nandini',
      candidateEmail: 'nandini@example.com',
      candidateLanguage: 'en',
      modelUsed: 'gemini-3.1-pro',
      promptVersionUsed: 1,
      recruiterView: NANDINI_RECRUITER_EVALUATION,
      candidateView: NANDINI_GROWTH_REPORT,
    });
    console.log('Seeded Nandini EvaluationResult document.');
  } else {
    nandiniEval.recruiterView = NANDINI_RECRUITER_EVALUATION;
    nandiniEval.candidateView = NANDINI_GROWTH_REPORT;
    await nandiniEval.save();
    console.log('Updated Nandini EvaluationResult with verified 9-page benchmark data.');
  }

  return { assessmentId: assessment._id.toString(), nandiniEvalId: nandiniEval._id.toString() };
}
