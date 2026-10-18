import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AssessmentRoom } from '@/components/AssessmentRoom';
import { SAMPLE_QUESTIONS } from '@/lib/seed-data';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/models/Assessment';

export const dynamic = 'force-dynamic';

async function getAssessmentData() {
  try {
    await connectToDatabase();
    const doc = await Assessment.findOne({ status: 'published' }).lean();
    if (doc) {
      return {
        assessmentId: (doc._id as unknown as { toString(): string }).toString(),
        roleTarget: doc.roleTarget || 'Senior Software Engineer / Tech Lead',
        version: doc.version || 'v1.0.0',
        questions: JSON.parse(JSON.stringify(doc.questions)),
      };
    }
  } catch (e) {
    console.warn('MongoDB connection fallback to static seed in assessment page:', e);
  }

  // Graceful fallback to rich sample questions
  return {
    assessmentId: 'seed-assessment-lead-dev-01',
    roleTarget: 'Senior Software Engineer / Tech Lead',
    version: 'v1.0.0',
    questions: SAMPLE_QUESTIONS,
  };
}

export default async function AssessmentPage() {
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
          initialLanguage="en"
        />
      </main>
      <Footer />
    </div>
  );
}
