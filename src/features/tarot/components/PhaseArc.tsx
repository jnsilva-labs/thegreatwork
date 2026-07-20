'use client';

import Link from 'next/link';
import { greatWork } from '@/data/greatWork';
import { AlchemicalStage, ALCHEMICAL_STAGES } from '../types';

type PhaseArcProps = {
  phase: AlchemicalStage;
  reason?: string;
};

const NUMERALS = ['I', 'II', 'III', 'IV'];

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
                  className={`flex h-10 w-10 items-center justify-center rounded-full border font-ritual text-sm transition-[background-color,border-color,color,box-shadow] ${
                    isActive
                      ? 'border-[color:var(--gilt)]/80 bg-[color:var(--gilt)]/18 text-[color:var(--bone)]'
                      : 'border-[color:var(--copper)]/30 text-[color:var(--mist)]/60'
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow: '0 0 18px color-mix(in srgb, var(--glow) 35%, transparent)',
                        }
                      : undefined
                  }
                >
                  {NUMERALS[index]}
                </span>
                <span
                  className={`text-xs uppercase tracking-[0.1em] sm:tracking-[0.16em] ${
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
        <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-[color:var(--mist)]">{reason}</p>
      )}

      <p className="text-center">
        <Link
          href={`/great-work#${phase}`}
          className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]/72 underline-offset-4 transition-[color,text-decoration-color] hover:text-[color:var(--gilt)] hover:underline sm:tracking-[0.18em]"
        >
          Read about this stage of the Great Work
        </Link>
      </p>
    </div>
  );
}
