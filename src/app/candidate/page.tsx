import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CandidateGrowthView } from '@/components/CandidateGrowthView';
import { getGroundedMockEvaluation } from '@/lib/gemini';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult, type ICandidateGrowthReport } from '@/models/EvaluationResult';
import mongoose from 'mongoose';
import { NANDINI_GROWTH_REPORT, NANDINI_GROWTH_REPORT_HI, NANDINI_GROWTH_REPORT_KN } from '@/lib/seed-data';
import { ArrowLeft, UserCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CandidatePageProps {
  searchParams: Promise<{ evalId?: string; lang?: string }>;
}

function localizeReportForLanguage(
  report: ICandidateGrowthReport,
  chosenLang: 'en' | 'hi' | 'kn',
  meta: { candidateName?: string; candidateEmail?: string; roleTarget?: string }
): ICandidateGrowthReport {
  const storedLang = report?.language === 'hi' || report?.language === 'kn' ? report.language : 'en';
  if (storedLang === chosenLang) return report;

  const localized = getGroundedMockEvaluation({
    candidateName: meta.candidateName || 'Candidate',
    candidateEmail: meta.candidateEmail || '',
    candidateLanguage: chosenLang,
    roleTarget: meta.roleTarget || 'Software Professional',
    assessmentVersion: '1.0',
    answers: [],
  }).candidateView;

  if (report.personalityProfile?.oceanScores) {
    localized.personalityProfile = {
      ...localized.personalityProfile,
      oceanScores: report.personalityProfile.oceanScores,
    };
  }
  if (report.candidateId) localized.candidateId = report.candidateId;
  if (report.totalQuestions) localized.totalQuestions = report.totalQuestions;
  if (report.scoringIntegrity) {
    localized.scoringIntegrity = {
      ...report.scoringIntegrity,
      languagesUsed: [chosenLang],
      verificationStatus:
        chosenLang === 'hi'
          ? 'स्कोरिंग सत्यनिष्ठा सत्यापित: भाषा या सरलीकरण अनुरोध पर 0 स्कोर प्रभाव।'
          : chosenLang === 'kn'
          ? 'ಸ್ಕೋರಿಂಗ್ ಸಮಗ್ರತೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ: ಭಾಷೆ ಅಥವಾ ಸರಳೀಕರಣ ವಿನಂತಿಗೆ 0 ಅಂಕ ಕಡಿತ.'
          : 'Scoring Integrity Verified: Evaluation conducted with 0 score impact or penalty for language or simplification requests.',
    };
  }
  return localized;
}

async function getCandidateGrowthData(evalId?: string, requestedLang?: string) {
  const explicitLang = (requestedLang === 'hi' || requestedLang === 'kn' || requestedLang === 'en') ? requestedLang as 'en' | 'hi' | 'kn' : undefined;

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
        const rawCandidate = (doc.candidateView as unknown) as Record<string, unknown> | undefined;
        const storedLang = ((doc as unknown as Record<string, unknown>).candidateLanguage as string) || (rawCandidate?.language as string);
        const chosenLang: 'en' | 'hi' | 'kn' = explicitLang || (storedLang === 'hi' || storedLang === 'kn' ? storedLang : 'en');

        const isNandini = doc.candidateName?.toLowerCase().includes('nandini') || doc.candidateEmail?.includes('nandini');
        const isCandidateValid = rawCandidate?.personalityProfile && Array.isArray(rawCandidate?.potentialStrengths) && rawCandidate.potentialStrengths.length > 0;
        const baseReport = isNandini
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
        const report = isNandini
          ? baseReport
          : localizeReportForLanguage(baseReport, chosenLang, {
              candidateName: doc.candidateName,
              candidateEmail: doc.candidateEmail,
              roleTarget: targetRole,
            });

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
      const rawCandidate = (doc.candidateView as unknown) as Record<string, unknown> | undefined;
      const storedLang = ((doc as unknown as Record<string, unknown>).candidateLanguage as string) || (rawCandidate?.language as string);
      const chosenLang: 'en' | 'hi' | 'kn' = explicitLang || (storedLang === 'hi' || storedLang === 'kn' ? storedLang : 'en');

      const isNandini = doc.candidateName?.toLowerCase().includes('nandini') || doc.candidateEmail?.includes('nandini');
      const isCandidateValid = rawCandidate?.personalityProfile && Array.isArray(rawCandidate?.potentialStrengths) && rawCandidate.potentialStrengths.length > 0;
      const baseReport = isNandini
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
      const report = isNandini
        ? baseReport
        : localizeReportForLanguage(baseReport, chosenLang, {
            candidateName: doc.candidateName,
            candidateEmail: doc.candidateEmail,
            roleTarget: targetRole,
          });

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

  const defaultLang: 'en' | 'hi' | 'kn' = explicitLang || 'en';
  return {
    growthReport: getNandiniReportForLang(defaultLang),
    candidateName: 'Nandini Perumal',
    candidateLanguage: defaultLang,
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar currentLanguage={data.candidateLanguage} />

      {/* Top Breadcrumb & Status Navigation */}
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
            <span className="font-semibold text-gray-800">Candidate Growth &amp; Self-Discovery</span>
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <span className="px-3 py-1 rounded text-xs font-semibold bg-white shadow-xs text-[var(--ulipsu-indigo)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
                <span>Candidate Report</span>
              </span>
              <Link
                href={data.evalId ? `/recruiter?evalId=${data.evalId}` : `/recruiter`}
                className="px-3 py-1 rounded text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Recruiter Suite</span>
              </Link>
            </div> */}
            <div className="flex items-center gap-1 bg-white border border-[var(--ulipsu-border)] p-1 rounded-lg">
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=en` : `/candidate?lang=en`}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'en'
                    ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                English
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=hi` : `/candidate?lang=hi`}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'hi'
                    ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                हिन्दी
              </Link>
              <Link
                href={data.evalId ? `/candidate?evalId=${data.evalId}&lang=kn` : `/candidate?lang=kn`}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  data.candidateLanguage === 'kn'
                    ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                ಕನ್ನಡ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Candidate Growth Report Content */}
      <main className="flex-1 py-6">
        <CandidateGrowthView
          growthReport={data.growthReport}
          candidateName={data.candidateName}
          targetRole={data.targetRole}
          candidateId={data.candidateId}
          language={data.candidateLanguage}
        />
      </main>

      <Footer />
    </div>
  );
}
