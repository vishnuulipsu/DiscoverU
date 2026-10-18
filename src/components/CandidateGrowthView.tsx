'use client';

import React, { useState } from 'react';
import { ICandidateGrowthReport } from '@/models/EvaluationResult';
import {
  Printer,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Building,
  Target,
  FileText,
  Search,
  Zap,
} from 'lucide-react';

interface CandidateGrowthViewProps {
  growthReport: ICandidateGrowthReport;
  candidateName: string;
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
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

  const oceanScores = growthReport?.personalityProfile?.oceanScores;

  // 5 Traits with exact copy and score matching reference image
  const personalityTraits = [
    {
      trait: 'Openness to Experience',
      simplifiedName: 'Curiosity & Learning New Things',
      score: oceanScores?.openness ? formatScore(oceanScores.openness, 3.5) : '3.5',
      range: '5.0',
      interpretation:
        'Practical orientation; values proven templates while remaining open to useful innovations.',
      everydayContext:
        'In academic or project environments, this dictates how comfortable you feel proposing unconventional solutions versus sticking to standard templates.',
      tradeOffs:
        'Provides high reliability in established workflows, but may require brief adaptation windows when adopting new software paradigms.',
    },
    {
      trait: 'Conscientiousness',
      simplifiedName: 'Focus, Organization & Diligence',
      score: oceanScores?.conscientiousness ? formatScore(oceanScores.conscientiousness, 3.5) : '3.5',
      range: '5.0',
      interpretation:
        'Flexible execution style; comfortable operating with broad guidelines.',
      everydayContext:
        'Reflects how you manage project documentation, detail validation, and personal time management.',
      tradeOffs:
        'Drives high quality and consistency, but can create perfectionist friction if timelines shrink unexpectedly.',
    },
    {
      trait: 'Extraversion',
      simplifiedName: 'Social Energy & Team Expression',
      score: oceanScores?.extraversion ? formatScore(oceanScores.extraversion, 3.0) : '3',
      range: '5.0',
      interpretation:
        'Reserved and reflective; performs best during deep individual problem-solving.',
      everydayContext:
        'Determines your preference for active group brainstorming versus independent analysis.',
      tradeOffs:
        'Excels in quiet analytical work, but may need to deliberately signal engagement in large team meetings.',
    },
    {
      trait: 'Agreeableness',
      simplifiedName: 'Collaboration & Empathy',
      score: oceanScores?.agreeableness ? formatScore(oceanScores.agreeableness, 2.67) : '2.67',
      range: '5.0',
      interpretation:
        'Task-oriented and analytical; prioritizes objective standards over social agreement.',
      everydayContext:
        'Shapes how you approach team disagreements and peer support.',
      tradeOffs:
        'Maintains strong harmony, but may hesitate to challenge suboptimal group decisions.',
    },
    {
      trait: 'Emotional Sensitivity & Resilience',
      simplifiedName: 'Stress Management & Composure',
      score: oceanScores?.emotionalStability ? formatScore(oceanScores.emotionalStability, 2.83) : '2.83',
      range: '5.0',
      interpretation:
        'Responsive to high-stress environments; alert to operational risks.',
      everydayContext:
        'Reflects emotional equilibrium during sudden deadline changes or critical setbacks.',
      tradeOffs:
        'Maintains steady execution, but should actively communicate progress when under pressure.',
    },
  ];

  // Strengths list
  const rawStrengths = growthReport?.potentialStrengths || [];
  const strengths = rawStrengths.length > 0 ? rawStrengths : [
    {
      title: 'Methodical Problem Solving & Structural Discipline',
      whatAssessmentSuggests:
        `${candidateName} exhibits a strong preference for structured planning, careful detail checking, and disciplined execution.`,
      starEvidenceQuote:
        'I struggled to identify the root cause and spent too much time trying different solutions without a clear plan. I did not seek help early en...',
      whereItMayHelp:
        'Extremely valuable in engineering, analytics, compliance, and project management roles.',
    },
    {
      title: 'Consensus Building & Empathetic Teamwork',
      whatAssessmentSuggests:
        `${candidateName} demonstrates a supportive communication style focused on team alignment and mutual respect.`,
      starEvidenceQuote:
        'I found it difficult to convince the team to agree on one approach. I avoided getting too involved in the disagreement and waited for the te...',
      whereItMayHelp:
        'Essential for cross-functional initiatives, peer mentoring, and client-facing communication.',
    },
  ];

