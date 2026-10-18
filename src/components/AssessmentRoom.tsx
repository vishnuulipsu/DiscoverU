'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IDualPaneQuestion } from '@/models/Assessment';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Send, 
  Clock, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  WifiOff,
  Wifi,
  LayoutList,
  AlignLeft,
  User,
  Edit3,
  Check,
  X,
  ArrowRight,
  Info,
  Sliders,
  Briefcase,
  Building2,
  Layers,
  GraduationCap,
  Code2,
  LineChart,
  Settings,
  Mail,
  Globe,
  ArrowLeft,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  PenTool
} from 'lucide-react';
import { getSimplifiedQuestionInfo } from '@/lib/question-simplifier';
import { SearchableSelect } from './SearchableSelect';
import {
  COUNTRIES,
  INDIAN_STATES,
  STATES_BY_COUNTRY,
  DEFAULT_STATES,
  EDUCATION_LEVELS,
  DEGREES_BY_LEVEL,
  CAREER_STAGES,
  WORK_EXPERIENCES,
  GENDER_OPTIONS,
  ASSESSMENT_LANGUAGES,
  TARGET_ROLE_FIELDS,
  ASSESSMENT_TRACK_OPTIONS,
} from './CandidateProfileData';

interface AssessmentRoomProps {
  assessmentId: string;
  roleTarget: string;
  version: string;
  questions: IDualPaneQuestion[];
  initialLanguage?: 'en' | 'hi' | 'kn';
}

interface IQuestionResponse {
  selectedOptionId: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  writtenRationale: string;
}

// Canonical simplified question versions per language (plain language, zero construct loss)
const SIMPLIFIED_SCENARIOS: Record<string, { en: string; hi: string; kn: string }> = {
  q1: {
    en: 'A big executive demo starts in 30 minutes, but the dashboard is running very slowly. You can restart the cache to temporarily hide the problem (with risk of bad data later), or redirect queries to a backup server and inform the demo lead about a slight delay. What would you do?',
    hi: '30 मिनट में एक महत्वपूर्ण डेमो शुरू होना है, लेकिन सिस्टम बहुत धीमा हो गया है। आप कैश रीस्टार्ट करके समस्या को कुछ देर छिपा सकते हैं (जिससे बाद में डेटा गलत हो सकता है), या बैकअप सर्वर पर ट्रैफिक भेजकर डेमो लीडर को संभावित देरी की जानकारी दे सकते हैं। आप क्या करेंगे?',
    kn: 'ಪ್ರಮುಖ ಡೆಮೊ ಪ್ರಾರಂಭವಾಗಲು 30 ನಿಮಿಷಗಳಿವೆ, ಆದರೆ ಸಿಸ್ಟಮ್ ತುಂಬಾ ನಿಧಾನವಾಗಿದೆ. ತಾತ್ಕಾಲಿಕ ಮರುಪ್ರಾರಂಭದ ಮೂಲಕ ಸಮಸ್ಯೆಯನ್ನು ಮರೆಮಾಡಬಹುದು (ನಂತರ ಡೇಟಾ ದೋಷದ ಅಪಾಯವಿದೆ), ಅಥವಾ ಬ್ಯಾಕಪ್ ಸರ್ವರ್‌ಗೆ ವರ್ಗಾಯಿಸಿ ಡೆಮೊ ತಂಡಕ್ಕೆ ಮುಂಚಿತವಾಗಿ ತಿಳಿಸಬಹುದು. ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ?'
  },
  q2: {
    en: 'Just 4 days before a scheduled release, the Product Manager asks to add a new checkout feature. Your analysis shows an 80% risk that mobile payments will break. How do you handle this request?',
    hi: 'रिलीज से सिर्फ 4 दिन पहले, प्रोडक्ट मैनेजर एक नया पेमेंट फीचर जोड़ने का अनुरोध करते हैं। आपके विश्लेषण के अनुसार इससे मोबाइल पेमेंट फेल होने का 80% जोखिम है। आप इस स्थिति से कैसे निपटेंगे?',
    kn: 'ಬಿಡುಗಡೆಗೆ ಕೇವಲ 4 दिनಗಳ ಮೊದಲು ಹೊಸ ವೈಶಿಷ್ಟ್ಯ ಸೇರಿಸಲು ಬೇಡಿಕೆ ಬರುತ್ತದೆ. ಆದರೆ ಇದರಿಂದ ಮೊಬೈಲ್ ಪಾವತಿಯಲ್ಲಿ 80% ದೋಷ ಉಂಟಾಗುವ ಅಪಾಯವಿದೆ. ನೀವು ಈ ವಿನಂತಿಯನ್ನು ಹೇಗೆ ನಿಭಾಯಿಸುತ್ತೀರಿ?'
  },
  q3: {
    en: 'A subtle race condition bug that you approved during code review slipped into production and affected 120 users. How do you respond and take accountability?',
    hi: 'कोड समीक्षा के दौरान आपसे छूटा हुआ एक बग लाइव सिस्टम में चला गया और 120 उपयोगकर्ताओं को प्रभावित किया। आप इसकी जिम्मेदारी कैसे लेंगे और क्या कदम उठाएंगे?',
    kn: 'ಕೋಡ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ ನಿಮ್ಮ ಗಮನಕ್ಕೆ ಬಾರದ ಒಂದು ದೋಷವು ಲೈವ್ ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ಕಾಣಿಸಿಕೊಂಡು 120 ಬಳಕೆದಾರರ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದೆ. ನೀವು ಇದಕ್ಕೆ ಹೇಗೆ ಜವಾಬ್ದಾರಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತೀರಿ?'
  },
  q4: {
    en: 'Midway through an urgent quarterly sprint, a surprise data regulation rule forces your team to redesign the auth system. How do you adjust priorities and help the team adapt?',
    hi: 'अति-महत्वपूर्ण तिमाही काम के बीच में, एक नए सरकारी डेटा नियम के कारण आपकी टीम को ऑथेंटिकेशन सिस्टम फिर से डिजाइन करना पड़ रहा है। आप प्राथमिकताओं को कैसे संतुलित करेंगे?',
    kn: 'ತುರ್ತು ಕಾರ್ಯದ ನಡುವೆ, ಹೊಸ ಡೇಟಾ ನಿಯಮದ ಕಾರಣದಿಂದ ಲಾಗಿನ್ ಸಿಸ್ಟಮ್ ಅನ್ನು ಮರುವಿನ್ಯಾಸಗೊಳಿಸಬೇಕಾಗಿದೆ. ನೀವು ಆದ್ಯತೆಗಳನ್ನು ಹೇಗೆ ಹೊಂದಿಸುತ್ತೀರಿ?'
  },
  q5: {
    en: 'You have a high-priority deadline to fix an enterprise security issue affecting 500,000 users, but your team has also received 4 urgent customer escalation tickets today. How do you decide what to do first?',
    hi: '500,000 उपयोगकर्ताओं की सुरक्षा के लिए एक महत्वपूर्ण समय-सीमा है, लेकिन आज 4 जरूरी ग्राहक शिकायतें भी आई हैं। आप पहले क्या करेंगे और कैसे फैसला लेंगे?',
    kn: '500,000 ಬಳಕೆದಾರರ ಸುರಕ್ಷತೆಗೆ ಪ್ರಮುಖ ಗಡುವು ಇದೆ, ಆದರೆ ಇಂದು 4 ತುರ್ತು ಗ್ರಾಹಕ ಟಿಕೆಟ್‌ಗಳು ಕೂಡ ಬಂದಿವೆ. ನೀವು ಮೊದಲು ಯಾವುದನ್ನು ಆರಿಸುತ್ತೀರಿ?'
  }
};

const DEFAULT_ANSWERS: Record<string, IQuestionResponse> = {
  q1: {
    selectedOptionId: 'B',
    situation: 'Demonstration was scheduled within 30 minutes while the analytics system experienced severe query latency under high load.',
    task: 'Isolate database pressure immediately to ensure client demonstration continuity without risking data corruption.',
    action: 'Redirected read queries to an emergency read-replica and briefed the lead on expected query response times.',
    result: 'The demo proceeded without data anomalies, and the root-cause index rebuilding was scheduled safely for off-peak hours.',
    writtenRationale:
      'I prioritize systemic stability and stakeholder transparency. Masking latency with a quick cache restart risks corrupted transactions during the demo. Instead, an emergency read-replica redirect isolates query pressure immediately while maintaining database integrity.',
  },
  q2: {
    selectedOptionId: 'C',
    situation: 'Four days before product launch, an unvetted checkout integration was requested that introduced an 80% regression risk to mobile payment processing.',
    task: 'Protect payment flow stability while collaborating constructively with the Product Manager to explore safe delivery.',
    action: 'Scheduled a brief alignment sync, visually demonstrated regression failure scenarios, and proposed phased feature-flag enablement.',
    result: 'The launch proceeded reliably with core payments safe, and the new integration was rolled out progressively behind feature flags.',
    writtenRationale:
      'Rejecting requests abruptly damages cross-functional trust, while silently building risky code endangers users. A rapid sync to visually demonstrate the 80% regression risk and proposing a feature flag provides safety with agility.',
  },
  q3: {
    selectedOptionId: 'A',
    situation: 'A subtle concurrency edge-case approved during peer review slipped into production and impacted session stability for 120 users.',
    task: 'Contain the issue immediately, take personal responsibility, and implement structural checks to prevent recurrence.',
    action: 'Deployed a hotfix promptly, communicated transparently without deflecting blame, and authored automated concurrency tests.',
    result: 'System stability was restored within 25 minutes, and regression test suites now catch similar concurrency bugs pre-merge.',
    writtenRationale:
      'True accountability requires owning the review miss without deflecting blame. Deploying the hotfix alongside automated concurrency regression tests ensures the incident turns into an enduring institutional improvement.',
  },
  q4: {
    selectedOptionId: 'A',
    situation: 'Midway through an urgent delivery sprint, a surprise data privacy mandate required re-architecting customer authentication.',
    task: 'Restructure team backlog to achieve mandatory compliance without collapsing delivery timelines or team morale.',
    action: 'Decomposed the mandate into minimal compliance primitives, postponed non-critical features, and synchronized tasks across the sprint.',
    result: 'The compliance deadline was met on time with zero regulatory infractions, while team momentum was preserved.',
    writtenRationale:
      'Sudden regulatory shifts are inevitable in scaling products. By decomposing the mandate into minimal compliance primitives and descoping non-critical items, the team preserves velocity and morale.',
  },
  q5: {
    selectedOptionId: 'B',
    situation: 'Simultaneous demands arose between a critical security milestone safeguarding 500,000 accounts and 4 escalated client tickets.',
    task: 'Balance strategic security risk mitigation against immediate client operational blockages.',
    action: 'Delivered quick manual workarounds for the 4 customer issues to unblock users, while focusing core engineering focus on the security deliverable.',
    result: 'Both the critical security deadline was met and customer escalation impact was mitigated effectively.',
    writtenRationale:
      'High-impact strategic milestones protecting 500,000 accounts must not be derailed by localized operational emergencies. Providing workarounds for the 4 tickets allows focus on the security deliverable.',
  },
};

// Available Industries for dynamic tailoring
const INDUSTRY_OPTIONS = [
  { id: 'saas', name: 'Enterprise SaaS & Cloud', icon: Building2, desc: '99.99% SLAs, distributed microservices, multi-tenant databases' },
  { id: 'fintech', name: 'Fintech & Digital Banking', icon: LineChart, desc: 'Payment gateways, ledger reconciliation, audit compliance' },
  { id: 'healthcare', name: 'Healthcare & HealthTech', icon: ShieldCheck, desc: 'Clinical EHR systems, HIPAA patient privacy, zero-downtime' },
  { id: 'ecommerce', name: 'E-Commerce & Digital Retail', icon: Layers, desc: 'Flash sales, shopping cart checkout, inventory race conditions' },
  { id: 'ai', name: 'AI & Autonomous Systems', icon: Sparkles, desc: 'LLM inference pipelines, model hallucinations, safety guardrails' },
  { id: 'edtech', name: 'EdTech & Digital Learning', icon: GraduationCap, desc: 'Live video streaming, student data privacy, proctoring' },
];

// Available Roles ("What are you doing")
const ROLE_OPTIONS = [
  { id: 'Software Engineer', label: 'Software Engineer / Developer', icon: Code2 },
  { id: 'Student / Fresher', label: 'College Graduate / Student', icon: GraduationCap },
  { id: 'Product Manager', label: 'Product Manager / Strategy', icon: Briefcase },
  { id: 'Data & AI Specialist', label: 'Data Analyst / AI Specialist', icon: LineChart },
  { id: 'Operations Analyst', label: 'Operations & Business Systems', icon: Settings },
  { id: 'custom', label: 'Other / Custom Role...', icon: Edit3 },
];

// Available Test Tracks ("Which test he want to choose")
const TEST_TRACKS = [
  { id: 'full', name: 'Full 360° Behavioral Assessment', questionsCount: '5 Dilemmas', desc: 'Comprehensive evaluation across Problem Solving, Communication, Accountability, Adaptability & Prioritization' },
  { id: 'crisis', name: 'Crisis Management & System Resilience', questionsCount: '2 Dilemmas', desc: 'Focus on high-stakes production outages, executive escalations & critical incident triage' },
  { id: 'cross_functional', name: 'Stakeholder Alignment & Scope Negotiation', questionsCount: '2 Dilemmas', desc: 'Focus on cross-functional conflicts, deadline pushback & roadmap trade-offs' },
  { id: 'governance', name: 'Enterprise Governance & Regulatory Agility', questionsCount: '2 Dilemmas', desc: 'Focus on sudden compliance mandates, review ownership & accountability' },
];

// Creative loader insights cycling while AI Engine is running
const CREATIVE_LOADER_INSIGHTS = [
  {
    icon: '🧠',
    title: 'Synthesizing Cognitive Dilemmas',
    detail: 'Constructing high-stakes workplace scenarios with realistic operational trade-offs and competing business constraints...',
  },
  {
    icon: '⚡',
    title: 'Contextualizing Industry Realities',
    detail: 'Injecting technical edge cases, architecture friction, and cross-functional team dynamics tailored to your domain...',
  },
  {
    icon: '📐',
    title: 'Calibrating Multi-Dimensional Rubrics',
    detail: 'Formulating structured workplace evaluation vectors with zero construct loss...',
  },
  {
    icon: '🌐',
    title: 'Ensuring Trilingual Parity',
    detail: 'Cross-aligning cognitive nuances across English, Hindi, and Kannada for bias-free, language-neutral evaluation...',
  },
  {
    icon: '🎯',
    title: 'Engineering Decision Vectors',
    detail: 'Balancing short-term fixes against root-cause remedies to accurately measure strategic foresight and execution rigor...',
  },
  {
    icon: '🚀',
    title: 'Assembling Test Environment',
    detail: 'Finalizing dual-pane workspace, interactive prompts, and baseline scoring thresholds for your session...',
  },
];

