import React from 'react';

interface TarotShellProps {
  children: React.ReactNode;
}

// Theme-aware shell: the room darkens from the active theme's background
// instead of a hardcoded hex, so abyssal and crimson change the atmosphere,
// not just the text. Accent glows derive from --copper / --gilt.
const TarotShell: React.FC<TarotShellProps> = ({ children }) => {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-[color:var(--bone)]"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 72%, #000 28%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--copper) 14%, transparent), transparent 34%),' +
            'radial-gradient(circle at 82% 16%, color-mix(in srgb, var(--gilt) 13%, transparent), transparent 36%),' +
            'linear-gradient(180deg, color-mix(in srgb, var(--bg) 82%, #000 18%), color-mix(in srgb, var(--bg) 68%, #000 32%))',
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--bone) 60%, transparent) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 78%, #000 22%), transparent)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(0deg, color-mix(in srgb, var(--bg) 76%, #000 24%), transparent)' }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TarotShell;
