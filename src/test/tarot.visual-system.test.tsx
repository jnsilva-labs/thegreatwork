import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import CardVisual from '@/features/tarot/components/CardVisual';
import Home from '@/features/tarot/pages/Home';
import { DEFAULT_DECK } from '@/features/tarot/constants';

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
});
