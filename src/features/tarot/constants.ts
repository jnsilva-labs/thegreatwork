import { Card, Deck, SpreadDefinition } from './types';

// Source: Sacred Texts Archive (The Pictorial Key to the Tarot)
// This is a stable, public domain web host that does not block hotlinking.
const BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img';

// Helper to generate filenames based on Sacred Texts convention:
// Majors: ar00.jpg to ar21.jpg
// Wands: wa01.jpg to wa14.jpg
// Cups: cu01.jpg to cu14.jpg
// Swords: sw01.jpg to sw14.jpg
// Pentacles: pe01.jpg to pe14.jpg
const getImgUrl = (filename: string) => `${BASE_URL}/${filename}.jpg`;

const MAJOR_ARCANA_DATA: Partial<Card>[] = [
  { id: 'm0', name: 'The Fool', number: 0, keywords: ['New beginnings', 'Innocence', 'Leap of faith'], meaningUpright: 'A fresh start, trust in the process.', meaningReversed: 'Recklessness, negligence.', shadow: 'Naivety, avoiding responsibility.', gift: 'Pure potentiality.', imageUrl: getImgUrl('ar00') },
  { id: 'm1', name: 'The Magician', number: 1, keywords: ['Manifestation', 'Power', 'Action'], meaningUpright: 'You have the resources you need.', meaningReversed: 'Manipulation, untapped talent.', shadow: 'Trickster energy.', gift: 'Conscious creation.', imageUrl: getImgUrl('ar01') },
  { id: 'm2', name: 'The High Priestess', number: 2, keywords: ['Intuition', 'Unconscious', 'Mystery'], meaningUpright: 'Listen to your inner voice.', meaningReversed: 'Secrets, disconnected intuition.', shadow: 'Hidden agendas.', gift: 'Deep inner knowing.', imageUrl: getImgUrl('ar02') },
  { id: 'm3', name: 'The Empress', number: 3, keywords: ['Fertility', 'Nature', 'Abundance'], meaningUpright: 'Creativity birthing reality.', meaningReversed: 'Creative block, dependence.', shadow: 'Smothering energy.', gift: 'Unconditional nurturing.', imageUrl: getImgUrl('ar03') },
  { id: 'm4', name: 'The Emperor', number: 4, keywords: ['Authority', 'Structure', 'Control'], meaningUpright: 'Establishing order and boundaries.', meaningReversed: 'Tyranny, rigidity.', shadow: 'Domination.', gift: 'Stability and protection.', imageUrl: getImgUrl('ar04') },
  { id: 'm5', name: 'The Hierophant', number: 5, keywords: ['Tradition', 'Beliefs', 'Teaching'], meaningUpright: 'Spiritual wisdom, conformity.', meaningReversed: 'Rebellion, personal beliefs.', shadow: 'Dogma.', gift: 'Shared wisdom.', imageUrl: getImgUrl('ar05') },
  { id: 'm6', name: 'The Lovers', number: 6, keywords: ['Love', 'Union', 'Choices'], meaningUpright: 'Harmony and alignment of values.', meaningReversed: 'Disharmony, imbalance.', shadow: 'Codependency.', gift: 'Integration of opposites.', imageUrl: getImgUrl('ar06') },
  { id: 'm7', name: 'The Chariot', number: 7, keywords: ['Willpower', 'Determination', 'Victory'], meaningUpright: 'Focus and drive lead to success.', meaningReversed: 'Lack of direction, aggression.', shadow: 'Ego-driven control.', gift: 'Disciplined action.', imageUrl: getImgUrl('ar07') },
  { id: 'm8', name: 'Strength', number: 8, keywords: ['Courage', 'Compassion', 'Influence'], meaningUpright: 'Inner strength and patience.', meaningReversed: 'Self-doubt, insecurity.', shadow: 'Brute force.', gift: 'Gentle power.', imageUrl: getImgUrl('ar08') },
  { id: 'm9', name: 'The Hermit', number: 9, keywords: ['Introspection', 'Solitude', 'Guidance'], meaningUpright: 'Seeking inner answers.', meaningReversed: 'Isolation, loneliness.', shadow: 'Withdrawal from life.', gift: 'Self-illumination.', imageUrl: getImgUrl('ar09') },
  { id: 'm10', name: 'Wheel of Fortune', number: 10, keywords: ['Cycles', 'Fate', 'Change'], meaningUpright: 'Life is in constant motion.', meaningReversed: 'Resistance to change.', shadow: 'Victim mentality.', gift: 'Acceptance of flow.', imageUrl: getImgUrl('ar10') },
  { id: 'm11', name: 'Justice', number: 11, keywords: ['Justice', 'Fairness', 'Truth'], meaningUpright: 'Fairness, truth, law.', meaningReversed: 'Unfairness, lack of accountability.', shadow: 'Judgmentalism.', gift: 'Clarity and truth.', imageUrl: getImgUrl('ar11') },
  { id: 'm12', name: 'The Hanged Man', number: 12, keywords: ['Surrender', 'Perspective', 'Pause'], meaningUpright: 'Letting go, new perspective.', meaningReversed: 'Stalling, resistance.', shadow: 'Martyrdom.', gift: 'Surrender to the flow.', imageUrl: getImgUrl('ar12') },
  { id: 'm13', name: 'Death', number: 13, keywords: ['Endings', 'Transformation', 'Transition'], meaningUpright: 'End of a cycle, new beginning.', meaningReversed: 'Resistance to change.', shadow: 'Fear of change.', gift: 'Rebirth.', imageUrl: getImgUrl('ar13') },
  { id: 'm14', name: 'Temperance', number: 14, keywords: ['Balance', 'Moderation', 'Patience'], meaningUpright: 'Balance, moderation, patience.', meaningReversed: 'Imbalance, excess.', shadow: 'Extremism.', gift: 'Harmony.', imageUrl: getImgUrl('ar14') },
  { id: 'm15', name: 'The Devil', number: 15, keywords: ['Addiction', 'Materialism', 'Playfulness'], meaningUpright: 'Bondage, addiction, sexuality.', meaningReversed: 'Release, breaking chains.', shadow: 'Enslavement to matter.', gift: 'Understanding shadow.', imageUrl: getImgUrl('ar15') },
  { id: 'm16', name: 'The Tower', number: 16, keywords: ['Sudden Change', 'Upheaval', 'Chaos'], meaningUpright: 'Sudden change, upheaval, revelation.', meaningReversed: 'Fear of change, averting disaster.', shadow: 'Destruction without rebuilding.', gift: 'Liberation from false structures.', imageUrl: getImgUrl('ar16') },
  { id: 'm17', name: 'The Star', number: 17, keywords: ['Hope', 'Faith', 'Purpose'], meaningUpright: 'Hope, faith, purpose.', meaningReversed: 'Despair, lack of faith.', shadow: 'Hopelessness.', gift: 'Inspiration.', imageUrl: getImgUrl('ar17') },
  { id: 'm18', name: 'The Moon', number: 18, keywords: ['Illusion', 'Fear', 'Anxiety'], meaningUpright: 'Illusion, fear, anxiety.', meaningReversed: 'Release of fear, clarity.', shadow: 'Delusion.', gift: 'Navigating the unknown.', imageUrl: getImgUrl('ar18') },
  { id: 'm19', name: 'The Sun', number: 19, keywords: ['Joy', 'Success', 'Celebration'], meaningUpright: 'Positivity, fun, warmth, success.', meaningReversed: 'Inner child, feeling down.', shadow: 'Burnout.', gift: 'Vitality.', imageUrl: getImgUrl('ar19') },
  { id: 'm20', name: 'Judgment', number: 20, keywords: ['Judgment', 'Rebirth', 'Inner Calling'], meaningUpright: 'Judgment, rebirth, inner calling.', meaningReversed: 'Self-doubt, refusal of call.', shadow: 'Self-judgment.', gift: 'Awakening.', imageUrl: getImgUrl('ar20') },
  { id: 'm21', name: 'The World', number: 21, keywords: ['Completion', 'Integration', 'Accomplishment'], meaningUpright: 'Completion, integration, travel.', meaningReversed: 'Incompletion, lack of closure.', shadow: 'Stagnation.', gift: 'Wholeness.', imageUrl: getImgUrl('ar21') },
];

