import { gateway, generateText, Output } from 'ai';
import { buildPrompt, SYSTEM_INSTRUCTION } from '@/features/tarot/services/interpretationHelpers';
import { interpretationSchema, toInterpretation } from '@/features/tarot/services/interpretationSchema';
import { type SharedInterpretationRequest } from './request';

const REQUEST_TIMEOUT_MS = 55_000;
const PRIMARY_MODEL = 'google/gemini-3.5-flash';
const FALLBACK_MODEL = 'anthropic/claude-sonnet-4.6';

export async function generateSharedInterpretation({
  question,
  intention,
  spread,
  cards,
}: SharedInterpretationRequest) {
  const result = await generateText({
    model: gateway(PRIMARY_MODEL),
    system: SYSTEM_INSTRUCTION,
    prompt: buildPrompt({ question, intention, spread, cards }),
    temperature: 0.8,
    maxOutputTokens: 2048,
    output: Output.object({ schema: interpretationSchema }),
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    providerOptions: {
      gateway: {
        models: [FALLBACK_MODEL],
        tags: ['feature:tarot-interpretation'],
      },
    },
  });

  return toInterpretation(result.output);
}
