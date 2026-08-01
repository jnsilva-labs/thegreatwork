'use client';

import React from 'react';
import { DrawnCard } from '../types';
import TarotCardFace from './TarotCardFace';
import { useMotionPreference } from '@/components/motion/useMotionPreference';

interface CardVisualProps {
  card?: DrawnCard;
  isFaceUp: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CardVisual: React.FC<CardVisualProps> = ({ card, isFaceUp, onClick, size = 'md', className = '' }) => {
  const { motionOk } = useMotionPreference();
  const sizeClasses = {
    sm: 'w-16 md:w-20 text-xs',
    md: 'w-24 md:w-32 text-xs md:text-sm',
    lg: 'w-44 md:w-56 text-xs md:text-sm',
    xl: 'w-56 md:w-72 text-sm md:text-base',
  };

  const currentSizeClass = className.includes('w-') ? className : `${sizeClasses[size]} ${className}`;

  return (
    <div className={`group relative z-0 aspect-[7/12] perspective-1000 text-[color:var(--bone)] ${motionOk ? 'transition-[filter,transform] duration-300 hover:z-10 hover:-translate-y-1' : ''} ${isFaceUp && motionOk ? 'card-reveal-arrive' : ''} ${currentSizeClass}`}>
      <div className={`pointer-events-none relative h-full w-full text-center transform-style-3d ${motionOk ? 'transition-transform duration-700' : ''} ${isFaceUp ? 'rotate-y-180' : ''}`}>
        
        <div className="absolute inset-0 flex backface-hidden items-center justify-center overflow-hidden rounded-[0.2rem] border border-[color:var(--copper)]/55 bg-[color:var(--panel)] shadow-2xl">
          
          <span className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(color-mix(in_srgb,var(--gilt)_28%,transparent)_0.75px,transparent_0.75px)] [background-size:12px_12px]" />
          
          <span className="absolute inset-2 rounded-sm border border-[color:var(--gilt)]/28" />
          <span className="absolute inset-1.5 border border-[color:var(--bone)]/10" />
          
          <span className="relative text-[color:var(--gilt)]/55">
             <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="45" strokeOpacity="0.5"/>
                <circle cx="50" cy="50" r="15" />
                
                {/* Hexagon */}
                <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" />
                
                {/* Inner Triangles */}
                <path d="M50 5 L89 72.5 L11 72.5 Z" strokeOpacity="0.3" />
                <path d="M50 95 L11 27.5 L89 27.5 Z" strokeOpacity="0.3" />
                
                <line x1="50" y1="5" x2="50" y2="95" strokeOpacity="0.2" />
                <line x1="11" y1="27.5" x2="89" y2="72.5" strokeOpacity="0.2" />
                <line x1="89" y1="27.5" x2="11" y2="72.5" strokeOpacity="0.2" />
             </svg>
          </span>
        </div>

        <div className="absolute inset-0 rotate-y-180 backface-hidden overflow-hidden rounded-[0.2rem] border-[3px] border-[color:var(--bone)]/25 bg-[color:var(--bg)] shadow-2xl">
           {card ? (
             <div className={`relative flex h-full w-full flex-col ${card.isReversed ? 'rotate-180' : ''}`}>
               <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[color:var(--panel)]">
                  <TarotCardFace card={card} />
               </div>
             </div>
           ) : (
             <span className="flex h-full items-center justify-center bg-[color:var(--panel)] font-headers text-[color:var(--mist)]">?</span>
           )}
        </div>
      </div>
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label={isFaceUp && card ? `${card.name}${card.isReversed ? ', reversed' : ''} — open details` : 'Turn this card'}
          className="absolute inset-0 z-20 cursor-pointer appearance-none border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--gilt)]"
        />
      )}
    </div>
  );
};

export default CardVisual;
