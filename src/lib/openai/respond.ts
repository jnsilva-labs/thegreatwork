import {
  monthAheadReadingSchema,
  readingSchema,
  type AstroChart,
  type AstroMonthAheadResponse,
  type MonthAheadReading,
  type Reading
} from "@/lib/astro/types";
import type { CanonicalBigThree, DerivedPlacementFact } from "@/lib/astro/derive";

interface RequestNatalReadingInput {
  name?: string;
  chart: AstroChart;
  timeUnknown: boolean;
  houseSystem: "wholeSign" | "placidus";
  zodiac: "tropical";
  canonicalBigThree: CanonicalBigThree;
  placements: DerivedPlacementFact[];
  timeoutMs?: number;
}

interface RequestMonthAheadReadingInput {
  chart: AstroChart;
  timeUnknown: boolean;
  houseSystem: "wholeSign" | "placidus" | null;
  canonicalBigThree: CanonicalBigThree;
  placements: DerivedPlacementFact[];
  transits: AstroMonthAheadResponse;
  timeoutMs?: number;
}

const readingJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "bigThree",
    "snapshot",
    "coreThemes",
    "strengths",
    "shadows",
    "relationships",
    "careerCalling",
    "growthKeys",
    "paradox",
    "mantra",
    "disclaimer"
  ],
  properties: {
    title: { type: "string" },
    bigThree: {
      type: "object",
      additionalProperties: false,
      required: ["sun", "moon", "rising"],
      properties: {
        sun: { type: "string" },
        moon: { type: "string" },
        rising: { type: ["string", "null"] }
      }
    },
    snapshot: { type: "string" },
    coreThemes: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    strengths: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    shadows: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    relationships: { type: "string" },
    careerCalling: { type: "string" },
    growthKeys: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "practice"],
        properties: {
          label: { type: "string" },
          practice: { type: "string" }
        }
      }
    },
    paradox: {
      type: "object",
      additionalProperties: false,
      required: ["tension", "gift"],
      properties: {
        tension: { type: "string" },
        gift: { type: "string" }
      }
    },
    mantra: { type: "string" },
    disclaimer: { type: "string" }
  }
} as const;

const monthAheadReadingJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "timeframe",
    "overview",
    "majorThemes",
    "transitHighlights",
    "lunarStages",
    "practiceSuggestions",
    "cautions",
    "closingLine",
    "disclaimer"
  ],
  properties: {
    title: { type: "string" },
    timeframe: { type: "string" },
    overview: { type: "string" },
    majorThemes: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    transitHighlights: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "window", "guidance"],
        properties: {
          title: { type: "string" },
          window: { type: "string" },
          guidance: { type: "string" }
        }
      }
    },
    lunarStages: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["phase", "window", "cue"],
        properties: {
          phase: { type: "string", enum: ["newMoon", "firstQuarter", "fullMoon", "lastQuarter"] },
          window: { type: "string" },
          cue: { type: "string" }
        }
      }
    },
    practiceSuggestions: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    cautions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
    closingLine: { type: "string" },
    disclaimer: { type: "string" }
  }
} as const;

