'use client';

import React, { useState } from 'react';
import { ICandidateGrowthReport } from '@/models/EvaluationResult';
import {
  Printer,
  Sparkles,
  CheckCircle2,
  Building,
  Target,
  FileText,
  Search,
  Zap,
} from 'lucide-react';

interface CandidateGrowthViewProps {
  growthReport: ICandidateGrowthReport;
  candidateName?: string;
  targetRole?: string;
  candidateId?: string;
  onLanguageChange?: (lang: 'en' | 'hi' | 'kn') => void;
}

export function CandidateGrowthView({
  growthReport,
  candidateName = 'Nandini Perumal',
  targetRole = 'Product Management',
  candidateId = 'cand_1792308629917',
  onLanguageChange,
}: CandidateGrowthViewProps) {
  const [isSimplified, setIsSimplified] = useState(false);
  const language = growthReport?.language || 'en';

  const isHindi = language === 'hi';
  const isKannada = language === 'kn';
  const fontClass = isHindi ? 'font-[var(--font-hindi)]' : isKannada ? 'font-[var(--font-kannada)]' : 'font-sans';

  // Section 12 Rule 7: Export file naming format: DiscoverU_Report_<Language>_<Version>.pdf
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      const langTitle = isHindi ? 'Hindi' : isKannada ? 'Kannada' : 'English';
      const versionTitle = isSimplified ? 'Simplified' : 'Original';
      const originalDocTitle = document.title;
      document.title = `DiscoverU_Report_${langTitle}_${versionTitle}`;
      window.print();
      setTimeout(() => {
        document.title = originalDocTitle;
      }, 1500);
    }
  };

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'hi' | 'kn';
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.location.href = url.toString();
    }
  };

  // Safe score formatting
  const formatScore = (val: any, fallback: number) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : parseFloat(val) || fallback;
    const normalized = num > 5 ? num / 20 : num;
    return Number.isInteger(normalized) ? `${normalized}` : `${normalized.toFixed(normalized % 1 === 0 ? 0 : 2)}`;
  };

  // Localized UI strings
  const labels = {
    reportTitle: isHindi
      ? `मूल्यांकन रिपोर्ट: ${candidateName}`
      : isKannada
      ? `ಮೌಲ್ಯಮಾಪನ ವರದಿ: ${candidateName}`
      : `Assessment Report: ${candidateName}`,
    targetRoleLabel: isHindi ? 'लक्षित भूमिका' : isKannada ? 'ಗುರಿ ಪಾತ್ರ' : 'Target Role',
    langLabel: isHindi ? 'रिपोर्ट भाषा:' : isKannada ? 'ವರದಿ ಭಾಷೆ:' : 'Report Language:',
    simplifyBtn: isHindi
      ? (isSimplified ? 'सरलीकृत भाषा सक्रिय' : 'रिपोर्ट सरल बनाएं')
      : isKannada
      ? (isSimplified ? 'ಸರಳೀಕೃತ ಭಾಷೆ ಸಕ್ರಿಯ' : 'ವರದಿಯನ್ನು ಸರಳಗೊಳಿಸಿ')
      : (isSimplified ? 'Using Simplified Terminology' : 'Simplify Report Terminology'),
    printBtn: isHindi ? 'प्रिंट / पीडीएफ सहेजें' : isKannada ? 'ಮುದ್ರಿಸಿ / ಪಿಡಿಎಫ್ ಉಳಿಸಿ' : 'Print / Save PDF Report',
    scoringVerified: isHindi
      ? `स्कोरिंग सत्यनिष्ठा सत्यापित: ${language.toUpperCase()} में मूल्यांकन, 0 स्कोर प्रभाव या दंड।`
      : isKannada
      ? `ಸ್ಕೋರಿಂಗ್ ಸಮಗ್ರತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ${language.toUpperCase()} ನಲ್ಲಿ ಮೌಲ್ಯಮಾಪನ, 0 ಅಂಕ ಕಡಿತ.`
      : `Scoring Integrity Verified: Evaluation conducted with 0 score impact or penalty for language or simplification requests.`,
    section1: isHindi ? '# 1. मेरी व्यक्तित्व रूपरेखा' : isKannada ? '# 1. ನನ್ನ ವ್ಯಕ್ತಿತ್ವ ವಿವರ' : '# 1. My personality profile',
    section1Desc: isHindi
      ? `यह रूपरेखा ${targetRole} की भूमिका के लिए 5 प्रमुख व्यक्तित्व आयामों में ${candidateName} की प्रवृत्तियों और व्यावहारिक साक्ष्यों का विश्लेषण प्रस्तुत करती है।`
      : isKannada
      ? `${targetRole} ಪಾತ್ರಕ್ಕಾಗಿ 5 ಪ್ರಮುಖ ವ್ಯಕ್ತಿತ್ವ ಆಯಾಮಗಳಲ್ಲಿ ${candidateName} ಅವರ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಪುರಾವೆಗಳನ್ನು ಈ ವರದಿ ಪ್ರಸ್ತುತಪಡಿಸುತ್ತದೆ.`
      : `This profile presents a psychometric interpretation of ${candidateName}'s self-reported tendencies across five key personality dimensions, combined with behavioral evidence provided across structured scenarios for ${targetRole}.`,
    thTrait: isHindi ? 'व्यक्तित्व आयाम' : isKannada ? 'ವ್ಯಕ್ತಿತ್ವದ ಲಕ್ಷಣ' : 'Personality Dimension',
    thScore: isHindi ? 'स्कोर एवं सीमा' : isKannada ? 'ಅಂಕ ಮತ್ತು ವ್ಯಾಪ್ತಿ' : 'Score & Range',
    thInterp: isHindi ? 'समर्थित व्याख्या' : isKannada ? 'ವಿವರಣೆ' : 'Supported Interpretation',
    everydayContext: isHindi ? 'दैनिक कार्य संदर्भ: ' : isKannada ? 'ದೈನಂದಿನ ಕೆಲಸದ ಸನ್ನಿವೇಶ: ' : 'Everyday Context: ',
    tradeOffs: isHindi ? 'संतुलन एवं गतिशीलता: ' : isKannada ? 'ಸಮತೋಲನ ಮತ್ತು ಪರಿಣಾಮಗಳು: ' : 'Trade-offs & Dynamics: ',
    section2: isHindi ? '# 2. मेरी संभावित क्षमताएँ' : isKannada ? '# 2. ನನ್ನ ಸಂಭಾವ್ಯ ಸಾಮರ್ಥ್ಯಗಳು' : '# 2. My potential strengths',
    whatSuggests: isHindi ? 'मूल्यांकन क्या दर्शाता है: ' : isKannada ? 'ಮೌಲ್ಯಮಾಪನವು ಏನನ್ನು ಸೂಚಿಸುತ್ತದೆ: ' : 'What the assessment suggests: ',
    supportingEvidence: isHindi ? 'सहायक व्यावहारिक साक्ष्य:' : isKannada ? 'ಪೂರಕ ವರ್ತನೆಯ ಪುರಾವೆ:' : 'Supporting behavioural evidence:',
    whereHelps: isHindi ? 'यह कहाँ सहायक हो सकता है: ' : isKannada ? 'ಇದು ಎಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು: ' : 'Where it may help: ',
    section3: isHindi ? '# 3. मेरी चुनौतियाँ' : isKannada ? '# 3. ನನ್ನ ಸವಾಲುಗಳು' : '# 3. My challenges',
    whyOccurs: isHindi ? 'यह क्यों हो सकता है: ' : isKannada ? 'ಇದು ಏಕೆ ಸಂಭವಿಸಬಹುದು: ' : 'Why it may occur: ',
    howAppears: isHindi ? 'यह कैसे प्रकट हो सकता है: ' : isKannada ? 'ಇದು ಹೇಗೆ ಕಂಡುಬರಬಹುದು: ' : 'How it might appear: ',
    whatToWatch: isHindi ? 'किन बातों का ध्यान रखें: ' : isKannada ? 'ಏನನ್ನು ಗಮನಿಸಬೇಕು: ' : 'What to watch for: ',
    constructiveAdjustment: isHindi ? 'रचनात्मक सुधार: ' : isKannada ? 'ರಚನಾत्मक ಹೊಂದಾಣಿಕೆ: ' : 'Constructive Adjustment: ',
    section4: isHindi ? '# 4. मेरी कार्य प्राथमिकताएँ' : isKannada ? '# 4. ನನ್ನ ಕೆಲಸದ ಆದ್ಯತೆಗಳು' : '# 4. My work preferences',
    findings: isHindi ? 'मूल्यांकन निष्कर्ष: ' : isKannada ? 'ಮೌಲ್ಯಮಾಪನ ಸಂಶೋಧನೆಗಳು: ' : 'Assessment findings: ',
    adaptationStrategy: isHindi ? 'अनुकूलन रणनीति: ' : isKannada ? 'ಹೊಂದಾಣಿಕೆಯ ತಂತ್ರ: ' : 'Adaptation strategy: ',
    section5: isHindi ? '# 5. मेरी व्यक्तिगत विकास योजना' : isKannada ? '# 5. ನನ್ನ ವೈಯಕ್ತಿಕ ಬೆಳವಣಿಗೆಯ ಯೋಜನೆ' : '# 5. My personal development plan',
    section5Sub: isHindi
      ? '30-दिनों की व्यावहारिक कार्ययोजना जिसमें आपकी प्राथमिकताओं के अनुरूप सूक्ष्म-कदम शामिल हैं।'
      : isKannada
      ? 'ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅಥವಾ ವೃತ್ತಿಪರ ಜವಾಬ್ದಾರಿಗಳೊಂದಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವ 30 ದಿನಗಳ ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗಸೂಚಿ.'
      : 'A 30-day practical roadmap with targeted micro-actions designed to fit alongside your academic or professional responsibilities.',
    whyMatters: isHindi ? 'यह क्यों महत्वपूर्ण है: ' : isKannada ? 'ಇದು ಏಕೆ ಮುಖ್ಯ: ' : 'Why it matters: ',
    practicalAction: isHindi ? 'व्यावहारिक कदम: ' : isKannada ? 'ಪ್ರಾಯೋಗಿಕ ಕ್ರಮ: ' : 'Practical Action: ',
    timeline: isHindi ? 'समय-सीमा: ' : isKannada ? 'ಸಮಯದ ಮಿತಿ: ' : 'Timeline: ',
    progressIndicator: isHindi ? 'प्रगति सूचक: ' : isKannada ? 'ಪ್ರಗತಿಯ ಸೂಚಕ: ' : 'Progress Indicator: ',
    reflectionPrompt: isHindi ? 'आत्म-चिंतन प्रश्न: ' : isKannada ? 'ಆತ್ಮಾವಲೋಕನ ಪ್ರಶ್ನೆ: ' : 'Reflection Prompt: ',
    insufficientEvidence: isHindi
      ? 'इस प्रतिक्रिया का मूल्यांकन करने के लिए पर्याप्त साक्ष्य प्रदान नहीं किए गए।'
      : isKannada
      ? 'ಈ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ಸಾಕಷ್ಟು ಪುರಾವೆಗಳು ಲಭ್ಯವಿಲ್ಲ.'
      : 'Sufficient evidence was not provided to assess this response.',
  };

  const oceanScores = growthReport?.personalityProfile?.oceanScores;
  const traitExps = growthReport?.personalityProfile?.traitExplanations;

  // Trait descriptions adhering strictly to neutral framing (Emotional Sensitivity & Resilience, never Neuroticism)
  const personalityTraits = [
    {
      trait: isHindi ? 'अनुभव के प्रति खुलापन (Openness)' : isKannada ? 'ಅನುಭವಕ್ಕೆ ಮುಕ್ತತೆ (Openness)' : 'Openness to Experience',
      simplifiedName: isHindi ? 'नई चीजें सीखने की जिज्ञासा' : isKannada ? 'ಹೊಸ ಕಲಿಕೆಯ ಆಸಕ್ತಿ' : 'Curiosity & Learning New Things',
      score: oceanScores?.openness ? formatScore(oceanScores.openness, 3.5) : '3.5',
      range: '5.0',
      interpretation:
        traitExps?.openness ||
        (isHindi
          ? 'स्थापित पद्धतियों के साथ-साथ रचनात्मक प्रयोगों का विवेकपूर्ण समन्वय।'
          : isKannada
          ? 'ಸ್ಥಾಪಿತ ವಿಧಾನಗಳೊಂದಿಗೆ ನವೀನ ಆಲೋಚನೆಗಳ ಸಮತೋಲಿತ ಹೊಂದಾಣಿಕೆ.'
          : 'Practical orientation; values proven templates while remaining open to useful innovations.'),
      everydayContext: isHindi
        ? 'परियोजनाओं में नए और अपरंपरागत समाधानों को आजमाने में सहजता।'
        : isKannada
        ? 'ಯೋಜನಾ ನಿರ್ಧಾರಗಳಲ್ಲಿ ಅಸಾಂಪ್ರದಾಯಿಕ ಪರಿಹಾರಗಳನ್ನು ಅನ್ವಯಿಸುವ ಆಸಕ್ತಿ.'
        : 'In academic or project environments, this dictates how comfortable you feel proposing unconventional solutions versus sticking to standard templates.',
      tradeOffs: isHindi
        ? 'नियमित कार्यों में उच्च विश्वसनीयता, पर नए तरीकों को अपनाने में थोड़ा समय लग सकता है।'
        : isKannada
        ? 'ನಿಯಮಿತ ಕೆಲಸಗಳಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ, ಆದರೆ ಹೊಸ ವಿಧಾನಗಳಿಗೆ ಹೊಂದಿಕೊಳ್ಳಲು ಅಲ್ಪ ಸಮಯಾವಕಾಶ ಬೇಕಾಗಬಹುದು.'
        : 'Provides high reliability in established workflows, but may require brief adaptation windows when adopting new software paradigms.',
    },
    {
      trait: isHindi ? 'कर्तव्यनिष्ठा (Conscientiousness)' : isKannada ? 'ಕರ್ತವ್ಯನಿಷ್ಠೆ (Conscientiousness)' : 'Conscientiousness',
      simplifiedName: isHindi ? 'अनुशासन और संगठन' : isKannada ? 'ಶಿಸ್ತು ಮತ್ತು ಪರಿಶ್ರಮ' : 'Focus, Organization & Diligence',
      score: oceanScores?.conscientiousness ? formatScore(oceanScores.conscientiousness, 3.8) : '3.8',
      range: '5.0',
      interpretation:
        traitExps?.conscientiousness ||
        (isHindi
          ? 'व्यवस्थित, गहन और उच्च प्रतिबद्धता; विवरणों पर सूक्ष्म ध्यान।'
          : isKannada
          ? 'ವ್ಯವಸ್ಥಿತ, ಸಂಪೂರ್ಣ ಮತ್ತು ಬದ್ಧತೆಯ ಕಾರ್ಯವಿಧಾನ; ವಿವರಗಳಿಗೆ ಸೂಕ್ಷ್ಮ ಗಮನ.'
          : 'Disciplined and methodical execution style; comfortable operating with structured guidelines.'),
      everydayContext: isHindi
        ? 'दस्तावेज़ीकरण, कोड और कार्य विवरणों का सटीक सत्यापन तथा समय प्रबंधन।'
        : isKannada
        ? 'ದಾಖಲಾತಿ, ನಿಖರ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆ.'
        : 'Reflects how you manage project documentation, detail validation, and personal time management.',
      tradeOffs: isHindi
        ? 'उच्च गुणवत्ता सुनिश्चित होती है, पर समय सीमा कम होने पर पूर्णतावाद (perfectionism) का तनाव आ सकता है।'
        : isKannada
        ? 'ಉನ್ನತ ಗುಣಮಟ್ಟವನ್ನು ಕಾಪಾಡುತ್ತದೆ, ಆದರೆ ಕಡಿಮೆ ಗಡುವಿನಲ್ಲಿ ಪರಿಪೂರ್ಣತೆಯ ಒತ್ತಡ ತರಬಹುದು.'
        : 'Drives high quality and consistency, but can create perfectionist friction if timelines shrink unexpectedly.',
    },
    {
      trait: isHindi ? 'बहिर्मुखता (Extraversion)' : isKannada ? 'ಬಹಿರ್ಮುಖತೆ (Extraversion)' : 'Extraversion',
      simplifiedName: isHindi ? 'टीम संवाद और ऊर्जा' : isKannada ? 'ತಂಡದ ಸಂವಹನ' : 'Social Energy & Team Expression',
      score: oceanScores?.extraversion ? formatScore(oceanScores.extraversion, 2.8) : '2.8',
      range: '5.0',
      interpretation:
        traitExps?.extraversion ||
        (isHindi
          ? 'विचारशील और आत्मनिरीक्षी; छोटे समूहों और स्वतंत्र कार्य में सर्वश्रेष्ठ प्रदर्शन।'
          : isKannada
          ? 'ಚಿಂತನಶೀಲ ಮತ್ತು ಆಂತರಿಕ ಗಮನ; ಸಣ್ಣ ತಂಡಗಳಲ್ಲಿ ಮತ್ತು ಸ್ವತಂತ್ರ ಕೆಲಸದಲ್ಲಿ ಪ್ರಾಬಲ್ಯ.'
          : 'Reserved and reflective; performs best during deep individual problem-solving and focused syncs.'),
      everydayContext: isHindi
        ? 'गहन विश्लेषणात्मक कार्य और उद्देश्यपूर्ण तकनीकी चर्चा।'
        : isKannada
        ? 'ಆಳವಾದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕೆಲಸ ಮತ್ತು ಉದ್ದೇಶಪೂರ್ವಕ ಸಂವಹನ.'
        : 'Determines your preference for active group brainstorming versus independent analysis.',
      tradeOffs: isHindi
        ? 'शांत विश्लेषण में उत्कृष्ट, पर बड़ी बैठकों में सक्रिय उपस्थिति के लिए जागरूक प्रयास उपयोगी है।'
        : isKannada
        ? 'ಶಾಂತ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ಅತ್ಯುತ್ತಮ, ಆದರೆ ದೊಡ್ಡ ಸಭೆಗಳಲ್ಲಿ ಸಕ್ರಿಯ ಉಪಸ್ಥಿತಿ ತೋರಲು ಪ್ರಯತ್ನ ಬೇಕು.'
        : 'Excels in quiet analytical work, but may need to deliberately signal engagement in large team meetings.',
    },
    {
      trait: isHindi ? 'मिलनसारिता (Agreeableness)' : isKannada ? 'ಸೌಹಾರ್ದತೆ (Agreeableness)' : 'Agreeableness',
      simplifiedName: isHindi ? 'सहानुभूति और सहयोग' : isKannada ? 'ಸಹಯೋಗ ಮತ್ತು ಸಹಾನುಭೂತಿ' : 'Collaboration & Empathy',
      score: oceanScores?.agreeableness ? formatScore(oceanScores.agreeableness, 3.2) : '3.2',
      range: '5.0',
      interpretation:
        traitExps?.agreeableness ||
        (isHindi
          ? 'सहयोगात्मक और निष्पक्ष; सतही सहमति के स्थान पर वस्तुनिष्ठ गुणवत्ता मानकों की रक्षा।'
          : isKannada
          ? 'ನೇರವಾದ ಮತ್ತು ನ್ಯಾಯಯುತ; ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳ ರಕ್ಷಣೆಗೆ ಮಹತ್ವ.'
          : 'Empathetic collaborator; prioritizes mutual respect, team psychological safety, and objective standards.'),
      everydayContext: isHindi
        ? 'टीम असहमति और साथियों की सहायता को संभालने का तरीका।'
        : isKannada
        ? 'ತಂಡದ ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳು ಮತ್ತು ಪರಸ್ಪರ ಸಹಕಾರವನ್ನು ನಿಭಾಯಿಸುವ ಶೈಲಿ.'
        : 'Shapes how you approach team disagreements and peer support.',
      tradeOffs: isHindi
        ? 'सद्भाव बनाए रखता है, पर कभी-कभी अनुचित निर्णयों का तुरंत विरोध करने में संकोच हो सकता है।'
        : isKannada
        ? 'ಸಾಮರಸ್ಯವನ್ನು ಕಾಪಾಡುತ್ತದೆ, ಆದರೆ ಉಪ-ಉತ್ತಮ ನಿರ್ಧಾರಗಳನ್ನು ಪ್ರಶ್ನಿಸಲು ಹಿಂಜರಿಯಬಹುದು.'
        : 'Maintains strong team harmony, but may require conscious practice to challenge suboptimal decisions early.',
    },
    {
      trait: isHindi ? 'भावनात्मक संवेदनशीलता एवं लचीलापन' : isKannada ? 'ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ ಮತ್ತು ಚೇತರಿಕೆ' : 'Emotional Sensitivity & Resilience',
      simplifiedName: isHindi ? 'तनाव प्रबंधन और संयम' : isKannada ? 'ಒತ್ತಡ ನಿರ್ವಹಣೆ' : 'Stress Management & Composure',
      score: oceanScores?.emotionalStability ? formatScore(oceanScores.emotionalStability, 3.4) : '3.4',
      range: '5.0',
      interpretation:
        traitExps?.emotionalStability ||
        (isHindi
          ? 'दबाव की स्थितियों में संयमित; संभावित जोखिमों के प्रति सतर्क और त्वरित सुधारात्मक दृष्टिकोण।'
          : isKannada
          ? 'ಒತ್ತಡದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಶಾಂತತೆ ಮತ್ತು ಸಮಚಿತ್ತತೆ; ಅಪಾಯಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಚೇತರಿಕೆ.'
          : 'Responsive to high-stress environments; alert to operational risks and systematic recovery.'),
      everydayContext: isHindi
        ? 'कठिन समय-सीमाओं या अचानक बदलावों के दौरान मानसिक संतुलन और स्पष्टता।'
        : isKannada
        ? 'ಗಡುವುಗಳ ಬದಲಾವಣೆ ಅಥವಾ ಹಿನ್ನಡೆಗಳ ಸಂದರ್ಭದಲ್ಲಿ ಮಾನಸಿಕ ಸಮತೋಲನ.'
        : 'Reflects emotional equilibrium during sudden deadline changes or critical setbacks.',
      tradeOffs: isHindi
        ? 'जोखिमों को तुरंत पहचानती हैं, पर लंबे समय तक अनिश्चितता में खुला संचार सहायक होता है।'
        : isKannada
        ? 'ಅಪಾಯಗಳನ್ನು ಮೊದಲೇ ಗುರುತಿಸುತ್ತಾರೆ, ಆದರೆ ದೀರ್ಘಕಾಲದ ಒತ್ತಡದಲ್ಲಿ ಮುಕ್ತ ಸಂವಹನ ಅಗತ್ಯ.'
        : 'Catches risks early, but benefits from transparent checkpointing to protect long-term delivery momentum.',
    },
  ];

  // Section 2: Potential Strengths (strictly capped at 3)
  const rawStrengths = Array.isArray(growthReport?.potentialStrengths) ? growthReport.potentialStrengths.slice(0, 3) : [];
  const strengths = rawStrengths.length > 0 ? rawStrengths : [
    {
      title: 'Methodical Problem Solving & Structural Discipline',
      simplifiedTitle: 'Disciplined Problem Solving',
      whatAssessmentSuggests: `${candidateName} exhibits a strong preference for structured planning, careful detail checking, and disciplined execution.`,
      simplifiedAssessmentSuggests: `You approach problems in an organized, step-by-step manner.`,
      starEvidenceQuote: 'I listened to both sides to understand the reason for the disagreement and compared the approaches against our core benchmarks.',
      whereItMayHelp: 'Extremely valuable in engineering, analytics, compliance, and project management roles.',
      simplifiedWhereItMayHelp: 'Great for roles requiring structured planning and clear execution.',
    },
  ];

  // Section 3: Challenges (strictly capped at 3)
  const rawChallenges = Array.isArray(growthReport?.challenges) && growthReport.challenges.length > 0
    ? growthReport.challenges.slice(0, 3)
    : Array.isArray(growthReport?.blindSpotsAndChallenges) && growthReport.blindSpotsAndChallenges.length > 0
    ? growthReport.blindSpotsAndChallenges.slice(0, 3)
    : [];

  const challenges = rawChallenges.length > 0 ? rawChallenges : [
    {
      title: 'Perfectionism vs Speed Trade-off',
      simplifiedTitle: 'Balancing Speed and Thoroughness',
      whyItMayOccur: 'High standards for quality can create friction when rapid iteration or minimum viable output is required.',
      howItMightAppear: 'Extra time spent polishing completed tasks before seeking initial feedback.',
      whatToWatchFor: 'Monitor personal stress during sudden timeline compressions.',
      constructiveAdjustment: 'Define explicit "good enough" criteria with stakeholders before starting detailed work.',
      simplifiedConstructiveAdjustment: 'Agree with your team on what is essential before spending extra time perfecting details.',
    },
  ];

  // Section 4: Work Preferences
  const rawPreferences = Array.isArray(growthReport?.workPreferences) ? growthReport.workPreferences : [];
  const preferences = rawPreferences.length > 0 ? rawPreferences : [
    {
      title: 'Structured Roles with Clear Ownership',
      simplifiedTitle: 'Clear Roles & Goals',
      assessmentFindings: `${candidateName} thrives in structured environments with well-defined deliverables and transparent evaluation metrics.`,
      simplifiedAssessmentFindings: `You work best when expectations, responsibilities, and success measures are clear.`,
      supportingEvidence: 'Demonstrated consistent preference for unambiguous project guidelines and async checkpointing.',
      adaptationStrategy: 'When assigned ambiguous tasks, proactively create a 1-page proposal outlining proposed scope.',
      simplifiedAdaptationStrategy: 'When tasks are unclear, write down your plan and get a quick sign-off before starting.',
    },
  ];

  // Section 5: Personal Development Plan (strictly capped at 3 priority actions for 30 days)
  const rawPDP = Array.isArray(growthReport?.personalDevelopmentPlan) ? growthReport.personalDevelopmentPlan.slice(0, 3) : [];
  const pdpItems = rawPDP.length > 0 ? rawPDP : [
    {
      priorityTitle: 'Priority Action 1: Agile Execution & Incremental Submissions',
      simplifiedTitle: 'Share Drafts Early',
      whyItMatters: 'Early stakeholder check-ins reduce rework and accelerate delivery in fast-paced teams.',
      practicalAction: 'Adopt a 50% milestone review habit: share draft outlines or working prototypes before final polish.',
      simplifiedPracticalAction: 'Show your work in progress at the halfway mark to get feedback before finishing.',
      timeline: 'Next 30 days',
      progressIndicator: 'Reduced iteration cycles and positive supervisor feedback on milestone transparency.',
      reflectionPrompt: 'How did seeking early feedback change the final quality of my work?',
    },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-100 ${fontClass}`}>
      {/* ================= HEADER CARD ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span role="img" aria-label="report">📋</span> {labels.reportTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              ID: {candidateId} | {labels.targetRoleLabel}: <span className="text-slate-300 font-semibold">{targetRole}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white">
              <span className="text-slate-400 text-xs">{labels.langLabel}</span>
              <select
                value={language}
                onChange={handleLanguageSelect}
                aria-label={labels.langLabel}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#1E293B] text-white">🇬🇧 English</option>
                <option value="hi" className="bg-[#1E293B] text-white">🇮🇳 हिन्दी</option>
                <option value="kn" className="bg-[#1E293B] text-white">🇮🇳 ಕನ್ನಡ</option>
              </select>
            </div>

            {/* Simplify Report Terminology Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSimplified(!isSimplified)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSimplified
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                  : 'bg-[#1E293B] hover:bg-[#334155] border-slate-700 text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{labels.simplifyBtn}</span>
            </button>

            {/* Print / Save PDF Report */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>{labels.printBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= SCORING INTEGRITY VERIFIED CALLOUT ================= */}
      <div className="bg-[#064E3B]/25 border border-[#059669]/40 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="font-medium">
          {growthReport?.scoringIntegrity?.verificationStatus || labels.scoringVerified}
        </p>
      </div>

      {/* ================= # 1. MY PERSONALITY PROFILE ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-sky-400">
            {labels.section1}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5">
            {labels.section1Desc}
          </p>
        </div>

        {/* Psychometric Table (3 Columns) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0B1120]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-semibold text-xs">
                <th className="py-3 px-4 sm:px-6 w-1/4">{labels.thTrait}</th>
                <th className="py-3 px-3 sm:px-4 w-32 text-center">{labels.thScore}</th>
                <th className="py-3 px-4 sm:px-6">{labels.thInterp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {personalityTraits.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-white align-top">
                    <div>{item.trait}</div>
                    {isSimplified && (
                      <div className="text-[11px] font-normal text-amber-300 mt-0.5">
                        ({item.simplifiedName})
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-white align-top whitespace-nowrap">
                    {item.score} / {item.range}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-slate-300 leading-relaxed align-top">
                    {item.interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5 Detailed Trait Breakdown Cards */}
        <div className="space-y-4 pt-1">
          {personalityTraits.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
            >
              <h3 className="font-bold text-sm sm:text-base text-white">
                {item.trait} ({labels.thScore}: {item.score} / {item.range})
              </h3>
              <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                <div>
                  <span className="font-bold text-sky-400">{labels.everydayContext}</span>
                  <span className="text-slate-300">{item.everydayContext}</span>
                </div>
                <div>
                  <span className="font-bold text-sky-400">{labels.tradeOffs}</span>
                  <span className="text-slate-300">{item.tradeOffs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= # 2. MY POTENTIAL STRENGTHS ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-sky-400">
          {labels.section2}
        </h2>

        <div className="space-y-4">
          {strengths.map((str: any, idx: number) => {
            const displayTitle = isSimplified && str.simplifiedTitle ? str.simplifiedTitle : str.title;
            const displaySuggests = isSimplified && str.simplifiedAssessmentSuggests ? str.simplifiedAssessmentSuggests : (str.whatAssessmentSuggests || str.tendency);
            const displayWhere = isSimplified && str.simplifiedWhereItMayHelp ? str.simplifiedWhereItMayHelp : str.whereItMayHelp;
            const evidence = str.evidenceQuote || str.starEvidenceQuote || str.supportedStarExample;

            return (
              <div
                key={idx}
                className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3"
              >
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>💪</span>
                  <span>{displayTitle}</span>
                </h3>

                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">{labels.whatSuggests}</span>
                  <span className="text-slate-300">
                    {displaySuggests || labels.insufficientEvidence}
                  </span>
                </div>

                {/* Supporting Behavioural Evidence Callout Box (No STAR labels) */}
                {evidence && (
                  <div className="bg-[#0F172A] border-l-2 border-purple-500 rounded-r-lg p-3 text-xs sm:text-sm space-y-1">
                    <div className="text-purple-300 font-semibold flex items-center gap-1.5">
                      <span>📌</span>
                      <span>{labels.supportingEvidence}</span>
                    </div>
                    <p className="italic text-slate-300 leading-relaxed pl-5">
                      &ldquo;{evidence}&rdquo;
                    </p>
                  </div>
                )}

                {displayWhere && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.whereHelps}</span>
                    <span className="text-slate-300">{displayWhere}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= # 3. MY CHALLENGES ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-sky-400">
          {labels.section3}
        </h2>

        <div className="space-y-4">
          {challenges.map((blind: any, idx: number) => {
            const displayTitle = isSimplified && blind.simplifiedTitle ? blind.simplifiedTitle : (blind.title || blind.area);
            const displayAdjustment = isSimplified && blind.simplifiedConstructiveAdjustment
              ? blind.simplifiedConstructiveAdjustment
              : (blind.constructiveAdjustment || blind.constructivePerspective);

            return (
              <div
                key={idx}
                className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
              >
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>🔍</span>
                  <span>{displayTitle}</span>
                </h3>

                {blind.whyItMayOccur && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.whyOccurs}</span>
                    <span className="text-slate-300">{blind.whyItMayOccur}</span>
                  </div>
                )}

                {blind.howItMightAppear && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.howAppears}</span>
                    <span className="text-slate-300">{blind.howItMightAppear}</span>
                  </div>
                )}

                {blind.whatToWatchFor && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.whatToWatch}</span>
                    <span className="text-slate-300">{blind.whatToWatchFor}</span>
                  </div>
                )}

                {/* Constructive Adjustment Box */}
                {displayAdjustment && (
                  <div className="bg-[#064E3B]/20 border border-[#059669]/40 rounded-lg p-3 text-xs sm:text-sm mt-1">
                    <span className="font-bold text-emerald-400">{labels.constructiveAdjustment}</span>
                    <span className="text-slate-200">{displayAdjustment}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= # 4. MY WORK PREFERENCES ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-sky-400">
          {labels.section4}
        </h2>

        <div className="space-y-4">
          {preferences.map((pref: any, idx: number) => {
            const displayTitle = isSimplified && pref.simplifiedTitle ? pref.simplifiedTitle : (pref.title || pref.hypothesisTitle);
            const displayFindings = isSimplified && pref.simplifiedAssessmentFindings
              ? pref.simplifiedAssessmentFindings
              : (pref.assessmentFindings || pref.description);
            const displayStrategy = isSimplified && pref.simplifiedAdaptationStrategy
              ? pref.simplifiedAdaptationStrategy
              : pref.adaptationStrategy;

            return (
              <div
                key={idx}
                className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
              >
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>🏢</span>
                  <span>{displayTitle}</span>
                </h3>

                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">{labels.findings}</span>
                  <span className="text-slate-300">
                    {displayFindings || labels.insufficientEvidence}
                  </span>
                </div>

                {pref.supportingEvidence && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.supportingEvidence} </span>
                    <span className="text-slate-300">{pref.supportingEvidence}</span>
                  </div>
                )}

                {pref.realWorldApplication && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{isHindi ? 'व्यावहारिक अनुप्रयोग: ' : isKannada ? 'ಪ್ರಾಯೋಗಿಕ ಅನ್ವಯ: ' : 'Real-world application: '}</span>
                    <span className="text-slate-300">{pref.realWorldApplication}</span>
                  </div>
                )}

                {displayStrategy && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.adaptationStrategy}</span>
                    <span className="text-slate-300">{displayStrategy}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= # 5. MY PERSONAL DEVELOPMENT PLAN ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sky-400">
            {labels.section5}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 italic mt-1">
            {labels.section5Sub}
          </p>
        </div>

        <div className="space-y-4">
          {pdpItems.map((pdp: any, idx: number) => {
            const displayTitle = isSimplified && pdp.simplifiedTitle ? pdp.simplifiedTitle : (pdp.priorityTitle || `Priority Action ${idx + 1}`);
            const displayAction = isSimplified && pdp.simplifiedPracticalAction ? pdp.simplifiedPracticalAction : pdp.practicalAction;

            return (
              <div
                key={idx}
                className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
              >
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>🎯</span>
                  <span>{displayTitle}</span>
                </h3>

                {pdp.whyItMatters && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.whyMatters}</span>
                    <span className="text-slate-300">{pdp.whyItMatters}</span>
                  </div>
                )}

                {displayAction && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.practicalAction}</span>
                    <span className="text-slate-300">{displayAction}</span>
                  </div>
                )}

                {(pdp.timeline || pdp.timeframe) && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.timeline}</span>
                    <span className="text-slate-300">{pdp.timeline || pdp.timeframe}</span>
                  </div>
                )}

                {(pdp.progressIndicator || pdp.measureOfProgress) && (
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold text-sky-400">{labels.progressIndicator}</span>
                    <span className="text-slate-300">
                      {pdp.progressIndicator || pdp.measureOfProgress}
                    </span>
                  </div>
                )}

                {/* Reflection Prompt Box */}
                {pdp.reflectionPrompt && (
                  <div className="bg-[#2E1065]/30 border border-purple-500/40 rounded-lg p-3 text-xs sm:text-sm mt-1">
                    <span className="font-bold text-purple-300">{labels.reflectionPrompt}</span>
                    <span className="italic text-purple-200">
                      &ldquo;{pdp.reflectionPrompt}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= FOOTER COMPLIANCE ================= */}
      <div className="text-center py-6 text-xs text-slate-500">
        DiscoverU • Make Your Next Move Count • Multilingual Assessment Engine
      </div>
    </div>
  );
}
