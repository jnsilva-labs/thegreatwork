import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INTENTIONS, SpreadType } from '../types';
import { Sparkles, CircleDot, Triangle, Infinity, ExternalLink } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [intention, setIntention] = useState('General');

  const startReading = (spreadId: SpreadType) => {
    navigate('/reading', { state: { question, intention, spreadId } });
  };

  return (
    <div className="min-h-screen bg-void-950 text-slate-300 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Sacred Geometry Background Overlays */}
      <div className="absolute inset-0 bg-sacred-geo opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-radial-glow pointer-events-none"></div>

      {/* Floating Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-alchemy-gold/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <div className="z-10 max-w-3xl w-full flex flex-col gap-12 animate-fade-in px-4">
        
        {/* Header */}
        <header className="text-center space-y-6 relative">
          <div className="inline-flex flex-col items-center gap-2 mb-2">
             <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-alchemy-gold to-transparent opacity-50"></div>
             <Sparkles size={16} className="text-alchemy-gold animate-spin-slow" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headers text-slate-100 tracking-tight leading-none">
            Tarot <span className="text-alchemy-gold italic font-serif">Alchemy</span>
          </h1>
          
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm tracking-wide font-light border-b border-alchemy-gold/10 pb-6">
            The mirror does not show you what you look like.<br/>It shows you who you are.
          </p>
        </header>

        {/* Input Module */}
        <div className="group relative">
           {/* Decorative Corners */}
           <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-alchemy-gold/30 transition-all group-hover:w-full group-hover:h-full group-hover:border-alchemy-gold/10"></div>
           <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-alchemy-gold/30 transition-all group-hover:w-full group-hover:h-full group-hover:border-alchemy-gold/10"></div>

           <div className="bg-void-900/80 backdrop-blur-sm border border-void-800 p-8 md:p-10 space-y-10 relative overflow-hidden">
              
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-alchemy-gold-dim font-bold flex items-center gap-2">
                   <CircleDot size={10} /> The Question
                </label>
                <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is seeking awareness?"
                  className="w-full bg-transparent border-b border-void-700 p-4 text-xl md:text-2xl text-slate-100 focus:outline-none focus:border-alchemy-gold transition-colors font-serif placeholder:text-void-700 text-center"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-alchemy-gold-dim font-bold flex items-center gap-2 justify-center">
                   <Triangle size={10} className="rotate-180" /> Intention
                </label>
                <div className="flex flex-wrap justify-center gap-3">
                  {INTENTIONS.map(i => (
                    <button
                      key={i}
                      onClick={() => setIntention(i)}
                      className={`px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all border ${intention === i ? 'bg-alchemy-gold text-void-950 border-alchemy-gold font-bold' : 'bg-transparent text-slate-500 border-void-800 hover:border-alchemy-gold/50 hover:text-slate-300'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-void-800/50">
                {[
                    { id: 'one-card', name: 'Focus', desc: 'Single Insight', icon: CircleDot },
                    { id: 'three-card', name: 'Trinity', desc: 'Past / Present / Future', icon: Triangle },
                    { id: 'celtic-cross', name: 'Celtic', desc: 'Deep Analysis', icon: Infinity }
                ].map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => startReading(s.id as SpreadType)}
                      className="sacred-border group/btn relative p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-void-800/30 transition-colors"
                    >
                      <s.icon size={20} className="text-alchemy-gold/50 group-hover/btn:text-alchemy-gold transition-colors" />
                      <div>
                          <div className="font-headers text-lg text-slate-200 group-hover/btn:text-white transition-colors">{s.name}</div>
                          <div className="text-[10px] uppercase tracking-widest text-slate-600 group-hover/btn:text-alchemy-gold/70">{s.desc}</div>
                      </div>
                    </button>
                ))}
              </div>
           </div>
        </div>

        {/* Footer Nav */}
        <div className="w-full flex flex-col items-center gap-8">
            <div className="flex justify-center gap-12 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
               <button onClick={() => navigate('/journal')} className="flex items-center gap-2 hover:text-alchemy-gold transition-colors group">
                  <span className="w-1 h-1 bg-current rounded-full group-hover:scale-150 transition-transform"></span> Journal
               </button>
               <button onClick={() => navigate('/decks')} className="flex items-center gap-2 hover:text-alchemy-gold transition-colors group">
                  <span className="w-1 h-1 bg-current rounded-full group-hover:scale-150 transition-transform"></span> Decks
               </button>
               <button onClick={() => navigate('/settings')} className="flex items-center gap-2 hover:text-alchemy-gold transition-colors group">
                  <span className="w-1 h-1 bg-current rounded-full group-hover:scale-150 transition-transform"></span> Settings
               </button>
            </div>

            {/* Back to Main Site Link */}
            <a href="https://www.awarenessparadox.com" className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-400 transition-colors uppercase tracking-widest">
                <ExternalLink size={12} /> Return to Awareness Paradox
            </a>
        </div>

      </div>
    </div>
  );
};

export default Home;