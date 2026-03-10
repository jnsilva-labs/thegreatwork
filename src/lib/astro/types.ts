import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const natalInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    birthDate: z
      .string()
      .regex(datePattern, "birthDate must use YYYY-MM-DD format"),
    birthTime: z
      .string()
      .regex(timePattern, "birthTime must use HH:MM (24h) format")
      .optional(),
    timeUnknown: z.boolean(),
    birthPlace: z.string().trim().min(2).max(180),
    turnstileToken: z.string().trim().min(1).max(2048).optional(),
    houseSystem: z.enum(["wholeSign", "placidus"]),
    zodiac: z.literal("tropical")
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value.timeUnknown && !value.birthTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthTime"],
        message: "birthTime is required unless timeUnknown is true"
      });
    }
  });

export type NatalInput = z.infer<typeof natalInputSchema>;

export interface GeocodeResult {
  lat: number;
  lon: number;
  timezone: string;
  provider: string;
  displayName: string;
}

export interface AstroServiceRequest {
  datetimeUtc: string;
  lat: number;
  lon: number;
  zodiac: "tropical";
  houseSystem: "wholeSign" | "placidus";
  aspects: {
    orbDefault: number;
    orbLuminary: number;
  };
}

export interface AstroAspect {
  a: string;
  b: string;
  type: "conjunction" | "sextile" | "square" | "trine" | "opposition";
  orb: number;
}

export interface AstroChart {
  meta: Record<string, unknown>;
  points: Record<string, number | undefined>;
  houses: { cusps: number[] } | null;
  aspects: AstroAspect[];
}

export const astroChartSchema: z.ZodType<AstroChart> = z.object({
  meta: z.record(z.string(), z.unknown()),
  points: z.record(z.string(), z.number().optional()),
  houses: z
    .object({
      cusps: z.array(z.number())
    })
    .nullable(),
  aspects: z.array(
    z.object({
      a: z.string(),
      b: z.string(),
      type: z.enum(["conjunction", "sextile", "square", "trine", "opposition"]),
      orb: z.number()
    })
  )
});

export const readingSchema = z.object({
  title: z.string(),
  bigThree: z.object({
    sun: z.string(),
    moon: z.string(),
    rising: z.string().nullable()
  }),
  snapshot: z.string(),
  coreThemes: z.array(z.string()),
  strengths: z.array(z.string()),
  shadows: z.array(z.string()),
  relationships: z.string(),
  careerCalling: z.string(),
  growthKeys: z.array(
    z.object({
      label: z.string(),
      practice: z.string()
    })
  ),
  paradox: z.object({
    tension: z.string(),
    gift: z.string()
  }),
  mantra: z.string(),
  disclaimer: z.string()
});

export type Reading = z.infer<typeof readingSchema>;

export interface AstroNatalResponse {
  chart: AstroChart;
  reading: Reading;
  meta: {
    timeUnknown: boolean;
    houseSystem: "wholeSign" | "placidus";
    zodiac: "tropical";
  };
}

export const astroMonthAheadRequestSchema = z
  .object({
    chart: astroChartSchema,
    timeUnknown: z.boolean(),
    turnstileToken: z.string().trim().min(1).max(2048).optional(),
    startDateUtc: z.string().datetime({ offset: true }).optional()
  })
  .strict();

export type AstroMonthAheadRequest = z.infer<typeof astroMonthAheadRequestSchema>;

export const lunarStageEventSchema = z.object({
  kind: z.literal("lunarStage"),
  phase: z.enum(["newMoon", "firstQuarter", "fullMoon", "lastQuarter"]),
  timestampUtc: z.string(),
  orb: z.number(),
  priority: z.number()
});

export const skyShiftEventSchema = z.object({
  kind: z.literal("skyShift"),
  eventType: z.enum(["ingress", "stationRetrograde", "stationDirect"]),
  planet: z.enum(["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"]),
  timestampUtc: z.string(),
  longitude: z.number(),
  speed: z.number(),
  priority: z.number(),
  transitHouse: z.number().int().min(1).max(12).optional(),
  fromSign: z.string().optional(),
  toSign: z.string().optional(),
  sign: z.string().optional()
});

export const transitContactEventSchema = z.object({
  kind: z.literal("transitContact"),
  transitPlanet: z.enum(["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"]),
  natalPoint: z.enum(["sun", "moon", "asc"]),
  aspect: z.enum(["conjunction", "sextile", "square", "trine", "opposition"]),
  timestampUtc: z.string(),
  orb: z.number(),
  transitLongitude: z.number(),
  natalLongitude: z.number(),
  priority: z.number(),
  transitHouse: z.number().int().min(1).max(12).optional()
});

export const monthAheadHighlightSchema = z.discriminatedUnion("kind", [
  lunarStageEventSchema,
  skyShiftEventSchema,
  transitContactEventSchema
]);

export const astroMonthAheadResponseSchema = z.object({
  meta: z.object({
    startDateUtc: z.string(),
    endDateUtc: z.string(),
    durationDays: z.number(),
    generatedAt: z.string(),
    sampleHours: z.number(),
    zodiac: z.literal("tropical")
  }),
  lunarStages: z.array(lunarStageEventSchema),
  skyShifts: z.array(skyShiftEventSchema),
  transitContacts: z.array(transitContactEventSchema),
  highlights: z.array(monthAheadHighlightSchema)
});

export type AstroMonthAheadResponse = z.infer<typeof astroMonthAheadResponseSchema>;

export const monthAheadTransitHighlightSchema = z.object({
  title: z.string(),
  window: z.string(),
  guidance: z.string()
});

export const monthAheadLunarCueSchema = z.object({
  phase: z.enum(["newMoon", "firstQuarter", "fullMoon", "lastQuarter"]),
  window: z.string(),
  cue: z.string()
});

export const monthAheadReadingSchema = z.object({
  title: z.string(),
  timeframe: z.string(),
  overview: z.string(),
  majorThemes: z.array(z.string()).min(3).max(5),
  transitHighlights: z.array(monthAheadTransitHighlightSchema).min(3).max(6),
  lunarStages: z.array(monthAheadLunarCueSchema).length(4),
  practiceSuggestions: z.array(z.string()).min(3).max(5),
  cautions: z.array(z.string()).min(2).max(4),
  closingLine: z.string(),
  disclaimer: z.string()
});

export type MonthAheadReading = z.infer<typeof monthAheadReadingSchema>;

export const astroMonthAheadReadingResponseSchema = astroMonthAheadResponseSchema.extend({
  reading: monthAheadReadingSchema
});

export type AstroMonthAheadReadingResponse = z.infer<typeof astroMonthAheadReadingResponseSchema>;
