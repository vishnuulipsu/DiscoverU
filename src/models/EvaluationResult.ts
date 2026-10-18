import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecruiterEvaluation {
  // Section 1: Role-Fit Summary
  roleFitSummary: {
    roleAssessed: string;
    competenciesEvaluated: string[];
    assessmentVersion: string;
    overallEvidenceSummary: string;
  };

  // Section 2: Competency Scorecard
  competencyScorecard: Array<{
    competencyName: string;
    score: number; // 1 to 5
    criteria: string;
    evidenceExcerpt: string;
  }>;

  // Section 3: Evidence from Responses (Separation of facts vs interpretation)
  evidenceFromResponses: Array<{
    questionId: string;
    competency: string;
    candidateStatedFact: string; // Verbatim raw quote from candidate
    englishTranslation?: string; // If candidate answered in Hindi or Kannada
    aiInterpretation: string;
    missingEvidenceNote?: string;
  }>;

  // Section 4: Strengths and Areas to Probe
  strengthsAndProbes: {
    strengths: string[];
    areasToProbe: string[];
    contextualNotes: string; // Explains low evidence != low capability
  };

  // Section 5: Recommended Follow-up
  recommendedFollowUp: Array<{
    followUpQuestion: string;
    rationaleOrPracticalTask: string;
    targetedCompetency: string;
  }>;

  // Section 6: Decision Support and Fairness
  decisionSupportAndFairness: {
    rubricOverview: string;
    uncertaintiesNoted: string[];
    missingInformationNotes: string;
    fairnessComplianceVerified: boolean;
    humanReviewerSignedOff: boolean;
  };
}

export interface ICandidateGrowthReport {
  language: 'en' | 'hi' | 'kn';
  candidateId?: string;
  totalQuestions?: number;
  scoringIntegrity?: {
    languagesUsed: string[];
    simplificationRequestsCount: number;
    scoreImpactOrPenalty: number;
    verificationStatus: string;
  };

  // Section 1: My personality profile (OCEAN)
  personalityProfile: {
    oceanScores: {
      openness: number; // e.g. 3.5
      conscientiousness: number; // e.g. 3.8
      extraversion: number; // e.g. 2.3
      agreeableness: number; // e.g. 2.8
      emotionalStability: number; // e.g. 3.5
    };
    traitExplanations: {
      openness: string;
      conscientiousness: string;
      extraversion: string;
      agreeableness: string;
      emotionalStability: string;
    };
    uncertaintyNote: string;
    oceanDetails?: Array<{
      trait: string;
      score: number;
      maxScore: number;
      supportedInterpretation: string;
      everydayContext: string;
      tradeOffs: string;
    }>;
  };

  // Section 2: My potential strengths
  potentialStrengths: Array<{
    title: string;
    tendency?: string;
    supportedStarExample?: string;
    whatAssessmentSuggests?: string;
    starEvidenceQuote?: string;
    whereItMayHelp?: string;
  }>;

  // Section 3: My blind spots and challenges
  blindSpotsAndChallenges: Array<{
    area?: string;
    evidenceContext?: string;
    constructivePerspective?: string;
    title?: string;
    whyItMayOccur?: string;
    howItMightAppear?: string;
    whatToWatchFor?: string;
    constructiveAdjustment?: string;
  }>;

  // Section 4: My work preferences
  workPreferences: Array<{
    hypothesisTitle?: string;
    environmentType?: string;
    description?: string;
    title?: string;
    assessmentFindings?: string;
    supportingEvidence?: string;
    realWorldApplication?: string;
    adaptationStrategy?: string;
  }>;

  // Section 5: My personal development plan (30-day practical actions)
  personalDevelopmentPlan: Array<{
    timeframe?: string;
    suggestedHabit?: string;
    priorityTitle?: string;
    whyItMatters?: string;
    practicalAction: string;
    timeline?: string;
    progressIndicator?: string;
    measureOfProgress?: string;
    reflectionPrompt?: string;
  }>;

  // Preserved STAR Behavioural Evidence
  preservedStarEvidence?: Array<{
    competency: string;
    originalLanguage: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  }>;
}

export interface IEvaluationResult extends Document {
  submissionId: string;
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLanguage: 'en' | 'hi' | 'kn';
  modelUsed: string;
  promptVersionUsed: number;
  recruiterView: IRecruiterEvaluation;
  candidateView: ICandidateGrowthReport;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationResultSchema = new Schema<IEvaluationResult>(
  {
    submissionId: { type: String, required: true, index: true },
    assessmentId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    candidateLanguage: { type: String, enum: ['en', 'hi', 'kn'], default: 'en' },
    modelUsed: { type: String, default: 'gemini-2.5-pro' },
    promptVersionUsed: { type: Number, default: 1 },
    recruiterView: { type: Schema.Types.Mixed, required: true },
    candidateView: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const EvaluationResult: Model<IEvaluationResult> =
  mongoose.models.EvaluationResult || mongoose.model<IEvaluationResult>('EvaluationResult', EvaluationResultSchema);
