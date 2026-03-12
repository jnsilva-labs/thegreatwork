import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { DrawnCard } from '../types';
import { ImageOff } from '../icons';

interface TarotCardFaceProps {
  card: DrawnCard;
  className?: string;
}

const suitAccents = {
  major: { border: 'rgba(184, 155, 94, 0.48)', wash: 'rgba(184, 155, 94, 0.08)', glyph: '◎', label: 'Major Arcana' },
  wands: { border: 'rgba(173, 124, 92, 0.5)', wash: 'rgba(173, 124, 92, 0.1)', glyph: '△', label: 'Wands' },
  cups: { border: 'rgba(110, 147, 132, 0.52)', wash: 'rgba(110, 147, 132, 0.1)', glyph: '◔', label: 'Cups' },
  swords: { border: 'rgba(118, 137, 167, 0.5)', wash: 'rgba(118, 137, 167, 0.1)', glyph: '✦', label: 'Swords' },
  pentacles: { border: 'rgba(214, 198, 165, 0.52)', wash: 'rgba(214, 198, 165, 0.08)', glyph: '◇', label: 'Pentacles' },
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
      className={`relative h-full w-full overflow-hidden rounded-[0.18rem] border bg-[#080d15] ${className}`}
      style={{ borderColor: accent.border }}
    >
      {showIllustration ? (
        <>
          <Image
            src={card.imageUrl!}
            alt={card.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 320px, 480px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,13,0.12),rgba(3,7,13,0.45)_100%)]" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(165deg, ${accent.wash}, rgba(6,11,19,0.12) 38%, rgba(6,11,19,0.92) 100%)`,
            }}
          />
          <div className="absolute inset-[10px] border border-white/6" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.05),transparent_34%)]" />
          <div className="absolute inset-x-[14%] top-[16%] h-px bg-white/8" />
          <div className="absolute inset-x-[18%] bottom-[22%] h-px bg-white/8" />

            <div className="absolute inset-0 flex flex-col justify-between px-4 py-5 text-center">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--mist)]/80">{accent.label}</p>
              <p className="font-ritual text-xl leading-none text-[color:var(--bone)]">{card.name}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-ritual text-4xl leading-none text-[color:var(--gilt)]/85">{accent.glyph}</span>
              <div className="h-14 w-14 rounded-full border border-white/8" style={{ boxShadow: `0 0 0 1px ${accent.border} inset` }} />
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--mist)]/72">
                {card.arcana === 'major' ? `Arcana ${card.number}` : `${card.number} · ${accent.label}`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[color:var(--mist)]/72">
                {card.keywords.slice(0, 2).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-white/8 px-2 py-1">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!showIllustration && imgError && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/8 bg-black/30 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--mist)]/72">
          <ImageOff size={11} />
          Archive unavailable
        </div>
      )}

      {card.isReversed && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(94,32,32,0.02),rgba(94,32,32,0.16))] mix-blend-screen" />
      )}
    </div>
  );
};

export default TarotCardFace;
