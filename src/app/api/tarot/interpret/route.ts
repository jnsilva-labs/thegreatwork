import { generateSharedInterpretation } from './generator';
import { createInterpretHandler } from './handler';

export const runtime = 'nodejs';
export const maxDuration = 60;

const handleInterpretation = createInterpretHandler({ generate: generateSharedInterpretation });

export async function POST(request: Request) {
  return handleInterpretation(request);
}
