import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Key, ShieldCheck, ExternalLink, Zap } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storageService';
import { AppSettings } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>({
    reversalsEnabled: true,
    activeDeckId: 'classic-rw',
    apiKey: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-void-950 text-slate-300 p-6 md:p-12 font-sans relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-sacred-geo opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-10 relative z-10">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="p-2 bg-void-900 rounded-full hover:bg-void-800 transition-colors border border-void-800">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-headers text-slate-100">Attunement Settings</h1>
            </header>

            <div className="space-y-8">
                
                {/* API Key Section */}
                <div className="bg-void-900/50 border border-alchemy-gold/30 rounded-sm p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Key size={100} />
                    </div>

                    <div>
                        <h2 className="text-xl font-headers text-alchemy-gold mb-2 flex items-center gap-2">
                            <Key size={18} /> The Voice (API Key)
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-2">
                            The application uses a shared connection by default. However, heavy traffic may cause delays or limits.
                        </p>
                        <div className="flex items-start gap-2 text-xs text-alchemy-gold/80 bg-alchemy-gold/5 p-3 rounded border border-alchemy-gold/10">
                            <Zap size={14} className="mt-0.5 shrink-0" />
                            <span>Adding your own key ensures a private, stable connection and bypasses shared rate limits.</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Personal API Key (Optional)</label>
                        <input 
                            type="password" 
                            value={settings.apiKey || ''}
                            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                            placeholder="AIzaSy... (Leave empty to use shared key)"
                            className="w-full bg-void-950 border border-void-800 p-4 text-slate-200 focus:border-alchemy-gold focus:outline-none font-mono text-sm rounded-sm"
                        />
                    </div>

                    <div className="flex gap-4 text-xs">
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-alchemy-gold hover:underline"
                        >
                            <ExternalLink size={12} /> Get a free Gemini API Key
                        </a>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-void-900/30 border border-void-800 rounded-sm p-8 space-y-6">
                    <h2 className="text-xl font-headers text-slate-200 mb-2">Reading Preferences</h2>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-slate-200 font-bold mb-1">Enable Reversals</span>
                            <span className="text-xs text-slate-500">Allow cards to appear upside down, indicating internalized or blocked energy.</span>
                        </div>
                        <button 
                            onClick={() => setSettings({...settings, reversalsEnabled: !settings.reversalsEnabled})}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.reversalsEnabled ? 'bg-alchemy-gold' : 'bg-void-800 border border-void-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.reversalsEnabled ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full py-4 bg-void-800 hover:bg-alchemy-gold hover:text-void-950 text-alchemy-gold border border-alchemy-gold/50 font-headers text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                >
                    {isSaved ? <ShieldCheck size={20} /> : <Save size={20} />}
                    {isSaved ? 'Attunement Complete' : 'Save Settings'}
                </button>

            </div>
        </div>
    </div>
  );
};

export default Settings;