const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Majors
  MAJOR_ARCANA_DATA.forEach(d => {
    deck.push({
      ...d,
      id: d.id!,
      name: d.name!,
      number: d.number!,
      suit: 'major',
      arcana: 'major',
      keywords: d.keywords!,
      meaningUpright: d.meaningUpright!,
      meaningReversed: d.meaningReversed!,
      shadow: d.shadow!,
      gift: d.gift!,
      imageUrl: d.imageUrl,
      element: 'Ether'
    });
  });

  // Generate Minors
  const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
  
  // Sacred Texts specific prefixes
  const suitPrefixes = { wands: 'wa', cups: 'cu', swords: 'sw', pentacles: 'pe' };
  
  suits.forEach(suit => {
    for (let i = 1; i <= 14; i++) {
      const name = i === 1 ? 'Ace' : i === 11 ? 'Page' : i === 12 ? 'Knight' : i === 13 ? 'Queen' : i === 14 ? 'King' : i.toString();
      
      // Sacred Texts filename format: [prefix][01-14].jpg
      const filenameNum = i < 10 ? `0${i}` : `${i}`;
      const url = getImgUrl(`${suitPrefixes[suit]}${filenameNum}`);

      deck.push({
        id: `${suit[0]}${i}`,
        name: `${name} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        number: i,
        suit: suit,
        arcana: 'minor',
        keywords: [`${suit} energy`, 'Daily life'],
        meaningUpright: `The essence of ${suit} in its upright expression.`,
        meaningReversed: `The essence of ${suit} hindered or internalized.`,
        shadow: `Shadow side of ${suit}.`,
        gift: `Wisdom of ${suit}.`,
        imageUrl: url,
        element: suit === 'wands' ? 'Fire' : suit === 'cups' ? 'Water' : suit === 'swords' ? 'Air' : 'Earth'
      });
    }
  });

  return deck;
};

export const DEFAULT_DECK: Deck = {
  id: 'classic-rw',
  name: 'Classic Rider-Waite',
  description: 'The definitive tarot deck (1910). Rich in symbolism and archetypal imagery.',
  cards: generateDeck(),
  isCustom: false
};

export const SPREADS: Record<string, SpreadDefinition> = {
  'one-card': {
    id: 'one-card',
    name: 'The Focal Point',
    description: 'A single point of clarity for the now.',
    positions: [{ id: 1, name: 'The Insight', description: 'What requires your attention immediately.' }]
  },
  'three-card': {
    id: 'three-card',
    name: 'Trinity Expansion',
    description: 'Tracing the arc of energy through time or state.',
    positions: [
      { id: 1, name: 'The Root (Past/Situation)', description: 'The soil from which this grows.' },
      { id: 2, name: 'The Stem (Present/Action)', description: 'The active energy moving now.' },
      { id: 3, name: 'The Bloom (Future/Outcome)', description: 'The potential manifestation.' }
    ]
  },
  'celtic-cross': {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description: 'A complete mapping of the situation\'s psyche.',
    positions: [
      { id: 1, name: 'The Present', description: 'The heart of the matter.' },
      { id: 2, name: 'The Crossing', description: 'The obstacle or challenge.' },
      { id: 3, name: 'The Foundation', description: 'Subconscious influences.' },
      { id: 4, name: 'The Past', description: 'Passing influence.' },
      { id: 5, name: 'The Crown', description: 'Conscious goals and best outcome.' },
      { id: 6, name: 'The Future', description: 'Approaching influence.' },
      { id: 7, name: 'The Self', description: 'Your attitude and stance.' },
      { id: 8, name: 'The Environment', description: 'External factors and others.' },
      { id: 9, name: 'Hopes & Fears', description: 'Psychological undercurrents.' },
      { id: 10, name: 'The Outcome', description: 'Final synthesis.' }
    ]
  }
};
