'use client';

import Link from 'next/link';
import { greatWork } from '@/data/greatWork';
import { AlchemicalStage, ALCHEMICAL_STAGES } from '../types';

type PhaseArcProps = {
  phase: AlchemicalStage;
  reason?: string;
};

const NUMERALS = ['I', 'II', 'III', 'IV'];

// Numeral color readable against each stage tone (albedo and citrinitas
// tones are light; nigredo and rubedo are dark).
const ACTIVE_TEXT: Record<AlchemicalStage, string> = {
  nigredo: 'var(--bone)',
  albedo: '#1e1b22',
  citrinitas: '#141110',
  rubedo: 'var(--bone)',
};

// Compact four-stage arc of the Great Work with the reading's stage lit.
// Repetition across readings becomes legible location on a shared map, and
// the stage links into the site's Great Work page.
export function PhaseArc({ phase, reason }: PhaseArcProps) {
  const activeIndex = ALCHEMICAL_STAGES.indexOf(phase);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-0" aria-label={`Alchemical stage: ${phase}`}>
        {greatWork.stages.map((stage, index) => {
          const isActive = stage.id === phase;
          const isPassed = index < activeIndex;
          return (
            <div key={stage.id} className="flex items-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`block h-px w-6 sm:w-10 ${isPassed || isActive ? 'bg-[color:var(--gilt)]/45' : 'bg-[color:var(--copper)]/25'}`}
                />
              )}
              <div className="flex flex-col items-center gap-2 px-1.5 sm:px-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border font-ritual text-sm transition sm:h-10 sm:w-10 ${
                    isActive
                      ? 'border-[color:var(--gilt)]/80'
                      : 'border-[color:var(--copper)]/30 text-[color:var(--mist)]/60'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: stage.tone,
                          color: ACTIVE_TEXT[stage.id],
                          boxShadow: '0 0 18px color-mix(in srgb, var(--glow) 35%, transparent)',
                        }
                      : undefined
                  }
                >
                  {NUMERALS[index]}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.22em] sm:text-[10px] ${
                    isActive ? 'text-[color:var(--gilt)]' : 'text-[color:var(--mist)]/50'
                  }`}
                >
                  {stage.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {reason && (
        <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-[color:#D5D0C6]">{reason}</p>
      )}

      <p className="text-center">
        <Link
          href={`/great-work#${phase}`}
          className="inline-flex min-h-[44px] items-center text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]/72 underline-offset-4 transition hover:text-[color:var(--gilt)] hover:underline"
        >
          Read about this stage of the Great Work
        </Link>
      </p>
    </div>
  );
}
