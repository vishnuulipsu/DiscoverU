import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { EvaluationResult } from '@/models/EvaluationResult';
import { handleApiError } from '@/lib/api-error';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Evaluation ID is required.', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: `Invalid evaluation ID format: '${id}'`, code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const evaluation = await EvaluationResult.findById(id).lean();

    if (!evaluation) {
      return NextResponse.json(
        { success: false, error: `Evaluation report with ID '${id}' was not found.`, code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, evaluation });
  } catch (err: unknown) {
    return handleApiError(err, 'GET /api/evaluations/[id]');
  }
}