const SYSTEM_PROMPT = [
  "You are an astrology interpreter for reflective self-inquiry.",
  "Use ONLY the provided chart JSON and precomputed placement facts. Do not invent placements, houses, angles, aspects, or signs.",
  "Do not calculate signs from longitude yourself. Use the supplied precomputed sign facts.",
  "The canonical Big Three is supplied; keep the reading aligned with it.",
  "If data is missing, acknowledge the uncertainty plainly.",
  "If timeUnknown is true, you MUST avoid house and rising sign claims and explain houses/angles were omitted.",
  "Outside bigThree fields, avoid hard-asserting alternate sun/moon/rising sign labels.",
  "Write with the dignity, restraint, and observational precision associated with serious Hellenistic and traditional astrologers.",
  "Keep the language calm, lucid, grounded, and source-aware.",
  "Avoid modern coaching tone, therapy cliches, app-store mysticism, inflated certainty, and filler transitions.",
  "Do not use em dashes.",
  "Do not use the rhetorical pattern 'it is not X, it is Y' or similar contrast formulas.",
  "Tone: compassionate, grounded, specific, non-fatalistic.",
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
  "Write with the dignity, restraint, and observational precision associated with serious Hellenistic and traditional astrologers.",
  "Keep the language calm, lucid, grounded, source-aware, and personable.",
  "Assume the reader may know little or no astrology.",
  "The top reading should feel welcoming and readable before it feels technical.",
  "Use everyday life language first, and only introduce astrological terms when they genuinely help.",
  "In the overview, emphasize lived experience, emotional weather, relationships, work, pacing, and attention rather than technical delineation.",
  "Make the overview slightly fuller, usually four to six sentences, so the reader feels oriented and held.",
  "For transit highlight guidance, begin with what the person may notice or feel in life, then connect that to the supplied transit.",
  "Keep the lower breakdowns precise, but do not let them read like textbook astrology.",
  "Avoid modern coaching tone, therapy cliches, app-store mysticism, inflated certainty, and filler transitions.",
  "Do not use em dashes.",
  "Do not use the rhetorical pattern 'it is not X, it is Y' or similar contrast formulas.",
  "Frame the month as symbolic timing and reflective guidance, not deterministic fate.",
  "Return only valid JSON matching the schema."
].join(" ");

const ZODIAC_SIGN_PATTERN =
  "(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)";

const replaceRoleSign = (text: string, role: string, expectedSign: string): string => {
  const pattern = new RegExp(`\\b${ZODIAC_SIGN_PATTERN}(?=\\s+${role}\\b)`, "gi");
  return text.replace(pattern, expectedSign);
};

const enforceCanonicalMentions = (
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
  [/\u2014/g, ","],
  [/\s+--\s+/g, ", "],
  [/\bit'?s not\b/gi, "It is less"],
  [/\bthis is not\b/gi, "This is less"],
];

const sanitizeStyle = (text: string): string => {
  return bannedPatternReplacements.reduce((output, [pattern, replacement]) => {
    return output.replace(pattern, replacement);
  }, text);
};

const extractOutputText = (payload: unknown): string => {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("OpenAI returned malformed response payload");
  }

  const record = payload as {
    output_text?: string;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text.trim();
  }

  const text =
    record.output
      ?.flatMap((item) => item.content ?? [])
      .filter((part) => part.type === "output_text" && typeof part.text === "string")
      .map((part) => part.text as string)
      .join("\n")
      .trim() ?? "";

  if (!text) {
    throw new Error("OpenAI returned no output_text content");
  }

  return text;
};

export const requestNatalReading = async ({
  name,
  chart,
  timeUnknown,
  houseSystem,
  zodiac,
  canonicalBigThree,
  placements,
  timeoutMs = 15000
}: RequestNatalReadingInput): Promise<Reading> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

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

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: SYSTEM_PROMPT }]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Interpret this natal chart JSON exactly as provided:\n${JSON.stringify(userPayload)}`
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "natal_reading",
            schema: readingJsonSchema,
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    const payload = await response.json();
    const parsed = JSON.parse(extractOutputText(payload));
    const reading = readingSchema.parse(parsed);

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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("OpenAI request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const requestMonthAheadReading = async ({
  chart,
  timeUnknown,
  houseSystem,
  canonicalBigThree,
  placements,
  transits,
  timeoutMs = 18000
}: RequestMonthAheadReadingInput): Promise<MonthAheadReading> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

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

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: MONTH_AHEAD_SYSTEM_PROMPT }]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Interpret this month-ahead transit payload exactly as provided:\n${JSON.stringify(userPayload)}`
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "month_ahead_reading",
            schema: monthAheadReadingJsonSchema,
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    const payload = await response.json();
    const parsed = JSON.parse(extractOutputText(payload));
    const reading = monthAheadReadingSchema.parse(parsed);

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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("OpenAI request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};
