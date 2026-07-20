'use client';

import React from 'react';
import { DrawnCard, SpreadType } from '../types';
import CardVisual from './CardVisual';

interface SpreadLayoutProps {
  type: SpreadType;
  cards: DrawnCard[];
  revealedIds: ReadonlySet<string>;
  onCardClick: (card: DrawnCard) => void;
}

type CardWithLabelProps = {
  card?: DrawnCard;
  isFaceUp: boolean;
  onClick: () => void;
  size: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const CardWithLabel: React.FC<CardWithLabelProps> = ({ card, isFaceUp, onClick, size, className = '' }) => (
  <div className={`group flex flex-col items-center ${className}`}>
    <CardVisual
      card={card}
      isFaceUp={isFaceUp}
      size={size}
      onClick={onClick}
      className="w-full"
    />
    {card && isFaceUp && (
      <div className="mt-3 max-w-[10rem] animate-fade-in text-center">
        <div className="mb-1 font-ritual text-base leading-tight text-[color:var(--gilt)]">{card.name}</div>
        <div className="hidden text-xs uppercase leading-relaxed tracking-[0.12em] text-[color:var(--mist)] md:block">
          {card.keywords.slice(0, 2).join(' • ')}
        </div>
      </div>
    )}
  </div>
);

const SpreadLayout: React.FC<SpreadLayoutProps> = ({ type, cards, revealedIds, onCardClick }) => {
  const isRevealed = (card?: DrawnCard) => Boolean(card && revealedIds.has(card.id));

  if (type === 'one-card') {
    return (
      <div className="flex min-h-[28rem] items-center justify-center py-4">
        {cards[0] && (
          <div className="flex animate-fade-in flex-col items-center gap-6">
            <CardVisual
              card={cards[0]}
              isFaceUp={isRevealed(cards[0])}
              size="xl"
              onClick={() => onCardClick(cards[0])}
            />
            {isRevealed(cards[0]) && (
              <div className="space-y-2 text-center">
                <div className="font-ritual text-3xl text-[color:var(--gilt)]">{cards[0].name}</div>
                <div className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)] sm:text-sm">
                  {cards[0].keywords.join(' • ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'three-card') {
    const positions = ['Context', 'Focus', 'Outcome'];

    return (
      <div className="flex min-h-[24rem] w-full items-start justify-center gap-3 px-1 py-5 sm:gap-6 md:gap-8 md:px-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="flex w-[30%] max-w-[12rem] animate-fade-in flex-col items-center gap-2"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="mb-1 min-h-5 text-center text-xs uppercase tracking-[0.1em] text-[color:var(--mist)] sm:tracking-[0.14em]">
              {positions[index]}
            </span>
            <CardWithLabel
              card={card}
              isFaceUp={isRevealed(card)}
              size="lg"
              className="w-full"
              onClick={() => onCardClick(card)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'celtic-cross') {
    return (
      <div className="flex min-h-[48rem] flex-col items-center justify-center gap-12 px-1 py-6 xl:flex-row xl:gap-20">
        <div className="relative h-[440px] w-[310px] shrink-0 origin-center scale-90 sm:scale-100 md:h-[600px] md:w-[450px]">
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            {cards[0] && <CardWithLabel card={cards[0]} isFaceUp={isRevealed(cards[0])} size="sm" onClick={() => onCardClick(cards[0])} />}
          </div>
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rotate-90 transition-[transform] duration-500 hover:z-30 hover:rotate-0">
            {cards[1] && <CardVisual card={cards[1]} isFaceUp={isRevealed(cards[1])} size="sm" onClick={() => onCardClick(cards[1])} />}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            {cards[2] && <CardWithLabel card={cards[2]} isFaceUp={isRevealed(cards[2])} size="sm" onClick={() => onCardClick(cards[2])} />}
          </div>
          <div className="absolute left-0 top-1/2 -ml-2 -translate-y-1/2 md:-ml-4">
            {cards[3] && <CardWithLabel card={cards[3]} isFaceUp={isRevealed(cards[3])} size="sm" onClick={() => onCardClick(cards[3])} />}
          </div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            {cards[4] && <CardWithLabel card={cards[4]} isFaceUp={isRevealed(cards[4])} size="sm" onClick={() => onCardClick(cards[4])} />}
          </div>
          <div className="absolute right-0 top-1/2 -mr-2 -translate-y-1/2 md:-mr-4">
            {cards[5] && <CardWithLabel card={cards[5]} isFaceUp={isRevealed(cards[5])} size="sm" onClick={() => onCardClick(cards[5])} />}
          </div>
        </div>

        <div className="w-full max-w-[22rem] border-y border-[color:var(--copper)]/28 xl:max-w-none">
          {[9, 8, 7, 6].map((index) => (
            <div key={index} className="relative flex min-h-[9rem] items-center gap-4 border-b border-[color:var(--copper)]/20 px-3 py-3 last:border-b-0">
              {cards[index] && (
                <>
                  <div className="shrink-0">
                    <CardVisual card={cards[index]} isFaceUp={isRevealed(cards[index])} size="sm" onClick={() => onCardClick(cards[index])} />
                  </div>
                  <div className={`flex flex-col text-left transition-[opacity] duration-500 ${isRevealed(cards[index]) ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="mb-1 text-xs uppercase tracking-[0.1em] text-[color:var(--mist)] sm:tracking-[0.14em]">
                      {index === 9 ? 'Outcome' : index === 8 ? 'Hopes / Fears' : index === 7 ? 'Environment' : 'Self'}
                    </span>
                    <span className="font-ritual text-base text-[color:var(--gilt)]">{cards[index].name}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SpreadLayout;
