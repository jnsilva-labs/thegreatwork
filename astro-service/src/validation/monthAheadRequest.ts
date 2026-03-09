import { z } from "zod";

const utcSecondPrecisionPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const natalPointsSchema = z.object({
  sun: z.number(),
  moon: z.number(),
  mercury: z.number(),
  venus: z.number(),
  mars: z.number(),
  jupiter: z.number(),
  saturn: z.number(),
  uranus: z.number(),
  neptune: z.number(),
  pluto: z.number(),
  node: z.number(),
  chiron: z.number().optional(),
  asc: z.number().optional(),
  mc: z.number().optional()
});

export const monthAheadRequestSchema = z
  .object({
    startDateUtc: z
      .string()
      .regex(
        utcSecondPrecisionPattern,
        "startDateUtc must be UTC ISO format YYYY-MM-DDTHH:mm:ssZ"
      )
      .refine((value) => Number.isFinite(Date.parse(value)), {
        message: "startDateUtc must be a valid UTC datetime"
      }),
    durationDays: z.number().int().min(1).max(45),
    timeUnknown: z.boolean(),
    natalPoints: natalPointsSchema
  })
  .strict();

export type MonthAheadRequestInput = z.infer<typeof monthAheadRequestSchema>;
