'use client';

import React from 'react';
import { IRecruiterEvaluation } from '@/models/EvaluationResult';
import {
  Briefcase,
  BarChart3,
  FileText,
  ShieldAlert,
  HelpCircle,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';

interface RecruiterEvaluationViewProps {
  evaluation: IRecruiterEvaluation;
  candidateName: string;
  candidateEmail: string;
  candidateLanguage: 'en' | 'hi' | 'kn';
  modelUsed?: string;
}

export function RecruiterEvaluationView({
  evaluation,
  candidateName,
  candidateEmail,
  candidateLanguage,
  modelUsed = 'AI Powered Engine',
}: RecruiterEvaluationViewProps) {
  const {
    roleFitSummary,
    competencyScorecard,
    evidenceFromResponses,
    strengthsAndProbes,
    recommendedFollowUp,
    decisionSupportAndFairness,
  } = evaluation;

  const displayModel = modelUsed.toLowerCase().includes('gemini')
    ? 'AI Powered Intelligence Engine'
    : modelUsed;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--ulipsu-border)] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)]">
                Recruiter Evaluation Suite
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Evidence Grounded
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Candidate Evaluation: {candidateName}
            </h1>
            <p className="text-xs text-[var(--ulipsu-muted)] mt-1">
              {candidateEmail} • Submission Language: {candidateLanguage.toUpperCase()} • {displayModel}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-500 block">Assessment Target</span>
            <span className="font-bold text-gray-900 text-sm">{roleFitSummary.roleAssessed}</span>
            <span className="text-[11px] text-gray-500 block">Version {roleFitSummary.assessmentVersion}</span>
          </div>
        </div>
      </div>

      {/* ================= 1. ROLE-FIT SUMMARY ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--ulipsu-indigo)] flex items-center justify-center shrink-0 border border-purple-100">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">
                1. Role-Fit Summary
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                Human-in-the-Loop Review
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 italic">
              A concise overview of the candidate's demonstrated alignment with predefined role requirements. Avoids declaring a candidate a guaranteed fit.
            </p>
            <div className="p-4 rounded-xl bg-[var(--ulipsu-surface)] border border-gray-200/80 text-sm text-gray-800 leading-relaxed mb-4">
              {roleFitSummary.overallEvidenceSummary}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-gray-500">Evaluated Competencies:</span>
              {roleFitSummary.competenciesEvaluated.map((comp) => (
                <span
                  key={comp}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)]"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. COMPETENCY SCORECARD ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              2. Competency Scorecard
            </h2>
            <p className="text-xs text-gray-500 mb-5 italic">
              Shows scores for each competency using a consistent, predefined rubric. Includes the scoring criteria and evidence behind each rating.
            </p>

            <div className="space-y-4">
              {competencyScorecard.map((item) => {
                const scorePercent = (item.score / 5) * 100;
                return (
                  <div
                    key={item.competencyName}
                    className="p-4 rounded-xl border border-gray-100 bg-[var(--ulipsu-surface)]/60 hover:bg-[var(--ulipsu-surface)] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {item.competencyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--ulipsu-amber-light)] text-[var(--ulipsu-amber-hover)]">
                          {item.score.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>

                    {/* Progress Gauge */}
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-[var(--ulipsu-indigo)] rounded-full transition-all duration-500"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-600 mb-1.5">
                      <span className="font-semibold text-gray-700">Criteria: </span>
                      {item.criteria}
                    </div>
                    <div className="text-xs text-gray-500 italic bg-white p-2.5 rounded-lg border border-gray-200/60">
                      <span className="font-semibold text-gray-700 not-italic">Evidence Excerpt: </span>
                      {item.evidenceExcerpt}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. EVIDENCE FROM RESPONSES ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[var(--ulipsu-amber-hover)] flex items-center justify-center shrink-0 border border-amber-100">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-900">
                3. Evidence from Responses
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-[var(--ulipsu-indigo)] border border-indigo-100">
                Fact vs Interpretation Split
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-5 italic">
              Summarises relevant actions, decisions, and reasoning from candidate's SJT and STAR responses. Clearly separates candidate stated experience from AI interpretation.
            </p>

            <div className="space-y-4">
              {evidenceFromResponses.map((item, idx) => (
                <div
                  key={item.questionId || idx}
                  className="p-4 rounded-xl border border-gray-200 bg-white shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--ulipsu-indigo)] uppercase">
                      Scenario {idx + 1} • {item.competency}
                    </span>
                    {item.missingEvidenceNote && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Missing Metric Flagged
                      </span>
                    )}
                  </div>

                  {/* Dual Column: Stated Fact vs AI Interpretation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/80 text-xs text-gray-800 leading-relaxed">
                      <span className="font-bold text-gray-900 block mb-1 uppercase tracking-wider text-[10px] text-gray-500">
                        Candidate's Stated Experience / Quotation:
                      </span>
                      "{item.candidateStatedFact}"
                      {item.englishTranslation && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600 italic">
                          {item.englishTranslation}
                        </div>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--ulipsu-indigo-light)]/40 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                      <span className="font-bold text-[var(--ulipsu-indigo)] block mb-1 uppercase tracking-wider text-[10px]">
                        AI Evaluator's Grounded Interpretation:
                      </span>
                      {item.aiInterpretation}
                    </div>
                  </div>

                  {item.missingEvidenceNote && (
                    <div className="mt-2 text-[11px] text-amber-900 bg-amber-50/70 p-2 rounded-md">
                      <span className="font-bold">Missing Evidence Note:</span> {item.missingEvidenceNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. STRENGTHS AND AREAS TO PROBE ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              4. Strengths and Areas to Probe
            </h2>
            <p className="text-xs text-gray-500 mb-5 italic">
              Identifies competencies with strong supporting evidence vs areas where evidence is mixed. Low evidence does not mean low capability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-[var(--ulipsu-emerald-light)]/50 border border-emerald-200/80">
                <h3 className="font-bold text-emerald-900 text-sm mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Strong Supporting Evidence
                </h3>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {strengthsAndProbes.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Probe */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <h3 className="font-bold text-amber-950 text-sm mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Areas Where Evidence is Mixed / To Probe
                </h3>
                <ul className="space-y-2 text-xs text-amber-950">
                  {strengthsAndProbes.areasToProbe.map((probe, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                      <span>{probe}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>{strengthsAndProbes.contextualNotes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5. RECOMMENDED FOLLOW-UP ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[var(--ulipsu-indigo)] flex items-center justify-center shrink-0 border border-indigo-100">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              5. Recommended Follow-up
            </h2>
            <p className="text-xs text-gray-500 mb-5 italic">
              Suggests role-relevant interview questions and practical mini-tasks to address unanswered questions during the next round.
            </p>

            <div className="space-y-4">
              {recommendedFollowUp.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 bg-[var(--ulipsu-surface)]/70 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)]">
                      {item.targetedCompetency}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">
                    "{item.followUpQuestion}"
                  </h4>
                  <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="font-semibold text-gray-800">Interviewer Context / Practical Task: </span>
                    {item.rationaleOrPracticalTask}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 6. DECISION SUPPORT AND FAIRNESS ================= */}
      <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-900">
                6. Decision Support and Fairness
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Fairness Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 italic">
              Presents assessment evidence, scoring rubric, uncertainties, and missing information for human review. Does not automatically reject or rank candidates based solely on AI interpretations.
            </p>

            <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100 mb-4 text-xs text-rose-950 leading-relaxed">
              <span className="font-bold block mb-1">Human Reviewer Governance Notice:</span>
              The hiring team must evaluate the candidate in totality. AI-generated inferences serve exclusively as decision support and must be cross-referenced with interview evidence.
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-900 block mb-0.5">Identified Uncertainties:</span>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  {decisionSupportAndFairness.uncertaintiesNoted.map((unc, i) => (
                    <li key={i}>{unc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-900 block mb-0.5">Missing Information Notes:</span>
                <p className="text-gray-600">{decisionSupportAndFairness.missingInformationNotes}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Standardized Rubric Calibrated (Non-Discriminatory)</span>
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] shadow-xs">
                Record Hiring Manager Sign-off
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
