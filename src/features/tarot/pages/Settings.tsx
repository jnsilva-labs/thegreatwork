'use client';

import React, { useState } from 'react';
import { useMotionPreference } from '@/components/motion/useMotionPreference';
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
  const { motionOk } = useMotionPreference();

  const handleSave = () => {
    saveSettings(settings);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <TarotShell>
      <div className="relative z-10 mx-auto max-w-3xl space-y-10 px-6 py-16 md:px-12">
        <header className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('home')} aria-label="Return to tarot home" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[color:var(--copper)]/18 px-3 py-2 text-[color:var(--mist)] transition-[border-color,color] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--gilt)] sm:tracking-[0.28em]">Tarot settings</p>
            <h1 className="font-ritual text-4xl text-[color:var(--bone)]">Attunement</h1>
          </div>
        </header>

        <div className="space-y-8">
          <div className="relative space-y-6 overflow-hidden border border-[color:var(--gilt)]/22 bg-[color:var(--panel)]/72 p-8">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Key size={100} />
            </div>

            <div>
              <h2 className="mb-2 flex items-center gap-2 font-ritual text-2xl text-[color:var(--gilt)]">
                <Key size={18} /> The Voice (API Key)
              </h2>
              <p className="mb-2 text-sm leading-relaxed text-[color:var(--mist)]">
                Readings use the app&apos;s shared AI service first. Add your own Gemini key only as a fallback if shared quota is reached.
              </p>
              <div className="flex items-start gap-2 border border-[color:var(--gilt)]/10 bg-[color:var(--gilt)]/6 p-3 text-xs text-[color:var(--gilt)]/88">
                <Zap size={14} className="mt-0.5 shrink-0" />
                <span>Your personal key bypasses shared limits and keeps your readings available during peak traffic.</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="personal-api-key" className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--mist)]">Personal API Key (Optional)</label>
              <input
                id="personal-api-key"
                name="apiKey"
                type="password"
                value={settings.apiKey || ''}
                onChange={(event) => setSettings({ ...settings, apiKey: event.target.value })}
                placeholder="AIzaSy..."
                autoComplete="off"
                className="min-h-[44px] w-full border border-[color:var(--copper)]/28 bg-[color:var(--bg)] p-4 font-mono text-sm text-[color:var(--bone)] outline-none transition-[border-color] focus:border-[color:var(--gilt)]"
              />
            </div>

            <div className="flex gap-4 text-xs">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-[color:var(--gilt)] hover:underline"
              >
                <ExternalLink size={12} /> Get a Gemini API Key
              </a>
            </div>
          </div>

          <div className="space-y-6 border border-[color:var(--copper)]/24 bg-[color:var(--panel)]/62 p-8">
            <h2 className="mb-2 font-ritual text-2xl text-[color:var(--bone)]">Reading Preferences</h2>

            <div className="flex items-center justify-between">
              <div>
                <span className="mb-1 block text-[color:var(--bone)] font-bold">Enable Reversals</span>
                <span className="text-xs text-[color:var(--mist)]">Allow cards to appear upside down, indicating internalized or blocked energy.</span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, reversalsEnabled: !settings.reversalsEnabled })}
                aria-pressed={settings.reversalsEnabled}
                aria-label="Enable reversals"
                className={`relative h-11 w-12 rounded-full ${motionOk ? 'transition-colors' : ''} ${settings.reversalsEnabled ? 'bg-[color:var(--gilt)]' : 'border border-[color:var(--copper)]/28 bg-[color:var(--bg)]'}`}
              >
                <div className={`absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white ${motionOk ? 'transition-transform' : ''} ${settings.reversalsEnabled ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="flex min-h-12 w-full items-center justify-center gap-3 border border-[color:var(--gilt)]/45 bg-[color:var(--bg)]/86 py-4 text-sm uppercase tracking-[0.18em] text-[color:var(--gilt)] transition-[background-color,color] hover:bg-[color:var(--gilt)]/12 hover:text-[color:var(--bone)] sm:tracking-[0.26em]"
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
