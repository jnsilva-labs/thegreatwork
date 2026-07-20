import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CardVisual from '@/features/tarot/components/CardVisual';
import { PhaseArc } from '@/features/tarot/components/PhaseArc';
import Home from '@/features/tarot/pages/Home';
import { DEFAULT_DECK } from '@/features/tarot/constants';

const { completedInterpretation } = vi.hoisted(() => ({
  completedInterpretation: {
    mirrorStatement: 'The mirror clarifies the question.',
    archetypeShadow: 'Name the pattern before acting on it.',
    alchemicalPhase: 'Clarification through reflection.',
    phase: 'albedo' as const,
    phaseReason: 'The reading asks for clear seeing.',
    practicalGuidance: ['Write down what is known.'],
    journalPrompts: ['What becomes visible when urgency falls away?'],
    mantra: 'I make room for clarity.',
  },
}));

vi.mock('@/features/tarot/services/geminiService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/tarot/services/geminiService')>();
  return {
    ...actual,
    generateInterpretation: vi.fn().mockResolvedValue(completedInterpretation),
  };
});

vi.mock('@/features/tarot/services/storageService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/tarot/services/storageService')>();
  return { ...actual, saveReading: vi.fn() };
});

import Reading from '@/features/tarot/pages/Reading';

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

const upgradedFiles = [
  'src/features/tarot/components/TarotShell.tsx',
  'src/features/tarot/pages/Home.tsx',
  'src/features/tarot/components/CardVisual.tsx',
  'src/features/tarot/components/TarotCardFace.tsx',
  'src/features/tarot/components/SpreadLayout.tsx',
  'src/features/tarot/components/PhaseArc.tsx',
  'src/features/tarot/pages/Reading.tsx',
] as const;

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

describe('tarot reading chamber visual system', () => {
  it('uses the authentic Rider-Waite 7:12 proportion for every card presentation', () => {
    const cardVisual = readSource('src/features/tarot/components/CardVisual.tsx');
    const cardFace = readSource('src/features/tarot/components/TarotCardFace.tsx');
    const spread = readSource('src/features/tarot/components/SpreadLayout.tsx');
    const reading = readSource('src/features/tarot/pages/Reading.tsx');

    expect(cardVisual).toContain('aspect-[7/12]');
    expect(cardFace).toContain('aspect-[7/12]');
    expect(`${cardVisual}\n${spread}\n${reading}`).not.toContain('aspect-[2/3]');
  });

  it('renders each card trigger as a clearly named native button', () => {
    const card = { ...DEFAULT_DECK.cards[0], isReversed: false, positionId: 1 };

    render(<CardVisual card={card} isFaceUp={false} onClick={vi.fn()} />);

    const trigger = screen.getByRole('button', { name: /turn this card/i });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.childElementCount).toBe(0);
  });

  it('derives the chamber from semantic theme tokens without legacy room materials', () => {
    for (const file of upgradedFiles) {
      const source = readSource(file);
      expect(source, file).toMatch(/var\(--(?:bg|bone|mist|copper|gilt|panel|fg|muted|border|accent)\)/);
      expect(source, file).not.toMatch(/(?:bg|text|border)-(?:void|mystic|slate|navy)(?:-|\b)/);
      expect(source, file).not.toContain('transition-all');
      expect(source, file).not.toContain('transparenttextures.com');
    }
  });

  it('keeps essential card and phase labels at 12px or larger with restrained tracking', () => {
    const labels = [
      readSource('src/features/tarot/components/TarotCardFace.tsx'),
      readSource('src/features/tarot/components/PhaseArc.tsx'),
    ].join('\n');

    expect(labels).not.toMatch(/text-\[(?:9|10|11)px\]/);
    expect(labels).not.toContain('tracking-[0.28em]');
    expect(labels).toMatch(/min-h-\[44px\]/);
  });

  it('lays out all four phase steps in a narrow-safe grid with overlay connectors', () => {
    const { container } = render(
      <div data-testid="phase-320" style={{ width: 320 }}>
        <PhaseArc phase="albedo" />
      </div>,
    );
    const arc = screen.getByLabelText(/alchemical stage: albedo/i);

    expect(screen.getByTestId('phase-320').style.width).toBe('320px');
    expect(arc.className).toContain('grid-cols-4');
    expect(arc.className).toContain('w-full');
    expect(container.querySelectorAll('[data-phase-step]')).toHaveLength(4);
    for (const step of container.querySelectorAll('[data-phase-step]')) {
      expect(step.className).toContain('min-w-0');
    }
    const connectors = Array.from(container.querySelectorAll('[data-phase-connector]'));
    expect(connectors).toHaveLength(3);
    expect(connectors.every((connector) => connector.className.includes('absolute'))).toBe(true);
  });

  it('presents a labelled, high-contrast question field with persistent narrow-screen guidance', () => {
    render(<Home onNavigate={vi.fn()} onStartReading={vi.fn()} />);

    const question = screen.getByLabelText(/the question/i);
    const helper = screen.getByText(/one clear question/i);

    expect(question.getAttribute('aria-describedby')).toContain(helper.id);
    expect(question.className).toContain('min-h-[96px]');
    expect(question.className).toContain('bg-[color:var(--bone)]');
    expect(helper.className).toContain('text-xs');
  });

  it('keeps the completed reading in one continuous interpretive sequence', () => {
    const reading = readSource('src/features/tarot/pages/Reading.tsx');
    const landmarks = [
      'Question',
      '<SpreadLayout',
      'mirrorStatement',
      '<PhaseArc',
      'Archetype & Shadow',
      'Practical Integration',
      'Journal Inquiries',
      'Saved to Journal',
    ];

    let previousIndex = -1;
    for (const landmark of landmarks) {
      const nextIndex = reading.indexOf(landmark);
      expect(nextIndex, landmark).toBeGreaterThan(previousIndex);
      previousIndex = nextIndex;
    }
  });

  it('renders a coherent h1, h2, h3 outline for a completed reading', async () => {
    vi.useFakeTimers();
    render(
      <Reading
        request={{ question: 'What needs attention?', intention: 'General', spreadId: 'one-card' }}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'The Focal Point' })).toBeTruthy();

    act(() => vi.advanceTimersByTime(2_500));
    fireEvent.click(screen.getByRole('button', { name: /turn this card/i }));
    vi.useRealTimers();
    fireEvent.click(screen.getByRole('button', { name: /reveal guidance/i }));

    expect(await screen.findByRole('heading', { level: 2, name: /the mirror clarifies the question/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: /where you stand in the work/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: /archetype & shadow/i })).toBeTruthy();
  });
});
