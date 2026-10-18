import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMcqOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  points: number; // 1-5 rubric alignment
  rationaleCategory: string; // e.g. 'Proactive Collaboration', 'Process Adherence'
}

export interface ILocalizedQuestionContent {
  title: string;
  scenario: string;
  mcqOptions: IMcqOption[];
  writtenPrompt: string; // Prompt for the right-hand text area
  writtenPlaceholder: string;
}

export interface IDualPaneQuestion {
  questionId: string;
  competencyKey: 'problem_solving' | 'communication' | 'accountability' | 'adaptability' | 'prioritisation';
  competencyName: string;
  en: ILocalizedQuestionContent;
  hi: ILocalizedQuestionContent;
  kn: ILocalizedQuestionContent;
  idealEvidenceCriteria: string;
}

export interface IAssessment extends Document {
  title: string;
  roleTarget: string; // e.g. "Senior Software Engineer" or "Product Operations Lead"
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
    points: { type: Number, required: true },
    rationaleCategory: { type: String, required: true },
  },
  { _id: false }
);

const LocalizedContentSchema = new Schema<ILocalizedQuestionContent>(
  {
    title: { type: String, required: true },
    scenario: { type: String, required: true },
    mcqOptions: [McqOptionSchema],
    writtenPrompt: { type: String, required: true },
    writtenPlaceholder: { type: String, required: true },
  },
  { _id: false }
);

const DualPaneQuestionSchema = new Schema<IDualPaneQuestion>(
  {
    questionId: { type: String, required: true },
    competencyKey: { 
      type: String, 
      required: true, 
      enum: ['problem_solving', 'communication', 'accountability', 'adaptability', 'prioritisation'] 
    },
    competencyName: { type: String, required: true },
    en: { type: LocalizedContentSchema, required: true },
    hi: { type: LocalizedContentSchema, required: true },
    kn: { type: LocalizedContentSchema, required: true },
    idealEvidenceCriteria: { type: String, required: true },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    roleTarget: { type: String, required: true },
    version: { type: String, default: '1.0' },
    description: { type: String, required: true },
    timeLimitMinutes: { type: Number, default: 45 },
    questions: [DualPaneQuestionSchema],
  },
  { timestamps: true }
);

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
