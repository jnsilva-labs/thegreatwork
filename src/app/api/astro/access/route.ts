import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  astroAccessCookie,
  hasAstroBetaAccess,
  verifyAstroBetaPassword
} from "@/lib/astro/auth";

export const runtime = "nodejs";

const requestSchema = z
  .object({
    password: z.string().min(1, "Password is required.")
  })
  .strict();

const unauthorizedJson = () =>
  NextResponse.json(
    {
      code: "UNAUTHORIZED",
      error: "Incorrect password."
    },
    { status: 401 }
  );

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        code: "INVALID_JSON",
        error: "Request body must be valid JSON."
      },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        error: "Request payload failed validation.",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  if (!verifyAstroBetaPassword(parsed.data.password)) {
    return unauthorizedJson();
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(astroAccessCookie);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...astroAccessCookie,
    value: "",
    maxAge: 0
  });
  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ authorized: hasAstroBetaAccess(request.cookies) });
}
