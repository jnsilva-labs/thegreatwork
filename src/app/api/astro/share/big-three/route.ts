import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  isZodiacSign,
  type ZodiacSign
} from "../../../../../lib/astro/assets/zodiacGrid";
import { generateBigThreeFromGridPng } from "../../../../../lib/astro/sharecards/bigThreeFromGrid";
import { hasAstroBetaAccess } from "@/lib/astro/auth";

export const runtime = "nodejs";

const requestSchema = z
  .object({
    chart: z
      .object({
        sunSign: z.string().min(1),
        moonSign: z.string().min(1),
        risingSign: z.string().nullable().optional(),
        timeUnknown: z.boolean().optional()
      })
      .strict(),
    options: z
      .object({
        watermark: z.boolean().optional()
      })
      .strict()
      .optional()
  })
  .strict();

const normalizeSign = (value: string): string => {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
};

const parseSign = (value: string): ZodiacSign | null => {
  const normalized = normalizeSign(value);
  return isZodiacSign(normalized) ? normalized : null;
};

const jsonError = (status: number, code: string, error: string, details?: unknown) => {
  return NextResponse.json({ code, error, details }, { status });
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!hasAstroBetaAccess(request.cookies)) {
    return jsonError(401, "UNAUTHORIZED", "Private beta access required.");
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "VALIDATION_ERROR", "Request payload failed validation.", parsed.error.flatten());
  }

  const sunSign = parseSign(parsed.data.chart.sunSign);
  const moonSign = parseSign(parsed.data.chart.moonSign);
  const risingSignRaw = parsed.data.chart.risingSign;

  if (!sunSign || !moonSign) {
    return jsonError(422, "INVALID_SIGN", "sunSign and moonSign must be valid zodiac signs.");
  }

  const risingSign =
    typeof risingSignRaw === "string" && risingSignRaw.trim().length > 0
      ? parseSign(risingSignRaw)
      : null;

  try {
    const image = await generateBigThreeFromGridPng({
      sunSign,
      moonSign,
      risingSign,
      timeUnknown: parsed.data.chart.timeUnknown ?? false,
      watermark: parsed.data.options?.watermark
    });

    return new NextResponse(new Uint8Array(image), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(image.byteLength),
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="big-three.png"'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("Invalid zodiac grid") || message.includes("tile size")) {
      return jsonError(422, "GRID_PROCESSING_FAILED", "Unable to process zodiac grid image.");
    }

    return jsonError(500, "IMAGE_GENERATION_FAILED", "Failed to generate Big Three share image.");
  }
}
