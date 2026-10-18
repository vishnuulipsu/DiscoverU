import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/models/Assessment';
import { generateAssessmentWithGemini, GenerateAssessmentParams } from '@/lib/assessment-generator';
import { handleApiError } from '@/lib/api-error';

export async function POST(req: Request) {
  try {
    let body: GenerateAssessmentParams;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const { candidateName, currentRole, targetIndustry, testTrack, assessmentTrack, language } = body || {};

    if (!targetIndustry || !currentRole) {
      return NextResponse.json(
        { success: false, error: 'Target industry and current role are required.', code: 'MISSING_PARAMETERS' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Determine track: explicit assessmentTrack, or inferred from currentRole
    const determinedTrack: 'professional' | 'student' =
      assessmentTrack ||
      (currentRole?.toLowerCase().includes('student') || currentRole?.toLowerCase().includes('fresher')
        ? 'student'
        : 'professional');

    // Generate bespoke assessment dilemmas using AI Engine / Psychometric suites
    const generated = await generateAssessmentWithGemini({
      candidateName: candidateName || 'Candidate',
      currentRole,
      targetIndustry,
      testTrack: testTrack || 'full',
      assessmentTrack: determinedTrack,
      language: language || 'en',
    });

    // Save customized assessment into MongoDB
    const assessmentDoc = await Assessment.create({
      title: generated.title,
      roleTarget: generated.roleTarget,
      version: generated.generatedByAi ? 'v2.0-gemini' : 'v2.0-dynamic',
      description: generated.description,
      track: determinedTrack,
      timeLimitMinutes: generated.questions.length * 4,
      questions: generated.questions,
    });

    return NextResponse.json({
      success: true,
      assessmentId: assessmentDoc._id.toString(),
      roleTarget: generated.roleTarget,
      title: generated.title,
      track: determinedTrack,
      questions: generated.questions,
      version: generated.generatedByAi ? 'v2.0-gemini' : 'v2.0-dynamic',
      generatedByAi: generated.generatedByAi,
    });
  } catch (err: unknown) {
    return handleApiError(err, 'POST /api/assessments/generate');
  }
}
