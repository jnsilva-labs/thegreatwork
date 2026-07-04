import { z } from 'zod';
import { Interpretation } from '../types';

export const interpretationSchema = z.object({
  mirrorStatement: z.string().describe('Direct insight in 1-2 sentences'),
  archetypeShadow: z.string().describe('Detailed psychological analysis of the archetypes and shadow at play'),
  phase: z
    .enum(['nigredo', 'albedo', 'citrinitas', 'rubedo'])
    .describe('Which of the four stages of the Great Work this reading sits in'),
  phaseReason: z.string().describe('One sentence: why the reading sits in that stage'),
  practicalGuidance: z.array(z.string()).min(3).describe('Three concrete actions'),
  journalPrompts: z.array(z.string()).min(3).describe('Three reflective questions'),
  mantra: z.string().describe('Short grounding affirmation'),
});

export type InterpretationSchemaOutput = z.infer<typeof interpretationSchema>;

const STAGE_TITLES: Record<InterpretationSchemaOutput['phase'], string> = {
  nigredo: 'Nigredo — the blackening',
  albedo: 'Albedo — the whitening',
  citrinitas: 'Citrinitas — the yellowing',
  rubedo: 'Rubedo — the reddening',
};

// Bridge the schema output to the stored Interpretation shape. The legacy
// `alchemicalPhase` prose field is kept populated so older consumers
// (journal search, saved-reading rendering) keep working.
export function toInterpretation(output: InterpretationSchemaOutput): Interpretation {
  return {
    mirrorStatement: output.mirrorStatement,
    archetypeShadow: output.archetypeShadow,
    alchemicalPhase: `${STAGE_TITLES[output.phase]}. ${output.phaseReason}`,
    phase: output.phase,
    phaseReason: output.phaseReason,
    practicalGuidance: output.practicalGuidance.slice(0, 3),
    journalPrompts: output.journalPrompts.slice(0, 3),
    mantra: output.mantra,
  };
}
