import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'recruiter' | 'candidate';
export type SupportedLanguage = 'en' | 'hi' | 'kn';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage: SupportedLanguage;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['admin', 'recruiter', 'candidate'], default: 'candidate', index: true },
    preferredLanguage: { type: String, enum: ['en', 'hi', 'kn'], default: 'en' },
    organization: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
