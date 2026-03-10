import { NextResponse } from "next/server";
import { STARTER_GUIDE_PDF_URL, hasStarterGuideAccess } from "@/lib/starterGuide";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("access");

  if (!process.env.STARTER_GUIDE_ACCESS_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "Starter guide access token is not configured." },
      { status: 503 }
    );
  }

  if (!hasStarterGuideAccess(token)) {
    return NextResponse.json(
      { error: "Access denied. Use the private guide link from your email." },
      { status: 403 }
    );
  }

  return NextResponse.redirect(STARTER_GUIDE_PDF_URL);
}