const UI_TEXT = {
  en: {
    onboardingBadge: 'Candidate Assessment Onboarding',
    langNeutralScoring: 'Language-Neutral Scoring',
    profileSetupTitle: 'Candidate Profile Setup',
    profileSetupDesc: 'Please complete your candidate profile before beginning the behavioral dilemma assessment. DiscoverU AI Engine will customize cognitive dilemmas calibrated to your background and target field.',
    prefillBtn: 'Prefill Demo Profile',
    restoreDraftBtn: 'Restore Progress',
    startFreshBtn: 'Start Fresh',
    sec1Title: 'Personal Information',
    fullName: 'Full Name',
    fullNameHint: '(Required, trimmed)',
    fullNamePlaceholder: 'e.g. Rahul Verma',
    email: 'Work / Personal Email',
    emailHint: '(For report delivery)',
    emailPlaceholder: 'e.g. rahul.verma@example.com',
    dob: 'Date of Birth',
    dobHint: '(Optional, past dates only)',
    gender: 'Gender',
    genderHint: '(Optional)',
    sec2Title: 'Location (Country & State)',
    indiaOnlyBadge: 'Restricted to India 🇮🇳',
    country: 'Country',
    countryHint: '(Restricted)',
    stateUt: 'State / Union Territory',
    stateUtHint: '(Searchable)',
    statePlaceholder: 'Search state / union territory...',
    sec3Title: 'Education & Qualification',
    educationLevel: 'Education Level',
    degreeQualification: 'Degree / Qualification',
    sec4Title: 'Career Stage & Work Experience',
    careerStage: 'Career Stage',
    workExperience: 'Work Experience',
    sec5Title: 'Assessment Track & Methodology',
    sec5Subtitle: 'Configured for your persona',
    professionalTrackTitle: 'Working Professional Track',
    professionalTrackBadge: 'Likert Scale (30 Questions)',
    professionalTrackQ1: '30 Questions (Workplace behavioral statements on 1–5 scale)',
    professionalTrackQ2: 'Includes real-world experience justification for select statements',
    studentTrackTitle: 'Student Track',
    studentTrackBadge: 'Option-Based Approach',
    studentTrackQ1: '12 Questions (3 each across E/I, S/N, T/F, J/P)',
    studentTrackQ2: '4 Questions for vocational interest mapping',
    sec6Title: 'Target Role & Preferred Assessment Language',
    targetRoleLabel: 'Target Role / Career Field',
    targetRoleHint: '(Searchable)',
    targetRolePlaceholder: 'Search career field...',
    langLabel: 'Preferred Assessment Language',
    langGuaranteed: 'Language-neutral scoring with trilingual construct parity',
    generateBtn: 'Generate Assessment',
    generatingBtn: 'Synthesizing Your Assessment',
    aiFooterNote: 'Powered by DiscoverU AI Engine • Situational Dilemma Generation & Comprehensive Evaluation',
    dualPaneBadge: 'Dual-Pane Assessment',
    part1Tab: 'Workplace Assessment',
    part2Tab: 'Case Study',
    setupFormBtn: 'Setup Form',
    customizeBtn: 'Customize Assessment',
    simplifyBtn: 'Simplify Questions',
    simplifiedActive: 'Simplified Mode ON',
    prevBtn: 'Previous Question',
    nextBtn: 'Next Question',
    submitBtn: 'Submit Assessment & View Evaluation',
    evaluatingBtn: 'AI Powered Evaluating...',
    wordCount: 'words written',
    autosaved: 'Draft autosaved',
    questionProgress: 'Question',
    of: 'of',
    nextOrSubmitHint: 'Click Next or Submit when ready',
    writtenReqBadge: 'Written Example Required',
    statementLabel: 'Workplace Behavioral Statement',
    selectRating: 'Select your rating:',
    ratingRecorded: 'Rating recorded',
    step2Required: 'Step 2: Real-Life Experience & Context',
    requiredBadge: 'Required *',
    optionalBadge: 'Optional',
    mandatoryMinChars: 'Mandatory written example for this section (min 15 characters)',
    optionalContext: 'Optional: Provide context if you wish',
    valSelectRating: 'Please select a rating on the scale from 1 to 5 to proceed.',
    valSelectChoice: 'Please select your preferred choice before proceeding.',
    valMinCharsStar: 'Please provide your response for this phase (at least 15 characters).',
    valMinCharsWritten: 'This question requires a written justification or real-life example (at least 15 characters) before proceeding.',
    valStep1Req: 'Step 1 Required: Please choose your preferred decision option on the left.',
    valStep2Req: 'Step 2 Required: Please provide your written rationale (at least 20 characters).',
  },
  hi: {
    onboardingBadge: 'उम्मीदवार मूल्यांकन ऑनबोर्डिंग',
    langNeutralScoring: 'भाषा-तटस्थ स्कोरिंग',
    profileSetupTitle: 'उम्मीदवार प्रोफ़ाइल सेटअप',
    profileSetupDesc: 'व्यावहारिक दुविधा मूल्यांकन शुरू करने से पहले कृपया अपनी प्रोफ़ाइल पूरी करें। डिस्कवरयू एआई इंजन आपके अनुभव और लक्षित क्षेत्र के अनुसार परिदृश्यों को अनुकूलित करेगा।',
    prefillBtn: 'डेमो प्रोफ़ाइल भरें',
    restoreDraftBtn: 'प्रगति पुनः प्राप्त करें',
    startFreshBtn: 'नया शुरू करें',
    sec1Title: 'व्यक्तिगत जानकारी',
    fullName: 'पूरा नाम',
    fullNameHint: '(अनिवार्य)',
    fullNamePlaceholder: 'उदा. राहुल वर्मा',
    email: 'कार्य / व्यक्तिगत ईमेल',
    emailHint: '(रिपोर्ट वितरण के लिए)',
    emailPlaceholder: 'उदा. rahul.verma@example.com',
    dob: 'जन्म तिथि',
    dobHint: '(ऐच्छिक, केवल पूर्व दिनांक)',
    gender: 'लिंग',
    genderHint: '(ऐच्छिक)',
    sec2Title: 'स्थान (देश और राज्य)',
    indiaOnlyBadge: 'केवल भारत 🇮🇳',
    country: 'देश',
    countryHint: '(प्रतिबंधित)',
    stateUt: 'राज्य / केंद्र शासित प्रदेश',
    stateUtHint: '(खोजने योग्य)',
    statePlaceholder: 'राज्य या केंद्र शासित प्रदेश खोजें...',
    sec3Title: 'शिक्षा एवं योग्यता',
    educationLevel: 'शिक्षा स्तर',
    degreeQualification: 'डिग्री / योग्यता',
    sec4Title: 'करियर स्तर एवं कार्य अनुभव',
    careerStage: 'करियर स्तर',
    workExperience: 'कार्य अनुभव',
    sec5Title: 'मूल्यांकन ट्रैक और पद्धति',
    sec5Subtitle: 'आपकी प्रोफ़ाइल के अनुरूप निर्धारित',
    professionalTrackTitle: 'कार्यरत पेशेवर ट्रैक',
    professionalTrackBadge: '30 लिकर्ट प्रश्न',
    professionalTrackQ1: '30 प्रश्न (कार्यस्थल व्यवहार पर 1–5 लिकर्ट पैमाना)',
    professionalTrackQ2: 'चयनित कथनों के लिए वास्तविक अनुभव का औचित्य शामिल है',
    studentTrackTitle: 'छात्र ट्रैक',
    studentTrackBadge: 'विकल्प-आधारित दृष्टिकोण',
    studentTrackQ1: '12 प्रश्न (E/I, S/N, T/F, J/P के 3-3 प्रश्न)',
    studentTrackQ2: 'व्यावसायिक रुचि मैपिंग हेतु 4 प्रश्न',
    sec6Title: 'लक्षित भूमिका एवं पसंदीदा मूल्यांकन भाषा',
    targetRoleLabel: 'लक्षित भूमिका / करियर क्षेत्र',
    targetRoleHint: '(खोजने योग्य)',
    targetRolePlaceholder: 'करियर क्षेत्र खोजें...',
    langLabel: 'पसंदीदा मूल्यांकन भाषा',
    langGuaranteed: 'तीनों भाषाओं में समान व निष्पक्ष भाषा-तटस्थ स्कोरिंग',
    generateBtn: 'मूल्यांकन तैयार करें',
    generatingBtn: 'मूल्यांकन तैयार हो रहा है',
    aiFooterNote: 'डिस्कवरयू एआई इंजन द्वारा संचालित • व्यावहारिक परिदृश्य एवं समग्र मूल्यांकन',
    dualPaneBadge: 'ड्यूल-पेन मूल्यांकन',
    part1Tab: 'कार्यस्थल मूल्यांकन',
    part2Tab: 'केस स्टडी',
    setupFormBtn: 'सेटअप फॉर्म',
    customizeBtn: 'मूल्यांकन अनुकूलित करें',
    simplifyBtn: 'सरल भाषा मोड',
    simplifiedActive: 'सरल मोड सक्रिय',
    prevBtn: 'पिछला प्रश्न',
    nextBtn: 'अगला प्रश्न',
    submitBtn: 'मूल्यांकन जमा करें और परिणाम देखें',
    evaluatingBtn: 'एआई द्वारा मूल्यांकन जारी...',
    wordCount: 'शब्द लिखे गए',
    autosaved: 'ड्राफ्ट सहेजा गया',
    questionProgress: 'प्रश्न',
    of: 'में से',
    nextOrSubmitHint: 'तैयार होने पर अगला या सबमिट क्लिक करें',
    writtenReqBadge: 'लिखित उदाहरण अनिवार्य',
    statementLabel: 'कार्यस्थल व्यवहार कथन',
    selectRating: 'अपनी रेटिंग चुनें:',
    ratingRecorded: 'रेटिंग दर्ज की गई',
    step2Required: 'चरण 2: वास्तविक अनुभव एवं संदर्भ',
    requiredBadge: 'अनिवार्य *',
    optionalBadge: 'ऐच्छिक',
    mandatoryMinChars: 'इस खंड के लिए लिखित उदाहरण अनिवार्य है (कम से कम 15 अक्षर)',
    optionalContext: 'ऐच्छिक: यदि आप चाहें तो संदर्भ साझा करें',
    valSelectRating: 'आगे बढ़ने के लिए कृपया 1 से 5 के पैमाने पर अपनी रेटिंग चुनें।',
    valSelectChoice: 'आगे बढ़ने से पहले कृपया अपना पसंदीदा विकल्प चुनें।',
    valMinCharsStar: 'कृपया इस चरण के लिए अपना उत्तर दें (कम से कम 15 अक्षर)।',
    valMinCharsWritten: 'आगे बढ़ने से पहले इस प्रश्न के लिए लिखित औचित्य या उदाहरण (कम से कम 15 अक्षर) अनिवार्य है।',
    valStep1Req: 'चरण 1 आवश्यक: कृपया बाईं ओर अपना पसंदीदा विकल्प चुनें।',
    valStep2Req: 'चरण 2 आवश्यक: कृपया अपना लिखित औचित्य (कम से कम 20 अक्षर) प्रदान करें।',
  },
  kn: {
    onboardingBadge: 'ಅಭ್ಯರ್ಥಿ ಮೌಲ್ಯಮಾಪನ ಆರಂಭ',
    langNeutralScoring: 'ಭಾಷಾ-ತಟಸ್ಥ ಸ್ಕೋರಿಂಗ್',
    profileSetupTitle: 'ಅಭ್ಯರ್ಥಿ ಪ್ರೊಫೈಲ್ ಸೆಟಪ್',
    profileSetupDesc: 'ವರ್ತನೆಯ ಸನ್ನಿವೇಶ ಮೌಲ್ಯಮಾಪನವನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ. ಡಿಸ್ಕವರ್‌ಯು ಎಐ ನಿಮ್ಮ ಹಿನ್ನೆಲೆಗೆ ತಕ್ಕಂತೆ ಸನ್ನಿವೇಶಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.',
    prefillBtn: 'ಡೆಮೊ ಪ್ರೊಫೈಲ್ ಭರ್ತಿ ಮಾಡಿ',
    restoreDraftBtn: 'ಪ್ರಗತಿ ಮರುಪಡೆಯಿರಿ',
    startFreshBtn: 'ಹೊಸದಾಗಿ ಪ್ರಾರಂಭಿಸಿ',
    sec1Title: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    fullNameHint: '(ಕಡ್ಡಾಯ)',
    fullNamePlaceholder: 'ಉದಾ. ರಾಹುಲ್ ವರ್ಮಾ',
    email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    emailHint: '(ವರದಿ ಕಳುಹಿಸಲು)',
    emailPlaceholder: 'ಉದಾ. rahul.verma@example.com',
    dob: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ',
    dobHint: '(ಐಚ್ಛಿಕ)',
    gender: 'ಲಿಂಗ',
    genderHint: '(ಐಚ್ಛಿಕ)',
    sec2Title: 'ಸ್ಥಳ (ದೇಶ ಮತ್ತು ರಾಜ್ಯ)',
    indiaOnlyBadge: 'ಭಾರತ ಮಾತ್ರ 🇮🇳',
    country: 'ದೇಶ',
    countryHint: '(ನಿರ್ಬಂಧಿತ)',
    stateUt: 'ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ',
    stateUtHint: '(ಹುಡುಕಬಹುದು)',
    statePlaceholder: 'ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ ಹುಡುಕಿ...',
    sec3Title: 'ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಹತೆ',
    educationLevel: 'ಶಿಕ್ಷಣದ ಹಂತ',
    degreeQualification: 'ಪದವಿ / ವಿದ್ಯಾರ್ಹತೆ',
    sec4Title: 'ವೃತ್ತಿ ಹಂತ ಮತ್ತು ಕೆಲಸದ ಅನುಭವ',
    careerStage: 'ವೃತ್ತಿ ಹಂತ',
    workExperience: 'ಕೆಲಸದ ಅನುಭವ',
    sec5Title: 'ಮೌಲ್ಯಮಾಪನ ಟ್ರ್ಯಾಕ್ ಮತ್ತು ವಿಧಾನ',
    sec5Subtitle: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಅನುಗುಣವಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ',
    professionalTrackTitle: 'ಉದ್ಯೋಗಿ / ವೃತ್ತಿಪರ ಟ್ರ್ಯಾಕ್',
    professionalTrackBadge: '30 ಲಿಕರ್ಟ್ ಪ್ರಶ್ನೆಗಳು',
    professionalTrackQ1: '30 ಪ್ರಶ್ನೆಗಳು (ಕೆಲಸದ ಶೈಲಿಯ ಹೇಳಿಕೆಗಳು 1–5 ಲಿಕರ್ಟ್ ಪ್ರಮಾಣ)',
    professionalTrackQ2: 'ಆಯ್ದ ಹೇಳಿಕೆಗಳಿಗೆ ನೈಜ ಅನುಭವದ ಸಮರ್ಥನೆ ಒಳಗೊಂಡಿದೆ',
    studentTrackTitle: 'ವಿದ್ಯಾರ್ಥಿ ಟ್ರ್ಯಾಕ್',
    studentTrackBadge: 'ಆಯ್ಕೆ-ಆಧಾರಿತ ವಿಧಾನ',
    studentTrackQ1: '12 ಪ್ರಶ್ನೆಗಳು (E/I, S/N, T/F, J/P ತಲಾ 3)',
    studentTrackQ2: 'ವೃತ್ತಿಪರ ಆಸಕ್ತಿ ಮ್ಯಾಪಿಂಗ್‌ಗಾಗಿ 4 ಪ್ರಶ್ನೆಗಳು',
    sec6Title: 'ಗುರಿ ಹುದ್ದೆ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ಭಾಷೆ',
    targetRoleLabel: 'ಗುರಿ ಹುದ್ದೆ / ವೃತ್ತಿ ಕ್ಷೇತ್ರ',
    targetRoleHint: '(ಹುಡುಕಬಹುದು)',
    targetRolePlaceholder: 'ವೃತ್ತಿ ಕ್ಷೇತ್ರ ಹುಡುಕಿ...',
    langLabel: 'ಆದ್ಯತೆಯ ಮೌಲ್ಯಮಾಪನ ಭಾಷೆ',
    langGuaranteed: 'ಮೂರು ಭಾಷೆಗಳಲ್ಲಿ ಸಮಾನ ಮತ್ತು ನಿಷ್ಪಕ್ಷಪಾತ ಮೌಲ್ಯಮಾಪನ',
    generateBtn: 'ಮೌಲ್ಯಮಾಪನ ರಚಿಸಿ',
    generatingBtn: 'ಮೌಲ್ಯಮಾಪನ ಸಿದ್ಧಗೊಳ್ಳುತ್ತಿದೆ',
    aiFooterNote: 'ಡಿಸ್ಕವರ್‌ಯು ಎಐ ಎಂಜಿನ್‌ನಿಂದ ಸಶಕ್ತ • ಸನ್ನಿವೇಶ ಸೃಷ್ಟಿ ಮತ್ತು ಸಮಗ್ರ ಮೌಲ್ಯಮಾಪನ',
    dualPaneBadge: 'ಡ್ಯುಯಲ್-ಪೇನ್ ಮೌಲ್ಯಮಾಪನ',
    part1Tab: 'ಕೆಲಸದ ಶೈಲಿ ಮೌಲ್ಯಮಾಪನ',
    part2Tab: 'ಕೇಸ್ ಸ್ಟಡಿ',
    setupFormBtn: 'ಸೆಟಪ್ ಫಾರ್ಮ್',
    customizeBtn: 'ಮೌಲ್ಯಮಾಪನ ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
    simplifyBtn: 'ಸರಳ ಭಾಷಾ ಮೋಡ್',
    simplifiedActive: 'ಸರಳ ಮೋಡ್ ಆನ್ ಆಗಿದೆ',
    prevBtn: 'ಹಿಂದಿನ ಪ್ರಶ್ನೆ',
    nextBtn: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ',
    submitBtn: 'ಮೌಲ್ಯಮಾಪನ ಸಲ್ಲಿಸಿ ಮತ್ತು ವರದಿ ವೀಕ್ಷಿಸಿ',
    evaluatingBtn: 'ಎಐ ಮೌಲ್ಯಮಾಪನ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    wordCount: 'ಪದಗಳನ್ನು ಬರೆಯಲಾಗಿದೆ',
    autosaved: 'ಕರಡು ಉಳಿಸಲಾಗಿದೆ',
    questionProgress: 'ಪ್ರಶ್ನೆ',
    of: 'ರ ಪೈಕಿ',
    nextOrSubmitHint: 'ಸಿದ್ಧವಾದಾಗ ಮುಂದಿನ ಅಥವಾ ಸಲ್ಲಿಕೆ ಕ್ಲಿಕ್ ಮಾಡಿ',
    writtenReqBadge: 'ಲಿಖಿತ ಉದಾಹರಣೆ ಕಡ್ಡಾಯ',
    statementLabel: 'ಕೆಲಸದ ಸ್ಥಳದ ವರ್ತನೆಯ ಹೇಳಿಕೆ',
    selectRating: 'ನಿಮ್ಮ ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ:',
    ratingRecorded: 'ರೇಟಿಂಗ್ ದಾಖಲಾಗಿದೆ',
    step2Required: 'ಹಂತ 2: ನೈಜ ಅನುಭವ ಮತ್ತು ಹಿನ್ನೆಲೆ',
    requiredBadge: 'ಕಡ್ಡಾಯ *',
    optionalBadge: 'ಐಚ್ಛಿಕ',
    mandatoryMinChars: 'ಈ ವಿಭಾಗಕ್ಕೆ ಲಿಖಿತ ಉದಾಹರಣೆ ಕಡ್ಡಾಯವಾಗಿದೆ (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು)',
    optionalContext: 'ಐಚ್ಛಿಕ: ನೀವು ಬಯಸಿದರೆ ವಿವರ ನೀಡಿ',
    valSelectRating: 'ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು 1 ರಿಂದ 5 ರ ಪ್ರಮಾಣದಲ್ಲಿ ನಿಮ್ಮ ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ.',
    valSelectChoice: 'ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.',
    valMinCharsStar: 'ದಯವಿಟ್ಟು ಈ ಹಂತಕ್ಕೆ ನಿಮ್ಮ ಉತ್ತರ ನೀಡಿ (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು).',
    valMinCharsWritten: 'ಮುಂದುವರಿಯುವ ಮೊದಲು ಈ ಪ್ರಶ್ನೆಗೆ ಲಿಖಿತ ವಿವರಣೆ ಅಥವಾ ಉದಾಹರಣೆ (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು) ಕಡ್ಡಾಯವಾಗಿದೆ.',
    valStep1Req: 'ಹಂತ 1 ಕಡ್ಡಾಯ: ದಯವಿಟ್ಟು ಎಡಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.',
    valStep2Req: 'ಹಂತ 2 ಕಡ್ಡಾಯ: ದಯವಿಟ್ಟು ಲಿಖಿತ ಸಮರ್ಥನೆಯನ್ನು (ಕನಿಷ್ಠ 20 ಅಕ್ಷರಗಳು) ಒದಗಿಸಿ.',
  },
};

