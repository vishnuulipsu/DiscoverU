import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMcqOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  simplifiedText?: string;
  points: number; // 1-5 rubric alignment
  rationaleCategory: string; // e.g. 'Proactive Collaboration', 'Process Adherence'
}

export interface ILocalizedQuestionContent {
  title: string;
  scenario: string;
  simplifiedScenario?: string;
  mcqOptions: IMcqOption[];
  writtenPrompt?: string;
  simplifiedPrompt?: string;
  writtenPlaceholder?: string;
}

export interface IDualPaneQuestion {
  questionId: string;
  competencyKey: string;
  competencyName: string;
  questionType?: 'likert' | 'subjective_star' | 'option_explain' | 'mcq_dual';
  category?: 'ocean' | 'star' | 'mbti' | 'holland' | 'situational';
  subCategory?: string; // e.g. 'Openness', 'Conscientiousness', 'Situation', 'E vs I', 'Realistic'
  dimension?: 'O' | 'C' | 'E' | 'A' | 'N';
  isOptionalExplanation?: boolean;
  isRationaleRequired?: boolean;
  en: ILocalizedQuestionContent;
  hi: ILocalizedQuestionContent;
  kn: ILocalizedQuestionContent;
  idealEvidenceCriteria?: string;
}

export interface IAssessment extends Document {
  title: string;
  roleTarget: string; // e.g. "Senior Software Engineer" or "Product Operations Lead"
  track?: 'professional' | 'student';
  version: string;
  description: string;
  timeLimitMinutes: number;
  questions: IDualPaneQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const McqOptionSchema = new Schema<IMcqOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    simplifiedText: { type: String, default: '' },
    points: { type: Number, default: 0 },
    rationaleCategory: { type: String, default: '' },
  },
  { _id: false }
);

const LocalizedContentSchema = new Schema<ILocalizedQuestionContent>(
  {
    title: { type: String, default: '' },
    scenario: { type: String, default: '' },
    simplifiedScenario: { type: String, default: '' },
    mcqOptions: [McqOptionSchema],
    writtenPrompt: { type: String, default: '' },
    simplifiedPrompt: { type: String, default: '' },
    writtenPlaceholder: { type: String, default: '' },
  },
  { _id: false }
);

const DualPaneQuestionSchema = new Schema<IDualPaneQuestion>(
  {
    questionId: { type: String, required: true },
    competencyKey: { type: String, required: true },
    competencyName: { type: String, required: true },
    questionType: { type: String, default: 'mcq_dual' },
    category: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    dimension: { type: String, default: '' },
    isOptionalExplanation: { type: Boolean, default: false },
    isRationaleRequired: { type: Boolean, default: false },
    en: { type: LocalizedContentSchema, required: true },
    hi: { type: LocalizedContentSchema, required: true },
    kn: { type: LocalizedContentSchema, required: true },
    idealEvidenceCriteria: { type: String, default: '' },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    roleTarget: { type: String, required: true },
    track: { type: String, enum: ['professional', 'student'], default: 'professional' },
    version: { type: String, default: '1.0' },
    description: { type: String, required: true },
    timeLimitMinutes: { type: Number, default: 45 },
    questions: [DualPaneQuestionSchema],
  },
  { timestamps: true }
);

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
