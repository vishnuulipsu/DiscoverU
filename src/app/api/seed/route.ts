import { NextResponse } from 'next/server';
import { seedInitialDatabase } from '@/lib/seed-data';

export async function GET() {
  try {
    const result = await seedInitialDatabase();
    return NextResponse.json({ success: true, message: 'Database seeded successfully', data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown seeding error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
