import { DrawnCard, Interpretation, SpreadDefinition } from '../types';
import { buildPrompt, coerceInterpretation, extractJsonObject, SYSTEM_INSTRUCTION } from './interpretationHelpers';

interface GenerateInterpretationParams {
  question: string;
  intention: string;
  spread: SpreadDefinition;
  cards: DrawnCard[];
  apiKey?: string;
}

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

interface SharedErrorPayload {
  code?: string;
  error?: string;
}

export class TarotInterpretationError extends Error {
  code?: string;
  status?: number;
  needsPersonalKey: boolean;

  constructor(message: string, options?: { code?: string; status?: number; needsPersonalKey?: boolean }) {
    super(message);
    this.name = 'TarotInterpretationError';
    this.code = options?.code;
    this.status = options?.status;
    this.needsPersonalKey = options?.needsPersonalKey ?? false;
  }
}

async function callGeminiDirect({
  question,
  intention,
  spread,
  cards,
  apiKey,
}: Required<GenerateInterpretationParams>): Promise<Interpretation> {
  const prompt = buildPrompt({ question, intention, spread, cards });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
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
    await response.text();
    throw new TarotInterpretationError(`Personal key request failed (${response.status}).`, {
      status: response.status,
      code: 'PERSONAL_KEY_REQUEST_FAILED',
      needsPersonalKey: response.status === 401 || response.status === 403,
    });
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!text) {
    throw new TarotInterpretationError('Gemini returned an empty response.', {
      code: 'EMPTY_RESPONSE',
    });
  }

  const parsed = extractJsonObject(text);
  return coerceInterpretation(parsed);
}

async function callSharedEndpoint({ question, intention, spread, cards }: Omit<GenerateInterpretationParams, 'apiKey'>) {
  const response = await fetch('/api/tarot/interpret', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      intention,
      spread,
      cards,
    }),
  });

  if (!response.ok) {
    let payload: SharedErrorPayload | null = null;
    try {
      payload = (await response.json()) as SharedErrorPayload;
    } catch {
      payload = null;
    }

    throw new TarotInterpretationError(payload?.error || `Shared request failed (${response.status}).`, {
      code: payload?.code,
      status: response.status,
      needsPersonalKey:
        payload?.code === 'SHARED_QUOTA_EXCEEDED' ||
        payload?.code === 'SHARED_KEY_UNAVAILABLE' ||
        payload?.code === 'SHARED_KEY_INVALID',
    });
  }

  return (await response.json()) as Interpretation;
}

export const generateInterpretation = async ({
  question,
  intention,
  spread,
  cards,
  apiKey,
}: GenerateInterpretationParams): Promise<Interpretation> => {
  try {
    return await callSharedEndpoint({ question, intention, spread, cards });
  } catch (error) {
    const tarotError =
      error instanceof TarotInterpretationError
        ? error
        : new TarotInterpretationError(error instanceof Error ? error.message : 'Unknown interpretation error.');

    if (tarotError.needsPersonalKey) {
      const personalKey = apiKey?.trim();

      if (!personalKey) {
        throw new TarotInterpretationError(
          'Shared free usage is currently exhausted. Add your personal Gemini key in Settings to continue.',
          {
            code: tarotError.code,
            status: tarotError.status,
            needsPersonalKey: true,
          },
        );
      }

      return await callGeminiDirect({
        question,
        intention,
        spread,
        cards,
        apiKey: personalKey,
      });
    }

    throw tarotError;
  }
};
