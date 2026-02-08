import { z } from "zod";

const utcSecondPrecisionPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

export const chartRequestSchema = z
  .object({
    datetimeUtc: z
      .string()
      .regex(
        utcSecondPrecisionPattern,
        "datetimeUtc must be UTC ISO format YYYY-MM-DDTHH:mm:ssZ"
      )
      .refine((value) => Number.isFinite(Date.parse(value)), {
        message: "datetimeUtc must be a valid UTC datetime"
      }),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    zodiac: z.literal("tropical"),
    houseSystem: z.enum(["wholeSign", "placidus"]),
    aspects: z
      .object({
        orbDefault: z.number().min(0).max(15),
        orbLuminary: z.number().min(0).max(15)
      })
      .strict()
  })
  .strict();

export type ChartRequestInput = z.infer<typeof chartRequestSchema>;
