import { NextResponse } from 'next/server';
import { buildPrompt, coerceInterpretation, extractJsonObject, SYSTEM_INSTRUCTION } from '@/features/tarot/services/interpretationHelpers';
import { DrawnCard, SpreadDefinition } from '@/features/tarot/types';

interface GeminiCandidatePart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiCandidatePart[];
    };
  }>;
}

interface InterpretationRequestBody {
  question?: string;
  intention?: string;
  spread?: SpreadDefinition;
  cards?: DrawnCard[];
}

function getSharedApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

export async function POST(request: Request) {
  const sharedApiKey = getSharedApiKey();
  if (!sharedApiKey) {
    return NextResponse.json(
      {
        code: 'SHARED_KEY_UNAVAILABLE',
        error: 'Shared Gemini key is not configured on the server.',
      },
      { status: 503 },
    );
  }

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

  const prompt = buildPrompt({ question, intention, spread, cards });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(sharedApiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          role: 'system',
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();

    if (response.status === 429) {
      return NextResponse.json(
        {
          code: 'SHARED_QUOTA_EXCEEDED',
          error: 'Shared Gemini quota/rate limit reached.',
          detail,
        },
        { status: 429 },
      );
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        {
          code: 'SHARED_KEY_INVALID',
          error: 'Shared Gemini key is invalid or unauthorized.',
          detail,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        code: 'SHARED_REQUEST_FAILED',
        error: 'Shared Gemini request failed.',
        detail,
      },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates
    ?.at(0)
    ?.content?.parts?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    return NextResponse.json(
      {
        code: 'EMPTY_RESPONSE',
        error: 'Gemini returned an empty response.',
      },
      { status: 502 },
    );
  }

  try {
    const parsed = extractJsonObject(text);
    return NextResponse.json(coerceInterpretation(parsed));
  } catch (error) {
    return NextResponse.json(
      {
        code: 'BAD_RESPONSE_FORMAT',
        error: error instanceof Error ? error.message : 'Failed to parse Gemini response.',
      },
      { status: 502 },
    );
  }
}
