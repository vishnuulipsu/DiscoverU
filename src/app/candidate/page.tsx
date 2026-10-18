import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CandidateGrowthView } from '@/components/CandidateGrowthView';
import { getGroundedMockEvaluation } from '@/lib/gemini';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult } from '@/models/EvaluationResult';
import mongoose from 'mongoose';
import { NANDINI_GROWTH_REPORT, NANDINI_GROWTH_REPORT_HI, NANDINI_GROWTH_REPORT_KN } from '@/lib/seed-data';
import { ArrowLeft, UserCheck, Sparkles, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CandidatePageProps {
  searchParams: Promise<{ evalId?: string; lang?: string }>;
}

async function getCandidateGrowthData(evalId?: string, requestedLang?: string) {
  const chosenLang = (requestedLang === 'hi' || requestedLang === 'kn' ? requestedLang : 'en') as 'en' | 'hi' | 'kn';

  // Helper to retrieve localized Nandini report
  const getNandiniReportForLang = (l: 'en' | 'hi' | 'kn') => {
    if (l === 'hi') return NANDINI_GROWTH_REPORT_HI;
    if (l === 'kn') return NANDINI_GROWTH_REPORT_KN;
    return NANDINI_GROWTH_REPORT;
  };

  if (evalId && mongoose.isValidObjectId(evalId)) {
    try {
      await connectToDatabase();
      const doc = await EvaluationResult.findById(evalId).lean();
      if (doc && doc.candidateView) {
        const isNandini = doc.candidateName?.toLowerCase().includes('nandini') || doc.candidateEmail?.includes('nandini');
        const rawCandidate = (doc.candidateView as unknown) as Record<string, unknown> | undefined;
        const isCandidateValid = rawCandidate?.personalityProfile && Array.isArray(rawCandidate?.potentialStrengths) && rawCandidate.potentialStrengths.length > 0;
        const report = isNandini
          ? getNandiniReportForLang(chosenLang)
          : (isCandidateValid
              ? JSON.parse(JSON.stringify(rawCandidate))
              : getGroundedMockEvaluation({
                  candidateName: doc.candidateName,
                  candidateEmail: doc.candidateEmail,
                  candidateLanguage: chosenLang,
                  roleTarget: 'Software Professional',
                  assessmentVersion: '1.0',
                  answers: [],
                }).candidateView);

        const candidateProfile = doc.candidateProfile as Record<string, unknown> | undefined;
        const targetRole = (candidateProfile?.targetRole as string) || doc.recruiterView?.roleFitSummary?.roleAssessed || 'Product Management';

        return {
          growthReport: report,
          candidateName: doc.candidateName || 'Nandini Perumal',
          candidateLanguage: chosenLang,
          isLiveDb: true,
          evalId: doc._id.toString(),
          targetRole,
          candidateId: doc.candidateView?.candidateId || doc._id.toString() || 'cand_1792308629917',
        };
      }
    } catch (e) {
      console.warn('Could not load candidate evaluation by ID:', e);
    }
  }

  // Check if Nandini or latest evaluation exists in DB
  try {
    await connectToDatabase();
    const nandiniDoc = await EvaluationResult.findOne({ candidateName: /Nandini/i }).lean();
    const doc = nandiniDoc || (await EvaluationResult.findOne().sort({ createdAt: -1 }).lean());
    if (doc && doc.candidateView) {
      const isNandini = doc.candidateName?.toLowerCase().includes('nandini') || doc.candidateEmail?.includes('nandini');
      const rawCandidate = (doc.candidateView as unknown) as Record<string, unknown> | undefined;
      const isCandidateValid = rawCandidate?.personalityProfile && Array.isArray(rawCandidate?.potentialStrengths) && rawCandidate.potentialStrengths.length > 0;
      const report = isNandini
        ? getNandiniReportForLang(chosenLang)
        : (isCandidateValid
            ? JSON.parse(JSON.stringify(rawCandidate))
            : getGroundedMockEvaluation({
                candidateName: doc.candidateName,
                candidateEmail: doc.candidateEmail,
                candidateLanguage: chosenLang,
                roleTarget: 'Software Professional',
                assessmentVersion: '1.0',
                answers: [],
              }).candidateView);

      const candidateProfile = doc.candidateProfile as Record<string, unknown> | undefined;
      const targetRole = (candidateProfile?.targetRole as string) || doc.recruiterView?.roleFitSummary?.roleAssessed || 'Product Management';

      return {
        growthReport: report,
        candidateName: doc.candidateName || 'Nandini Perumal',
        candidateLanguage: chosenLang,
        isLiveDb: true,
        evalId: doc._id.toString(),
        targetRole,
        candidateId: doc.candidateView?.candidateId || doc._id.toString() || 'cand_1792308629917',
      };
    }
  } catch {
    // Fall back to grounded mock demo
  }

  return {
    growthReport: getNandiniReportForLang(chosenLang),
    candidateName: 'Nandini Perumal',
    candidateLanguage: chosenLang,
    isLiveDb: false,
    evalId: undefined,
    targetRole: 'Product Management',
    candidateId: 'cand_1792308629917',
  };
}

export default async function CandidatePage({ searchParams }: CandidatePageProps) {
  const resolvedParams = await searchParams;
  const data = await getCandidateGrowthData(resolvedParams?.evalId, resolvedParams?.lang);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar currentLanguage={data.candidateLanguage} theme="dark" />

      {/* Top Breadcrumb & Status Navigation */}
      <div className="bg-[#0B1120] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-semibold text-slate-200">Candidate Growth &amp; Self-Discovery</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1E293B] border border-slate-700/80 p-1 rounded-lg">
              <span className="text-[11px] text-slate-400 px-2 font-medium">View in:</span>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=en` : `/candidate?lang=en`}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'en'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=hi` : `/candidate?lang=hi`}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'hi'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=kn` : `/candidate?lang=kn`}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'kn'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </Link>
            </div>

            <Link
              href={data.evalId ? `/recruiter?evalId=${data.evalId}` : `/recruiter`}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to Recruiter View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Candidate Growth Report Content */}
      <main className="flex-1 py-6 bg-[#0B1120]">
        <CandidateGrowthView
          growthReport={data.growthReport}
          candidateName={data.candidateName}
          targetRole={data.targetRole}
          candidateId={data.candidateId}
        />
      </main>
    </div>
  );
}
