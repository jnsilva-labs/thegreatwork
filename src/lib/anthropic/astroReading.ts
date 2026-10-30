import { generateText, Output, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  monthAheadReadingSchema,
  readingSchema,
  type AstroChart,
  type AstroMonthAheadResponse,
  type MonthAheadReading,
  type Reading
} from "@/lib/astro/types";
import type { CanonicalBigThree, DerivedPlacementFact } from "@/lib/astro/derive";
import { ASTRO_MODEL } from "./models";

interface RequestNatalReadingInput {
  name?: string;
  chart: AstroChart;
  timeUnknown: boolean;
  houseSystem: "wholeSign" | "placidus";
  zodiac: "tropical";
  canonicalBigThree: CanonicalBigThree;
  placements: DerivedPlacementFact[];
  timeoutMs?: number;
  model?: LanguageModel;
}

interface RequestMonthAheadReadingInput {
  chart: AstroChart;
  timeUnknown: boolean;
  houseSystem: "wholeSign" | "placidus" | null;
  canonicalBigThree: CanonicalBigThree;
  placements: DerivedPlacementFact[];
  transits: AstroMonthAheadResponse;
  timeoutMs?: number;
  model?: LanguageModel;
}

/** ANTHROPIC_API_KEY is missing: the route maps this to CONFIG_ERROR 503. */
export class ReadingConfigError extends Error {}
/** The model call hit its deadline: mapped to READING_TIMEOUT 504. */
export class ReadingTimeoutError extends Error {}
/** Any other model-call failure: mapped to READING_UPSTREAM_ERROR 502. */
export class ReadingUpstreamError extends Error {}

const VOICE = [
  "Write for a thoughtful adult who has never read an astrology chart. Explain any technical term in plain words in the same sentence, or leave the term out entirely.",
  "Voice: the warmth and playfulness of Alan Watts explaining the cosmos over tea, the heart and plain humanity of Ram Dass, the directness of Krishnamurti refusing to hand anyone a borrowed belief. Modern cadence: short sentences, everyday images, speak to 'you' in the present tense.",
  "Paradox is welcome; mystification is not. Ground every claim in something the person can notice in an ordinary day.",
  "Banned stock phrasing: 'delve', 'tapestry', 'unlock', 'embrace your', 'navigate', 'testament to', 'journey of self-discovery', 'rich inner landscape', 'step into', 'invites you to'. No strings of three adjectives. No inflated certainty, no therapy cliches, no coaching talk, no app-store mysticism.",
  "Do not use em dashes.",
  "Do not use the rhetorical pattern 'it is not X, it is Y' or similar contrast formulas.",
  "Tone: compassionate, grounded, specific, non-fatalistic."
].join(" ");

const SYSTEM_PROMPT = [
  "You are an astrology interpreter for reflective self-inquiry.",
  "Use ONLY the provided chart JSON and precomputed placement facts. Do not invent placements, houses, angles, aspects, or signs.",
  "Do not calculate signs from longitude yourself. Use the supplied precomputed sign facts.",
  "The canonical Big Three is supplied; keep the reading aligned with it.",
  "If data is missing, acknowledge the uncertainty plainly.",
  "If timeUnknown is true, you MUST avoid house and rising sign claims and explain houses/angles were omitted.",
  "Outside bigThree fields, avoid hard-asserting alternate sun/moon/rising sign labels.",
  VOICE,
  "Return only valid JSON matching the schema."
].join(" ");

