import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/models/Assessment';
import { seedInitialDatabase, SAMPLE_QUESTIONS } from '@/lib/seed-data';
import { handleApiError } from '@/lib/api-error';

export async function GET() {
  try {
    try {
      await connectToDatabase();
      let assessment = await Assessment.findOne();
      if (!assessment) {
        await seedInitialDatabase();
        assessment = await Assessment.findOne();
      }
      return NextResponse.json({ success: true, assessment });
    } catch (dbErr) {
      console.warn('[Assessments API] DB connection failed, falling back to static questions:', dbErr);
      return NextResponse.json({
        success: true,
        assessment: {
          title: 'DiscoverU Workplace Diagnostic',
          roleTarget: 'Senior Software Engineer / Tech Lead',
          version: 'v1.0.0',
          questions: SAMPLE_QUESTIONS,
        },
        isFallback: true,
      });
    }
  } catch (err: unknown) {
    return handleApiError(err, 'GET /api/assessments');
  }
}
