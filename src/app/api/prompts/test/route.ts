import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { systemInstruction, userPrompt, model, temperature } = body;

    if (!userPrompt) {
      return NextResponse.json({ success: false, error: 'User prompt is required' }, { status: 400 });
    }

    if (ai && apiKey) {
      const response = await ai.models.generateContent({
        model: model || 'gemini-2.5-pro',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: typeof temperature === 'number' ? temperature : 0.2,
          responseMimeType: 'application/json',
        },
      });

      const latencyMs = Date.now() - startTime;
      const textOutput = response.text || '';
      let parsedJson = null;
      try {
        parsedJson = JSON.parse(textOutput);
      } catch {
        // text output is not json
      }

      return NextResponse.json({
        success: true,
        latencyMs,
        modelUsed: model || 'gemini-2.5-pro',
        rawText: textOutput,
        parsedJson,
      });
    }

    // Mock response if API key is not yet set
    const latencyMs = Date.now() - startTime + 380;
    return NextResponse.json({
      success: true,
      latencyMs,
      modelUsed: 'gemini-2.5-pro (Mock Sandbox Simulator)',
      rawText: JSON.stringify(
        {
          status: 'SUCCESS',
          testOutput: 'Sandbox simulation executed successfully.',
          guardrailValidation: 'PASS',
          extractedEvidenceCount: 5,
        },
        null,
        2
      ),
      parsedJson: {
        status: 'SUCCESS',
        testOutput: 'Sandbox simulation executed successfully.',
        guardrailValidation: 'PASS',
        extractedEvidenceCount: 5,
      },
    });
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const message = err instanceof Error ? err.message : 'Prompt test error';
    return NextResponse.json({ success: false, latencyMs, error: message }, { status: 500 });
  }
}
