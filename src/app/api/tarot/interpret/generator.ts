import { generateText, Output } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildPrompt, SYSTEM_INSTRUCTION } from '@/features/tarot/services/interpretationHelpers';
import { interpretationSchema, toInterpretation } from '@/features/tarot/services/interpretationSchema';
import { TAROT_MODEL } from '@/lib/anthropic/models';
import { type SharedInterpretationRequest } from './request';

const REQUEST_TIMEOUT_MS = 55_000;
// Adaptive thinking shares the output budget; 2048 risked truncated JSON on
// Claude models, surfacing as NoObjectGeneratedError.
const MAX_OUTPUT_TOKENS = 6000;

export async function generateSharedInterpretation({
  question,
  intention,
  spread,
  cards,
}: SharedInterpretationRequest) {
  const result = await generateText({
    model: anthropic(TAROT_MODEL),
    system: SYSTEM_INSTRUCTION,
    prompt: buildPrompt({ question, intention, spread, cards }),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    output: Output.object({ schema: interpretationSchema }),
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  return toInterpretation(result.output);
}
