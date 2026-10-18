import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Submission } from '@/models/Submission';
import { Assessment } from '@/models/Assessment';
import { EvaluationResult } from '@/models/EvaluationResult';
import { PromptVersion } from '@/models/PromptVersion';
import mongoose from 'mongoose';
import { SAMPLE_QUESTIONS } from '@/lib/seed-data';
import { runGeminiEvaluation } from '@/lib/gemini';
import { handleApiError } from '@/lib/api-error';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const { candidateName, candidateEmail, languageSelected, answers, assessmentId, candidateProfile } = body || {};

    if (!candidateName?.trim() || !candidateEmail?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Candidate name and email are required.', code: 'MISSING_CANDIDATE_INFO' },
        { status: 400 }
      );
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one answered question is required.', code: 'MISSING_ANSWERS' },
        { status: 400 }
      );
    }

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment identifier is required.', code: 'MISSING_ASSESSMENT_ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Save initial Submission document
    const submission = await Submission.create({
      assessmentId,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      languageSelected: languageSelected || 'en',
      candidateProfile: candidateProfile || null,
      status: 'submitted',
      answers,
      submittedAt: new Date(),
    });

    // Fetch assessment metadata to build context
    let assessment = null;
    if (mongoose.isValidObjectId(assessmentId)) {
      assessment = await Assessment.findById(assessmentId);
    }
    if (!assessment) {
      assessment = await Assessment.findOne({ status: 'published' });
    }

    const questionsPool = assessment?.questions && assessment.questions.length > 0 ? assessment.questions : SAMPLE_QUESTIONS;
    const roleTarget = assessment?.roleTarget || candidateProfile?.targetRoleField || 'Senior Software Engineer / Tech Lead';
    const assessmentVersion = assessment?.version || 'v1.0.0';

    // Retrieve active prompt versions from DB
    let activeRecruiterPrompt = null;
    let activeCandidatePrompt = null;
    try {
      activeRecruiterPrompt = await PromptVersion.findOne({
        templateSlug: 'recruiter_evaluation',
        isActive: true,
      });
      activeCandidatePrompt = await PromptVersion.findOne({
        templateSlug: 'candidate_growth',
        isActive: true,
      });
    } catch {
      // Non-fatal if prompt versions collection is empty
    }

    // Map answers with scenario text
    const enrichedAnswers = answers.map((ans: { questionId: string; selectedOptionId: string; writtenRationale: string }) => {
      const q = questionsPool.find((quest) => quest.questionId === ans.questionId) || questionsPool[0];
      const lang = (languageSelected || 'en') as 'en' | 'hi' | 'kn';
      const localizedQ = q?.[lang] || q?.en;
      const selectedOpt = localizedQ?.mcqOptions?.find((opt) => opt.id === ans.selectedOptionId);

      return {
        questionId: ans.questionId,
        competencyName: q?.competencyName || 'Core Competency',
        scenario: localizedQ?.scenario || '',
        selectedOptionText: selectedOpt ? `[${selectedOpt.id}] ${selectedOpt.text}` : ans.selectedOptionId,
        writtenRationale: ans.writtenRationale,
      };
    });

    // Run Gemini 3.1 evaluation pipeline
    let evaluation;
    try {
      evaluation = await runGeminiEvaluation(
        {
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim(),
          candidateLanguage: languageSelected || 'en',
          roleTarget,
          assessmentVersion,
          answers: enrichedAnswers,
        },
        activeRecruiterPrompt?.userPromptTemplate,
        activeCandidatePrompt?.userPromptTemplate
      );
    } catch (evalErr) {
      console.error('[Evaluation Pipeline Warning] runGeminiEvaluation failed, will rely on safe fallback:', evalErr);
      throw evalErr;
    }

    // Save EvaluationResult document
    const evalDoc = await EvaluationResult.create({
      submissionId: submission._id.toString(),
      assessmentId,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidateLanguage: languageSelected || 'en',
      candidateProfile: candidateProfile || null,
      modelUsed: evaluation.modelUsed,
      promptVersionUsed: activeRecruiterPrompt?.versionNumber || 1,
      recruiterView: evaluation.recruiterView,
      candidateView: evaluation.candidateView,
    });

    submission.status = 'evaluated';
    await submission.save();

    return NextResponse.json({
      success: true,
      evaluationId: evalDoc._id.toString(),
      submissionId: submission._id.toString(),
    });
  } catch (err: unknown) {
    return handleApiError(err, 'POST /api/submissions');
  }
}
