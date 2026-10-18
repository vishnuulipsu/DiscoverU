import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/models/Assessment';
import { seedInitialDatabase } from '@/lib/seed-data';

export async function GET() {
  try {
    await connectToDatabase();
    let assessment = await Assessment.findOne();
    if (!assessment) {
      await seedInitialDatabase();
      assessment = await Assessment.findOne();
    }
    return NextResponse.json({ success: true, assessment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch assessment';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
