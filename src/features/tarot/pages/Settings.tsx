'use client';

import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Key, Save, ShieldCheck, Zap } from '../icons';
import TarotShell from '../components/TarotShell';
import { getSettings, saveSettings } from '../services/storageService';
import { AppSettings, TarotView } from '../types';

interface SettingsProps {
  onNavigate: (view: TarotView) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <TarotShell>
      <div className="relative z-10 mx-auto max-w-3xl space-y-10 px-6 py-16 md:px-12">
        <header className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[color:var(--copper)]/18 px-3 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--gilt)]">Tarot settings</p>
            <h1 className="font-ritual text-4xl text-[color:var(--bone)]">Attunement</h1>
          </div>
        </header>

        <div className="space-y-8">
          <div className="relative overflow-hidden border border-[color:var(--gilt)]/22 bg-[rgba(6,11,19,0.72)] p-8 space-y-6">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Key size={100} />
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 font-ritual text-2xl text-[color:var(--gilt)]">
                <Key size={18} /> The Voice (API Key)
              </h2>
              <p className="mb-2 text-sm leading-relaxed text-[color:var(--mist)]">
                Readings use the app&apos;s shared free Gemini key first. Add your own key only as a fallback if shared quota is reached.
              </p>
              <div className="flex items-start gap-2 border border-[color:var(--gilt)]/10 bg-[rgba(184,155,94,0.06)] p-3 text-xs text-[color:var(--gilt)]/88">
                <Zap size={14} className="mt-0.5 shrink-0" />
                <span>Your personal key bypasses shared limits and keeps your readings available during peak traffic.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--mist)]">Personal API Key (Optional)</label>
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(event) => setSettings({ ...settings, apiKey: event.target.value })}
                placeholder="AIzaSy..."
                className="w-full border border-[color:var(--copper)]/16 bg-[#050810] p-4 font-mono text-sm text-[color:#D5D0C6] outline-none transition focus:border-[color:var(--gilt)]"
              />
            </div>

            <div className="flex gap-4 text-xs">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[color:var(--gilt)] hover:underline"
              >
                <ExternalLink size={12} /> Get a Gemini API Key
              </a>
            </div>
          </div>

          <div className="space-y-6 border border-[color:var(--copper)]/14 bg-[rgba(6,11,19,0.62)] p-8">
            <h2 className="mb-2 font-ritual text-2xl text-[color:var(--bone)]">Reading Preferences</h2>

            <div className="flex items-center justify-between">
              <div>
                <span className="mb-1 block text-[color:var(--bone)] font-bold">Enable Reversals</span>
                <span className="text-xs text-[color:var(--mist)]">Allow cards to appear upside down, indicating internalized or blocked energy.</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, reversalsEnabled: !settings.reversalsEnabled })}
                className={`relative h-6 w-12 rounded-full transition-colors ${settings.reversalsEnabled ? 'bg-[color:var(--gilt)]' : 'border border-[color:var(--copper)]/16 bg-[#050810]'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.reversalsEnabled ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-3 border border-[color:var(--gilt)]/45 bg-[rgba(6,11,19,0.86)] py-4 text-sm uppercase tracking-[0.3em] text-[color:var(--gilt)] transition hover:bg-[rgba(184,155,94,0.12)] hover:text-[color:var(--bone)]"
          >
            {isSaved ? <ShieldCheck size={20} /> : <Save size={20} />}
            {isSaved ? 'Attunement Complete' : 'Save Settings'}
          </button>
        </div>
      </div>
    </TarotShell>
  );
};

export default Settings;
