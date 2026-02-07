import { DrawnCard, Interpretation, SpreadDefinition } from '../types';

const SYSTEM_INSTRUCTION = `
You are a warm, psychologically grounded Tarot Guide using a Jungian and Alchemical lens.
Your goal is to help the user understand themselves through the mirror of the cards.

TONE:
- Mystical but clear.
- Psychological, not predictive.
- Use metaphors of the alchemical laboratory.
- Avoid generic prediction language.

STRUCTURE:
1. mirrorStatement: direct insight in 1-2 sentences.
2. archetypeShadow: detailed psychological analysis.
3. alchemicalPhase: explain the phase and process.
4. practicalGuidance: 3 concrete actions.
5. journalPrompts: 3 reflective questions.
6. mantra: short grounding affirmation.
Return valid JSON only.
`;

interface GenerateInterpretationParams {
  question: string;
  intention: string;
  spread: SpreadDefinition;
  cards: DrawnCard[];
  apiKey: string;
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

function coerceInterpretation(value: unknown): Interpretation {
  const data = (value ?? {}) as Record<string, unknown>;
  const practicalGuidance = Array.isArray(data.practicalGuidance) ? data.practicalGuidance.filter((entry): entry is string => typeof entry === 'string') : [];
  const journalPrompts = Array.isArray(data.journalPrompts) ? data.journalPrompts.filter((entry): entry is string => typeof entry === 'string') : [];

  return {
    mirrorStatement: typeof data.mirrorStatement === 'string' ? data.mirrorStatement : 'Your cards invite patient reflection.',
    archetypeShadow: typeof data.archetypeShadow === 'string' ? data.archetypeShadow : 'Notice where effort and resistance are entangled.',
    alchemicalPhase: typeof data.alchemicalPhase === 'string' ? data.alchemicalPhase : 'This reading suggests a transition through conscious integration.',
    practicalGuidance: practicalGuidance.length > 0 ? practicalGuidance.slice(0, 3) : ['Take 10 minutes of quiet journaling today.', 'Name one fear and one desire active right now.', 'Choose one grounded action before the day ends.'],
    journalPrompts: journalPrompts.length > 0 ? journalPrompts.slice(0, 3) : ['What is this situation trying to teach me?', 'Which part of me feels threatened?', 'What would grounded courage look like this week?'],
    mantra: typeof data.mantra === 'string' ? data.mantra : 'I can meet truth with clarity and care.',
  };
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(fenced);
    } catch {
      const firstBrace = fenced.indexOf('{');
      const lastBrace = fenced.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
        return JSON.parse(fenced.slice(firstBrace, lastBrace + 1));
      }
      throw new Error('Gemini response was not valid JSON.');
    }
  }
}

export const generateInterpretation = async ({
  question,
  intention,
  spread,
  cards,
  apiKey,
}: GenerateInterpretationParams): Promise<Interpretation> => {
  if (!apiKey) {
    throw new Error('API key is missing.');
  }

  const cardDescriptions = cards
    .map((card) => {
      const position = spread.positions.find((slot) => slot.id === card.positionId);
      return `Position ${card.positionId} (${position?.name} - ${position?.description}): Card ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'}). Meaning: ${card.isReversed ? card.meaningReversed : card.meaningUpright}. Keywords: ${card.keywords.join(', ')}.`;
    })
    .join('\n');

  const prompt = `Question: "${question || 'What do I need to know right now?'}"\nIntention: "${intention}"\nSpread: ${spread.name}\n\nCards:\n${cardDescriptions}\n\nReturn JSON only with keys: mirrorStatement, archetypeShadow, alchemicalPhase, practicalGuidance, journalPrompts, mantra.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
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
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${detail}`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  const parsed = extractJsonObject(text);
  return coerceInterpretation(parsed);
};
