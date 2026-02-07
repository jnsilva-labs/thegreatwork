import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReadings } from '../services/storageService';
import { Reading } from '../types';
import { ArrowLeft, Calendar, Search } from 'lucide-react';

const Journal: React.FC = () => {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setReadings(getReadings());
  }, []);

  const filteredReadings = readings.filter(r => 
    r.question?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.intention?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.interpretation?.mirrorStatement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-serif text-white">Journal</h1>
        </header>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search your journey..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-mystic-gold/30"
          />
        </div>

        <div className="space-y-4">
          {filteredReadings.length === 0 ? (
            <div className="text-center text-slate-600 py-12 italic">No entries found. The page is blank.</div>
          ) : (
            filteredReadings.map(reading => (
              <div key={reading.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-mystic-gold uppercase tracking-widest mb-1 block">{reading.intention}</span>
                    <h3 className="text-xl font-serif text-white">{reading.question || "General Reading"}</h3>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs gap-1">
                    <Calendar size={12} />
                    {new Date(reading.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                   {reading.cards.map((c, i) => (
                     <div key={i} className="flex-shrink-0 w-16 h-24 bg-slate-800 rounded border border-slate-700 overflow-hidden relative">
                        <img src={c.imageUrl} className="w-full h-full object-cover opacity-50" />
                        {c.isReversed && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-red-300 font-bold bg-black/20">REV</div>}
                     </div>
                   ))}
                </div>

                {reading.interpretation && (
                  <div className="border-t border-slate-800 pt-4">
                    <p className="text-slate-400 italic mb-4">"{reading.interpretation.mirrorStatement}"</p>
                    
                    <div className="text-sm text-slate-500">
                      <span className="font-bold text-slate-400">Guidance: </span> 
                      {reading.interpretation.practicalGuidance[0]}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Journal;