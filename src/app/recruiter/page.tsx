import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecruiterEvaluationView } from '@/components/RecruiterEvaluationView';
import { getGroundedMockEvaluation } from '@/lib/gemini';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult } from '@/models/EvaluationResult';
import { NANDINI_RECRUITER_EVALUATION } from '@/lib/seed-data';
import { ArrowLeft, Sparkles, UserCheck, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface RecruiterPageProps {
  searchParams: Promise<{ evalId?: string }>;
}

async function getEvaluationData(evalId?: string) {
  if (evalId) {
    try {
      await connectToDatabase();
      const evalDoc = await EvaluationResult.findById(evalId).lean();
      if (evalDoc) {
        return {
          evaluation: JSON.parse(JSON.stringify(evalDoc.recruiterView)),
          candidateName: evalDoc.candidateName,
          candidateEmail: evalDoc.candidateEmail,
          candidateLanguage: evalDoc.candidateLanguage as 'en' | 'hi' | 'kn',
          modelUsed: evalDoc.modelUsed || 'gemini-3.1-pro',
          isLiveDb: true,
          evalId: evalDoc._id.toString(),
        };
      }
    } catch (err) {
      console.warn('Could not load evaluation by ID from MongoDB:', err);
    }
  }

  // Check if Nandini or latest evaluation exists in DB
  try {
    await connectToDatabase();
    const nandiniDoc = await EvaluationResult.findOne({ candidateName: /Nandini/i }).lean();
    const doc = nandiniDoc || (await EvaluationResult.findOne().sort({ createdAt: -1 }).lean());
    if (doc) {
      return {
        evaluation: JSON.parse(JSON.stringify(doc.recruiterView)),
        candidateName: doc.candidateName,
        candidateEmail: doc.candidateEmail,
        candidateLanguage: doc.candidateLanguage as 'en' | 'hi' | 'kn',
        modelUsed: doc.modelUsed || 'gemini-3.1-pro',
        isLiveDb: true,
        evalId: doc._id.toString(),
      };
    }
  } catch {
    // Fall back to grounded benchmark
  }

  return {
    evaluation: NANDINI_RECRUITER_EVALUATION,
    candidateName: 'Nandini',
    candidateEmail: 'nandini@example.com',
    candidateLanguage: 'en' as const,
    modelUsed: 'AI Powered Intelligence Engine',
    isLiveDb: false,
    evalId: undefined,
  };
}

export default async function RecruiterPage({ searchParams }: RecruiterPageProps) {
  const resolvedParams = await searchParams;
  const data = await getEvaluationData(resolvedParams?.evalId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar currentLanguage={data.candidateLanguage} />

      {/* Top Breadcrumb & Status */}
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
            <span className="font-semibold text-gray-800">Recruiter Evaluation Suite</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${data.isLiveDb ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {data.isLiveDb ? 'Live MongoDB Record' : 'Demo Dataset Loaded'}
            </span>
            <Link
              href={data.evalId ? `/candidate?evalId=${data.evalId}` : '/candidate'}
              className="text-xs font-semibold text-[var(--ulipsu-indigo)] hover:underline flex items-center gap-1"
            >
              <span>View Candidate Growth Report</span>
              <Sparkles className="w-3.5 h-3.5 text-[var(--ulipsu-amber)]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Recruiter Suite Content */}
      <main className="flex-1 py-6">
        <RecruiterEvaluationView
          evaluation={data.evaluation}
          candidateName={data.candidateName}
          candidateEmail={data.candidateEmail}
          candidateLanguage={data.candidateLanguage}
          modelUsed={data.modelUsed}
        />
      </main>

      {/* Consistent Footer */}
      <Footer />
    </div>
  );
}
