import { Card, Deck, SpreadDefinition } from './types';

// Source: Rider-Waite-Smith scans from the public-domain tarot-json dataset.
// Vendored locally so the default deck never depends on a third-party host.
const BASE_URL = '/tarot/rider-waite';

// Helper to generate filenames for the local Rider-Waite bundle:
// Majors: m00.jpg to m21.jpg
// Wands: w01.jpg to w14.jpg
// Cups: c01.jpg to c14.jpg
// Swords: s01.jpg to s14.jpg
// Pentacles: p01.jpg to p14.jpg
const getImgUrl = (filename: string) => `${BASE_URL}/${filename}.jpg`;

const MAJOR_ARCANA_DATA: Partial<Card>[] = [
  { id: 'm0', name: 'The Fool', number: 0, keywords: ['New beginnings', 'Innocence', 'Leap of faith'], meaningUpright: 'A fresh start, trust in the process.', meaningReversed: 'Recklessness, negligence.', shadow: 'Naivety, avoiding responsibility.', gift: 'Pure potentiality.', imageUrl: getImgUrl('m00') },
  { id: 'm1', name: 'The Magician', number: 1, keywords: ['Manifestation', 'Power', 'Action'], meaningUpright: 'You have the resources you need.', meaningReversed: 'Manipulation, untapped talent.', shadow: 'Trickster energy.', gift: 'Conscious creation.', imageUrl: getImgUrl('m01') },
  { id: 'm2', name: 'The High Priestess', number: 2, keywords: ['Intuition', 'Unconscious', 'Mystery'], meaningUpright: 'Listen to your inner voice.', meaningReversed: 'Secrets, disconnected intuition.', shadow: 'Hidden agendas.', gift: 'Deep inner knowing.', imageUrl: getImgUrl('m02') },
  { id: 'm3', name: 'The Empress', number: 3, keywords: ['Fertility', 'Nature', 'Abundance'], meaningUpright: 'Creativity birthing reality.', meaningReversed: 'Creative block, dependence.', shadow: 'Smothering energy.', gift: 'Unconditional nurturing.', imageUrl: getImgUrl('m03') },
  { id: 'm4', name: 'The Emperor', number: 4, keywords: ['Authority', 'Structure', 'Control'], meaningUpright: 'Establishing order and boundaries.', meaningReversed: 'Tyranny, rigidity.', shadow: 'Domination.', gift: 'Stability and protection.', imageUrl: getImgUrl('m04') },
  { id: 'm5', name: 'The Hierophant', number: 5, keywords: ['Tradition', 'Beliefs', 'Teaching'], meaningUpright: 'Spiritual wisdom, conformity.', meaningReversed: 'Rebellion, personal beliefs.', shadow: 'Dogma.', gift: 'Shared wisdom.', imageUrl: getImgUrl('m05') },
  { id: 'm6', name: 'The Lovers', number: 6, keywords: ['Love', 'Union', 'Choices'], meaningUpright: 'Harmony and alignment of values.', meaningReversed: 'Disharmony, imbalance.', shadow: 'Codependency.', gift: 'Integration of opposites.', imageUrl: getImgUrl('m06') },
  { id: 'm7', name: 'The Chariot', number: 7, keywords: ['Willpower', 'Determination', 'Victory'], meaningUpright: 'Focus and drive lead to success.', meaningReversed: 'Lack of direction, aggression.', shadow: 'Ego-driven control.', gift: 'Disciplined action.', imageUrl: getImgUrl('m07') },
  { id: 'm8', name: 'Strength', number: 8, keywords: ['Courage', 'Compassion', 'Influence'], meaningUpright: 'Inner strength and patience.', meaningReversed: 'Self-doubt, insecurity.', shadow: 'Brute force.', gift: 'Gentle power.', imageUrl: getImgUrl('m08') },
  { id: 'm9', name: 'The Hermit', number: 9, keywords: ['Introspection', 'Solitude', 'Guidance'], meaningUpright: 'Seeking inner answers.', meaningReversed: 'Isolation, loneliness.', shadow: 'Withdrawal from life.', gift: 'Self-illumination.', imageUrl: getImgUrl('m09') },
  { id: 'm10', name: 'Wheel of Fortune', number: 10, keywords: ['Cycles', 'Fate', 'Change'], meaningUpright: 'Life is in constant motion.', meaningReversed: 'Resistance to change.', shadow: 'Victim mentality.', gift: 'Acceptance of flow.', imageUrl: getImgUrl('m10') },
  { id: 'm11', name: 'Justice', number: 11, keywords: ['Justice', 'Fairness', 'Truth'], meaningUpright: 'Fairness, truth, law.', meaningReversed: 'Unfairness, lack of accountability.', shadow: 'Judgmentalism.', gift: 'Clarity and truth.', imageUrl: getImgUrl('m11') },
  { id: 'm12', name: 'The Hanged Man', number: 12, keywords: ['Surrender', 'Perspective', 'Pause'], meaningUpright: 'Letting go, new perspective.', meaningReversed: 'Stalling, resistance.', shadow: 'Martyrdom.', gift: 'Surrender to the flow.', imageUrl: getImgUrl('m12') },
  { id: 'm13', name: 'Death', number: 13, keywords: ['Endings', 'Transformation', 'Transition'], meaningUpright: 'End of a cycle, new beginning.', meaningReversed: 'Resistance to change.', shadow: 'Fear of change.', gift: 'Rebirth.', imageUrl: getImgUrl('m13') },
  { id: 'm14', name: 'Temperance', number: 14, keywords: ['Balance', 'Moderation', 'Patience'], meaningUpright: 'Balance, moderation, patience.', meaningReversed: 'Imbalance, excess.', shadow: 'Extremism.', gift: 'Harmony.', imageUrl: getImgUrl('m14') },
  { id: 'm15', name: 'The Devil', number: 15, keywords: ['Addiction', 'Materialism', 'Playfulness'], meaningUpright: 'Bondage, addiction, sexuality.', meaningReversed: 'Release, breaking chains.', shadow: 'Enslavement to matter.', gift: 'Understanding shadow.', imageUrl: getImgUrl('m15') },
  { id: 'm16', name: 'The Tower', number: 16, keywords: ['Sudden Change', 'Upheaval', 'Chaos'], meaningUpright: 'Sudden change, upheaval, revelation.', meaningReversed: 'Fear of change, averting disaster.', shadow: 'Destruction without rebuilding.', gift: 'Liberation from false structures.', imageUrl: getImgUrl('m16') },
  { id: 'm17', name: 'The Star', number: 17, keywords: ['Hope', 'Faith', 'Purpose'], meaningUpright: 'Hope, faith, purpose.', meaningReversed: 'Despair, lack of faith.', shadow: 'Hopelessness.', gift: 'Inspiration.', imageUrl: getImgUrl('m17') },
  { id: 'm18', name: 'The Moon', number: 18, keywords: ['Illusion', 'Fear', 'Anxiety'], meaningUpright: 'Illusion, fear, anxiety.', meaningReversed: 'Release of fear, clarity.', shadow: 'Delusion.', gift: 'Navigating the unknown.', imageUrl: getImgUrl('m18') },
  { id: 'm19', name: 'The Sun', number: 19, keywords: ['Joy', 'Success', 'Celebration'], meaningUpright: 'Positivity, fun, warmth, success.', meaningReversed: 'Inner child, feeling down.', shadow: 'Burnout.', gift: 'Vitality.', imageUrl: getImgUrl('m19') },
  { id: 'm20', name: 'Judgment', number: 20, keywords: ['Judgment', 'Rebirth', 'Inner Calling'], meaningUpright: 'Judgment, rebirth, inner calling.', meaningReversed: 'Self-doubt, refusal of call.', shadow: 'Self-judgment.', gift: 'Awakening.', imageUrl: getImgUrl('m20') },
  { id: 'm21', name: 'The World', number: 21, keywords: ['Completion', 'Integration', 'Accomplishment'], meaningUpright: 'Completion, integration, travel.', meaningReversed: 'Incompletion, lack of closure.', shadow: 'Stagnation.', gift: 'Wholeness.', imageUrl: getImgUrl('m21') },
];

type MinorRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
type MinorId = `${'w' | 'c' | 's' | 'p'}${MinorRank}`;
type MinorContent = Pick<Card, 'keywords' | 'meaningUpright' | 'meaningReversed' | 'shadow' | 'gift'>;

// Hand-written Rider-Waite meanings for the 56 minor arcana, in the site's voice.
// Keyed by card id so the generator below stays the single source of ids and image URLs.
const MINOR_ARCANA_CONTENT: Record<MinorId, MinorContent> = {
  // Wands: fire, desire, the will to create
  w1: { keywords: ['Spark', 'Inspiration', 'Raw energy'], meaningUpright: 'A new desire catches fire. Say yes.', meaningReversed: 'A spark with no kindling, false starts.', shadow: 'Enthusiasm that never acts.', gift: 'The first flame of creation.' },
  w2: { keywords: ['Vision', 'Planning', 'First step'], meaningUpright: 'The world in your hand. Choose a direction.', meaningReversed: 'Fear of leaving the castle walls.', shadow: 'Planning as a way to avoid starting.', gift: 'Bold foresight.' },
  w3: { keywords: ['Expansion', 'Patience', 'Long view'], meaningUpright: 'Your ships are out. Trust what you set in motion.', meaningReversed: 'Delays, playing too small.', shadow: 'Impatience with slow growth.', gift: 'Confidence in the unseen.' },
  w4: { keywords: ['Celebration', 'Homecoming', 'Stability'], meaningUpright: 'Pause and celebrate what you built.', meaningReversed: 'Shaky foundations, postponed joy.', shadow: 'Rushing past every milestone.', gift: 'Belonging.' },
  w5: { keywords: ['Conflict', 'Competition', 'Friction'], meaningUpright: 'Creative friction. Everyone wants the lead.', meaningReversed: 'Avoided conflict turned inward.', shadow: 'Fighting for its own sake.', gift: 'Energy sharpened by challenge.' },
  w6: { keywords: ['Victory', 'Recognition', 'Pride'], meaningUpright: 'Success seen and applauded.', meaningReversed: 'Hunger for applause, private doubt.', shadow: 'Needing the crowd to feel real.', gift: 'Earned confidence.' },
  w7: { keywords: ['Defense', 'Conviction', 'Standing ground'], meaningUpright: 'Hold your position. You have the high ground.', meaningReversed: 'Overwhelm, giving up the hill.', shadow: 'Hearing every question as an attack.', gift: 'Courage under pressure.' },
  w8: { keywords: ['Speed', 'Momentum', 'News'], meaningUpright: 'Events move fast now. Stay loose.', meaningReversed: 'Delays, scattered effort.', shadow: 'Haste that skips the heart.', gift: 'Swift, clean motion.' },
  w9: { keywords: ['Resilience', 'Wariness', 'Last stand'], meaningUpright: 'Wounded but standing. One more push.', meaningReversed: 'Exhaustion, walls that keep out help.', shadow: 'Bracing for battles that ended long ago.', gift: 'Stamina of spirit.' },
  w10: { keywords: ['Burden', 'Overload', 'Duty'], meaningUpright: 'Carrying too much, and the goal is close.', meaningReversed: 'Collapse. Set something down.', shadow: 'Pride in overwork.', gift: 'Knowing what is yours to carry.' },
  w11: { keywords: ['Curiosity', 'Enthusiasm', 'Free spirit'], meaningUpright: 'A fresh passion wants exploring.', meaningReversed: 'Restlessness, half-finished starts.', shadow: 'Chasing novelty, finishing nothing.', gift: 'Beginner\'s fire.' },
  w12: { keywords: ['Adventure', 'Impulse', 'Daring'], meaningUpright: 'Charge toward what excites you.', meaningReversed: 'Recklessness, scattered fire.', shadow: 'All spark, no follow-through.', gift: 'Fearless momentum.' },
  w13: { keywords: ['Warmth', 'Confidence', 'Magnetism'], meaningUpright: 'Lead with warmth and self-trust.', meaningReversed: 'Jealousy, a dimmed flame.', shadow: 'Demanding the spotlight.', gift: 'Radiant self-possession.' },
  w14: { keywords: ['Vision', 'Leadership', 'Boldness'], meaningUpright: 'Mature fire. A vision carried through.', meaningReversed: 'Arrogance, impulsive rule.', shadow: 'Tyrant of his own dream.', gift: 'Inspired leadership.' },
  // Cups: water, feeling, the life of the heart
  c1: { keywords: ['New love', 'Openness', 'Overflow'], meaningUpright: 'The heart opens. Let feeling in.', meaningReversed: 'Blocked feeling, a cup turned over.', shadow: 'Drowning in emotion.', gift: 'Love without conditions.' },
  c2: { keywords: ['Connection', 'Partnership', 'Mutuality'], meaningUpright: 'Two meet as equals. Something real begins.', meaningReversed: 'Imbalance, a bond out of tune.', shadow: 'Losing yourself in another.', gift: 'True meeting.' },
  c3: { keywords: ['Friendship', 'Celebration', 'Community'], meaningUpright: 'Joy shared with your people.', meaningReversed: 'Isolation, gossip, hollow parties.', shadow: 'Belonging bought with conformity.', gift: 'The medicine of friends.' },
  c4: { keywords: ['Apathy', 'Discontent', 'Re-evaluation'], meaningUpright: 'Bored with what you have, blind to what is offered.', meaningReversed: 'Waking up, reaching for the offered cup.', shadow: 'Sulking as a way of life.', gift: 'Honest discontent that starts change.' },
  c5: { keywords: ['Grief', 'Loss', 'Regret'], meaningUpright: 'Mourning what spilled. Two cups still stand.', meaningReversed: 'Acceptance, turning toward what remains.', shadow: 'Loyalty to sorrow.', gift: 'Grief that honors love.' },
  c6: { keywords: ['Nostalgia', 'Innocence', 'Kindness'], meaningUpright: 'Sweet memory, a gift freely given.', meaningReversed: 'Living in the past.', shadow: 'A golden childhood that never was.', gift: 'The open heart of the child.' },
  c7: { keywords: ['Fantasy', 'Choices', 'Illusion'], meaningUpright: 'Many shining options. Most are mist.', meaningReversed: 'Clarity, choosing one real cup.', shadow: 'Dreaming instead of deciding.', gift: 'Rich imagination.' },
  c8: { keywords: ['Departure', 'Searching', 'Letting go'], meaningUpright: 'Walking away from what no longer feeds you.', meaningReversed: 'Fear of leaving, aimless drifting.', shadow: 'Abandoning every almost.', gift: 'Courage to seek deeper water.' },
  c9: { keywords: ['Satisfaction', 'Pleasure', 'Wish fulfilled'], meaningUpright: 'Contentment. A wish comes true.', meaningReversed: 'Smugness, pleasure that does not fill.', shadow: 'Comfort used as a wall.', gift: 'Gratitude for enough.' },
  c10: { keywords: ['Harmony', 'Family', 'Fulfillment'], meaningUpright: 'Love at home, feeling in full bloom.', meaningReversed: 'Broken harmony, picture-perfect pressure.', shadow: 'Performing the happy family.', gift: 'Lasting emotional peace.' },
  c11: { keywords: ['Sensitivity', 'Wonder', 'Creative stirrings'], meaningUpright: 'An unexpected feeling surfaces. Listen.', meaningReversed: 'Moodiness, ignored intuition.', shadow: 'Daydreams with no ground.', gift: 'Wonder at the inner world.' },
  c12: { keywords: ['Romance', 'Idealism', 'Invitation'], meaningUpright: 'Following the heart. An offer arrives.', meaningReversed: 'Moody charm, promises that evaporate.', shadow: 'In love with being in love.', gift: 'The devoted heart.' },
  c13: { keywords: ['Compassion', 'Intuition', 'Depth'], meaningUpright: 'Feeling deeply without drowning.', meaningReversed: 'Absorbing everyone\'s pain.', shadow: 'No shoreline between self and other.', gift: 'Compassion with boundaries.' },
  c14: { keywords: ['Emotional mastery', 'Calm', 'Counsel'], meaningUpright: 'A steady heart in rough seas.', meaningReversed: 'Repressed feeling, cold charm.', shadow: 'Control dressed up as calm.', gift: 'Feeling governed by wisdom.' },
  // Swords: air, thought, the edge of truth
  s1: { keywords: ['Clarity', 'Breakthrough', 'Truth'], meaningUpright: 'One clean insight cuts the knot.', meaningReversed: 'Confusion, a truth misused.', shadow: 'Cleverness without kindness.', gift: 'The mind\'s first light.' },
  s2: { keywords: ['Stalemate', 'Avoidance', 'Hard choice'], meaningUpright: 'Blindfolded between two blades. A choice waits.', meaningReversed: 'The blindfold slips. Time to decide.', shadow: 'Peace kept by refusing to look.', gift: 'Stillness before the decision.' },
  s3: { keywords: ['Heartbreak', 'Sorrow', 'Painful truth'], meaningUpright: 'A truth pierces the heart. Let it.', meaningReversed: 'Old pain loosening, slow repair.', shadow: 'Rehearsing the wound.', gift: 'Clarity bought with tears.' },
  s4: { keywords: ['Rest', 'Retreat', 'Recovery'], meaningUpright: 'Lay the fight down. Rest is strategy.', meaningReversed: 'Burnout, a forced return.', shadow: 'Hiding and calling it rest.', gift: 'Renewal through stillness.' },
  s5: { keywords: ['Hollow victory', 'Conflict', 'Ego'], meaningUpright: 'You can win and still lose people.', meaningReversed: 'Making amends, releasing grudges.', shadow: 'Winning as identity.', gift: 'Knowing which battles matter.' },
  s6: { keywords: ['Transition', 'Passage', 'Calmer waters'], meaningUpright: 'A quiet crossing toward calmer water.', meaningReversed: 'Baggage that keeps the boat circling.', shadow: 'Escaping instead of healing.', gift: 'Safe passage.' },
  s7: { keywords: ['Strategy', 'Deception', 'Stealth'], meaningUpright: 'Someone acts in secret. Maybe you.', meaningReversed: 'Confession, a plan exposed.', shadow: 'Cunning that corrodes trust.', gift: 'Discretion and good strategy.' },
  s8: { keywords: ['Restriction', 'Victim mind', 'Self-made trap'], meaningUpright: 'Bound mostly by belief. The ropes are loose.', meaningReversed: 'Freeing yourself, seeing options.', shadow: 'Comfort in helplessness.', gift: 'Seeing the prison you built.' },
  s9: { keywords: ['Anxiety', 'Insomnia', 'Dread'], meaningUpright: 'Three a.m. thoughts, fear louder than fact.', meaningReversed: 'Nightmares fading in daylight. Ask for help.', shadow: 'Worry as a ritual of control.', gift: 'Facing the worst thought honestly.' },
  s10: { keywords: ['Ending', 'Rock bottom', 'Release'], meaningUpright: 'It is over, and the sky is already lightening.', meaningReversed: 'Refusing an ending, slow recovery.', shadow: 'The melodrama of ruin.', gift: 'Nothing left to defend.' },
  s11: { keywords: ['Curiosity', 'Vigilance', 'New ideas'], meaningUpright: 'A quick young mind, questions everywhere.', meaningReversed: 'Gossip, spying, all talk.', shadow: 'Suspicion as a habit.', gift: 'Honest curiosity.' },
  s12: { keywords: ['Drive', 'Haste', 'Single focus'], meaningUpright: 'A fast mind in headlong charge.', meaningReversed: 'Burnout, arguing for its own sake.', shadow: 'Speed that tramples people.', gift: 'Fearless intellect.' },
  s13: { keywords: ['Clarity', 'Independence', 'Honesty'], meaningUpright: 'Clear eyes, firm boundaries, truth kindly said.', meaningReversed: 'Bitterness, cutting words.', shadow: 'Armor mistaken for strength.', gift: 'Truth spoken with care.' },
  s14: { keywords: ['Judgment', 'Logic', 'Authority'], meaningUpright: 'Rule by reason. Decide on principle.', meaningReversed: 'Cold verdicts, misused intellect.', shadow: 'A head severed from the heart.', gift: 'Impartial, clear judgment.' },
  // Pentacles: earth, body, work, and worth
  p1: { keywords: ['Opportunity', 'Seed', 'Prosperity'], meaningUpright: 'A real chance lands in your palm. Plant it.', meaningReversed: 'A missed opening, shaky ground.', shadow: 'Hoarding the seed.', gift: 'Spirit made practical.' },
  p2: { keywords: ['Balance', 'Juggling', 'Adaptability'], meaningUpright: 'Many demands in motion. Keep a light rhythm.', meaningReversed: 'Dropped balls, overcommitment.', shadow: 'Busyness as avoidance.', gift: 'Grace under load.' },
  p3: { keywords: ['Craft', 'Teamwork', 'Apprenticeship'], meaningUpright: 'Skilled work recognized. Build with others.', meaningReversed: 'Sloppy work, no one listening.', shadow: 'Working only for approval.', gift: 'Mastery through collaboration.' },
  p4: { keywords: ['Security', 'Control', 'Holding on'], meaningUpright: 'Guarding what you earned.', meaningReversed: 'The grip loosens, by choice or loss.', shadow: 'A fist that cannot receive.', gift: 'Steady stewardship.' },
  p5: { keywords: ['Hardship', 'Exclusion', 'Lean times'], meaningUpright: 'Out in the cold. Help is nearer than it looks.', meaningReversed: 'Recovery, a door opening.', shadow: 'Pride that will not knock.', gift: 'Companionship in hard weather.' },
  p6: { keywords: ['Generosity', 'Giving', 'Receiving'], meaningUpright: 'Giving and receiving find their balance.', meaningReversed: 'Strings attached, one-sided charity.', shadow: 'Power hidden inside the gift.', gift: 'Open-handed fairness.' },
  p7: { keywords: ['Patience', 'Assessment', 'Slow growth'], meaningUpright: 'Pause and weigh the harvest to come.', meaningReversed: 'Impatience, effort in the wrong field.', shadow: 'Watching the vine instead of tending it.', gift: 'Long patience.' },
  p8: { keywords: ['Diligence', 'Skill', 'Repetition'], meaningUpright: 'Head down, hands busy, craft deepening.', meaningReversed: 'Cut corners, a joyless grind.', shadow: 'Perfectionism at the workbench.', gift: 'Devotion to the work itself.' },
  p9: { keywords: ['Independence', 'Refinement', 'Self-worth'], meaningUpright: 'Enjoying a garden you grew yourself.', meaningReversed: 'A gilded cage, worth tied to income.', shadow: 'Luxury standing in for love.', gift: 'Quiet self-possession.' },
  p10: { keywords: ['Legacy', 'Wealth', 'Family roots'], meaningUpright: 'Wealth that outlives you. Roots and inheritance.', meaningReversed: 'Family disputes, unstable foundations.', shadow: 'Mistaking inheritance for identity.', gift: 'Building what endures.' },
  p11: { keywords: ['Study', 'Ambition', 'New skill'], meaningUpright: 'A student\'s eyes on a real goal.', meaningReversed: 'Procrastination, dreams without homework.', shadow: 'All plans, no practice.', gift: 'Love of learning by doing.' },
  p12: { keywords: ['Steadiness', 'Routine', 'Reliability'], meaningUpright: 'Slow, thorough, and unstoppable.', meaningReversed: 'Stuck in a rut.', shadow: 'Plodding past every open door.', gift: 'Patient endurance.' },
  p13: { keywords: ['Nurture', 'Practicality', 'Groundedness'], meaningUpright: 'Warm, practical care. A well-kept hearth.', meaningReversed: 'Self-neglect, care that smothers.', shadow: 'Worth measured in usefulness.', gift: 'Generous, grounded care.' },
  p14: { keywords: ['Abundance', 'Mastery', 'Security'], meaningUpright: 'Material mastery, a steady generous hand.', meaningReversed: 'Greed, status over substance.', shadow: 'Possessed by possessions.', gift: 'Prosperity that shelters others.' },
};

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
  const suitPrefixes = { wands: 'w', cups: 'c', swords: 's', pentacles: 'p' };
  
  suits.forEach(suit => {
    for (let i = 1; i <= 14; i++) {
      const name = i === 1 ? 'Ace' : i === 11 ? 'Page' : i === 12 ? 'Knight' : i === 13 ? 'Queen' : i === 14 ? 'King' : i.toString();
      
      // Sacred Texts filename format: [prefix][01-14].jpg
      const filenameNum = i < 10 ? `0${i}` : `${i}`;
      const url = getImgUrl(`${suitPrefixes[suit]}${filenameNum}`);
      const id = `${suit[0]}${i}` as MinorId;

      deck.push({
        id,
        name: `${name} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
        number: i,
        suit: suit,
        arcana: 'minor',
        ...MINOR_ARCANA_CONTENT[id],
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
