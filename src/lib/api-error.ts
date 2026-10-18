import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export function handleApiError(err: unknown, context: string): NextResponse<ApiErrorResponse> {
  const timestamp = new Date().toISOString();
  console.error(`[API Error] [${timestamp}] in ${context}:`, err);

  // Mongoose validation error (e.g. missing required schema field)
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return NextResponse.json(
      {
        success: false,
        error: `Validation Error: ${messages.join(', ')}`,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err instanceof mongoose.Error.CastError) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid resource identifier: '${err.value}' is not a valid ID.`,
        code: 'INVALID_IDENTIFIER',
      },
      { status: 400 }
    );
  }

  // MongoDB Connection / Timeout Error
  if (
    err instanceof Error &&
    (err.name === 'MongooseServerSelectionError' ||
      err.message.includes('buffering timed out') ||
      err.message.includes('connect ECONNREFUSED') ||
      err.message.includes('Server selection timed out'))
  ) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection is temporarily unavailable. Please retry shortly.',
        code: 'DATABASE_UNAVAILABLE',
      },
      { status: 503 }
    );
  }

  // Standard JavaScript Error
  if (err instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'An unexpected server error occurred.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'An unknown server error occurred.',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}
