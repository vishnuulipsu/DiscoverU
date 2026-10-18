import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidateAnswer {
  questionId: string;
  selectedOptionId: string; // Left Pane MCQ selection
  writtenRationale: string;  // Right Pane free text response
  timeSpentSeconds?: number;
}

export interface ISubmission extends Document {
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  languageSelected: 'en' | 'hi' | 'kn';
  status: 'in_progress' | 'submitted' | 'evaluated';
  answers: ICandidateAnswer[];
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateAnswerSchema = new Schema<ICandidateAnswer>(
  {
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, required: true },
    writtenRationale: { type: String, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    assessmentId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true, index: true },
    languageSelected: { type: String, enum: ['en', 'hi', 'kn'], default: 'en' },
    status: { 
      type: String, 
      enum: ['in_progress', 'submitted', 'evaluated'], 
      default: 'in_progress',
      index: true 
    },
    answers: [CandidateAnswerSchema],
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
