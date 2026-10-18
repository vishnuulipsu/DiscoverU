import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { PromptTemplate } from '@/models/PromptTemplate';
import { PromptVersion } from '@/models/PromptVersion';
import { seedInitialDatabase } from '@/lib/seed-data';

export async function GET() {
  try {
    await connectToDatabase();
    let templates = await PromptTemplate.find();
    if (templates.length === 0) {
      await seedInitialDatabase();
      templates = await PromptTemplate.find();
    }
    const versions = await PromptVersion.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, templates, versions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching prompts';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { templateSlug, systemInstruction, userPromptTemplate, model, temperature, topP, changeNotes, createdByName } = body;

    if (!templateSlug || !systemInstruction || !userPromptTemplate) {
      return NextResponse.json({ success: false, error: 'Missing required prompt fields' }, { status: 400 });
    }

    // Get highest version number for this template
    const highest = await PromptVersion.findOne({ templateSlug }).sort({ versionNumber: -1 });
    const nextVersion = (highest?.versionNumber || 0) + 1;

    // Deactivate previous versions
    await PromptVersion.updateMany({ templateSlug }, { isActive: false });

    // Create new active version
    const newVersion = await PromptVersion.create({
      templateSlug,
      versionNumber: nextVersion,
      systemInstruction,
      userPromptTemplate,
      model: model || 'gemini-2.5-pro',
      temperature: typeof temperature === 'number' ? temperature : 0.2,
      topP: typeof topP === 'number' ? topP : 0.9,
      responseSchemaName: templateSlug === 'recruiter_evaluation' ? 'IRecruiterEvaluation' : 'ICandidateGrowthReport',
      isActive: true,
      changeNotes: changeNotes || `Updated to version ${nextVersion}`,
      createdByName: createdByName || 'Admin',
    });

    // Update active version number on template
    await PromptTemplate.findOneAndUpdate(
      { slug: templateSlug },
      { activeVersionNumber: nextVersion }
    );

    return NextResponse.json({ success: true, version: newVersion });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving prompt version';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
