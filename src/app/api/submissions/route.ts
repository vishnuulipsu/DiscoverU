import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Submission } from '@/models/Submission';
import { Assessment } from '@/models/Assessment';
import { EvaluationResult } from '@/models/EvaluationResult';
import { PromptVersion } from '@/models/PromptVersion';
import mongoose from 'mongoose';
import { SAMPLE_QUESTIONS } from '@/lib/seed-data';
import { runGeminiEvaluation } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { candidateName, candidateEmail, languageSelected, answers, assessmentId } = body;

    if (!candidateName || !candidateEmail || !answers || !assessmentId) {
      return NextResponse.json({ success: false, error: 'Missing required submission fields' }, { status: 400 });
    }

    // Save initial Submission document
    const submission = await Submission.create({
      assessmentId,
      candidateName,
      candidateEmail,
      languageSelected: languageSelected || 'en',
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
    const roleTarget = assessment?.roleTarget || 'Senior Software Engineer / Tech Lead';
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
      // Ignore if prompt versions collection is empty
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
    const evaluation = await runGeminiEvaluation(
      {
        candidateName,
        candidateEmail,
        candidateLanguage: languageSelected || 'en',
        roleTarget,
        assessmentVersion,
        answers: enrichedAnswers,
      },
      activeRecruiterPrompt?.userPromptTemplate,
      activeCandidatePrompt?.userPromptTemplate
    );

    // Save EvaluationResult document
    const evalDoc = await EvaluationResult.create({
      submissionId: submission._id.toString(),
      assessmentId,
      candidateName,
      candidateEmail,
      candidateLanguage: languageSelected || 'en',
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
    console.error('Submission processing error:', err);
    const message = err instanceof Error ? err.message : 'Evaluation pipeline failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