const MONTH_AHEAD_SYSTEM_PROMPT = [
  "You are an astrology interpreter for reflective month-ahead guidance.",
  "Use ONLY the supplied natal context and explicit computed transit events.",
  "Do not invent transit events, dates, signs, stations, ingresses, lunar phases, aspects, houses, or external predictions.",
  "Do not calculate additional astrology beyond the provided event payload.",
  "Use the natal context to explain why the supplied events matter for this chart.",
  "When transit house context is supplied, use it concretely in the reading.",
  "Name the relevant house areas in the overview or transit highlights when they materially clarify the area of life being activated.",
  "If timeUnknown is true, you MUST avoid house and rising sign claims and keep the guidance focused on Sun, Moon, and clearly supplied placements.",
  "The top reading should feel welcoming and readable before it feels technical.",
  "In the overview, emphasize lived experience, emotional weather, relationships, work, pacing, and attention rather than technical delineation.",
  "Make the overview slightly fuller, usually four to six sentences, so the reader feels oriented and held.",
  "For transit highlight guidance, begin with what the person may notice or feel in life, then connect that to the supplied transit.",
  "Keep the lower breakdowns precise, but do not let them read like textbook astrology.",
  VOICE,
  "Frame the month as symbolic timing and reflective guidance, not deterministic fate.",
  "Return only valid JSON matching the schema."
].join(" ");

const ZODIAC_SIGN_PATTERN =
  "(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)";

export const replaceRoleSign = (text: string, role: string, expectedSign: string): string => {
  const pattern = new RegExp(`\\b${ZODIAC_SIGN_PATTERN}(?=\\s+${role}\\b)`, "gi");
  return text.replace(pattern, expectedSign);
};

export const enforceCanonicalMentions = (
  text: string,
  canonicalBigThree: CanonicalBigThree,
  timeUnknown: boolean
): string => {
  let output = replaceRoleSign(text, "sun", canonicalBigThree.sun);
  output = replaceRoleSign(output, "moon", canonicalBigThree.moon);

  if (!timeUnknown && canonicalBigThree.rising) {
    output = replaceRoleSign(output, "rising", canonicalBigThree.rising);
    output = replaceRoleSign(output, "ascendant", canonicalBigThree.rising);
  }

  return output;
};

