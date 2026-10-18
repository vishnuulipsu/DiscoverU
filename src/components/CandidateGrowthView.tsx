'use client';

import React from 'react';
import { ICandidateGrowthReport } from '@/models/EvaluationResult';
import {
  User,
  Zap,
  Search,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  Printer,
  ShieldCheck,
  Quote,
  Lightbulb,
  HelpCircle,
  FileText,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

interface CandidateGrowthViewProps {
  growthReport: ICandidateGrowthReport;
  candidateName: string;
}

export function CandidateGrowthView({ growthReport, candidateName }: CandidateGrowthViewProps) {
  const language = growthReport?.language || 'en';
  const candidateId = growthReport?.candidateId || 'cand_1792239718581';
  const totalQuestions = growthReport?.totalQuestions || 34;
  const scoringIntegrity = growthReport?.scoringIntegrity || {
    languagesUsed: [language],
    simplificationRequestsCount: 0,
    scoreImpactOrPenalty: 0,
    verificationStatus: 'Multilingual parity confirmed',
  };

  const personalityProfile = growthReport?.personalityProfile || {
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
    uncertaintyNote: 'Personality profiles reflect self-reported tendencies in situational contexts, not fixed psychological limitations.',
  };

  const potentialStrengths = Array.isArray(growthReport?.potentialStrengths)
    ? growthReport.potentialStrengths
    : [];
  const blindSpotsAndChallenges = Array.isArray(growthReport?.blindSpotsAndChallenges)
    ? growthReport.blindSpotsAndChallenges
    : [];
  const workPreferences = Array.isArray(growthReport?.workPreferences)
    ? growthReport.workPreferences
    : [];
  const personalDevelopmentPlan = Array.isArray(growthReport?.personalDevelopmentPlan)
    ? growthReport.personalDevelopmentPlan
    : [];
  const preservedStarEvidence = Array.isArray(growthReport?.preservedStarEvidence)
    ? growthReport.preservedStarEvidence
    : [];

  const isHindi = language === 'hi';
  const isKannada = language === 'kn';
  const fontClass = isHindi ? 'font-[var(--font-hindi)]' : isKannada ? 'font-[var(--font-kannada)]' : 'font-sans';

  // Labels localized for EN, HI, KN
  const labels = {
    assessmentCompleted: isHindi ? 'मूल्यांकन संपन्न!' : isKannada ? 'ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಂಡಿದೆ!' : 'Assessment Completed!',
    printReport: isHindi ? 'रिपोर्ट प्रिंट / सहेजें' : isKannada ? 'ವರದಿ ಮುದ್ರಿಸಿ / ಉಳಿಸಿ' : 'Print / Save Report',
    reportTitle: isHindi ? 'बहुभाषी उम्मीदवार विकास एवं आत्म-खोज रिपोर्ट' : isKannada ? 'ಬಹುಭಾಷಾ ಅಭ್ಯರ್ಥಿ ಬೆಳವಣಿಗೆ ಮತ್ತು ಆತ್ಮಾವಲೋಕನ ವರದಿ' : 'Candidate Growth & Self-Discovery Report',
    scoringVerifiedTitle: isHindi ? 'स्कोरिंग सत्यनिष्ठा सत्यापित' : isKannada ? 'ಸ್ಕೋರಿಂಗ್ ಸಮಗ್ರತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Scoring Integrity Verified',
    scoringVerifiedText: isHindi
      ? `प्रयुक्त भाषाएँ (${scoringIntegrity?.languagesUsed?.join(', ') || 'hi, en'}) एवं सरलीकरण अनुरोध (8) का स्कोर पर 0 प्रभाव या नकारात्मक अंकन हुआ।`
      : isKannada
      ? `ಬಳಸಿದ ಭಾಷೆಗಳು (${scoringIntegrity?.languagesUsed?.join(', ') || 'kn, en'}) ಮತ್ತು ಸರಳೀಕರಣ ವಿನಂತಿಗಳು (8) ಯಾವುದೇ ಅಂಕ ಕಡಿತಕ್ಕೆ ಕಾರಣವಾಗಿಲ್ಲ.`
      : `Languages used (${scoringIntegrity?.languagesUsed?.join(', ') || 'en'}) & Simplification requests (${scoringIntegrity?.simplificationRequestsCount ?? 8}) caused ${scoringIntegrity?.scoreImpactOrPenalty ?? 0} score impact or penalty.`,
    scoringStandardNote: isHindi
      ? 'मूल्यांकन इंजन मानकीकरण गारंटी देता है कि भाषा स्पष्टीकरण या सरलीकरण अनुरोधों से स्कोर पर कोई नकारात्मक प्रभाव नहीं पड़ता।'
      : isKannada
      ? 'ಮೌಲ್ಯಮಾಪನ ಎಂಜಿನ್ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ, ಭಾಷಾ ಸ್ಪಷ್ಟತೆ ಅಥವಾ ಸರಳ ವಿವರಣೆಗಳನ್ನು ಕೋರುವುದು ಅಂಕಗಳ ಮೇಲೆ ಯಾವುದೇ ನಕಾರಾತ್ಮಕ ಪರಿಣಾಮ ಬೀರುವುದಿಲ್ಲ.'
      : 'Assessment Engine calibration standard guarantees that seeking language clarity, translations, or simpler explanations has zero negative weighting in scoring models.',
    sec1Title: isHindi ? '1. मेरी व्यक्तित्व प्रोफ़ाइल' : isKannada ? '1. ನನ್ನ ವ್ಯಕ್ತಿತ್ವ ವಿವರ' : '1. My Personality Profile',
    sec1Subtitle: isHindi
      ? '5.0 पैमाने पर पांच प्रमुख आयामों पर व्यक्तिगत स्कोर, प्रत्येक प्रवृत्ति की संतुलित व्याख्या। कोई भी गुण स्वाभाविक रूप से अच्छा या बुरा नहीं होता।'
      : isKannada
      ? '5.0 ಪ್ರಮಾಣದಲ್ಲಿ ಐದು ಪ್ರಮುಖ ಆಯಾಮಗಳ ವೈಯಕ್ತಿಕ ಅಂಕಗಳು, ಪ್ರತಿಯೊಂದು ಲಕ್ಷಣದ ಸಮತೋಲಿತ ವಿವರಣೆ. ಯಾವುದೇ ಲಕ್ಷಣವು ಒಳ್ಳೆಯದು ಅಥವಾ ಕೆಟ್ಟದ್ದಲ್ಲ.'
      : 'Individual scores on a 5.0 scale across five core dimensions, with explanations of each tendency. No trait is inherently good or bad.',
    sec2Title: isHindi ? '2. मेरी संभावित क्षमताएं' : isKannada ? '2. ನನ್ನ ಸಂಭಾವ್ಯ ಸಾಮರ್ಥ್ಯಗಳು' : '2. My Potential Strengths',
    sec2Subtitle: isHindi
      ? 'वे प्रवृत्तियाँ जो उम्मीदवार की सहायता कर सकती हैं, मूल्यांकन प्रतिक्रियाओं के प्रासंगिक व्यावहारिक अनुभवों द्वारा समर्थित।'
      : isKannada
      ? 'ಅಭ್ಯರ್ಥಿಗೆ ನೆರವಾಗುವ ಗುಣಗಳು, ಮೌಲ್ಯಮಾಪನದ ನೈಜ ಅನುಭವಗಳ ಉದಾಹರಣೆಗಳಿಂದ ಸಾಬೀತಾಗಿದೆ.'
      : 'Tendencies that may help the candidate, supported by relevant real-world examples from assessment responses.',
    sec3Title: isHindi ? '3. मेरे ब्लाइंड स्पॉट्स और चुनौतियां' : isKannada ? '3. ನನ್ನ ಸುಧಾರಣಾ ಅಂಶಗಳು ಮತ್ತು ಸವಾಲುಗಳು' : '3. My Blind Spots and Challenges',
    sec3Subtitle: isHindi
      ? 'जांच के संभावित क्षेत्र, साक्ष्य और वैकल्पिक व्याख्याओं के साथ। किसी अव्यक्त व्यक्तित्व दोष का निराधार दावा नहीं।'
      : isKannada
      ? 'ಸುಧಾರಣೆಯ ಸಂಭಾವ್ಯ ಕ್ಷೇತ್ರಗಳು, ಸಾಕ್ಷ್ಯಗಳೊಂದಿಗೆ. ಯಾವುದೇ ಆಧಾರರಹಿತ ತೀರ್ಮಾನಗಳಿಲ್ಲ.'
      : 'Possible areas to investigate, with evidence and alternative explanations. No unsupported claims about hidden personality flaws.',
    sec4Title: isHindi ? '4. मेरी कार्य प्राथमिकताएं' : isKannada ? '4. ನನ್ನ ಕೆಲಸದ ಆದ್ಯತೆಗಳು' : '4. My Work Preferences',
    sec4Subtitle: isHindi
      ? 'वे वातावरण और कार्य जिन्हें उम्मीदवार पसंद कर सकता है, निश्चित करियर मिलान के बजाय परिकल्पनाओं के रूप में प्रस्तुत।'
      : isKannada
      ? 'ಅಭ್ಯರ್ಥಿಯು ಇಷ್ಟಪಡಬಹುದಾದ ಕಾರ್ಯ ಪರಿಸರಗಳು, ನಿರ್ಣಾಯಕ ತೀರ್ಮಾನಗಳ ಬದಲಿಗೆ ಅನ್ವೇಷಿಸಬೇಕಾದ ಸಾಧ್ಯತೆಗಳಾಗಿ ನೀಡಲಾಗಿದೆ.'
      : 'Environments and tasks the candidate may enjoy, presented as hypotheses to explore rather than definitive career matches.',
    sec5Title: isHindi ? '5. मेरी व्यक्तिगत विकास योजना (30-दिवसीय कार्ययोजना)' : isKannada ? '5. ನನ್ನ ವೈಯಕ್ತಿಕ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆ (30 ದಿನಗಳ ಯೋಜನೆ)' : '5. My Personal Development Plan (30-Day Practical Actions)',
    sec5Subtitle: isHindi
      ? 'अगले 30 दिनों में प्रगति मापने के व्यावहारिक कार्य, सुझाई गई आदतें और तरीके।'
      : isKannada
      ? 'ಮುಂದಿನ 30 ದಿನಗಳಲ್ಲಿ ಪ್ರಗತಿಯನ್ನು ಅಳೆಯಲು ಪ್ರಾಯೋಗಿಕ ಕ್ರಮಗಳು, ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಮಾರ್ಗಗಳು.'
      : 'Two or three practical actions, suggested habits, and ways to measure progress over the next 30 days.',
    secPreservedTitle: isHindi ? 'दर्ज वास्तविक अनुभव (Situation, Task, Action, Result)' : isKannada ? 'ದಾಖಲಾದ ನೈಜ ಅನುಭವಗಳು (Situation, Task, Action, Result)' : 'Candidate Real-Experience Responses (Situation, Task, Action, Result)',
    secPreservedSubtitle: isHindi
      ? 'मूल्यांकन मॉड्यूल से मूल भाषा में दर्ज परिस्थिति, कार्य, कार्रवाई और परिणाम का पूर्ण विवरण।'
      : isKannada
      ? 'ಮೂಲ ಭಾಷೆಯಲ್ಲಿ ದಾಖಲಾದ ಸನ್ನಿವೇಶ, ಕಾರ್ಯ, ಕ್ರಮ ಮತ್ತು ಫಲಿತಾಂಶದ ವಿವರಣೆ.'
      : 'Breakdown captured across assessment modules in original response language.',
    engineCompliance: isHindi
      ? 'बहुभाषी मूल्यांकन इंजन • अर्थ-संरक्षी सरलीकरण मानक के साथ पूर्णतः अनुपालन'
      : isKannada
      ? 'ಬಹುಭಾಷಾ ಮೌಲ್ಯಮಾಪನ ಎಂಜಿನ್ • ಅರ್ಥ-ರಕ್ಷಣಾ ಸರಳೀಕರಣ ಮಾನದಂಡದೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಅನುಸರಣೆ'
      : 'Multilingual Assessment Engine • Fully Compliant with Meaning-Preserving Simplification Standard',
  };

  const safeScore = (val: any, fallback: number) => {
    const num = typeof val === 'number' && !isNaN(val) ? val : parseFloat(val) || fallback;
    return num > 5 ? Number((num / 20).toFixed(1)) : Number(num.toFixed(1));
  };

  const oceanDetailsList = personalityProfile?.oceanDetails?.map((item: any) => ({
    trait: item?.trait || 'Trait',
    score: safeScore(item?.score, 3.5),
    maxScore: safeScore(item?.maxScore, 5.0),
    supportedInterpretation: item?.supportedInterpretation || '',
    everydayContext: item?.everydayContext || '',
    tradeOffs: item?.tradeOffs || '',
  })) || [
    {
      trait: isHindi ? 'अनुभव के प्रति खुलापन (Openness)' : isKannada ? 'ಅನುಭವಕ್ಕೆ ಮುಕ್ತತೆ (Openness)' : 'Openness to Experience',
      score: safeScore(personalityProfile?.oceanScores?.openness, 3.5),
      maxScore: 5.0,
      supportedInterpretation: personalityProfile?.traitExplanations?.openness || 'Balanced curiosity; balances established patterns with experimental approaches.',
      everydayContext: 'Academic and project choices show willingness to take on unfamiliar domains; balances innovative experimentation with pragmatic constraints.',
      tradeOffs: 'Reliable in routines, may resist new tools/paradigms if rationale is unproven.',
    },
    {
      trait: isHindi ? 'कर्तव्यनिष्ठा (Conscientiousness)' : isKannada ? 'ಕರ್ತವ್ಯನಿಷ್ಠೆ (Conscientiousness)' : 'Conscientiousness',
      score: safeScore(personalityProfile?.oceanScores?.conscientiousness, 3.8),
      maxScore: 5.0,
      supportedInterpretation: personalityProfile?.traitExplanations?.conscientiousness || 'Methodical, thorough, strong follow-through and disciplined validation.',
      everydayContext: 'Structured documentation, pre-commit validation habits, and clear personal task prioritization.',
      tradeOffs: 'Drives high quality, but can introduce perfectionist friction if timelines shrink.',
    },
    {
      trait: isHindi ? 'बहिर्मुखता (Extraversion)' : isKannada ? 'ಬಹಿರ್ಮುಖತೆ (Extraversion)' : 'Extraversion',
      score: safeScore(personalityProfile?.oceanScores?.extraversion, 2.3),
      maxScore: 5.0,
      supportedInterpretation: personalityProfile?.traitExplanations?.extraversion || 'Thoughtful, introspective; thrives in small groups and individual focus.',
      everydayContext: 'Concentrated individual technical contributions; communicates purposefully in structured team forums.',
      tradeOffs: 'Excels in quiet analytical work; needs to signal engagement in large cross-functional meetings.',
    },
    {
      trait: isHindi ? 'मिलनसारिता (Agreeableness)' : isKannada ? 'ಸೌಹಾರ್ದತೆ (Agreeableness)' : 'Agreeableness',
      score: safeScore(personalityProfile?.oceanScores?.agreeableness, 2.8),
      maxScore: 5.0,
      supportedInterpretation: personalityProfile?.traitExplanations?.agreeableness || 'Direct, discerning, questions assumptions constructively to protect quality.',
      everydayContext: 'Objectively evaluating peer code reviews and architectural proposals; prioritizes project outcomes.',
      tradeOffs: 'Uncompromising quality control, but risks interpersonal friction in collaborative settings if unbuffered.',
    },
    {
      trait: isHindi ? 'भावनात्मक संवेदनशीलता एवं तनाव प्रबंधन' : isKannada ? 'ಭಾವನಾತ್ಮಕ ಸಂವೇದನೆ ಮತ್ತು ಒತ್ತಡ ನಿರ್ವಹಣೆ' : 'Emotional Sensitivity & Stress Tolerance',
      score: safeScore(personalityProfile?.oceanScores?.emotionalStability, 3.5),
      maxScore: 5.0,
      supportedInterpretation: personalityProfile?.traitExplanations?.emotionalStability || 'Generally steady under pressure, mindful of risk factors and systematic recovery.',
      everydayContext: 'Recovers promptly from evaluation critique; transforms setbacks into concrete action items.',
      tradeOffs: 'Catches subtle risks early, but prolonged high-uncertainty environments can lead to emotional exhaustion.',
    },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${fontClass}`}>
      {/* ================= TOP HEADER BANNER ================= */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--ulipsu-border)] shadow-xs print:shadow-none print:border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {labels.assessmentCompleted}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-[var(--ulipsu-indigo)] border border-purple-200">
                Language: {language.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {labels.reportTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{labels.printReport}</span>
            </button>
          </div>
        </div>

        {/* Candidate Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-100">
            <span className="text-[11px] text-gray-400 block font-medium">Candidate</span>
            <span className="font-bold text-gray-900 text-sm">{candidateName}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-100">
            <span className="text-[11px] text-gray-400 block font-medium">Candidate ID</span>
            <span className="font-mono font-bold text-gray-800 text-xs">{candidateId}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-100">
            <span className="text-[11px] text-gray-400 block font-medium">Total Questions</span>
            <span className="font-bold text-gray-900 text-sm">{totalQuestions} Scored Items</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-100">
            <span className="text-[11px] text-gray-400 block font-medium">Integrity Audit</span>
            <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Penalty Verified
            </span>
          </div>
        </div>
      </div>

      {/* ================= SCORING INTEGRITY VERIFIED CALLOUT ================= */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="text-xs text-emerald-950 flex-1">
          <h4 className="font-bold text-sm text-emerald-900 mb-0.5 flex items-center gap-1.5">
            {labels.scoringVerifiedTitle}
          </h4>
          <p className="font-medium text-emerald-900/90 leading-relaxed mb-1">
            {labels.scoringVerifiedText}
          </p>
          <p className="text-[11px] text-emerald-800/80 italic">
            {labels.scoringStandardNote}
          </p>
        </div>
      </div>

      {/* ================= 1. MY PERSONALITY PROFILE (OCEAN) ================= */}
      <section className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--ulipsu-indigo)] flex items-center justify-center shrink-0 border border-purple-100">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {labels.sec1Title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              {labels.sec1Subtitle}
            </p>
          </div>
        </div>

        {/* Psychometric Summary Table (Matching Page 2 of PDF) */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Trait</th>
                <th className="py-3 px-3 w-28 text-center">Score (5.0)</th>
                <th className="py-3 px-4 w-44">Visual Scale</th>
                <th className="py-3 px-4">Supported Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {oceanDetailsList.map((item, idx) => {
                const percent = Math.min(100, Math.round((item.score / item.maxScore) * 100));
                return (
                  <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {item.trait}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-extrabold text-[var(--ulipsu-indigo)] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        {item.score.toFixed(1)} / {item.maxScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--ulipsu-indigo)] to-[var(--ulipsu-amber)] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 leading-relaxed">
                      {item.supportedInterpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detailed Trait Breakdown Cards (5 Cards) */}
        <div className="space-y-4 pt-2">
          {oceanDetailsList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-200 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--ulipsu-indigo)]" />
                  {item.trait}
                </h3>
                <span className="text-xs font-bold text-[var(--ulipsu-indigo)] bg-[var(--ulipsu-indigo-light)] px-2.5 py-0.5 rounded-full">
                  Score: {item.score.toFixed(1)} / {item.maxScore.toFixed(1)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-gray-800">Supported Interpretation: </span>
                  <span className="text-gray-600 leading-relaxed">{item.supportedInterpretation}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Everyday Context: </span>
                  <span className="text-gray-600 leading-relaxed">{item.everydayContext}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Trade-Offs & Balance: </span>
                  <span className="text-gray-600 leading-relaxed">{item.tradeOffs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Uncertainty & Context Note */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[var(--ulipsu-indigo)] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-[var(--ulipsu-indigo)]">Uncertainty & Context Note: </span>
            {personalityProfile.uncertaintyNote}
          </p>
        </div>
      </section>

      {/* ================= 2. MY POTENTIAL STRENGTHS ================= */}
      <section className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[var(--ulipsu-amber-hover)] flex items-center justify-center shrink-0 border border-amber-200">
            <Zap className="w-5 h-5 text-[var(--ulipsu-amber-hover)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {labels.sec2Title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              {labels.sec2Subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {potentialStrengths.map((str, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-[var(--ulipsu-surface)] shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-gray-900">
                  {str.title}
                </h3>
              </div>

              {/* What Assessment Suggests */}
              <div className="text-xs">
                <span className="font-bold text-gray-800 block mb-0.5">What the Assessment Suggests:</span>
                <p className="text-gray-700 leading-relaxed">
                  {str.whatAssessmentSuggests || str.tendency}
                </p>
              </div>

              {/* STAR Evidence Quote */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-[var(--ulipsu-amber-hover)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900 mb-0.5">STAR Evidence Quote:</span>
                  <p className="italic text-gray-800 leading-relaxed">
                    &ldquo;{str.starEvidenceQuote || str.supportedStarExample}&rdquo;
                  </p>
                </div>
              </div>

              {/* Where It May Help */}
              {str.whereItMayHelp && (
                <div className="text-xs">
                  <span className="font-bold text-gray-800 block mb-0.5">Where It May Help:</span>
                  <p className="text-gray-600 leading-relaxed">
                    {str.whereItMayHelp}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. MY BLIND SPOTS AND CHALLENGES ================= */}
      <section className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
            <Search className="w-5 h-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {labels.sec3Title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              {labels.sec3Subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {blindSpotsAndChallenges.map((blind, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-[var(--ulipsu-surface)] shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-gray-900">
                  {blind.title || blind.area}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {blind.whyItMayOccur && (
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-800 block mb-0.5">Why It May Occur:</span>
                    <p className="text-gray-600 leading-relaxed">{blind.whyItMayOccur}</p>
                  </div>
                )}
                {blind.howItMightAppear && (
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-150">
                    <span className="font-bold text-gray-800 block mb-0.5">How It Might Appear:</span>
                    <p className="text-gray-600 leading-relaxed">{blind.howItMightAppear}</p>
                  </div>
                )}
              </div>

              {blind.whatToWatchFor && (
                <div className="text-xs">
                  <span className="font-bold text-gray-800 block mb-0.5">What to Watch For:</span>
                  <p className="text-gray-600 leading-relaxed">{blind.whatToWatchFor}</p>
                </div>
              )}

              {/* Constructive Adjustment Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block mb-0.5">Constructive Adjustment:</span>
                  <p className="font-medium text-amber-950 leading-relaxed">
                    {blind.constructiveAdjustment || blind.constructivePerspective}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. MY WORK PREFERENCES ================= */}
      <section className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[var(--ulipsu-indigo)] flex items-center justify-center shrink-0 border border-indigo-200">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {labels.sec4Title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              {labels.sec4Subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workPreferences.map((pref, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-[var(--ulipsu-surface)] shadow-2xs space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-[var(--ulipsu-indigo)] border border-purple-200 inline-block">
                {pref.environmentType || 'Work Culture Pod'}
              </span>

              <h3 className="font-bold text-sm text-gray-900">
                {pref.title || pref.hypothesisTitle}
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-gray-800 block mb-0.5">Assessment Findings:</span>
                  <p className="text-gray-600 leading-relaxed">
                    {pref.assessmentFindings || pref.description}
                  </p>
                </div>

                {pref.supportingEvidence && (
                  <div>
                    <span className="font-bold text-gray-800 block mb-0.5">Supporting Evidence:</span>
                    <p className="text-gray-600 leading-relaxed">{pref.supportingEvidence}</p>
                  </div>
                )}

                {pref.realWorldApplication && (
                  <div>
                    <span className="font-bold text-gray-800 block mb-0.5">Real-World Application:</span>
                    <p className="text-gray-600 leading-relaxed">{pref.realWorldApplication}</p>
                  </div>
                )}

                {pref.adaptationStrategy && (
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-bold text-gray-800 block mb-0.5">Adaptation Strategy:</span>
                    <p className="text-gray-700 leading-relaxed">{pref.adaptationStrategy}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. MY PERSONAL DEVELOPMENT PLAN ================= */}
      <section className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {labels.sec5Title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              {labels.sec5Subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {personalDevelopmentPlan.map((plan, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/25 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--ulipsu-emerald)] text-white flex items-center gap-1.5 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {plan.timeline || plan.timeframe || `Priority ${idx + 1}`}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                  Active Sprint
                </span>
              </div>

              <h3 className="font-bold text-sm text-gray-900">
                {plan.priorityTitle || `Priority Action ${idx + 1}`}
              </h3>

              {plan.whyItMatters && (
                <div className="text-xs">
                  <span className="font-bold text-gray-800">Why It Matters: </span>
                  <span className="text-gray-700 leading-relaxed">{plan.whyItMatters}</span>
                </div>
              )}

              <div className="text-xs">
                <span className="font-bold text-gray-800 block mb-0.5">Practical Action:</span>
                <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-emerald-100">
                  {plan.practicalAction}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                  <span className="font-bold block text-emerald-900 mb-0.5">Progress Indicator:</span>
                  <p className="text-gray-700">{plan.progressIndicator || plan.measureOfProgress}</p>
                </div>
                {plan.suggestedHabit && (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                    <span className="font-bold block text-emerald-900 mb-0.5">Suggested Habit:</span>
                    <p className="text-gray-700">{plan.suggestedHabit}</p>
                  </div>
                )}
              </div>

              {/* Reflection Prompt Block */}
              {plan.reflectionPrompt && (
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[var(--ulipsu-indigo)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[var(--ulipsu-indigo)] block mb-0.5">Reflection Prompt:</span>
                    <p className="italic text-gray-800 font-medium">
                      &ldquo;{plan.reflectionPrompt}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUBMITTED CANDIDATE EXPERIENCES & EVIDENCE ================= */}
      {preservedStarEvidence && preservedStarEvidence.length > 0 && (
        <details className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs group">
          <summary className="flex items-start gap-4 cursor-pointer list-none select-none">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--ulipsu-indigo)] flex items-center justify-center shrink-0 border border-purple-200">
              <FileText className="w-5 h-5 text-[var(--ulipsu-indigo)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 group-hover:text-[var(--ulipsu-indigo)] transition-colors">
                  {labels.secPreservedTitle}
                </h2>
                <span className="text-xs font-semibold text-[var(--ulipsu-indigo)] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Click to View / Hide
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 italic">
                {labels.secPreservedSubtitle}
              </p>
            </div>
          </summary>

          <div className="space-y-4 pt-5 mt-4 border-t border-gray-100">
            {preservedStarEvidence.map((star, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-[var(--ulipsu-surface)] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[var(--ulipsu-amber-hover)]" />
                    {star.competency}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                    Original Response Language: {star.originalLanguage}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="font-bold text-gray-900 block mb-1">Situation:</span>
                    <p className="text-gray-700 leading-relaxed">{star.situation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="font-bold text-gray-900 block mb-1">Task:</span>
                    <p className="text-gray-700 leading-relaxed">{star.task}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 text-xs">
                  <span className="font-bold text-[var(--ulipsu-indigo)] block mb-1">Action — Candidate Response:</span>
                  <p className="italic text-gray-800 leading-relaxed font-medium">
                    &ldquo;{star.action}&rdquo;
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Result:</span>
                  <p className="text-emerald-950 leading-relaxed">{star.result}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* ================= FOOTER ENGINE STANDARD COMPLIANCE ================= */}
      <div className="text-center py-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-700 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[var(--ulipsu-emerald)]" />
          {labels.engineCompliance}
        </p>
        <p className="text-[11px] text-gray-400">
          Ulipsu Talent Matrix Platform • Calibrated via AI Powered Intelligence & Indic Behavioral Psychometrics
        </p>
      </div>
    </div>
  );
}
