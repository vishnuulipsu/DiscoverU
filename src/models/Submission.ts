import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidateAnswer {
  questionId: string;
  selectedOptionId?: string; // Optional for purely subjective STAR questions
  writtenRationale?: string;  // Optional for Likert rating items or student optional explanation
  timeSpentSeconds?: number;
}

export interface ICandidateProfileData {
  dob?: string;
  gender?: string;
  country?: string;
  stateRegion?: string;
  educationLevel?: string;
  degreeQualification?: string;
  careerStage?: string;
  workExperience?: string;
  targetRoleField?: string;
  assessmentTrack?: 'professional' | 'student';
}

export interface ISubmission extends Document {
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  languageSelected: 'en' | 'hi' | 'kn';
  candidateProfile?: ICandidateProfileData;
  status: 'in_progress' | 'submitted' | 'evaluated';
  answers: ICandidateAnswer[];
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateAnswerSchema = new Schema<ICandidateAnswer>(
  {
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, default: '' },
    writtenRationale: { type: String, default: '' },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const CandidateProfileSchema = new Schema<ICandidateProfileData>(
  {
    dob: { type: String },
    gender: { type: String },
    country: { type: String },
    stateRegion: { type: String },
    educationLevel: { type: String },
    degreeQualification: { type: String },
    careerStage: { type: String },
    workExperience: { type: String },
    targetRoleField: { type: String },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    assessmentId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true, index: true },
    languageSelected: { type: String, enum: ['en', 'hi', 'kn'], default: 'en' },
    candidateProfile: { type: CandidateProfileSchema, default: null },
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
