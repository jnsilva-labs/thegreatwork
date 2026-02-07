import React from 'react';
import { DrawnCard, SpreadType } from '../types';
import CardVisual from './CardVisual';

interface SpreadLayoutProps {
  type: SpreadType;
  cards: DrawnCard[];
  revealedCount: number;
  onCardClick: (card: DrawnCard) => void;
}

const CardWithLabel: React.FC<{ card?: DrawnCard; isFaceUp: boolean; onClick: () => void; size: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ card, isFaceUp, onClick, size, className }) => {
  return (
    <div className={`flex flex-col items-center group ${className}`}>
      <CardVisual 
        card={card} 
        isFaceUp={isFaceUp} 
        size={size}
        onClick={onClick}
        className="w-full h-full" 
      />
      {card && isFaceUp && (
        <div className="mt-3 text-center animate-fade-in max-w-[120px]">
          <div className="font-headers text-alchemy-gold text-sm leading-tight mb-1">{card.name}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed hidden md:block">
            {card.keywords.slice(0, 2).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
};

const SpreadLayout: React.FC<SpreadLayoutProps> = ({ type, cards, revealedCount, onCardClick }) => {
  
  if (type === 'one-card') {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        {cards[0] && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
             <CardVisual 
               card={cards[0]} 
               isFaceUp={revealedCount > 0} 
               size="xl"
               onClick={() => onCardClick(cards[0])}
             />
             {revealedCount > 0 && (
                <div className="text-center mt-2 space-y-2">
                   <div className="text-2xl md:text-3xl font-headers text-alchemy-gold">{cards[0].name}</div>
                   <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.2em]">{cards[0].keywords.join(' • ')}</div>
                </div>
             )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'three-card') {
    return (
      <div className="flex flex-row justify-center items-start gap-2 md:gap-8 h-full min-h-[50vh] p-2 md:p-4 w-full">
        {cards.map((card, idx) => (
          <div 
            key={card.id} 
            className="flex flex-col items-center gap-2 animate-fade-in w-[30vw] max-w-[200px]" 
            style={{ animationDelay: `${idx * 200}ms` }}
          >
            <span className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-1 text-center h-4">
               {idx === 0 ? 'Context' : idx === 1 ? 'Focus' : 'Outcome'}
            </span>
            {/* 
              We override the standard size prop with a dynamic class 
              w-full takes up the 30vw width set in parent, aspect ratio ensures correct shape 
            */}
            <CardWithLabel 
              card={card} 
              isFaceUp={idx < revealedCount} 
              size="lg" // Fallback size, overridden by className below
              className="w-full aspect-[2/3]" 
              onClick={() => onCardClick(card)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'celtic-cross') {
    return (
      <div className="flex flex-col xl:flex-row justify-center items-center gap-12 xl:gap-20 p-2 min-h-[80vh]">
         {/* The Cross Container - Scaled down on mobile using transform to preserve layout integrity */}
         <div className="relative w-[300px] h-[420px] md:w-[450px] md:h-[600px] flex-shrink-0 scale-90 md:scale-100 origin-center">
             
             {/* Center Group */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                {cards[0] && <CardWithLabel card={cards[0]} isFaceUp={revealedCount > 0} size="sm" onClick={() => onCardClick(cards[0])} />}
             </div>
             {/* Crossing Card (Rotated) */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 z-20 hover:z-30 hover:rotate-0 transition-all duration-500">
                {cards[1] && <CardVisual card={cards[1]} isFaceUp={revealedCount > 1} size="sm" onClick={() => onCardClick(cards[1])} />}
             </div>
             
             {/* Bottom - Foundation */}
             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                {cards[2] && <CardWithLabel card={cards[2]} isFaceUp={revealedCount > 2} size="sm" onClick={() => onCardClick(cards[2])} />}
             </div>
             {/* Left - Past */}
             <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-2 md:-ml-4">
                {cards[3] && <CardWithLabel card={cards[3]} isFaceUp={revealedCount > 3} size="sm" onClick={() => onCardClick(cards[3])} />}
             </div>
             {/* Top - Crown */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                {cards[4] && <CardWithLabel card={cards[4]} isFaceUp={revealedCount > 4} size="sm" onClick={() => onCardClick(cards[4])} />}
             </div>
             {/* Right - Future */}
             <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-2 md:-mr-4">
                {cards[5] && <CardWithLabel card={cards[5]} isFaceUp={revealedCount > 5} size="sm" onClick={() => onCardClick(cards[5])} />}
             </div>
         </div>

         {/* The Staff (Positions 7-10) - Vertical list */}
         <div className="flex flex-col gap-3 md:gap-4 w-full max-w-[300px] md:max-w-none">
            {[9, 8, 7, 6].map((idx) => (
               <div key={idx} className="relative flex items-center justify-start xl:justify-start gap-4 p-2 md:p-0 bg-void-900/30 md:bg-transparent rounded-lg border border-void-800 md:border-none">
                  {cards[idx] && (
                     <>
                        <div className="flex-shrink-0">
                           <CardVisual 
                              card={cards[idx]} 
                              isFaceUp={revealedCount > idx} 
                              size="sm" 
                              onClick={() => onCardClick(cards[idx])}
                           />
                        </div>
                        {/* Mobile-friendly label for Staff cards */}
                        <div className={`flex flex-col text-left transition-opacity duration-500 ${revealedCount > idx ? 'opacity-100' : 'opacity-0'}`}>
                           <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
                              {idx === 9 ? 'Outcome' : idx === 8 ? 'Hopes/Fears' : idx === 7 ? 'Environment' : 'Self'}
                           </span>
                           <span className="font-headers text-alchemy-gold text-sm">{cards[idx].name}</span>
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