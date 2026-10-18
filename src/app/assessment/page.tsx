import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AssessmentRoom } from '@/components/AssessmentRoom';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/models/Assessment';
import { buildProfessionalQuestions } from '@/lib/assessment-tracks';

export const dynamic = 'force-dynamic';

async function getAssessmentData() {
  try {
    await connectToDatabase();
    const doc = await Assessment.findOne({ status: 'published' }).lean();
    if (doc) {
      const rawQuestions = JSON.parse(JSON.stringify(doc.questions));
      const sanitizedQuestions = Array.isArray(rawQuestions)
        ? rawQuestions.filter(
            (q: { questionType?: string; category?: string; questionId?: string }) =>
              q.questionType !== 'subjective_star' &&
              q.category !== 'star' &&
              !q.questionId?.startsWith('star_')
          )
        : [];
      return {
        assessmentId: (doc._id as unknown as { toString(): string }).toString(),
        roleTarget: doc.roleTarget || 'Senior Software Engineer / Tech Lead',
        version: doc.version || 'v1.0.0',
        questions: sanitizedQuestions.length > 0 ? sanitizedQuestions : buildProfessionalQuestions('Senior Software Engineer', 'saas'),
      };
    }
  } catch (e) {
    console.warn('MongoDB connection fallback to static seed in assessment page:', e);
  }

  // Graceful fallback to 30 workplace behavioral questions
  return {
    assessmentId: 'seed-assessment-lead-dev-01',
    roleTarget: 'Senior Software Engineer / Tech Lead',
    version: 'v1.0.0',
    questions: buildProfessionalQuestions('Senior Software Engineer', 'saas'),
  };
}

interface AssessmentPageProps {
  searchParams?: Promise<{ lang?: string }>;
}

export default async function AssessmentPage({ searchParams }: AssessmentPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialLang = (resolvedParams?.lang === 'hi' || resolvedParams?.lang === 'kn' ? resolvedParams.lang : 'en') as 'en' | 'hi' | 'kn';
  const data = await getAssessmentData();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar />
      <main className="flex-1">
        <AssessmentRoom
          assessmentId={data.assessmentId}
          roleTarget={data.roleTarget}
          version={data.version}
          questions={data.questions}
          initialLanguage={initialLang}
        />
      </main>
      <Footer />
    </div>
  );
}
