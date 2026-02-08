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
