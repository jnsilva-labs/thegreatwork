import { readingSchema, type AstroChart, type Reading } from "@/lib/astro/types";
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

const SYSTEM_PROMPT = [
  "You are an astrology interpreter for reflective self-inquiry.",
  "Use ONLY the provided chart JSON and precomputed placement facts. Do not invent placements, houses, angles, aspects, or signs.",
  "Do not calculate signs from longitude yourself. Use the supplied precomputed sign facts.",
  "The canonical Big Three is supplied; keep the reading aligned with it.",
  "If data is missing, acknowledge the uncertainty plainly.",
  "If timeUnknown is true, you MUST avoid house and rising sign claims and explain houses/angles were omitted.",
  "Outside bigThree fields, avoid hard-asserting alternate sun/moon/rising sign labels.",
  "Tone: compassionate, grounded, specific, non-fatalistic.",
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

    reading.snapshot = enforceCanonicalMentions(reading.snapshot, canonicalBigThree, timeUnknown);
    reading.relationships = enforceCanonicalMentions(reading.relationships, canonicalBigThree, timeUnknown);
    reading.careerCalling = enforceCanonicalMentions(reading.careerCalling, canonicalBigThree, timeUnknown);
    reading.paradox = {
      tension: enforceCanonicalMentions(reading.paradox.tension, canonicalBigThree, timeUnknown),
      gift: enforceCanonicalMentions(reading.paradox.gift, canonicalBigThree, timeUnknown)
    };
    reading.coreThemes = reading.coreThemes.map((item) =>
      enforceCanonicalMentions(item, canonicalBigThree, timeUnknown)
    );
    reading.strengths = reading.strengths.map((item) =>
      enforceCanonicalMentions(item, canonicalBigThree, timeUnknown)
    );
    reading.shadows = reading.shadows.map((item) =>
      enforceCanonicalMentions(item, canonicalBigThree, timeUnknown)
    );

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
