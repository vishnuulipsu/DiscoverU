import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CandidateGrowthView } from '@/components/CandidateGrowthView';
import { getGroundedMockEvaluation } from '@/lib/gemini';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult } from '@/models/EvaluationResult';
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

  if (evalId) {
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

        return {
          growthReport: report,
          candidateName: doc.candidateName,
          candidateLanguage: chosenLang,
          isLiveDb: true,
          evalId: doc._id.toString(),
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
    const doc = nandiniDoc || await EvaluationResult.findOne().sort({ createdAt: -1 }).lean();
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

      return {
        growthReport: report,
        candidateName: doc.candidateName,
        candidateLanguage: chosenLang,
        isLiveDb: true,
        evalId: doc._id.toString(),
      };
    }
  } catch {
    // Fall back to grounded mock demo
  }

  return {
    growthReport: getNandiniReportForLang(chosenLang),
    candidateName: 'Nandini',
    candidateLanguage: chosenLang,
    isLiveDb: false,
    evalId: undefined,
  };
}

export default async function CandidatePage({ searchParams }: CandidatePageProps) {
  const resolvedParams = await searchParams;
  const data = await getCandidateGrowthData(resolvedParams?.evalId, resolvedParams?.lang);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar currentLanguage={data.candidateLanguage} />

      {/* Top Breadcrumb & Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-500 hover:text-[var(--ulipsu-indigo)] flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800">Candidate Growth & Self-Discovery</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <span className="text-[11px] text-gray-500 px-2 font-medium">View in:</span>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=en` : `/candidate?lang=en`}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  data.candidateLanguage === 'en'
                    ? 'bg-white shadow-xs text-[var(--ulipsu-indigo)]'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                English
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=hi` : `/candidate?lang=hi`}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  data.candidateLanguage === 'hi'
                    ? 'bg-white shadow-xs text-[var(--ulipsu-indigo)]'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                हिन्दी
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=kn` : `/candidate?lang=kn`}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  data.candidateLanguage === 'kn'
                    ? 'bg-white shadow-xs text-[var(--ulipsu-indigo)]'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                ಕನ್ನಡ
              </Link>
            </div>

            <Link
              href={data.evalId ? `/recruiter?evalId=${data.evalId}` : `/recruiter`}
              className="text-xs font-semibold text-[var(--ulipsu-indigo)] hover:underline flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
              <span>Switch to Recruiter View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Candidate Growth Report Content */}
      <main className="flex-1 py-6">
        <CandidateGrowthView
          growthReport={data.growthReport}
          candidateName={data.candidateName}
        />
      </main>

      {/* Consistent Footer */}
      <Footer />
    </div>
  );
}
