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
      <div className="mx-auto grid w-full max-w-lg grid-cols-4 gap-1 sm:gap-2" aria-label={`Alchemical stage: ${phase}`}>
        {greatWork.stages.map((stage, index) => {
          const isActive = stage.id === phase;
          const isPassed = index < activeIndex;
          return (
            <div key={stage.id} data-phase-step={stage.id} className="relative flex min-w-0 flex-col items-center gap-2 px-0.5 sm:px-1">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  data-phase-connector=""
                  className={`absolute right-1/2 top-5 z-0 block h-px w-[calc(100%+0.25rem)] sm:w-[calc(100%+0.5rem)] ${isPassed || isActive ? 'bg-[color:var(--gilt)]/45' : 'bg-[color:var(--copper)]/25'}`}
                />
              )}
              <span
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[color:var(--bg)] font-ritual text-sm transition-[background-color,border-color,color,box-shadow] ${
                  isActive
                    ? 'border-[color:var(--gilt)]/80 bg-[color:var(--gilt)]/18 text-[color:var(--bone)]'
                    : 'border-[color:var(--copper)]/30 text-[color:var(--mist)]/80'
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
                className={`w-full break-words text-center text-xs leading-tight uppercase tracking-[0.06em] sm:tracking-[0.12em] ${
                  isActive ? 'text-[color:var(--gilt)]' : 'text-[color:var(--mist)]/80'
                }`}
              >
                {stage.title}
              </span>
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
          className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] underline-offset-4 transition-[color,text-decoration-color] hover:text-[color:var(--gilt)] hover:underline sm:tracking-[0.18em]"
        >
          Read about this stage of the Great Work
        </Link>
      </p>
    </div>
  );
}
