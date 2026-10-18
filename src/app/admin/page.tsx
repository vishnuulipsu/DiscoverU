import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminPromptStudio } from '@/components/AdminPromptStudio';
import connectToDatabase from '@/lib/mongodb';
import { PromptTemplate, IPromptTemplate } from '@/models/PromptTemplate';
import { PromptVersion, IPromptVersion } from '@/models/PromptVersion';
import { DEFAULT_PROMPTS } from '@/lib/prompts';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAdminPromptData() {
  try {
    await connectToDatabase();
    const templates = await PromptTemplate.find().lean();
    const versions = await PromptVersion.find().sort({ createdAt: -1 }).lean();

    if (templates.length > 0 && versions.length > 0) {
      return {
        templates: JSON.parse(JSON.stringify(templates)) as IPromptTemplate[],
        versions: JSON.parse(JSON.stringify(versions)) as IPromptVersion[],
      };
    }
  } catch (err) {
    console.warn('MongoDB lookup in Admin page fallback to defaults:', err);
  }

  // Fallback defaults from DEFAULT_PROMPTS
  const defaultTemplates: IPromptTemplate[] = [
    {
      name: 'Master Assessment Generation Prompt',
      slug: 'assessment_generation',
      description: 'Master prompt generating personality questionnaire & 4 behavioural scenarios (Problem-solving, Teamwork, Adaptability, Setbacks) with Situation, Task, Action, Result fields.',
      activeVersionNumber: 1,
      availableVariables: ['candidateProfile', 'careerStage', 'targetRole', 'language'],
    },
    {
      name: 'Master Assessment Report Generation Prompt',
      slug: 'assessment_report',
      description: 'Master prompt generating 5-section candidate report: Personality Profile, Potential Strengths, Blind Spots, Work Preferences, and 30-Day Development Plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses', 'traitScores'],
    },
    {
      name: 'Recruiter Evaluation Suite Prompt',
      slug: 'recruiter_evaluation',
      description: 'Generates the 6 grounded modules for hiring teams with evidence separation and fairness guardrails.',
      activeVersionNumber: 1,
      availableVariables: ['roleTarget', 'assessmentVersion', 'candidateName', 'candidateLanguage', 'candidateResponses'],
    },
    {
      name: 'Candidate Growth & Development Report Prompt',
      slug: 'candidate_growth',
      description: 'Generates 5 constructive self-reflection modules including Big Five profile, demonstrated strengths, and 30-day action plan.',
      activeVersionNumber: 1,
      availableVariables: ['candidateName', 'candidateLanguage', 'targetLanguage', 'candidateResponses'],
    },
  ];

  const defaultVersions: IPromptVersion[] = [
    {
      templateSlug: 'assessment_generation',
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.assessment_generation.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.assessment_generation.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.3,
      topP: 0.9,
      responseSchemaName: 'AssessmentGenerationSchema',
      isActive: true,
      changeNotes: 'Master prompt baseline for Personality & 4 Behavioural Scenarios (Situation, Task, Action, Result).',
      createdByName: 'admin@discoveru.orbit',
      createdAt: new Date(),
    },
    {
      templateSlug: 'assessment_report',
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.assessment_report.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.assessment_report.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.3,
      topP: 0.9,
      responseSchemaName: 'AssessmentReportSchema',
      isActive: true,
      changeNotes: 'Master prompt baseline for 5-section candidate assessment report without framework acronym exposure.',
      createdByName: 'admin@discoveru.orbit',
      createdAt: new Date(),
    },
    {
      templateSlug: 'recruiter_evaluation',
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.recruiter_evaluation.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.recruiter_evaluation.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.2,
      topP: 0.9,
      responseSchemaName: 'RecruiterEvaluationSchema',
      isActive: true,
      changeNotes: 'Production prompt baseline with Future of Work & Enterprise Productivity competencies.',
      createdByName: 'admin@discoveru.orbit',
      createdAt: new Date(),
    },
    {
      templateSlug: 'candidate_growth',
      versionNumber: 1,
      systemInstruction: DEFAULT_PROMPTS.candidate_growth.systemInstruction,
      userPromptTemplate: DEFAULT_PROMPTS.candidate_growth.userPromptTemplate,
      model: 'gemini-2.5-pro',
      temperature: 0.4,
      topP: 0.9,
      responseSchemaName: 'CandidateGrowthSchema',
      isActive: true,
      changeNotes: 'Production prompt baseline for 5-module growth and 30-day action plans.',
      createdByName: 'admin@discoveru.orbit',
      createdAt: new Date(),
    },
  ];

  return {
    templates: defaultTemplates,
    versions: defaultVersions,
  };
}

export default async function AdminPage() {
  const data = await getAdminPromptData();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-500 hover:text-[var(--ulipsu-indigo)] flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-800">Admin Prompt Management Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Prompt Ops Console
            </span>
            <span className="text-xs text-gray-400">AI Powered Architecture</span>
          </div>
        </div>
      </div>

      {/* Admin Studio Body */}
      <main className="flex-1 py-6">
        <AdminPromptStudio
          initialTemplates={data.templates}
          initialVersions={data.versions}
        />
      </main>

      {/* Consistent Footer */}
      <Footer />
    </div>
  );
}
