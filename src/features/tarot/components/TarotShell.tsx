import React from 'react';

interface TarotShellProps {
  children: React.ReactNode;
  depth?: 'entry' | 'reading';
}

// The reading chamber is a deeper expression of the active site theme. Every
// material remains token-derived, so obsidian, abyssal, and crimson each carry
// their own atmosphere into the oracle.
const TarotShell: React.FC<TarotShellProps> = ({ children, depth = 'entry' }) => {
  const chamberBackground = depth === 'reading'
    ? 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 62%, var(--panel) 38%), color-mix(in srgb, var(--bg) 84%, var(--panel) 16%))'
    : 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 76%, var(--panel) 24%), var(--bg))';

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[color:var(--bg)] text-[color:var(--bone)]"
      data-tarot-depth={depth}
      style={{ background: chamberBackground }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--copper) 14%, transparent), transparent 34%),' +
            'radial-gradient(circle at 82% 12%, color-mix(in srgb, var(--gilt) 11%, transparent), transparent 36%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--bone) 58%, transparent) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-[6%] top-0 h-px bg-[color:var(--gilt)]/25"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TarotShell;