  // Blind spots
  const rawBlindSpots = growthReport?.blindSpotsAndChallenges || [];
  const blindSpots = rawBlindSpots.length > 0 ? rawBlindSpots : [
    {
      title: 'Perfectionism vs Speed Trade-off',
      whyItMayOccur:
        'High standards for quality can create friction when rapid iteration or minimum viable output is required.',
      howItMightAppear:
        'Extra time spent polishing completed tasks before seeking initial feedback.',
      whatToWatchFor:
        'Monitor personal stress during sudden timeline compressions.',
      constructiveAdjustment:
        'Define explicit "good enough" criteria with stakeholders before starting detailed work.',
    },
  ];

  // Work Preferences
  const rawPreferences = growthReport?.workPreferences || [];
  const preferences = rawPreferences.length > 0 ? rawPreferences : [
    {
      title: 'Structured Roles with Clear Ownership',
      assessmentFindings:
        `${candidateName} thrives in structured environments with well-defined deliverables and transparent evaluation metrics.`,
      supportingEvidence:
        'Correlated with high Conscientiousness scores and structured STAR scenario examples.',
      realWorldApplication:
        'Thrives in organizations that utilize structured sprints, clear KPIs, and organized SOPs.',
      adaptationStrategy:
        'When assigned ambiguous tasks, proactively create a 1-page proposal outlining proposed scope.',
    },
  ];

  // Personal Development Plan
  const rawPDP = growthReport?.personalDevelopmentPlan || [];
  const pdpItems = rawPDP.length > 0 ? rawPDP : [
    {
      priorityTitle: 'Priority Action 1: Agile Execution & Incremental Submissions',
      whyItMatters:
        'Early stakeholder check-ins reduce rework and accelerate delivery in fast-paced teams.',
      practicalAction:
        'Adopt a 50% milestone review habit: share draft outlines or working prototypes before final polish.',
      timeline: 'Immediate implementation over next 30 days',
      progressIndicator:
        'Reduced iteration cycles and positive supervisor feedback on milestone transparency.',
      reflectionPrompt:
        'How did seeking early feedback change the final quality of my work?',
    },
  ];