export function AssessmentRoom({
  assessmentId: initialAssessmentId,
  roleTarget: initialRoleTarget,
  version: initialVersion,
  questions: initialQuestions,
  initialLanguage = 'en',
}: AssessmentRoomProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi' | 'kn'>(initialLanguage);
  const t = UI_TEXT[language] || UI_TEXT.en;
  const [currentIdx, setCurrentIdx] = useState(0);

  // Creative cycling insight state while generating
  const [creativeInsightIdx, setCreativeInsightIdx] = useState(0);

  // Assessment Initiation State: false by default so candidate completes onboarding first
  const [hasStarted, setHasStarted] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [generationStep, setGenerationStep] = useState(0);

  // Dynamic Assessment State
  const [activeAssessmentId, setActiveAssessmentId] = useState(initialAssessmentId);
  const [activeRoleTarget, setActiveRoleTarget] = useState(initialRoleTarget);
  const [activeQuestions, setActiveQuestions] = useState<IDualPaneQuestion[]>(() =>
    (initialQuestions || []).filter(
      (q) => q.questionType !== 'subjective_star' && q.category !== 'star' && !q.questionId?.startsWith('star_')
    )
  );

  // Candidate Profile State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [country, setCountry] = useState('India');
  const [stateRegion, setStateRegion] = useState('Karnataka');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [degreeQualification, setDegreeQualification] = useState('B.Tech / B.E.');
  const [careerStage, setCareerStage] = useState('Recent Graduate / Fresher');
  const [workExperience, setWorkExperience] = useState('0-1 years');
  const [assessmentTrack, setAssessmentTrack] = useState<'professional' | 'student'>('professional');
  const [targetRoleField, setTargetRoleField] = useState('Tech/Software');
  const [currentRole, setCurrentRole] = useState('Software Engineer');
  const [targetIndustry, setTargetIndustry] = useState('saas');
  const [testTrack, setTestTrack] = useState<'full' | 'crisis' | 'cross_functional' | 'governance'>('full');

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const available = STATES_BY_COUNTRY[newCountry] || DEFAULT_STATES;
    setStateRegion(available[0]?.value || 'Central / Capital Region');
  };

  const handleEducationLevelChange = (newLevel: string) => {
    setEducationLevel(newLevel);
    const available = DEGREES_BY_LEVEL[newLevel] || [];
    setDegreeQualification(available[0]?.value || 'Other Qualification');
  };

  const handleTargetRoleFieldChange = (newField: string) => {
    setTargetRoleField(newField);
    const fieldObj = TARGET_ROLE_FIELDS.find((f) => f.value === newField);
    if (fieldObj) {
      setTargetIndustry(fieldObj.industryId);
      setCurrentRole(fieldObj.label);
    }
  };

  const handleCareerStageChange = (newStage: string) => {
    setCareerStage(newStage);
    if (newStage === 'Student') {
      setAssessmentTrack('student');
    } else if (newStage === 'Experienced Professional' || newStage === 'Recent Graduate / Fresher') {
      setAssessmentTrack('professional');
    }
  };

  // Generator Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  // Quick edit popover for simple name change
  const [isEditingCandidate, setIsEditingCandidate] = useState(false);
  const [tempName, setTempName] = useState(candidateName);
  const [tempEmail, setTempEmail] = useState(candidateEmail);

  // Input Mode: 'guided' (4 Fields: Situation, Task, Action, Result) vs 'freeform'
  const [responseMode, setResponseMode] = useState<'guided' | 'freeform'>('guided');

  // Simplification State per question and global toggle
  const [globalSimplify, setGlobalSimplify] = useState(false);
  const [simplifiedMap, setSimplifiedMap] = useState<Record<string, boolean>>({});

  // Answers Map: questionId -> IQuestionResponse (initialized empty so fresh attempts don't have mock answers)
  const [answers, setAnswers] = useState<Record<string, IQuestionResponse>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);
  const [cachedDraft, setCachedDraft] = useState<any>(null);
  const isMountCompleteRef = useRef(false);

  // Online / Offline connectivity listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Check for auto-saved draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('discoveru_assessment_draft_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const answeredCount = Object.values(parsed.answers || {}).filter(
          (a: unknown) => {
            const cast = a as IQuestionResponse | undefined;
            return !!(cast?.selectedOptionId || cast?.writtenRationale?.trim() || cast?.situation?.trim());
          }
        ).length;

        const hasCandidateData = !!(parsed.candidateName && parsed.candidateName.trim());
        const hasStartedFlag = !!parsed.hasStarted;
        const hasProgress = answeredCount > 0 || hasStartedFlag || hasCandidateData;

        if (hasProgress) {
          setCachedDraft(parsed);
          const nameLabel = parsed.candidateName ? `for ${parsed.candidateName}` : '';
          const qLabel = parsed.hasStarted && parsed.currentIdx !== undefined ? `at Question ${parsed.currentIdx + 1}` : '';
          const progressLabel = answeredCount > 0 ? `(${answeredCount} answers recorded)` : '(profile setup saved)';
          setDraftNotice(`Found an unfinished session ${nameLabel} ${qLabel} ${progressLabel}.`);
        }
      }
    } catch {
      // Non-fatal
    }
  }, []);

  // Auto-save candidate responses to localStorage for session crash resilience
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Never auto-save on initial mount — this guarantees existing drafts are never overwritten before checking
    if (!isMountCompleteRef.current) {
      isMountCompleteRef.current = true;
      return;
    }

    // Do not save blank initial default state if candidate hasn't started or typed anything
    const hasAnyAnswer = Object.values(answers || {}).some(
      (a) => !!(a?.selectedOptionId || a?.writtenRationale?.trim() || a?.situation?.trim())
    );
    if (!hasStarted && !candidateName.trim() && !hasAnyAnswer) {
      return;
    }

    try {
      const draft = {
        answers,
        candidateName,
        candidateEmail,
        dob,
        gender,
        country,
        stateRegion,
        educationLevel,
        degreeQualification,
        careerStage,
        workExperience,
        assessmentTrack,
        targetRoleField,
        currentRole,
        customRoleInput,
        targetIndustry,
        testTrack,
        language,
        activeQuestions,
        activeAssessmentId,
        activeRoleTarget,
        currentIdx,
        hasStarted,
        timestamp: Date.now(),
      };
      localStorage.setItem('discoveru_assessment_draft_v1', JSON.stringify(draft));
    } catch {
      // Ignore quota errors
    }
  }, [
    answers,
    candidateName,
    candidateEmail,
    dob,
    gender,
    country,
    stateRegion,
    educationLevel,
    degreeQualification,
    careerStage,
    workExperience,
    assessmentTrack,
    targetRoleField,
    currentRole,
    customRoleInput,
    targetIndustry,
    testTrack,
    language,
    activeQuestions,
    activeAssessmentId,
    activeRoleTarget,
    currentIdx,
    hasStarted,
  ]);

  const handleRestoreDraft = () => {
    try {
      let draftToRestore = cachedDraft;
      if (!draftToRestore && typeof window !== 'undefined') {
        const raw = localStorage.getItem('discoveru_assessment_draft_v1');
        if (raw) {
          draftToRestore = JSON.parse(raw);
        }
      }

      if (draftToRestore) {
        if (draftToRestore.answers && typeof draftToRestore.answers === 'object') {
          setAnswers(draftToRestore.answers);
        }
        if (draftToRestore.candidateName) setCandidateName(draftToRestore.candidateName);
        if (draftToRestore.candidateEmail) setCandidateEmail(draftToRestore.candidateEmail);
        if (draftToRestore.dob) setDob(draftToRestore.dob);
        if (draftToRestore.gender) setGender(draftToRestore.gender);
        if (draftToRestore.country) setCountry(draftToRestore.country);
        if (draftToRestore.stateRegion) setStateRegion(draftToRestore.stateRegion);
        if (draftToRestore.educationLevel) setEducationLevel(draftToRestore.educationLevel);
        if (draftToRestore.degreeQualification) setDegreeQualification(draftToRestore.degreeQualification);
        if (draftToRestore.careerStage) setCareerStage(draftToRestore.careerStage);
        if (draftToRestore.workExperience) setWorkExperience(draftToRestore.workExperience);
        if (draftToRestore.assessmentTrack) setAssessmentTrack(draftToRestore.assessmentTrack);
        if (draftToRestore.targetRoleField) setTargetRoleField(draftToRestore.targetRoleField);
        if (draftToRestore.currentRole) setCurrentRole(draftToRestore.currentRole);
        if (draftToRestore.customRoleInput) setCustomRoleInput(draftToRestore.customRoleInput);
        if (draftToRestore.targetIndustry) setTargetIndustry(draftToRestore.targetIndustry);
        if (draftToRestore.testTrack) setTestTrack(draftToRestore.testTrack);
        if (draftToRestore.language) setLanguage(draftToRestore.language);
        if (Array.isArray(draftToRestore.activeQuestions) && draftToRestore.activeQuestions.length > 0) {
          const cleanedQuestions = draftToRestore.activeQuestions.filter(
            (q: any) => q.questionType !== 'subjective_star' && q.category !== 'star' && !q.questionId?.startsWith('star_')
          );
          setActiveQuestions(cleanedQuestions.length > 0 ? cleanedQuestions : draftToRestore.activeQuestions);
        }
        if (draftToRestore.activeAssessmentId) setActiveAssessmentId(draftToRestore.activeAssessmentId);
        if (draftToRestore.activeRoleTarget) setActiveRoleTarget(draftToRestore.activeRoleTarget);
        if (typeof draftToRestore.currentIdx === 'number' && draftToRestore.currentIdx >= 0) {
          setCurrentIdx(draftToRestore.currentIdx);
        }

        const answeredCount = Object.values(draftToRestore.answers || {}).filter(
          (a: unknown) => {
            const cast = a as IQuestionResponse | undefined;
            return !!(cast?.selectedOptionId || cast?.writtenRationale?.trim() || cast?.situation?.trim());
          }
        ).length;

        // Resume directly into assessment workspace if test was started or answers recorded
        if (draftToRestore.hasStarted || answeredCount > 0) {
          setHasStarted(true);
          const qNum = (typeof draftToRestore.currentIdx === 'number' ? draftToRestore.currentIdx : 0) + 1;
          setGenerationFeedback(`Previous assessment session restored! Resumed at Question ${qNum} (${answeredCount} answers recorded).`);
        } else {
          setHasStarted(false);
          setGenerationFeedback('Candidate profile details restored successfully! Review and continue your assessment.');
        }

        setDraftNotice(null);
        setValidationError(null);
        setTimeout(() => setGenerationFeedback(null), 5000);
      } else {
        setValidationError('No saved draft data found to restore.');
      }
    } catch {
      setValidationError('Could not restore saved draft.');
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('discoveru_assessment_draft_v1');
      setCachedDraft(null);
      setDraftNotice(null);
    } catch {
      // Non-fatal
    }
  };

  // Creative loader insight cycling
  useEffect(() => {
    if (!isGenerating) {
      setCreativeInsightIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setCreativeInsightIdx((prev) => (prev + 1) % CREATIVE_LOADER_INSIGHTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const currentQ = activeQuestions[currentIdx] || activeQuestions[0];
  const localizedContent = currentQ[language] || currentQ.en;
  const isSimplified = globalSimplify || !!simplifiedMap[currentQ.questionId];
  const simplifiedInfo = getSimplifiedQuestionInfo(currentQ, language);

  const toggleSimplify = (qId?: string) => {
    const targetId = qId || currentQ.questionId;
    setSimplifiedMap((prev) => ({
      ...prev,
      [targetId]: !prev[targetId],
    }));
  };

  // Helper to compose full rationale from 4 fields
  const composeRationale = (s: string, t: string, a: string, r: string) => {
    const parts = [];
    if (s.trim()) parts.push(`Situation: ${s.trim()}`);
    if (t.trim()) parts.push(`Task: ${t.trim()}`);
    if (a.trim()) parts.push(`Action: ${a.trim()}`);
    if (r.trim()) parts.push(`Result: ${r.trim()}`);
    return parts.join('\n\n');
  };

  const currentAnswer = answers[currentQ.questionId] || {
    selectedOptionId: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    writtenRationale: '',
  };

  const selectedOptionObj = (localizedContent?.mcqOptions || []).find(
    (opt) => opt.id === currentAnswer.selectedOptionId
  );

  const handleSelectOption = (optionId: string) => {
    setValidationError(null);
    const selectedOpt = (localizedContent?.mcqOptions || []).find((o) => o.id === optionId);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.questionId]: {
        ...(prev[currentQ.questionId] || {
          situation: '',
          task: '',
          action: '',
          result: '',
          writtenRationale: '',
        }),
        selectedOptionId: optionId,
        writtenRationale: prev[currentQ.questionId]?.writtenRationale || '',
      },
    }));
  };

  const handleFieldChange = (field: 'situation' | 'task' | 'action' | 'result', value: string) => {
    setValidationError(null);
    setAnswers((prev) => {
      const existing = prev[currentQ.questionId] || {
        selectedOptionId: '',
        situation: '',
        task: '',
        action: '',
        result: '',
        writtenRationale: '',
      };
      const updated = { ...existing, [field]: value };
      const newRationale = composeRationale(updated.situation, updated.task, updated.action, updated.result);
      return {
        ...prev,
        [currentQ.questionId]: {
          ...updated,
          writtenRationale: newRationale,
        },
      };
    });
  };

  const handleFreeformChange = (text: string) => {
    setValidationError(null);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.questionId]: {
        ...(prev[currentQ.questionId] || {
          selectedOptionId: '',
          situation: '',
          task: '',
          action: '',
          result: '',
        }),
        writtenRationale: text,
      },
    }));
  };

  // Generate Tailored Assessment Handler
  const handleGenerateAssessment = async (startTestAfter: boolean = false) => {
    const trimmedName = candidateName.trim();
    if (!trimmedName) {
      setValidationError('Full Name is required and cannot be blank or whitespace only.');
      return;
    }

    if (dob) {
      const selectedDate = new Date(dob);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        setValidationError('Date of Birth cannot be in the future. Please select a valid date.');
        return;
      }
    }

    const emailToUse = candidateEmail.trim() || `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.evalsmart.com`;
    const fieldObj = TARGET_ROLE_FIELDS.find((f) => f.value === targetRoleField);
    const roleToSend = fieldObj?.label || targetRoleField || 'Software Professional';
    const industryToSend = fieldObj?.industryId || targetIndustry || 'saas';

    setIsGenerating(true);
    setValidationError(null);
    setGenerationStep(1);

    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2600);

    try {
      const res = await fetch('/api/assessments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: trimmedName,
          currentRole: roleToSend,
          targetIndustry: industryToSend,
          testTrack,
          language,
          assessmentTrack,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          res.status === 504 || res.status === 502
            ? 'The AI Engine took longer than expected to generate dilemmas. Please click Generate Assessment again.'
            : `Server returned unexpected status ${res.status}. Please try again.`
        );
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setValidationError(data.error || 'Failed to generate tailored questions with DiscoverU AI Engine.');
        return;
      }

      if (data.questions) {
        setGenerationStep(4);
        setActiveQuestions(data.questions);
        setActiveRoleTarget(data.roleTarget);
        setActiveAssessmentId(data.assessmentId);
        setCurrentIdx(0);
        
        // Setup fresh empty answers for the candidate
        const newAnsMap: Record<string, IQuestionResponse> = {};
        data.questions.forEach((q: IDualPaneQuestion) => {
          newAnsMap[q.questionId] = {
            selectedOptionId: '',
            situation: '',
            task: '',
            action: '',
            result: '',
            writtenRationale: '',
          };
        });
        setAnswers(newAnsMap);
        setIsConfigModalOpen(false);

        const indName = INDUSTRY_OPTIONS.find((i) => i.id === targetIndustry)?.name || targetIndustry;
        const feedbackMsg = data.generatedByAi 
          ? `✨ DiscoverU AI Engine synthesized ${data.questions.length} tailored dilemmas for ${roleToSend} in ${indName}!`
          : `Assessment tailored for ${roleToSend} in ${indName}!`;
        setGenerationFeedback(feedbackMsg);
        setTimeout(() => setGenerationFeedback(null), 6000);

        if (startTestAfter) {
          setTimeout(() => {
            setHasStarted(true);
          }, 600);
        }
      } else {
        setValidationError(data.error || 'Failed to generate tailored questions with DiscoverU AI Engine.');
      }
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
    }
  };

  const handleLoadSample = () => {
    const sample = DEFAULT_ANSWERS[currentQ.questionId] || DEFAULT_ANSWERS.q1;
    if (sample) {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.questionId]: { ...sample },
      }));
      setValidationError(null);
    }
  };

  const validateCurrentQuestion = (): boolean => {
    const ans = answers[currentQ.questionId];
    const qType = currentQ.questionType;

    // 1. Likert Scale (OCEAN Big Five: 30 Questions)
    if (qType === 'likert') {
      if (!ans?.selectedOptionId) {
        setValidationError(t.valSelectRating);
        return false;
      }
      if (currentQ.isRationaleRequired) {
        const written = ans?.writtenRationale?.trim() || '';
        if (!written || written.length < 15) {
          setValidationError(t.valMinCharsWritten);
          return false;
        }
      }
      setValidationError(null);
      return true;
    }

    // 2. Subjective STAR (4 Questions on ONE scenario)
    if (qType === 'subjective_star') {
      const written =
        ans?.writtenRationale?.trim() ||
        composeRationale(ans?.situation || '', ans?.task || '', ans?.action || '', ans?.result || '');
      if (!written || written.length < 15) {
        setValidationError(t.valMinCharsStar);
        return false;
      }
      setValidationError(null);
      return true;
    }

    // 3. Option-Based with Optional Explanation (MBTI + Holland: 16 Questions)
    if (qType === 'option_explain') {
      if (!ans?.selectedOptionId) {
        setValidationError(t.valSelectChoice);
        return false;
      }
      // Explanation is explicitly NOT mandatory
      setValidationError(null);
      return true;
    }

    // 4. Classical Dual-Pane MCQ
    if (!ans?.selectedOptionId) {
      setValidationError(t.valStep1Req);
      return false;
    }

    if (responseMode === 'guided') {
      if (!ans.situation?.trim()) {
        setValidationError('Step 2 Required: Please complete field 1 (Situation Context).');
        return false;
      }
      if (!ans.task?.trim()) {
        setValidationError('Step 2 Required: Please complete field 2 (Task Responsibility).');
        return false;
      }
      if (!ans.action?.trim()) {
        setValidationError('Step 2 Required: Please complete field 3 (Action Taken).');
        return false;
      }
      if (!ans.result?.trim()) {
        setValidationError('Step 2 Required: Please complete field 4 (Result & Outcome).');
        return false;
      }
    } else {
      if (!ans.writtenRationale?.trim() || ans.writtenRationale.trim().length < 20) {
        setValidationError(t.valStep2Req);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;
    setCurrentIdx((prev) => Math.min(activeQuestions.length - 1, prev + 1));
  };

  const handleSubmitAssessment = async () => {
    if (!validateCurrentQuestion()) return;
    setIsSubmitting(true);
    setValidationError(null);

    try {
      const payloadAnswers = activeQuestions.map((q) => {
        const a = answers[q.questionId];
        const combined =
          a?.writtenRationale?.trim() ||
          composeRationale(a?.situation || '', a?.task || '', a?.action || '', a?.result || '');

        let selectedOptionId = a?.selectedOptionId || '';
        let writtenRationale = combined || '';

        if (q.questionType === 'subjective_star') {
          selectedOptionId = selectedOptionId || 'STAR';
          writtenRationale = writtenRationale || 'Constructive scenario progression response provided.';
        } else if (q.questionType === 'likert') {
          selectedOptionId = selectedOptionId || '3';
          writtenRationale = writtenRationale || `Likert rating: ${selectedOptionId}/5 on ${q.competencyName}`;
        } else if (q.questionType === 'option_explain') {
          selectedOptionId = selectedOptionId || 'A';
          writtenRationale = writtenRationale || (a?.writtenRationale ? a.writtenRationale.trim() : 'Balanced choice selected.');
        } else {
          selectedOptionId = selectedOptionId || 'B';
          writtenRationale = writtenRationale || 'Evidence provided across situation, task, action, and result dimensions.';
        }

        return {
          questionId: q.questionId,
          selectedOptionId,
          writtenRationale,
        };
      });

      const trimmedName = candidateName.trim() || 'Candidate';
      const emailToUse = candidateEmail.trim() || `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.evalsmart.com`;

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: activeAssessmentId,
          candidateName: trimmedName,
          candidateEmail: emailToUse,
          languageSelected: language,
          candidateProfile: {
            dob: dob || undefined,
            gender,
            country,
            stateRegion,
            educationLevel,
            degreeQualification,
            careerStage,
            workExperience,
            targetRoleField,
            assessmentTrack,
          },
          answers: payloadAnswers,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          res.status === 504 || res.status === 502
            ? 'The AI evaluation took longer than expected or the server is busy. Please try submitting again.'
            : `Server returned unexpected response (status ${res.status}). Please try again.`
        );
      }

      const data = await res.json();
      if (res.ok && data.success && data.evaluationId) {
        try {
          localStorage.removeItem('discoveru_assessment_draft_v1');
        } catch {
          // Non-fatal
        }
        router.push(`/candidate?evalId=${data.evaluationId}&lang=${language}`);
      } else {
        const errMsg = data.error || 'Failed to submit evaluation.';
        setSubmissionError(errMsg);
        setValidationError(errMsg);
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Submission failed due to a network or server issue.';
      setSubmissionError(errMsg);
      setValidationError(errMsg);
      setIsSubmitting(false);
    }
  };

  const isLastQuestion = currentIdx === activeQuestions.length - 1;
  const wordCount = (currentAnswer.writtenRationale || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const fieldGuides = {
    situation: {
      label: language === 'hi' ? '1. परिस्थिति (Situation)' : language === 'kn' ? '1. ಸನ್ನಿವೇಶ (Situation)' : '1. Situation Context',
      question:
        language === 'hi'
          ? 'आपके अनुभव में क्या हो रहा था? परिस्थिति को चुनौतीपूर्ण किसने बनाया?'
          : language === 'kn'
          ? 'ನೀವು ವಿವರಿಸುತ್ತಿರುವ ಅನುಭವದಲ್ಲಿ ಏನಾಗುತ್ತಿತ್ತು? ಸನ್ನಿವೇಶವು ಸವಾಲಾಗಿರಲು ಕಾರಣವೇನು?'
          : 'What was happening in the scenario? What constraints or challenges were present?',
      placeholder:
        language === 'hi'
          ? 'संदर्भ और स्थिति का वर्णन करें...'
          : language === 'kn'
          ? 'ಸನ್ನಿವೇಶ ಮತ್ತು ಸಂದರ್ಭವನ್ನು ವಿವರಿಸಿ...'
          : 'Describe the context, timeline pressure, and what was at stake...',
    },
    task: {
      label: language === 'hi' ? '2. जिम्मेदारी (Task)' : language === 'kn' ? '2. ಜವಾಬ್ದಾರಿ (Task)' : '2. Your Responsibility',
      question:
        language === 'hi'
          ? 'आप किस बात के लिए जिम्मेदार थे, और क्या हासिल किया जाना था?'
          : language === 'kn'
          ? 'ನಿಮ್ಮ ಜವಾಬ್ದಾರಿ ಏನಾಗಿತ್ತು, ಮತ್ತು ಏನನ್ನು ಸಾಧಿಸಬೇಕಾಗಿತ್ತು?'
          : 'What were you personally responsible for achieving or protecting?',
      placeholder:
        language === 'hi'
          ? 'अपनी जिम्मेदारी और लक्ष्य स्पष्ट करें...'
          : language === 'kn'
          ? 'ನಿಮ್ಮ ಜವಾಬ್ದಾರಿ ಮತ್ತು ಗುರಿಯನ್ನು ವಿವರಿಸಿ...'
          : 'Explain your specific role, goal, and decision criteria...',
    },
    action: {
      label: language === 'hi' ? '3. कार्रवाई (Action)' : language === 'kn' ? '3. ಕ್ರಮ (Action)' : '3. Action Taken',
      question:
        language === 'hi'
          ? 'आपने व्यक्तिगत रूप से क्या किया? उठाए गए कदम और कारण बताएं...'
          : language === 'kn'
          ? 'ನೀವು ವೈಯಕ್ತಿಕವಾಗಿ ಏನು ಮಾಡಿದಿರಿ? ತೆಗೆದುಕೊಂಡ ಕ್ರಮಗಳು ಮತ್ತು ಕಾರಣಗಳನ್ನು ವಿವರಿಸಿ...'
          : 'What specific steps did you personally execute? Why did you choose this route?',
      placeholder:
        language === 'hi'
          ? 'अपनी व्यक्तिगत कार्रवाई और तर्क का विवरण दें...'
          : language === 'kn'
          ? 'ನಿಮ್ಮ ಕ್ರಮಗಳು ಮತ್ತು ನಿರ್ಧಾರದ ಕಾರಣಗಳನ್ನು ಬರೆಯಿರಿ...'
          : 'Detail the concrete steps, communication, and mitigation applied...',
    },
    result: {
      label: language === 'hi' ? '4. परिणाम और सीख (Result)' : language === 'kn' ? '4. ಫಲಿತಾಂಶ (Result)' : '4. Outcome & Learning',
      question:
        language === 'hi'
          ? 'अंत में क्या हुआ? परिणाम क्या रहा और आपने क्या सीखा?'
          : language === 'kn'
          ? 'ಕೊನೆಯಲ್ಲಿ ಏನಾಯಿತು? ಫಲಿತಾಂಶವೇನು ಮತ್ತು ನೀವು ಏನು ಕಲಿತಿರಿ?'
          : 'What was the immediate and long-term result? What did you learn?',
      placeholder:
        language === 'hi'
          ? 'परिणाम, प्रभाव या जो कुछ आपने सीखा उसे लिखें...'
          : language === 'kn'
          ? 'ಫಲಿತಾಂಶ ಮತ್ತು ನಿಮ್ಮ ಕಲಿಕೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...'
          : 'Describe the outcome, system impact, and lasting takeaway...',
    },
  };

  const currentScenarioText = isSimplified
    ? simplifiedInfo.scenarioSummary || SIMPLIFIED_SCENARIOS[currentQ.questionId]?.[language] || localizedContent.scenario
    : localizedContent.scenario;

  const answeredCount = activeQuestions.filter((q) => {
    const a = answers[q.questionId];
    if (q.questionType === 'likert') {
      return !!a?.selectedOptionId;
    }
    if (q.questionType === 'subjective_star') {
      return !!(a?.writtenRationale?.trim() || a?.situation?.trim() || a?.task?.trim() || a?.action?.trim() || a?.result?.trim());
    }
    if (q.questionType === 'option_explain') {
      return !!a?.selectedOptionId;
    }
    return !!(a?.selectedOptionId && (a.situation || a.writtenRationale));
  }).length;

  const currentIndustryObj = INDUSTRY_OPTIONS.find((i) => i.id === targetIndustry) || INDUSTRY_OPTIONS[0];

  if (!hasStarted) {
    const resolvedRole = currentRole === 'custom' ? (customRoleInput.trim() || 'Software Professional') : currentRole;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans">
        {/* If isGenerating, show high-tech dynamic generation screen */}
        {isGenerating ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-2xl text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95">
            {/* DiscoverU Logo with Animated Aura */}
            <div className="relative w-24 h-24 mx-auto mb-5">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[var(--ulipsu-indigo)] via-purple-600 to-[var(--ulipsu-amber)] animate-spin blur-md opacity-60"></div>
              <div className="relative w-full h-full rounded-3xl bg-white flex items-center justify-center border-2 border-indigo-100 shadow-xl p-3">
                <Image
                  src="/logo-icon.png"
                  alt="DiscoverU"
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* AI Engine is running Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-4 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>AI Engine is running</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mb-2 tracking-tight">
              Synthesizing Your Assessment
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Tailoring situational dilemmas for <span className="font-semibold text-gray-900">{resolvedRole}</span> targeting <span className="font-semibold text-gray-900">{currentIndustryObj.name}</span>.
            </p>

            {/* Creative Rotating Insight Card */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-amber-50/40 border border-indigo-100/90 text-left shadow-xs transition-all duration-500">
              <div className="flex items-start gap-3.5">
                <span className="text-2xl select-none shrink-0 p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
                  {CREATIVE_LOADER_INSIGHTS[creativeInsightIdx].icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-950 truncate">
                      {CREATIVE_LOADER_INSIGHTS[creativeInsightIdx].title}
                    </h4>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full font-bold shrink-0">
                      Phase {creativeInsightIdx + 1}/{CREATIVE_LOADER_INSIGHTS.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed min-h-[36px]">
                    {CREATIVE_LOADER_INSIGHTS[creativeInsightIdx].detail}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Animated Gradient Progress Shimmer */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-[var(--ulipsu-indigo)] via-purple-600 to-[var(--ulipsu-amber)] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(96, Math.max(20, (creativeInsightIdx + 1) * 16.6))}%` }}
              ></div>
            </div>

            {/* Step Progress Checklist */}
            <div className="space-y-3 text-left max-w-md mx-auto bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${generationStep > 1 ? 'bg-emerald-500 text-white' : generationStep === 1 ? 'bg-[var(--ulipsu-indigo)] text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                  {generationStep > 1 ? '✓' : '1'}
                </div>
                <span className={`text-xs ${generationStep >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  AI Engine initialized &amp; establishing context parameters
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${generationStep > 2 ? 'bg-emerald-500 text-white' : generationStep === 2 ? 'bg-[var(--ulipsu-indigo)] text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                  {generationStep > 2 ? '✓' : '2'}
                </div>
                <span className={`text-xs ${generationStep >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  Synthesizing {currentIndustryObj.name} challenges &amp; edge cases
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${generationStep > 3 ? 'bg-emerald-500 text-white' : generationStep === 3 ? 'bg-[var(--ulipsu-indigo)] text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                  {generationStep > 3 ? '✓' : '3'}
                </div>
                <span className={`text-xs ${generationStep >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  Structuring assessment evaluation criteria across {language.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${generationStep === 4 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {generationStep === 4 ? '✓' : '4'}
                </div>
                <span className={`text-xs ${generationStep === 4 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                  Calibrating behavioral scoring thresholds &amp; finalizing test room
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>DiscoverU AI Engine is synthesizing multi-perspective dilemma pool...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[var(--ulipsu-amber)]" />
                    {t.onboardingBadge}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {t.langNeutralScoring}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ulipsu-charcoal)]">
                  {t.profileSetupTitle}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                  {t.profileSetupDesc}
                </p>
              </div>

              {/* Language Switcher & Prefill Demo Profile Button */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <div className="inline-flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200 shadow-2xs">
                  {(['en', 'hi', 'kn'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        language === l
                          ? 'bg-white text-[var(--ulipsu-indigo)] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCandidateName('Rahul Verma');
                    setCandidateEmail('rahul.verma@example.com');
                    setDob('1998-05-15');
                    setGender('Male');
                    setCountry('India');
                    setStateRegion('Karnataka');
                    setEducationLevel('Undergraduate');
                    setDegreeQualification('B.Tech / B.E.');
                    setCareerStage('Recent Graduate / Fresher');
                    setWorkExperience('0-1 years');
                    setLanguage('en');
                    setTargetRoleField('Tech/Software');
                    setTargetIndustry('saas');
                    setCurrentRole('Software Engineer');
                    setValidationError(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Populate sample demo profile in 1 click"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.prefillBtn}</span>
                </button>
              </div>
            </div>

            {/* Draft Found Banner */}
            {draftNotice && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium">{draftNotice}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRestoreDraft}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    {t.restoreDraftBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscardDraft}
                    className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold text-xs cursor-pointer"
                  >
                    {t.startFreshBtn}
                  </button>
                </div>
              </div>
            )}

            {/* Validation Error Alert */}
            {validationError && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Profile Form Sections */}
            <div className="mt-8 space-y-7">
              {/* SECTION 1: Personal Details */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {t.sec1Title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name (Required, trimmed) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.fullName} <span className="text-red-500">*</span>
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.fullNameHint}</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => {
                          setCandidateName(e.target.value);
                          setValidationError(null);
                        }}
                        placeholder={t.fullNamePlaceholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Candidate Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.email}
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.emailHint}</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={candidateEmail}
                        onChange={(e) => {
                          setCandidateEmail(e.target.value);
                          setValidationError(null);
                        }}
                        placeholder={t.emailPlaceholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                      />
                    </div>
                  </div>

                  {/* Date of Birth (Optional, reject future dates) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.dob}
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.dobHint}</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Gender (Optional: Prefer not to say / Female / Male / Non-binary) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.gender}
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.genderHint}</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Geographic Location (Restricted to India) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {t.sec2Title}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {t.indiaOnlyBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country (Fixed / Restricted to India) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.country} <span className="text-red-500">*</span>
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.countryHint}</span>
                    </label>
                    <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white shadow-xs text-xs sm:text-sm text-gray-900 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base select-none">🇮🇳</span>
                        <span className="font-semibold text-gray-950">India</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        {t.indiaOnlyBadge}
                      </span>
                    </div>
                  </div>

                  {/* State / Union Territory (Searchable dropdown across all 28 states & 8 UTs, Default: Karnataka) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.stateUt} <span className="text-red-500">*</span>
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.stateUtHint}</span>
                    </label>
                    <SearchableSelect
                      options={INDIAN_STATES}
                      value={stateRegion}
                      onChange={setStateRegion}
                      placeholder={t.statePlaceholder}
                      icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Education & Qualification (Dynamic Dropdowns) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {t.sec3Title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Education Level (Dropdown) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.educationLevel} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => handleEducationLevelChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer"
                    >
                      {EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl.value} value={lvl.value}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Degree / Qualification (Dynamic based on Education Level) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.degreeQualification} <span className="text-red-500">*</span>
                      <span className="text-[10px] text-indigo-600 ml-1 font-normal">({educationLevel})</span>
                    </label>
                    <select
                      value={degreeQualification}
                      onChange={(e) => setDegreeQualification(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer"
                    >
                      {(DEGREES_BY_LEVEL[educationLevel] || []).map((deg) => (
                        <option key={deg.value} value={deg.value}>
                          {deg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Work Experience & Career Stage */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {t.sec4Title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Career Stage */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.careerStage} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={careerStage}
                      onChange={(e) => handleCareerStageChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer"
                    >
                      {CAREER_STAGES.map((cs) => (
                        <option key={cs.value} value={cs.value}>
                          {cs.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.workExperience} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={workExperience}
                      onChange={(e) => setWorkExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer"
                    >
                      {WORK_EXPERIENCES.map((we) => (
                        <option key={we.value} value={we.value}>
                          {we.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Assessment Track & Methodology Selection */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                      5
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {t.sec5Title}
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {t.sec5Subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Working Professional */}
                  <div
                    onClick={() => setAssessmentTrack('professional')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      assessmentTrack === 'professional'
                        ? 'border-[var(--ulipsu-indigo)] bg-gradient-to-b from-indigo-50/70 to-white shadow-sm ring-1 ring-[var(--ulipsu-indigo)]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-indigo-100/80 flex items-center justify-center text-lg shadow-2xs">
                            💼
                          </span>
                          <h3 className="text-sm font-bold text-gray-900">
                            {t.professionalTrackTitle}
                          </h3>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                            assessmentTrack === 'professional'
                              ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                              : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {assessmentTrack === 'professional' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </div>

                      {/* Clean structured items without verbose detailing */}
                      <div className="space-y-2 mt-3.5">
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                          <span className="leading-snug">
                            {t.professionalTrackQ1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="leading-snug">
                            {t.professionalTrackQ2}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-indigo-950 bg-indigo-100/70 px-3 py-1.5 rounded-xl">
                      <span>Total: 30 Questions</span>
                      <span className="text-indigo-700 font-medium">{t.professionalTrackBadge}</span>
                    </div>
                  </div>

                  {/* Option 2: Student Track */}
                  <div
                    onClick={() => setAssessmentTrack('student')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      assessmentTrack === 'student'
                        ? 'border-[var(--ulipsu-indigo)] bg-gradient-to-b from-indigo-50/70 to-white shadow-sm ring-1 ring-[var(--ulipsu-indigo)]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center text-lg shadow-2xs">
                            🎓
                          </span>
                          <h3 className="text-sm font-bold text-gray-900">
                            {t.studentTrackTitle}
                          </h3>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                            assessmentTrack === 'student'
                              ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                              : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {assessmentTrack === 'student' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </div>

                      {/* Clean structured items without verbose detailing */}
                      <div className="space-y-2 mt-3.5">
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"></span>
                          <span className="leading-snug">
                            {t.studentTrackQ1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/60 text-xs text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                          <span className="leading-snug">
                            {t.studentTrackQ2}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-emerald-950 bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                      <span>Total: 16 Questions</span>
                      <span className="text-emerald-700 font-medium">{t.studentTrackBadge}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Target Role & Assessment Language */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white text-xs font-bold flex items-center justify-center">
                    6
                  </div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {t.sec6Title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Role / Career Field (Searchable dropdown) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.targetRoleLabel} <span className="text-red-500">*</span>
                      <span className="text-[10px] text-gray-400 ml-1 font-normal">{t.targetRoleHint}</span>
                    </label>
                    <SearchableSelect
                      options={TARGET_ROLE_FIELDS}
                      value={targetRoleField}
                      onChange={handleTargetRoleFieldChange}
                      placeholder={t.targetRolePlaceholder}
                      icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                    />
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      {TARGET_ROLE_FIELDS.find((f) => f.value === targetRoleField)?.description}
                    </p>
                  </div>

                  {/* Preferred Assessment Language (Dropdown) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.langLabel} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'kn')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 bg-white cursor-pointer font-medium"
                    >
                      {ASSESSMENT_LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label} ({lang.sublabel})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.langGuaranteed}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT & GENERATE ACTION */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--ulipsu-amber)] shrink-0" />
                  <span>{t.aiFooterNote}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateAssessment(true)}
                  disabled={isGenerating}
                  className="px-8 py-3.5 rounded-xl bg-[var(--ulipsu-indigo)] hover:bg-[var(--ulipsu-indigo-hover)] text-white text-sm font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[var(--ulipsu-amber)]" />
                  <span>{isGenerating ? t.generatingBtn : t.generateBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* ================= SUCCESS BANNER WHEN RE-GENERATED ================= */}
      {generationFeedback && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{generationFeedback}</span>
          </div>
          <button onClick={() => setGenerationFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= DRAFT NOTICE IN ASSESSMENT WORKSPACE ================= */}
      {draftNotice && (
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">{draftNotice}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Restore Progress
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold text-xs cursor-pointer"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* ================= OFFLINE WARNING BANNER ================= */}
      {isOffline && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You are currently offline. Your responses are auto-saved in this browser. Please reconnect to the internet before final submission.</span>
        </div>
      )}

      {/* ================= SUBMISSION ERROR BANNER WITH RETRY ================= */}
      {submissionError && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-950">Submission Could Not Complete</p>
              <p className="text-xs text-rose-800 font-normal mt-0.5">{submissionError}</p>
              <p className="text-[11px] text-emerald-800 font-medium mt-1">✓ All your answers remain saved safely in this session. You can retry submission now.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmitAssessment}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Retrying...' : 'Retry Submission'}</span>
          </button>
        </div>
      )}

      {/* ================= TOP NAVIGATION / CONTEXT BAR ================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)]">
                {t.dualPaneBadge}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {t.langNeutralScoring}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[var(--ulipsu-indigo)] border border-indigo-200">
                Industry: {currentIndustryObj.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--ulipsu-charcoal)]">
              {activeRoleTarget}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Personalized Scenarios &amp; Behavioral Rationale • Answer both panes for complete evaluation
            </p>
          </div>

          {/* Right controls: Return to Setup + Customize Test Button + Candidate Badge + Language Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Return to Setup Form Button */}
            <button
              type="button"
              onClick={() => setHasStarted(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Return to Assessment Onboarding Setup Form"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
              <span>{t.setupFormBtn}</span>
            </button>

            {/* Customizer Launcher Button */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Change your background, target industry, or choose test track"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
              <span>{t.customizeBtn}</span>
            </button>

            {/* Candidate Info Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setTempName(candidateName);
                  setTempEmail(candidateEmail);
                  setIsEditingCandidate(!isEditingCandidate);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs transition cursor-pointer"
                title="Click to edit candidate profile"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--ulipsu-indigo)] text-white flex items-center justify-center font-bold text-[10px]">
                  {candidateName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 leading-none">{candidateName}</div>
                  <div className="text-[10px] text-gray-500 leading-none mt-0.5">{currentRole}</div>
                </div>
                <Edit3 className="w-3 h-3 text-gray-400 ml-1" />
              </button>

              {/* Candidate Quick Edit Popover */}
              {isEditingCandidate && (
                <div className="absolute right-0 top-11 z-30 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">Edit Candidate Details</span>
                    <button
                      onClick={() => setIsEditingCandidate(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (tempName.trim()) setCandidateName(tempName.trim());
                        if (tempEmail.trim()) setCandidateEmail(tempEmail.trim());
                        setIsEditingCandidate(false);
                      }}
                      className="w-full mt-2 py-1.5 bg-[var(--ulipsu-indigo)] text-white font-semibold rounded-lg hover:bg-[var(--ulipsu-indigo-hover)] transition"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Global Simplify Toggle */}
            <button
              type="button"
              onClick={() => setGlobalSimplify(!globalSimplify)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                globalSimplify
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs ring-2 ring-amber-400/30'
                  : 'bg-white text-gray-700 hover:text-amber-900 border-gray-200 hover:bg-amber-50/60'
              }`}
              title="Toggle plain language / simplified version for all questions"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${globalSimplify ? 'text-amber-600 fill-amber-500' : 'text-amber-500'}`} />
              <span>{globalSimplify ? t.simplifiedActive : t.simplifyBtn}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl p-1 text-xs">
              {(['en', 'hi', 'kn'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    language === l
                      ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Stepper & Progress */}
        <div className="mt-5 space-y-3">
          {/* Section Part Switcher Tabs (if multi-part) */}
          {(() => {
            const part1Questions = activeQuestions.filter((q) => q.questionType === 'likert' || q.category === 'ocean');
            const part2Questions = activeQuestions.filter((q) => q.questionType === 'subjective_star' || q.category === 'star');
            const hasMultipleParts = part1Questions.length > 0 && part2Questions.length > 0;
            const currentPart = (currentQ.questionType === 'subjective_star' || currentQ.category === 'star') ? 2 : 1;

            return (
              <>
                {hasMultipleParts && (
                  <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setValidationError(null);
                        const firstP1 = activeQuestions.findIndex((q) => q.questionType === 'likert' || q.category === 'ocean');
                        if (firstP1 !== -1) setCurrentIdx(firstP1);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        currentPart === 1
                          ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span>{t.part1Tab}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        currentPart === 1 ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {part1Questions.length} Questions
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValidationError(null);
                        const firstP2 = activeQuestions.findIndex((q) => q.questionType === 'subjective_star' || q.category === 'star');
                        if (firstP2 !== -1) setCurrentIdx(firstP2);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        currentPart === 2
                          ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span>{t.part2Tab}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        currentPart === 2 ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {part2Questions.length} Phases
                      </span>
                    </button>
                  </div>
                )}

                {/* Progress Header & Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      {t.questionProgress} {currentIdx + 1}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      {t.of} {activeQuestions.length}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[var(--ulipsu-indigo)] border border-indigo-100">
                      {hasMultipleParts
                        ? (currentPart === 1
                            ? (language === 'hi' ? 'कार्यस्थल व्यवहार' : language === 'kn' ? 'ಕೆಲಸದ ಶೈಲಿ' : 'Workplace Behavioral Style')
                            : `Situational Dilemma Case Study • Phase ${(currentIdx - part1Questions.length) + 1} of ${part2Questions.length}`)
                        : (language === 'hi' ? 'कार्यस्थल व्यवहार मूल्यांकन' : language === 'kn' ? 'ಕೆಲಸದ ಶೈಲಿ ಮೌಲ್ಯಮಾಪನ' : 'Workplace Behavioral Assessment')}
                    </span>
                    {currentQ.isRationaleRequired && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        <PenTool className="w-3 h-3 text-amber-600" />
                        {t.writtenReqBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                      <strong className="text-gray-900">{answeredCount}</strong> of {activeQuestions.length} completed ({Math.round((answeredCount / activeQuestions.length) * 100)}%)
                    </span>
                    <div className="w-28 sm:w-36 bg-gray-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-200">
                      <div
                        className="bg-gradient-to-r from-[var(--ulipsu-indigo)] to-[var(--ulipsu-amber)] h-full rounded-full transition-all duration-300"
                        style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Question Stepper Track */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-200">
                    {activeQuestions.map((q, idx) => {
                      const ans = answers[q.questionId];
                      let isAnswered = false;
                      if (q.questionType === 'likert') {
                        isAnswered = q.isRationaleRequired
                          ? !!(ans?.selectedOptionId && ans?.writtenRationale?.trim() && ans.writtenRationale.trim().length >= 15)
                          : !!ans?.selectedOptionId;
                      } else if (q.questionType === 'subjective_star') {
                        isAnswered = !!(ans?.writtenRationale?.trim() || ans?.situation?.trim() || ans?.task?.trim() || ans?.action?.trim() || ans?.result?.trim());
                      } else if (q.questionType === 'option_explain') {
                        isAnswered = !!ans?.selectedOptionId;
                      } else {
                        isAnswered = !!(ans?.selectedOptionId && (ans.situation || ans.writtenRationale));
                      }
                      const isCurrent = idx === currentIdx;

                      return (
                        <button
                          key={q.questionId}
                          onClick={() => {
                            setValidationError(null);
                            setCurrentIdx(idx);
                          }}
                          title={`Question ${idx + 1}${q.isRationaleRequired ? ' (Written rationale required)' : ''}${isAnswered ? ' (Answered)' : ''}`}
                          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                            isCurrent
                              ? 'bg-[var(--ulipsu-indigo)] text-white shadow-md ring-2 ring-[var(--ulipsu-indigo)]/30 scale-105 font-extrabold z-10'
                              : isAnswered
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 font-medium'
                          }`}
                        >
                          <span>{idx + 1}</span>

                          {/* Written requirement dot */}
                          {q.isRationaleRequired && (
                            <span
                              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                isAnswered ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              title="Written justification required"
                            />
                          )}

                          {/* Completed checkmark */}
                          {isAnswered && !isCurrent && (
                            <Check className="w-2.5 h-2.5 text-emerald-600 absolute bottom-0.5 right-0.5" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Dynamic Workflow Guidance Banner */}
        <div className="mt-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[var(--ulipsu-amber)] shrink-0" />
            <span className="leading-relaxed">
              {currentQ.questionType === 'likert' ? (
                currentQ.isRationaleRequired ? (
                  language === 'hi' ? (
                    <><strong>कार्यशैली एवं उदाहरण:</strong> 1 से 5 के पैमाने पर अपनी रेटिंग चुनें, और अपनी पसंद को स्पष्ट करने वाला एक संक्षिप्त वास्तविक उदाहरण (कम से कम 15 अक्षर) लिखें।</>
                  ) : language === 'kn' ? (
                    <><strong>ಕೆಲಸದ ಶೈಲಿ ಮತ್ತು ನೈಜ ಉದಾಹರಣೆ:</strong> 1 ರಿಂದ 5 ರವರೆಗೆ ನಿಮ್ಮ ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ, ಮತ್ತು ನಿಮ್ಮ ಆಯ್ಕೆಯನ್ನು ಬೆಂಬಲಿಸುವ ಸಂಕ್ಷಿಪ್ತ ಉದಾಹರಣೆಯನ್ನು (ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು) ಬರೆಯಿರಿ.</>
                  ) : (
                    <><strong>Workplace Style + Real Example:</strong> Rate from 1 (Strongly Disagree) to 5 (Strongly Agree). Please also describe a brief real-world incident or reason (minimum 15 characters).</>
                  )
                ) : (
                  language === 'hi' ? (
                    <><strong>कार्यशैली मूल्यांकन:</strong> चुनें कि यह कथन आपके स्वाभाविक कार्य करने के तरीके को कितना दर्शाता है (1 = पूरी तरह असहमत से 5 = पूरी तरह सहमत)। सिंगल टैप से उत्तर सुरक्षित होता है।</>
                  ) : language === 'kn' ? (
                    <><strong>ಕೆಲಸದ ಶೈಲಿ ಮೌಲ್ಯಮಾಪನ:</strong> ಈ ಹೇಳಿಕೆಯು ನಿಮ್ಮ ನೈಸರ್ಗಿಕ ವಿಧಾನವನ್ನು ಹೇಗೆ ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ರೇಟ್ ಮಾಡಿ (1 = ಬಲವಾಗಿ ಒಪ್ಪುವುದಿಲ್ಲ ನಿಂದ 5 = ಬಲವಾಗಿ ಒಪ್ಪುತ್ತೇನೆ)।</>
                  ) : (
                    <><strong>Workplace Behavioral Style:</strong> Rate how well each statement reflects your natural approach (1 = Strongly Disagree to 5 = Strongly Agree). Single tap progresses your response.</>
                  )
                )
              ) : currentQ.questionType === 'subjective_star' ? (
                language === 'hi' ? (
                  <><strong>व्यावहारिक केस स्टडी:</strong> कार्यस्थल परिदृश्य को ध्यान से पढ़ें और इस चरण के लिए अपनी विशिष्ट रणनीति या दृष्टिकोण साझा करें।</>
                ) : language === 'kn' ? (
                  <><strong>ಪ್ರಾಯೋಗಿಕ ಕೇಸ್ ಸ್ಟಡಿ:</strong> ಕೆಲಸದ ಸನ್ನಿವೇಶವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ ಮತ್ತು ಈ ಹಂತಕ್ಕೆ ನಿಮ್ಮ ಪರಿಹಾರ ವಿಧಾನವನ್ನು ವಿವರಿಸಿ.</>
                ) : (
                  <><strong>Situational Case Study:</strong> Review the workplace dilemma above and explain your specific approach for this sequential phase.</>
                )
              ) : currentQ.questionType === 'option_explain' ? (
                language === 'hi' ? (
                  <><strong>विकल्प-आधारित निर्णय:</strong> अपनी प्राथमिकता चुनें। दाईं ओर का विवरण बॉक्स ऐच्छिक (वैकल्पिक) है।</>
                ) : language === 'kn' ? (
                  <><strong>ಆಯ್ಕೆ-ಆಧಾರಿತ ಮೌಲ್ಯಮಾಪನ:</strong> ನಿಮ್ಮ ಆದ್ಯತೆಯ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ. ಬಲಭಾಗದಲ್ಲಿರುವ ವಿವರಣೆಯ ಬಾಕ್ಸ್ ಐಚ್ಛಿಕವಾಗಿರುತ್ತದೆ.</>
                ) : (
                  <><strong>Decision Assessment:</strong> Select your preferred choice. The explanation box on the right is optional.</>
                )
              ) : (
                <><strong>Two-Step Assessment:</strong> Select your action option on the left, then describe your reasoning or a past experience on the right.</>
              )}
            </span>
          </div>
          {currentQ.questionType !== 'likert' && currentQ.questionType !== 'subjective_star' && (
            <button
              type="button"
              onClick={handleLoadSample}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--ulipsu-indigo)] hover:text-indigo-800 hover:underline cursor-pointer shrink-0 ml-4"
              title="Load sample answer for this question"
            >
              <Sparkles className="w-3 h-3 text-[var(--ulipsu-amber)]" />
              <span>Reset Demo Answer</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= WORKSPACE (TAILORED BY QUESTION TYPE) ================= */}

      {/* 1. LIKERT SCALE WORKSPACE (Part 1: Workplace Style) */}
      {currentQ.questionType === 'likert' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--ulipsu-indigo)] text-white font-extrabold text-xs tracking-wider">
                {t.questionProgress.toUpperCase()} {currentIdx + 1}
              </span>
              {currentQ.isRationaleRequired && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <PenTool className="w-3 h-3 text-amber-700" />
                  {t.writtenReqBadge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSimplify(currentQ.questionId)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  isSimplified
                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border-gray-200'
                }`}
                title="Explain question in plain, simple everyday words"
              >
                <Lightbulb className={`w-3.5 h-3.5 ${isSimplified ? 'text-amber-600 fill-amber-500' : 'text-amber-500'}`} />
                <span>{isSimplified ? (language === 'hi' ? 'मानक दृश्य' : language === 'kn' ? 'ಸಾಮಾನ್ಯ ನೋಟ' : 'Standard View') : (language === 'hi' ? 'सरल भाषा' : language === 'kn' ? 'ಸರಳ ಭಾಷೆ' : 'Simplify Question')}</span>
              </button>
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                {language === 'hi' ? 'सिंगल-टैप रेटिंग' : language === 'kn' ? 'ಸಿಂಗಲ್-ಟ್ಯಾಪ್ ರೇಟಿಂಗ್' : 'Single-tap rating'}
              </span>
            </div>
          </div>

          {/* Simplified Question Helper Banner */}
          {isSimplified && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 fill-amber-500" />
              <div>
                <span className="font-bold block text-amber-950 text-xs mb-0.5">
                  {simplifiedInfo.scenarioTitle}
                </span>
                <p className="text-amber-900 font-medium">
                  {simplifiedInfo.scenarioSummary}
                </p>
              </div>
            </div>
          )}

          {/* Statement Box */}
          <div className="my-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 border border-slate-200/90 shadow-xs text-center relative">
            <span className="text-[11px] font-bold text-[var(--ulipsu-indigo)] uppercase tracking-widest block mb-2">
              {t.statementLabel}
            </span>
            <p className="text-xl sm:text-2xl font-semibold text-gray-950 leading-relaxed max-w-2xl mx-auto">
              "{currentScenarioText}"
            </p>
          </div>

          {/* 5-Point Likert Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600 px-1">
              <span>{t.selectRating}</span>
              {currentAnswer.selectedOptionId && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t.ratingRecorded}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {(localizedContent.mcqOptions || []).map((opt) => {
                const isSelected = currentAnswer.selectedOptionId === opt.id;
                const colors = [
                  { bg: 'hover:bg-rose-50 border-rose-200', active: 'border-rose-500 bg-rose-50/90 ring-2 ring-rose-500/20 text-rose-950 shadow-xs' },
                  { bg: 'hover:bg-orange-50 border-orange-200', active: 'border-orange-500 bg-orange-50/90 ring-2 ring-orange-500/20 text-orange-950 shadow-xs' },
                  { bg: 'hover:bg-slate-50 border-slate-200', active: 'border-slate-500 bg-slate-100 ring-2 ring-slate-500/20 text-slate-950 shadow-xs' },
                  { bg: 'hover:bg-indigo-50 border-indigo-200', active: 'border-indigo-500 bg-indigo-50/90 ring-2 ring-indigo-500/20 text-indigo-950 shadow-xs' },
                  { bg: 'hover:bg-emerald-50 border-emerald-200', active: 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs' },
                ];
                const colorScheme = colors[Number(opt.id) - 1] || colors[2];

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center min-h-[120px] cursor-pointer ${
                      isSelected ? colorScheme.active : `border-gray-200 bg-white ${colorScheme.bg}`
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm mb-2 transition ${
                      isSelected ? 'bg-gray-900 text-white shadow-xs' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {opt.id}
                    </div>
                    <span className={`text-xs leading-snug ${isSelected ? 'font-bold' : 'font-medium text-gray-700'}`}>
                      {opt.text}
                    </span>
                    {simplifiedInfo.simplifiedOptions?.[opt.id] && (
                      <span className="mt-1 text-[11px] text-gray-500 font-normal leading-tight">
                        ({simplifiedInfo.simplifiedOptions[opt.id]})
                      </span>
                    )}
                    {isSelected && (
                      <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {language === 'hi' ? 'चयनित' : language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ' : 'Selected'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Behavioral Reasoning & Justification */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900">
                  {localizedContent?.writtenPrompt || t.step2Required}
                </span>
                {currentQ.isRationaleRequired ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-200">
                    {t.requiredBadge}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                    {t.optionalBadge}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500">
                {currentQ.isRationaleRequired
                  ? t.mandatoryMinChars
                  : t.optionalContext}
              </span>
            </div>

            <textarea
              rows={3}
              value={currentAnswer.writtenRationale || ''}
              onChange={(e) => handleFreeformChange(e.target.value)}
              placeholder={
                localizedContent?.writtenPlaceholder ||
                (currentQ.isRationaleRequired
                  ? (language === 'hi'
                    ? 'संक्षेप में एक विशिष्ट वास्तविक घटना या पूर्व स्थिति का वर्णन करें जो यह दर्शाती है कि आपने यह रेटिंग क्यों चुनी (उदा. क्या हुआ, आपने क्या कदम उठाया, और क्या परिणाम रहा)...'
                    : language === 'kn'
                    ? 'ನೀವು ಈ ರೇಟಿಂಗ್ ಅನ್ನು ಏಕೆ ಆರಿಸಿದ್ದೀರಿ ಎಂಬುದನ್ನು ತೋರಿಸುವ ನಿರ್ದಿಷ್ಟ ನೈಜ ಘಟನೆ ಅಥವಾ ಹಿಂದಿನ ಸನ್ನಿವೇಶವನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ವಿವರಿಸಿ (ಉದಾ. ಏನಾಯಿತು, ನೀವು ಯಾವ ಕ್ರಮ ಕೈಗೊಂಡಿದ್ದೀರಿ, ಮತ್ತು ಫಲಿತಾಂಶವೇನು)...'
                    : 'Briefly describe a specific real-world incident or past situation that demonstrates why you chose this rating (e.g. what happened, what action you took, and the outcome)...')
                  : (language === 'hi'
                    ? 'अपनी रेटिंग के समर्थन में कोई संक्षिप्त वास्तविक उदाहरण या संदर्भ साझा करें (ऐच्छिक)...'
                    : language === 'kn'
                    ? 'ನಿಮ್ಮ ರೇಟಿಂಗ್ ಅನ್ನು ಬೆಂಬಲಿಸುವ ಯಾವುದೇ ಸಂಕ್ಷಿಪ್ತ ನೈಜ ಉದಾಹರಣೆ ಅಥವಾ ಸನ್ನಿವೇಶವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ (ಐಚ್ಛಿಕ)...'
                    : 'Share any brief real-life example or context supporting your rating (optional)...'))
              }
              className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition resize-none ${
                currentQ.isRationaleRequired && (!currentAnswer.writtenRationale || currentAnswer.writtenRationale.trim().length < 15)
                  ? 'border-amber-300 bg-amber-50/20 focus:border-amber-500 focus:ring-amber-400/20'
                  : 'border-gray-200 bg-white focus:border-[var(--ulipsu-indigo)] focus:ring-[var(--ulipsu-indigo)]/20'
              }`}
            />

            <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
              <span>
                {currentQ.isRationaleRequired && (
                  <span className={(!currentAnswer.writtenRationale || currentAnswer.writtenRationale.trim().length < 15) ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold flex items-center gap-1 inline-flex'}>
                    {(!currentAnswer.writtenRationale || currentAnswer.writtenRationale.trim().length < 15) ? (
                      language === 'hi'
                        ? `कम से कम 15 अक्षर आवश्यक (${currentAnswer.writtenRationale?.trim().length || 0}/15)`
                        : language === 'kn'
                        ? `ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು ಅಗತ್ಯವಿದೆ (${currentAnswer.writtenRationale?.trim().length || 0}/15)`
                        : `Minimum 15 characters needed (${currentAnswer.writtenRationale?.trim().length || 0}/15)`
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {language === 'hi'
                          ? `औचित्य आवश्यकता पूरी हुई (${currentAnswer.writtenRationale?.trim().length || 0} अक्षर)`
                          : language === 'kn'
                          ? `ಸಮರ್ಥನೆ ಪೂರ್ಣಗೊಂಡಿದೆ (${currentAnswer.writtenRationale?.trim().length || 0} ಅಕ್ಷರಗಳು)`
                          : `Justification requirement met (${currentAnswer.writtenRationale?.trim().length || 0} chars)`}
                      </>
                    )}
                  </span>
                )}
              </span>
              <span>
                {currentAnswer.writtenRationale ? `${currentAnswer.writtenRationale.length} ${language === 'hi' ? 'अक्षर' : language === 'kn' ? 'ಅಕ್ಷರಗಳು' : 'characters'}` : ''}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{language === 'hi' ? 'कार्यस्थल व्यवहार मूल्यांकन' : language === 'kn' ? 'ಕೆಲಸದ ಸ್ಥಳದ ನಡವಳಿಕೆ ಮೌಲ್ಯಮಾಪನ' : 'Workplace Behavioral Assessment'}</span>
            <span>{t.questionProgress} {currentIdx + 1} {t.of} {activeQuestions.length}</span>
          </div>
        </div>
      )}

      {/* 2. SITUATIONAL CASE STUDY WORKSPACE (Part 2: 4 Sequential Phases) */}
      {currentQ.questionType === 'subjective_star' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--ulipsu-amber)] text-gray-950 font-extrabold text-xs tracking-wider">
                {t.questionProgress.toUpperCase()} {currentIdx + 1}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                {language === 'hi'
                  ? `चरण ${((currentIdx - 30) % 4) + 1} / 4`
                  : language === 'kn'
                  ? `ಹಂತ ${((currentIdx - 30) % 4) + 1} / 4`
                  : `Phase ${((currentIdx - 30) % 4) + 1} of 4`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSimplify(currentQ.questionId)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  isSimplified
                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border-gray-200'
                }`}
                title="Explain incident and question in plain, simple everyday words"
              >
                <Lightbulb className={`w-3.5 h-3.5 ${isSimplified ? 'text-amber-600 fill-amber-500' : 'text-amber-500'}`} />
                <span>{isSimplified ? (language === 'hi' ? 'मानक दृश्य' : language === 'kn' ? 'ಸಾಮಾನ್ಯ ನೋಟ' : 'Standard View') : (language === 'hi' ? 'सरल भाषा' : language === 'kn' ? 'ಸರಳ ಭಾಷೆ' : 'Simplify / In Simple Words')}</span>
              </button>
              <span className="text-xs font-medium text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-md hidden sm:inline">
                {language === 'hi' ? '1 संकट परिदृश्य • 4 क्रमिक चरण' : language === 'kn' ? '1 ಬಿಕ್ಕಟ್ಟಿನ ಸನ್ನಿವೇಶ • 4 ಅನುಕ್ರಮ ಹಂತಗಳು' : '1 Incident Scenario • 4 Sequential Phases'}
              </span>
            </div>
          </div>

          {/* Incident Scenario Card (Shared across 4 phases) */}
          <div className={`my-5 p-5 sm:p-6 rounded-2xl border transition ${
            isSimplified ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[var(--ulipsu-indigo)]" />
                <span>
                  {isSimplified ? simplifiedInfo.scenarioTitle : (language === 'hi' ? 'वास्तविक कार्यस्थल परिदृश्य संदर्भ:' : language === 'kn' ? 'ನೈಜ ಕೆಲಸದ ಸ್ಥಳದ ಸನ್ನಿವೇಶದ ಹಿನ್ನೆಲೆ:' : 'Real-World Workplace Scenario Context:')}
                </span>
              </div>
              {isSimplified && (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                  {language === 'hi' ? 'सरल भाषा संदर्भ' : language === 'kn' ? 'ಸರಳ ಭಾಷಾ ಹಿನ್ನೆಲೆ' : 'Plain Language Context'}
                </span>
              )}
            </div>
            <p className="text-gray-900 text-xs sm:text-sm leading-relaxed">
              {currentScenarioText}
            </p>
          </div>

          {/* Phase Prompt Card */}
          <div className={`p-5 rounded-xl border mb-4 transition ${
            isSimplified ? 'bg-amber-50/50 border-amber-200' : 'bg-indigo-50/70 border-indigo-100'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--ulipsu-indigo)] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
                <span>
                  {isSimplified && simplifiedInfo.subjectivePromptTitle
                    ? simplifiedInfo.subjectivePromptTitle
                    : (localizedContent.title || (language === 'hi' ? 'परिदृश्य प्रतिक्रिया' : language === 'kn' ? 'ಸನ್ನಿವೇಶ ಪ್ರತಿಕ್ರಿಯೆ' : 'Scenario Response'))}
                </span>
              </div>
              {isSimplified && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {language === 'hi' ? 'सरल मार्गदर्शन' : language === 'kn' ? 'ಸರಳ ಮಾರ್ಗದರ್ಶನ' : 'Plain Guidance'}
                </span>
              )}
            </div>
            <p className="text-gray-900 text-sm font-semibold leading-relaxed">
              {isSimplified && simplifiedInfo.subjectivePromptGuide
                ? simplifiedInfo.subjectivePromptGuide
                : (localizedContent.writtenPrompt || currentScenarioText)}
            </p>

            {/* Helpful Guiding Questions */}
            {isSimplified && simplifiedInfo.helpfulQuestions && simplifiedInfo.helpfulQuestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-amber-200/70">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{language === 'hi' ? 'अपने उत्तर में शामिल करने योग्य मुख्य बिंदु:' : language === 'kn' ? 'ನಿಮ್ಮ ಉತ್ತರದಲ್ಲಿ ಒಳಗೊಂಡಿರಬೇಕಾದ ಮುಖ್ಯ ಅಂಶಗಳು:' : 'Key questions to cover in your response:'}</span>
                </span>
                <ul className="space-y-1.5 text-xs text-gray-800 list-disc list-inside">
                  {simplifiedInfo.helpfulQuestions.map((hq, i) => (
                    <li key={i} className="leading-snug">{hq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Subjective Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              {language === 'hi' ? 'इस चरण के लिए आपका लिखित उत्तर:' : language === 'kn' ? 'ಈ ಹಂತಕ್ಕಾಗಿ ನಿಮ್ಮ ಲಿಖಿತ ಪ್ರತಿಕ್ರಿಯೆ:' : 'Your Written Response for this Phase:'}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              value={currentAnswer.writtenRationale}
              onChange={(e) => handleFreeformChange(e.target.value)}
              placeholder={localizedContent.writtenPlaceholder || (language === 'hi' ? 'इस चरण के लिए अपने ठोस कदम, निर्णय तर्क और प्राथमिकताओं का विवरण दें...' : language === 'kn' ? 'ಈ ಹಂತಕ್ಕಾಗಿ ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಕ್ರಮಗಳು ಮತ್ತು ತಾರ್ಕಿಕ ವಿವರಣೆಯನ್ನು ಬರೆಯಿರಿ...' : 'Detail your concrete steps, decision logic, and trade-offs for this phase...')}
              rows={8}
              className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-900 placeholder-gray-400 resize-none transition leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{language === 'hi' ? 'कम से कम 15 अक्षर आवश्यक' : language === 'kn' ? 'ಕನಿಷ್ಠ 15 ಅಕ್ಷರಗಳು ಅಗತ್ಯವಿದೆ' : 'Minimum 15 characters required'}</span>
              </div>
              <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                wordCount >= 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {wordCount} words written
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. STUDENT OPTION-BASED WORKSPACE WITH OPTIONAL EXPLANATION (MBTI + Holland: 16 Questions) */}
      {currentQ.questionType === 'option_explain' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Subtle Balanced Options */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 flex flex-col min-h-[560px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--ulipsu-indigo)] text-white font-extrabold text-xs tracking-wider">
                  {t.questionProgress.toUpperCase()} {currentIdx + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSimplify(currentQ.questionId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    isSimplified
                      ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border-gray-200'
                  }`}
                  title="Explain choices in plain, simple everyday words"
                >
                  <Lightbulb className={`w-3.5 h-3.5 ${isSimplified ? 'text-amber-600 fill-amber-500' : 'text-amber-500'}`} />
                  <span>{isSimplified ? 'Standard' : 'Simplify'}</span>
                </button>
                <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">Select your natural tendency</span>
              </div>
            </div>

            {/* Dilemma Prompt */}
            <div className={`my-4 p-4 rounded-xl border transition ${
              isSimplified ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              {isSimplified && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{simplifiedInfo.scenarioTitle}</span>
                </div>
              )}
              <p className="text-gray-900 text-sm font-medium leading-relaxed">
                {currentScenarioText}
              </p>
            </div>

            {/* Balanced Options List */}
            <div className="space-y-3 flex-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Which option resonates most with you?
              </span>

              {(localizedContent.mcqOptions || []).map((opt) => {
                const isSelected = currentAnswer.selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-[var(--ulipsu-indigo)] bg-indigo-50/50 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        isSelected
                          ? 'border-2 border-[var(--ulipsu-indigo)] bg-[var(--ulipsu-indigo)] shadow-xs'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isSelected ? 'font-semibold text-gray-950' : 'text-gray-700 font-normal'
                      }`}>
                        {opt.text}
                      </p>
                      {simplifiedInfo.simplifiedOptions?.[opt.id] && (
                        <p className="text-[11px] text-gray-500 mt-1 font-normal italic">
                          💡 {simplifiedInfo.simplifiedOptions[opt.id]}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="shrink-0 text-[var(--ulipsu-indigo)] font-bold text-xs flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[var(--ulipsu-indigo)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>{language === 'hi' ? 'प्राथमिकता मूल्यांकन' : language === 'kn' ? 'ಆದ್ಯತೆ ಮೌಲ್ಯಮಾಪನ' : 'Preference Assessment'}</span>
              <span>{t.questionProgress} {currentIdx + 1} {t.of} {activeQuestions.length}</span>
            </div>
          </div>

          {/* Right Column: Optional Explanation Box */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 flex flex-col min-h-[560px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs tracking-wider">
                  PERSPECTIVE
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Optional Rationale
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Not Mandatory
              </span>
            </div>

            <div className="my-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>Explain your choice (Optional):</span>
              </div>
              <p className="text-emerald-900/90 font-normal">
                {isSimplified && simplifiedInfo.subjectivePromptGuide
                  ? simplifiedInfo.subjectivePromptGuide
                  : 'You can write a short note explaining why this option fits you better, or simply leave this blank and move forward. Your choice alone is fully valid.'}
              </p>
            </div>

            <div className="flex-1 flex flex-col">
              <textarea
                value={currentAnswer.writtenRationale}
                onChange={(e) => handleFreeformChange(e.target.value)}
                placeholder={localizedContent.writtenPlaceholder || 'Optional: Briefly share why you chose this option...'}
                rows={12}
                className="w-full flex-1 p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs sm:text-sm text-gray-800 placeholder-gray-400 resize-none transition leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px]">Autosaved</span>
              </div>
              <span className="text-[11px] text-gray-500">
                {wordCount > 0 ? `${wordCount} words (Optional)` : 'Optional - can be left blank'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLASSICAL DUAL-PANE WORKSPACE (Fallback for other tracks) */}
      {(!currentQ.questionType || currentQ.questionType === 'mcq_dual') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT PANE: STEP 1 */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 flex flex-col min-h-[640px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--ulipsu-indigo)] text-white font-extrabold text-xs tracking-wide">
                  STEP 1
                </span>
                <div>
                  <h2 className="font-bold text-gray-950 text-base leading-tight">
                    Choose Your Decision
                  </h2>
                  <p className="text-[11px] text-gray-500">Pick the action that best matches your instinct</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--ulipsu-amber-light)] text-[var(--ulipsu-amber-hover)]">
                {t.questionProgress} {currentIdx + 1}
              </span>
            </div>

            <div className="my-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-sm leading-relaxed">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800 uppercase tracking-wide">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                  <span>Workplace Scenario {currentIdx + 1}:</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSimplifiedMap((prev) => ({
                      ...prev,
                      [currentQ.questionId]: !prev[currentQ.questionId],
                    }))
                  }
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    isSimplified
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-white text-gray-700 hover:text-[var(--ulipsu-indigo)] border-gray-200 hover:border-gray-300'
                  }`}
                  title="Toggle plain language scenario without any score penalty"
                >
                  {isSimplified ? (
                    <>
                      <RotateCcw className="w-3 h-3 text-amber-700" />
                      <span>Original Text</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-[var(--ulipsu-amber)]" />
                      <span>Simplify Scenario</span>
                    </>
                  )}
                </button>
              </div>

              {isSimplified && (
                <div className="mb-2.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Plain Language Mode Active • No score penalty • Identical evaluation criteria</span>
                </div>
              )}

              <p className="text-gray-900 text-sm leading-relaxed font-normal">
                {currentScenarioText}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Which option would you choose?
                </span>
                {currentAnswer.selectedOptionId && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Option Selected
                  </span>
                )}
              </div>

              {(localizedContent.mcqOptions || []).map((opt) => {
                const isSelected = currentAnswer.selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'border-[var(--ulipsu-indigo)] bg-indigo-50/50 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        isSelected
                          ? 'border-2 border-[var(--ulipsu-indigo)] bg-[var(--ulipsu-indigo)] shadow-xs'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isSelected ? 'font-semibold text-gray-950' : 'text-gray-700 font-normal'
                        }`}
                      >
                        {opt.text}
                      </p>
                      {simplifiedInfo.simplifiedOptions?.[opt.id] && (
                        <p className="text-[11px] text-gray-500 mt-1 font-normal italic">
                          💡 {simplifiedInfo.simplifiedOptions[opt.id]}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="shrink-0 text-[var(--ulipsu-indigo)] font-bold text-xs flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[var(--ulipsu-indigo)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>{language === 'hi' ? 'व्यावहारिक परिदृश्य' : language === 'kn' ? 'ಪ್ರಾಯೋಗಿಕ ಸನ್ನಿವೇಶ' : 'Practical Scenario'}</span>
              <span>{t.questionProgress} {currentIdx + 1} {t.of} {activeQuestions.length}</span>
            </div>
          </div>

          {/* RIGHT PANE: STEP 2 */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 flex flex-col min-h-[640px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--ulipsu-amber)] text-gray-950 font-extrabold text-xs tracking-wide">
                  STEP 2
                </span>
                <div>
                  <h2 className="font-bold text-gray-950 text-base leading-tight">
                    Explain Your Approach
                  </h2>
                  <p className="text-[11px] text-gray-500">Provide evidence from your reasoning or past experience</p>
                </div>
              </div>

              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
                <button
                  type="button"
                  onClick={() => setResponseMode('guided')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer ${
                    responseMode === 'guided'
                      ? 'bg-white text-[var(--ulipsu-indigo)] shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Structured 4-step guided response"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Guided 4 Steps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResponseMode('freeform')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer ${
                    responseMode === 'freeform'
                      ? 'bg-white text-[var(--ulipsu-indigo)] shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Open single box response"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Single Box</span>
                </button>
              </div>
            </div>

            <div className="my-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
              {selectedOptionObj ? (
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
                    <span>Connecting to your Step 1 choice: Option {selectedOptionObj.id}</span>
                  </div>
                  <p className="text-amber-900 font-normal">
                    {isSimplified && simplifiedInfo.subjectivePromptGuide
                      ? simplifiedInfo.subjectivePromptGuide
                      : `Explain why Option ${selectedOptionObj.id} was your choice, or describe a real project/work situation where you faced a similar challenge in ${currentIndustryObj.name}.`}
                  </p>
                </div>
              ) : (
                <div className="text-gray-600 italic">
                  {isSimplified && simplifiedInfo.subjectivePromptGuide
                    ? simplifiedInfo.subjectivePromptGuide
                    : 'Tip: Choose an option in Step 1 on the left first. Then justify your reasoning or share a past experience here.'}
                </div>
              )}
            </div>

            {responseMode === 'guided' ? (
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      {fieldGuides.situation.label}
                    </label>
                    <span className="text-[10px] text-gray-500">Context &amp; Challenge</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2 leading-tight">
                    {fieldGuides.situation.question}
                  </p>
                  <textarea
                    value={currentAnswer.situation || ''}
                    onChange={(e) => handleFieldChange('situation', e.target.value)}
                    placeholder={fieldGuides.situation.placeholder}
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-800 placeholder-gray-400 resize-none transition"
                  />
                </div>

                <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      {fieldGuides.task.label}
                    </label>
                    <span className="text-[10px] text-gray-500">Role &amp; Responsibility</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2 leading-tight">
                    {fieldGuides.task.question}
                  </p>
                  <textarea
                    value={currentAnswer.task || ''}
                    onChange={(e) => handleFieldChange('task', e.target.value)}
                    placeholder={fieldGuides.task.placeholder}
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-800 placeholder-gray-400 resize-none transition"
                  />
                </div>

                <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      {fieldGuides.action.label}
                    </label>
                    <span className="text-[10px] text-gray-500">Steps Personally Executed</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2 leading-tight">
                    {fieldGuides.action.question}
                  </p>
                  <textarea
                    value={currentAnswer.action || ''}
                    onChange={(e) => handleFieldChange('action', e.target.value)}
                    placeholder={fieldGuides.action.placeholder}
                    rows={3}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-800 placeholder-gray-400 resize-none transition"
                  />
                </div>

                <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      {fieldGuides.result.label}
                    </label>
                    <span className="text-[10px] text-gray-500">Outcome &amp; Lasting Impact</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2 leading-tight">
                    {fieldGuides.result.question}
                  </p>
                  <textarea
                    value={currentAnswer.result || ''}
                    onChange={(e) => handleFieldChange('result', e.target.value)}
                    placeholder={fieldGuides.result.placeholder}
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-800 placeholder-gray-400 resize-none transition"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold text-gray-800 mb-1">
                  Your Complete Rationale &amp; Experience:
                </label>
                <textarea
                  value={currentAnswer.writtenRationale}
                  onChange={(e) => handleFreeformChange(e.target.value)}
                  placeholder={localizedContent.writtenPlaceholder}
                  rows={14}
                  className="w-full flex-1 p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs sm:text-sm text-gray-800 placeholder-gray-400 resize-none transition-all leading-relaxed"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px]">Draft autosaved</span>
              </div>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                  wordCount > 30 ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {wordCount} words written
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= UNIFIED BOTTOM NAVIGATION BAR ================= */}
      <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Previous Button */}
        <div>
          <button
            onClick={() => {
              setValidationError(null);
              setCurrentIdx((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentIdx === 0}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.prevBtn}
          </button>
        </div>

        {/* Center: Validation Callout or Helpful Indicator */}
        <div className="flex-1 max-w-xl text-center">
          {validationError ? (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-center gap-2 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{validationError}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {t.questionProgress} {currentIdx + 1} {t.of} {activeQuestions.length} • {t.nextOrSubmitHint}
            </div>
          )}
        </div>

        {/* Right: Next or Submit Button */}
        <div>
          {isLastQuestion ? (
            <button
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[var(--ulipsu-amber)] text-gray-950 hover:bg-[var(--ulipsu-amber-hover)] shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  {t.evaluatingBtn}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t.submitBtn}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] shadow-md shadow-indigo-900/20 flex items-center gap-1.5 cursor-pointer"
            >
              {t.nextBtn}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ================= CUSTOMIZE ASSESSMENT ONBOARDING MODAL ================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
                  <span>Dynamic AI Assessment Generator</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Configure Your Assessment
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Provide your details, background &amp; target industry to generate tailored real-world dilemmas.
                </p>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 py-5">
              {/* 1. Candidate Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                  1. Candidate Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. rahul.verma@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] text-xs text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 2. What are you doing? (Current Background) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                  2. What are you currently doing?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ROLE_OPTIONS.map((r) => {
                    const isSelected = currentRole === r.id;
                    const IconComponent = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setCurrentRole(r.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          isSelected
                            ? 'border-[var(--ulipsu-indigo)] bg-indigo-50/60 ring-1 ring-[var(--ulipsu-indigo)] text-[var(--ulipsu-indigo)] font-bold'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--ulipsu-indigo)]' : 'text-gray-500'}`} />
                        <span className="text-xs">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Which industry do you want to work in? */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                  3. Which industry do you want to work in?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INDUSTRY_OPTIONS.map((ind) => {
                    const isSelected = targetIndustry === ind.id;
                    const IconComponent = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setTargetIndustry(ind.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-[var(--ulipsu-indigo)] bg-indigo-50/60 ring-2 ring-[var(--ulipsu-indigo)]/20'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[var(--ulipsu-indigo)] font-bold' : 'text-gray-500'}`} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-gray-950' : 'text-gray-800'}`}>
                            {ind.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {ind.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Choose Test Track */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                  4. Which test track do you want to take?
                </h3>
                <div className="space-y-2">
                  {TEST_TRACKS.map((t) => {
                    const isSelected = testTrack === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTestTrack(t.id as 'full' | 'crisis' | 'cross_functional' | 'governance')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[var(--ulipsu-amber)] bg-amber-50/60 ring-1 ring-[var(--ulipsu-amber)]'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{t.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
                              {t.questionsCount}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{t.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${isSelected ? 'bg-[var(--ulipsu-amber)] text-gray-950 font-bold' : 'border border-gray-300'}`}>
                          {isSelected && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfigModalOpen(false);
                    setHasStarted(false);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  Exit to Setup
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateAssessment(false)}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-[var(--ulipsu-indigo)] hover:bg-[var(--ulipsu-indigo-hover)] text-white text-xs font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Tailoring {targetIndustry} Dilemmas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[var(--ulipsu-amber)]" />
                    <span>Generate Tailored Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
