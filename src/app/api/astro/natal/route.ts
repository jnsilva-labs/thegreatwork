import type { NextRequest } from "next/server";
import { createNatalHandler } from "./handler";

export const runtime = "nodejs";

const handleNatal = createNatalHandler();

export async function POST(request: NextRequest) {
  return handleNatal(request);
}
