import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { DrawnCard } from '../types';
import { ImageOff } from '../icons';

interface TarotCardFaceProps {
  card: DrawnCard;
  className?: string;
}

const suitAccents = {
  major: { glyph: '◎', label: 'Major Arcana' },
  wands: { glyph: '△', label: 'Wands' },
  cups: { glyph: '◔', label: 'Cups' },
  swords: { glyph: '✦', label: 'Swords' },
  pentacles: { glyph: '◇', label: 'Pentacles' },
} as const;

const shouldBypassIllustration = (url?: string) => !url;

export const TarotCardFace: React.FC<TarotCardFaceProps> = ({ card, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const accent = suitAccents[card.suit] ?? suitAccents.major;
  const showIllustration = useMemo(
    () => Boolean(card.imageUrl && !shouldBypassIllustration(card.imageUrl) && !imgError),
    [card.imageUrl, imgError],
  );

  return (
    <div
      className={`relative mx-auto aspect-[7/12] h-full max-w-full overflow-hidden rounded-[0.18rem] border border-[color:var(--copper)]/55 bg-[color:var(--panel)] ${className}`}
    >
      {showIllustration ? (
        <>
          <div className="absolute inset-0 bg-[color:var(--bone)]" />
          <Image
            src={card.imageUrl!}
            alt={card.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 320px, 480px"
            className="object-contain p-[3px]"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg)_5%,transparent),color-mix(in_srgb,var(--bg)_38%,transparent)_100%)]" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(165deg, color-mix(in srgb, var(--gilt) 10%, var(--panel)), color-mix(in srgb, var(--bg) 30%, var(--panel)) 48%, var(--bg) 100%)',
            }}
          />
          <div className="absolute inset-[10px] border border-[color:var(--bone)]/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,color-mix(in_srgb,var(--bone)_8%,transparent),transparent_34%)]" />
          <div className="absolute inset-x-[14%] top-[16%] h-px bg-[color:var(--bone)]/10" />
          <div className="absolute inset-x-[18%] bottom-[22%] h-px bg-[color:var(--bone)]/10" />

          <div className="absolute inset-0 flex flex-col justify-between px-4 py-5 text-center">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--mist)]/80 sm:tracking-[0.18em]">{accent.label}</p>
              <p className="font-ritual text-xl leading-none text-[color:var(--bone)]">{card.name}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-ritual text-4xl leading-none text-[color:var(--gilt)]/85">{accent.glyph}</span>
              <div className="h-14 w-14 rounded-full border border-[color:var(--copper)]/45 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--gilt)_22%,transparent)]" />
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]/72 sm:tracking-[0.16em]">
                {card.arcana === 'major' ? `Arcana ${card.number}` : `${card.number} · ${accent.label}`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-center gap-1.5 text-xs uppercase tracking-[0.1em] text-[color:var(--mist)]/72 sm:tracking-[0.14em]">
                {card.keywords.slice(0, 2).map((keyword) => (
                  <span key={keyword} className="border border-[color:var(--copper)]/28 px-2 py-1">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!showIllustration && imgError && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 border border-[color:var(--copper)]/28 bg-[color:var(--bg)]/75 px-2 py-1 text-xs uppercase tracking-[0.1em] text-[color:var(--mist)]/72">
          <ImageOff size={12} />
          Archive unavailable
        </div>
      )}

      {card.isReversed && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--gilt)_2%,transparent),color-mix(in_srgb,var(--copper)_18%,transparent))] mix-blend-screen" />
      )}
    </div>
  );
};

export default TarotCardFace;
