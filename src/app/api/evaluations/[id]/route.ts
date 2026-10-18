import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult } from '@/models/EvaluationResult';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const evaluation = await EvaluationResult.findById(id);

    if (!evaluation) {
      return NextResponse.json({ success: false, error: 'Evaluation not found' }, { status: 400 });
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error retrieving evaluation';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
