import { NextResponse } from 'next/server';
import { gateway, generateText, Output } from 'ai';
import { buildPrompt, coerceInterpretation, SYSTEM_INSTRUCTION } from '@/features/tarot/services/interpretationHelpers';
import { interpretationSchema } from '@/features/tarot/services/interpretationSchema';
import { DrawnCard, SpreadDefinition } from '@/features/tarot/types';
import { classifyInterpretError } from './classifier';

interface InterpretationRequestBody {
  question?: string;
  intention?: string;
  spread?: SpreadDefinition;
  cards?: DrawnCard[];
}

export const runtime = 'nodejs';
export const maxDuration = 60;

const REQUEST_TIMEOUT_MS = 25_000;
const PRIMARY_MODEL = 'google/gemini-3.5-flash';
const FALLBACK_MODEL = 'anthropic/claude-sonnet-4.6';

export async function POST(request: Request) {
  let body: InterpretationRequestBody;
  try {
    body = (await request.json()) as InterpretationRequestBody;
  } catch {
    return NextResponse.json(
      {
        code: 'INVALID_REQUEST',
        error: 'Request body must be valid JSON.',
      },
      { status: 400 },
    );
  }

  const question = body.question ?? '';
  const intention = body.intention ?? 'General';
  const spread = body.spread;
  const cards = body.cards;

  if (!spread || !Array.isArray(spread.positions) || !Array.isArray(cards) || cards.length === 0) {
    return NextResponse.json(
      {
        code: 'INVALID_REQUEST',
        error: 'Missing spread/cards payload.',
      },
      { status: 400 },
    );
  }

  try {
    const result = await generateText({
      model: gateway(PRIMARY_MODEL),
      system: SYSTEM_INSTRUCTION,
      prompt: buildPrompt({ question, intention, spread, cards }),
      temperature: 0.8,
      output: Output.object({ schema: interpretationSchema }),
      abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      providerOptions: {
        gateway: {
          models: [FALLBACK_MODEL],
          tags: ['feature:tarot-interpretation'],
        },
      },
    });

    return NextResponse.json(coerceInterpretation(result.output));
  } catch (error) {
    const classified = classifyInterpretError(error);
    console.error(
      `[tarot/interpret] ${classified.code} (${classified.status})`,
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        code: classified.code,
        error: classified.message,
      },
      { status: classified.status },
    );
  }
}