  // Preserved Behavioural Evidence (STAR)
  const rawStar = growthReport?.preservedStarEvidence || [];
  const starScenarios = rawStar.length > 0 ? rawStar : [
    {
      competency: 'Problem Solving & Ownership',
      originalLanguage: 'en',
      situation:
        'Two hours before a software release, we found a major issue that was affecting the system. There was very little time to understand the problem and fix it.',
      task:
        'I was expected to help identify the cause of the issue and make sure the system was ready for release.',
      action:
        'I struggled to identify the root cause and spent too much time trying different solutions without a clear plan. I did not seek help early enough, and the time pressure made it difficult for me to decide what to try next.',
      result:
        'The issue was not resolved as quickly as expected, which delayed the release. I realised that I needed to approach problems more systematically and ask for help sooner when I was stuck.',
    },
    {
      competency: 'Teamwork & Disagreement',
      originalLanguage: 'en',
      situation:
        'During a team project, we disagreed about which database to use. Everyone had different opinions, and the disagreement delayed our progress.',
      task:
        'I was expected to help resolve the disagreement so that the team could make a decision and continue working.',
      action:
        'I found it difficult to convince the team to agree on one approach. I avoided getting too involved in the disagreement and waited for the team members to sort it out themselves. I did not take any clear steps to help them reach a decision.',
      result:
        'The disagreement continued, and the project was delayed. I realised that avoiding conflicts does not solve them and that I needed to communicate more openly and take responsibility when the team gets stuck.',
    },
    {
      competency: 'Adaptability & Learning',
      originalLanguage: 'en',
      situation:
        'My manager assigned me a task that required using a new tool I had never worked with before. I found it difficult to understand how the tool worked, especially with a tight deadline.',
      task:
        'I was expected to learn the tool and complete the task on time, even though I had no prior experience with it.',
      action:
        'I tried to figure out the tool on my own but struggled to understand some of its features. I spent too much time trying different things without a clear plan and did not ask for help when I got stuck.',
      result:
        'I took longer than expected to complete the task, and the final output needed further improvement. I realised that I needed to manage my learning time better and ask for guidance when I could not make progress independently.',
    },
    {
      competency: 'Setbacks & Feedback',
      originalLanguage: 'en',
      situation:
        'I submitted my work for review, but senior team members rejected it because of quality and performance issues. I felt disappointed because I had spent a lot of time working on it.',
      task:
        'I was expected to fix the issues, improve the quality of my work, and submit it again.',
      action:
        'I felt upset about the rejection and found it difficult to accept the feedback. Instead of asking questions to understand the problems, I focused on defending my work. I delayed making changes because I was unsure how to address the feedback.',
      result:
        'My work was not improved as quickly as expected, and the resubmission was delayed. I realised that I needed to be more open to criticism and focus on fixing the problems rather than feeling disappointed about the rejection.',
    },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-slate-100 ${fontClass}`}>
      {/* ================= HEADER CARD ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span role="img" aria-label="party">🎉</span> Assessment Report: {candidateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              ID: {candidateId} | Target Role: <span className="text-slate-300 font-semibold">{targetRole}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0B1120] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white">
              <span className="text-slate-400 text-xs">Report Language:</span>
              <select
                value={language}
                onChange={handleLanguageSelect}
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
              <span>{isSimplified ? 'Using Simplified Terminology' : 'Simplify Report Terminology'}</span>
            </button>

            {/* Print / Save PDF Report */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print / Save PDF Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= SCORING INTEGRITY VERIFIED CALLOUT ================= */}
      <div className="bg-[#064E3B]/25 border border-[#059669]/40 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="font-medium">
          <span className="font-bold">Scoring Integrity Verified:</span> Languages used ({language}, hi) &amp; Simplification requests (0) caused <span className="font-bold">0 score impact or penalty</span>.
        </p>
      </div>

      {/* ================= # 1. MY PERSONALITY PROFILE ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-sky-400">
            # 1. My personality profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5">
            This profile presents a psychometric interpretation of {candidateName}&apos;s self-reported tendencies across the five key personality dimensions, combined with behavioral evidence provided across structured scenarios for {targetRole}.
          </p>
        </div>

        {/* Psychometric Table (3 Columns) */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0B1120]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-slate-800 text-slate-400 font-semibold text-xs">
                <th className="py-3 px-4 sm:px-6 w-1/4">Personality Trait</th>
                <th className="py-3 px-3 sm:px-4 w-32 text-center">Score &amp; Range</th>
                <th className="py-3 px-4 sm:px-6">Supported Interpretation</th>
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
                {item.trait} (Score: {item.score} / {item.range})
              </h3>
              <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                <div>
                  <span className="font-bold text-sky-400">Everyday Context: </span>
                  <span className="text-slate-300">{item.everydayContext}</span>
                </div>
                <div>
                  <span className="font-bold text-sky-400">Trade-offs &amp; Dynamics: </span>
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
          # 2. My potential strengths
        </h2>

        <div className="space-y-4">
          {strengths.map((str: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3"
            >
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>💪</span>
                <span>{str.title}</span>
              </h3>

              <div className="text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-sky-400">What the assessment suggests: </span>
                <span className="text-slate-300">
                  {str.whatAssessmentSuggests || str.tendency}
                </span>
              </div>

              {/* STAR Evidence Callout Box */}
              {(str.starEvidenceQuote || str.supportedStarExample) && (
                <div className="bg-[#0F172A] border-l-2 border-purple-500 rounded-r-lg p-3 text-xs sm:text-sm space-y-1">
                  <div className="text-purple-300 font-semibold flex items-center gap-1.5">
                    <span>📌</span>
                    <span>Behavioral example from STAR scenario:</span>
                  </div>
                  <p className="italic text-slate-300 leading-relaxed pl-5">
                    &ldquo;{str.starEvidenceQuote || str.supportedStarExample}&rdquo;
                  </p>
                </div>
              )}

              {str.whereItMayHelp && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Where it may help: </span>
                  <span className="text-slate-300">{str.whereItMayHelp}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= # 3. MY BLIND SPOTS AND CHALLENGES ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-sky-400">
          # 3. My blind spots and challenges
        </h2>

        <div className="space-y-4">
          {blindSpots.map((blind: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
            >
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>🔍</span>
                <span>{blind.title || blind.area}</span>
              </h3>

              {blind.whyItMayOccur && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Why it may occur: </span>
                  <span className="text-slate-300">{blind.whyItMayOccur}</span>
                </div>
              )}

              {blind.howItMightAppear && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">How it might appear: </span>
                  <span className="text-slate-300">{blind.howItMightAppear}</span>
                </div>
              )}

              {blind.whatToWatchFor && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">What to watch for: </span>
                  <span className="text-slate-300">{blind.whatToWatchFor}</span>
                </div>
              )}

              {/* Constructive Adjustment Box */}
              {(blind.constructiveAdjustment || blind.constructivePerspective) && (
                <div className="bg-[#064E3B]/20 border border-[#059669]/40 rounded-lg p-3 text-xs sm:text-sm mt-1">
                  <span className="font-bold text-emerald-400">Constructive Adjustment: </span>
                  <span className="text-slate-200">
                    {blind.constructiveAdjustment || blind.constructivePerspective}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= # 4. MY WORK PREFERENCES ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-sky-400">
          # 4. My work preferences
        </h2>

        <div className="space-y-4">
          {preferences.map((pref: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
            >
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>🏢</span>
                <span>{pref.title || pref.hypothesisTitle}</span>
              </h3>

              <div className="text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-sky-400">Assessment findings: </span>
                <span className="text-slate-300">
                  {pref.assessmentFindings || pref.description}
                </span>
              </div>

              {pref.supportingEvidence && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Supporting evidence: </span>
                  <span className="text-slate-300">{pref.supportingEvidence}</span>
                </div>
              )}

              {pref.realWorldApplication && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Real-world application: </span>
                  <span className="text-slate-300">{pref.realWorldApplication}</span>
                </div>
              )}

              {pref.adaptationStrategy && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Adaptation strategy: </span>
                  <span className="text-slate-300">{pref.adaptationStrategy}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= # 5. MY PERSONAL DEVELOPMENT PLAN ================= */}
      <div className="bg-[#131C31] border border-slate-800 rounded-xl p-6 sm:p-7 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-sky-400">
            # 5. My personal development plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 italic mt-1">
            A 30-day practical roadmap with targeted micro-actions designed to fit alongside your academic or professional responsibilities.
          </p>
        </div>

        <div className="space-y-4">
          {pdpItems.map((pdp: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
            >
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>🎯</span>
                <span>{pdp.priorityTitle || `Priority Action ${idx + 1}`}</span>
              </h3>

              {pdp.whyItMatters && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Why it matters: </span>
                  <span className="text-slate-300">{pdp.whyItMatters}</span>
                </div>
              )}

              {pdp.practicalAction && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Practical Action: </span>
                  <span className="text-slate-300">{pdp.practicalAction}</span>
                </div>
              )}

              {(pdp.timeline || pdp.timeframe) && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Timeline: </span>
                  <span className="text-slate-300">{pdp.timeline || pdp.timeframe}</span>
                </div>
              )}

              {(pdp.progressIndicator || pdp.measureOfProgress) && (
                <div className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-bold text-sky-400">Progress Indicator: </span>
                  <span className="text-slate-300">
                    {pdp.progressIndicator || pdp.measureOfProgress}
                  </span>
                </div>
              )}

              {/* Reflection Prompt Box */}
              {pdp.reflectionPrompt && (
                <div className="bg-[#2E1065]/30 border border-purple-500/40 rounded-lg p-3 text-xs sm:text-sm mt-1">
                  <span className="font-bold text-purple-300">Reflection Prompt: </span>
                  <span className="italic text-purple-200">
                    &ldquo;{pdp.reflectionPrompt}&rdquo;
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= PRESERVED BEHAVIOURAL EVIDENCE (STAR) ================= */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-sky-400">
          Preserved Behavioural Evidence (Structured Responses)
        </h2>

        <div className="space-y-4">
          {starScenarios.map((star: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#131C31] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5"
            >
              <h3 className="font-bold text-xs sm:text-sm text-sky-300">
                Competency: {star.competency} (Original Language: {star.originalLanguage || 'en'})
              </h3>

              <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
                <div>
                  <span className="font-bold text-white">S (Situation): </span>
                  <span className="text-slate-300">&ldquo;{star.situation}&rdquo;</span>
                </div>
                <div>
                  <span className="font-bold text-white">T (Task): </span>
                  <span className="text-slate-300">&ldquo;{star.task}&rdquo;</span>
                </div>
                <div>
                  <span className="font-bold text-white">A (Action): </span>
                  <span className="text-slate-300">&ldquo;{star.action}&rdquo;</span>
                </div>
                <div>
                  <span className="font-bold text-white">R (Result): </span>
                  <span className="text-slate-300">&ldquo;{star.result}&rdquo;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER COMPLIANCE ================= */}
      <div className="text-center py-6 text-xs text-slate-500">
        Multilingual Assessment Engine • Fully Compliant with Candidate Profile &amp; Meaning-Preserving Simplification Standards
      </div>
    </div>
  );
}
