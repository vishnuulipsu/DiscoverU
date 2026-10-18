import mongoose, { Schema, Document, Model } from 'mongoose';

export type PromptCategory = 
  | 'assessment_generation'
  | 'assessment_report'
  | 'sjt_mcq_reasoning_scorer'
  | 'recruiter_evaluation'
  | 'candidate_growth'
  | 'fairness_guardrail';

export interface IPromptTemplate {
  name: string;
  slug: PromptCategory;
  description: string;
  activeVersionNumber: number;
  availableVariables: string[]; // e.g. ['candidate_name', 'mcq_choice', 'written_rationale', 'rubrics']
  createdAt?: Date;
  updatedAt?: Date;
}

const PromptTemplateSchema = new Schema<IPromptTemplate>(
  {
    name: { type: String, required: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      enum: ['assessment_generation', 'assessment_report', 'sjt_mcq_reasoning_scorer', 'recruiter_evaluation', 'candidate_growth', 'fairness_guardrail'],
      index: true 
    },
    description: { type: String, required: true },
    activeVersionNumber: { type: Number, default: 1 },
    availableVariables: [{ type: String }],
  },
  { timestamps: true }
);

export const PromptTemplate: Model<IPromptTemplate> = 
  mongoose.models.PromptTemplate || mongoose.model<IPromptTemplate>('PromptTemplate', PromptTemplateSchema);
