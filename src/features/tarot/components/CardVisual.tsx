'use client';

import React, { useState } from 'react';
import { DrawnCard } from '../types';
import TarotCardFace from './TarotCardFace';

interface CardVisualProps {
  card?: DrawnCard;
  isFaceUp: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CardVisual: React.FC<CardVisualProps> = ({ card, isFaceUp, onClick, size = 'md', className = '' }) => {
  const [hovered, setHovered] = useState(false);

  // Responsive sizes: Mobile first, then md (desktop)
  // If className overrides width/height, these are fallback defaults.
  const sizeClasses = {
    // Celtic Cross / Dense layouts
    sm: 'w-16 h-24 md:w-20 md:h-32 text-[11px]', 
    
    // Standard
    md: 'w-24 h-36 md:w-32 md:h-52 text-[11px] md:text-sm',
    
    // Three Card spread
    lg: 'w-48 h-72 md:w-56 md:h-80 text-xs md:text-sm',
    
    // Single Card focus
    xl: 'w-64 h-96 md:w-80 md:h-[480px] text-sm md:text-base'
  };

  const currentSizeClass = className.includes('w-') ? className : `${sizeClasses[size]} ${className}`;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative perspective-1000 ${currentSizeClass} cursor-pointer group z-0 hover:z-10 transition-all duration-300`}
    >
      <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d ${isFaceUp ? 'rotate-y-180' : ''} ${hovered ? 'scale-[1.02]' : ''}`}>
        
        {/* Back of Card - Sacred Geometry Design */}
        <div className="absolute w-full h-full backface-hidden rounded shadow-2xl bg-void-900 border border-alchemy-gold/30 flex items-center justify-center overflow-hidden">
          
          {/* Layered Geometry */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
          
          <div className="absolute inset-2 border border-alchemy-gold/20 rounded-sm"></div>
          <div className="absolute inset-1.5 border-[0.5px] border-alchemy-gold/10"></div>
          
          {/* Central Motif - Metatron Cube Approximation */}
          <div className="relative text-alchemy-gold/40 animate-pulse-slow">
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
          </div>
        </div>

        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded shadow-2xl overflow-hidden bg-void-950 border-[3px] border-[color:rgba(214,198,165,0.24)]">
           {card ? (
             <div className={`relative w-full h-full flex flex-col ${card.isReversed ? 'rotate-180' : ''}`}>
               <div className="relative flex-1 overflow-hidden bg-void-900 flex items-center justify-center">
                  <TarotCardFace card={card} />
               </div>
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-slate-600 bg-void-900 font-headers">?</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CardVisual;
