import { z } from 'zod';
import { Interpretation } from '../types';

export const interpretationSchema = z.object({
  mirrorStatement: z.string().describe('Direct insight in 1-2 sentences'),
  archetypeShadow: z.string().describe('Detailed psychological analysis of the archetypes and shadow at play'),
  alchemicalPhase: z.string().describe('The alchemical phase and its process, explained'),
  practicalGuidance: z.array(z.string()).min(3).describe('Three concrete actions'),
  journalPrompts: z.array(z.string()).min(3).describe('Three reflective questions'),
  mantra: z.string().describe('Short grounding affirmation'),
});

// Compile-time check: the schema must stay structurally assignable to Interpretation.
type SchemaOutput = z.infer<typeof interpretationSchema>;
const _schemaMatchesInterpretation: Interpretation = {} as SchemaOutput;
void _schemaMatchesInterpretation;
