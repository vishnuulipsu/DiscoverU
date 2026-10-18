import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPromptVersion {
  templateSlug: string;
  versionNumber: number;
  systemInstruction: string;
  userPromptTemplate: string;
  model: string;
  temperature: number;
  topP: number;
  responseSchemaName: string;
  isActive: boolean;
  changeNotes?: string;
  createdByName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromptVersionSchema = new Schema<IPromptVersion>(
  {
    templateSlug: { type: String, required: true, index: true },
    versionNumber: { type: Number, required: true },
    systemInstruction: { type: String, required: true },
    userPromptTemplate: { type: String, required: true },
    model: { type: String, default: 'gemini-2.5-pro' },
    temperature: { type: Number, default: 0.2 },
    topP: { type: Number, default: 0.9 },
    responseSchemaName: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    changeNotes: { type: String },
    createdByName: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

PromptVersionSchema.index({ templateSlug: 1, versionNumber: 1 }, { unique: true });

export const PromptVersion: Model<IPromptVersion> =
  mongoose.models.PromptVersion || mongoose.model<IPromptVersion>('PromptVersion', PromptVersionSchema);