const bannedPatternReplacements: Array<[RegExp, string]> = [
  [/—/g, ","],
  [/\s+--\s+/g, ", "],
  [/\bit'?s not\b/gi, "It is less"],
  [/\bthis is not\b/gi, "This is less"],
];

export const sanitizeStyle = (text: string): string => {
  return bannedPatternReplacements.reduce((output, [pattern, replacement]) => {
    return output.replace(pattern, replacement);
  }, text);
};

const resolveModel = (model: LanguageModel | undefined): LanguageModel => {
  if (model) {
    return model;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ReadingConfigError("ANTHROPIC_API_KEY is not configured on the server.");
  }
  return anthropic(ASTRO_MODEL);
};

const toReadingError = (error: unknown): never => {
  if (error instanceof ReadingConfigError) {
    throw error;
  }
  if (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError")) {
    throw new ReadingTimeoutError("Reading request timed out", { cause: error });
  }
  const message = error instanceof Error ? error.message : String(error);
  throw new ReadingUpstreamError(`Reading request failed: ${message.slice(0, 240)}`, { cause: error });
};

export const requestNatalReading = async ({
  name,
  chart,
  timeUnknown,
  houseSystem,
  zodiac,
  canonicalBigThree,
  placements,
  timeoutMs = 25_000,
  model
}: RequestNatalReadingInput): Promise<Reading> => {
  const resolvedModel = resolveModel(model);

  const userPayload = {
    name: name ?? null,
    context: {
      timeUnknown,
      houseSystem,
      zodiac,
      canonicalBigThree
    },
    placements,
    chart
  };

  let reading: Reading;
  try {
    const result = await generateText({
      model: resolvedModel,
      system: SYSTEM_PROMPT,
      prompt: `Interpret this natal chart JSON exactly as provided:\n${JSON.stringify(userPayload)}`,
      maxOutputTokens: 8000,
      output: Output.object({ schema: readingSchema }),
      abortSignal: AbortSignal.timeout(timeoutMs)
    });
    reading = result.output;
  } catch (error) {
    toReadingError(error);
    throw error; // unreachable; satisfies control-flow analysis
  }

  // Deterministic guardrail: never let model drift from computed Big Three.
  reading.bigThree = {
    sun: canonicalBigThree.sun,
    moon: canonicalBigThree.moon,
    rising: timeUnknown ? null : canonicalBigThree.rising
  };

  reading.title = sanitizeStyle(reading.title);
  reading.snapshot = sanitizeStyle(enforceCanonicalMentions(reading.snapshot, canonicalBigThree, timeUnknown));
  reading.relationships = sanitizeStyle(
    enforceCanonicalMentions(reading.relationships, canonicalBigThree, timeUnknown)
  );
  reading.careerCalling = sanitizeStyle(
    enforceCanonicalMentions(reading.careerCalling, canonicalBigThree, timeUnknown)
  );
  reading.paradox = {
    tension: sanitizeStyle(enforceCanonicalMentions(reading.paradox.tension, canonicalBigThree, timeUnknown)),
    gift: sanitizeStyle(enforceCanonicalMentions(reading.paradox.gift, canonicalBigThree, timeUnknown))
  };
  reading.coreThemes = reading.coreThemes.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.strengths = reading.strengths.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.shadows = reading.shadows.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.growthKeys = reading.growthKeys.map((item) => ({
    label: sanitizeStyle(item.label),
    practice: sanitizeStyle(item.practice),
  }));
  reading.mantra = sanitizeStyle(reading.mantra);
  reading.disclaimer = sanitizeStyle(reading.disclaimer);

  return reading;
};

export const requestMonthAheadReading = async ({
  chart,
  timeUnknown,
  houseSystem,
  canonicalBigThree,
  placements,
  transits,
  timeoutMs = 30_000,
  model
}: RequestMonthAheadReadingInput): Promise<MonthAheadReading> => {
  const resolvedModel = resolveModel(model);

  const userPayload = {
    context: {
      timeUnknown,
      houseSystem,
      canonicalBigThree,
      timeframe: {
        startDateUtc: transits.meta.startDateUtc,
        endDateUtc: transits.meta.endDateUtc,
        durationDays: transits.meta.durationDays
      }
    },
    placements,
    chart,
    transits
  };

  let reading: MonthAheadReading;
  try {
    const result = await generateText({
      model: resolvedModel,
      system: MONTH_AHEAD_SYSTEM_PROMPT,
      prompt: `Interpret this month-ahead transit payload exactly as provided:\n${JSON.stringify(userPayload)}`,
      maxOutputTokens: 8000,
      output: Output.object({ schema: monthAheadReadingSchema }),
      abortSignal: AbortSignal.timeout(timeoutMs)
    });
    reading = result.output;
  } catch (error) {
    toReadingError(error);
    throw error; // unreachable; satisfies control-flow analysis
  }

  reading.title = sanitizeStyle(reading.title);
  reading.timeframe = sanitizeStyle(reading.timeframe);
  reading.overview = sanitizeStyle(enforceCanonicalMentions(reading.overview, canonicalBigThree, timeUnknown));
  reading.majorThemes = reading.majorThemes.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.transitHighlights = reading.transitHighlights.map((item) => ({
    title: sanitizeStyle(item.title),
    window: sanitizeStyle(item.window),
    guidance: sanitizeStyle(enforceCanonicalMentions(item.guidance, canonicalBigThree, timeUnknown))
  }));
  reading.lunarStages = reading.lunarStages.map((item) => ({
    phase: item.phase,
    window: sanitizeStyle(item.window),
    cue: sanitizeStyle(enforceCanonicalMentions(item.cue, canonicalBigThree, timeUnknown))
  }));
  reading.practiceSuggestions = reading.practiceSuggestions.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.cautions = reading.cautions.map((item) =>
    sanitizeStyle(enforceCanonicalMentions(item, canonicalBigThree, timeUnknown))
  );
  reading.closingLine = sanitizeStyle(
    enforceCanonicalMentions(reading.closingLine, canonicalBigThree, timeUnknown)
  );
  reading.disclaimer = sanitizeStyle(reading.disclaimer);

  return reading;
};
