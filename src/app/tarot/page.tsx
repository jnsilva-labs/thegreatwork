import type { Metadata } from 'next';
import TarotApp from '@/features/tarot/TarotApp';

export const metadata: Metadata = {
  title: 'Tarot Alchemy | Awareness Paradox',
  description: 'A reflective tarot experience for Awareness Paradox.',
};

export default function TarotPage() {
  return <TarotApp />;
}
