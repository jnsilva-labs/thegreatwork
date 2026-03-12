import React from 'react';

interface TarotShellProps {
  children: React.ReactNode;
}

const TarotShell: React.FC<TarotShellProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04070d] text-[color:var(--bone)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(43,111,106,0.12),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(184,155,94,0.12),transparent_36%),linear-gradient(180deg,rgba(5,8,14,0.96),rgba(4,7,13,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(232,227,216,0.6) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(6,11,19,0.9),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(6,11,19,0.92),transparent)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TarotShell;
