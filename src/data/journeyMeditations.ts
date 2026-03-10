export type JourneyMeditation = {
  slug:
    | "mentalism"
    | "correspondence"
    | "vibration"
    | "polarity"
    | "rhythm"
    | "cause-effect"
    | "gender";
  meditationTitle: string;
  breathCue: string;
  focusLine: string;
  meditationBody: [string, string];
  reflectionPrompt: string;
  integrationLine: string;
};

export const journeyMeditations: JourneyMeditation[] = [
  {
    slug: "mentalism",
    meditationTitle: "Rest in the field before the thought.",
    breathCue: "Breathe in for four, rest for four, breathe out for six.",
    focusLine: "Notice the space in which experience appears before you name what is happening.",
    meditationBody: [
      "Let the mind soften from its habit of grabbing at every passing image. Thoughts will continue to arise. You do not need to stop them. Simply notice that they are moving through a wider field of awareness that was already here before the thought arrived.",
      "Stay with that wider field for a few breaths. The practice is not to force silence. The practice is to remember that attention can become spacious, and that from spacious attention your life begins to take a more deliberate shape.",
    ],
    reflectionPrompt: "What changes when you relate to thought as weather inside awareness, rather than as your whole identity?",
    integrationLine: "Carry one breath of spacious attention into the next conversation you have today.",
  },
  {
    slug: "correspondence",
    meditationTitle: "See the pattern within the pattern.",
    breathCue: "Breathe evenly and let the inhale and exhale match in length.",
    focusLine: "As the geometry mirrors itself, let your attention notice where the same movement repeats in your own life.",
    meditationBody: [
      "The mind often thinks meaning must be hidden somewhere far away. Yet the same form returns at many scales. A habit in speech can echo a habit in relationship. A gesture of the body can reveal a gesture of the soul. The small is not separate from the great.",
      "As you watch the form reflect itself, let one repeating pattern in your life come gently into view. Do not rush to fix it. Simply recognize it. Recognition is already a kind of opening.",
    ],
    reflectionPrompt: "What pattern keeps returning in different settings, and what might it be asking you to understand more deeply?",
    integrationLine: "Let one ordinary moment today become a mirror rather than something to pass by without seeing.",
  },
  {
    slug: "vibration",
    meditationTitle: "Listen for the rhythm beneath the surface.",
    breathCue: "Let the breath move softly, as if you are listening more than controlling.",
    focusLine: "Feel the body as a living field of motion rather than a fixed object.",
    meditationBody: [
      "Nothing in you is truly static. Breath moves, blood moves, feeling moves, thought moves. Even stillness is alive with subtle vibration. The aim here is not excitement. It is sensitivity: the kind that notices when your inner rhythm is rushed, scattered, or gathered.",
      "Rest with the pulse of the form for a few breaths. Let the movement teach you its tempo. In that tempo, there may be less strain than the one you have been carrying.",
    ],
    reflectionPrompt: "What inner rhythm have you been living inside lately: hurried, heavy, fractured, gentle, clear?",
    integrationLine: "Before your next task, pause long enough to feel the rhythm you are bringing into it.",
  },
  {
    slug: "polarity",
    meditationTitle: "Hold the whole scale, not only one edge.",
    breathCue: "Inhale through the nose, exhale slowly through the mouth, and soften the shoulders.",
    focusLine: "The form turns between apparent opposites without breaking its nature.",
    meditationBody: [
      "The mind likes to divide experience into fixed camps: success and failure, light and dark, clarity and confusion. Yet most of life moves by degree. What feels like contradiction may actually be one living scale seen from different ends.",
      "As the geometry turns, consider one tension you are carrying. Instead of choosing a side too quickly, remain with the shared ground beneath the two poles. Sometimes peace comes when the conflict is seen more completely.",
    ],
    reflectionPrompt: "What opposite are you resisting that may actually belong to the same field you are trying to understand?",
    integrationLine: "Today, when you feel pulled to an extreme, ask what quieter middle degree is available.",
  },
  {
    slug: "rhythm",
    meditationTitle: "Trust the wisdom of return.",
    breathCue: "Let the inhale rise naturally and the exhale lengthen without force.",
    focusLine: "Notice the gentle swing: forward and back, rise and return.",
    meditationBody: [
      "Every life moves in tides. There are seasons of effort, seasons of waiting, seasons of loss, seasons of renewal. Suffering deepens when we treat one season as though it should last forever. Rhythm reminds us that experience moves.",
      "You do not need to rush the pendulum or freeze it in place. Simply feel the dignity of cyclical life. Even now, something in you is already on its way toward return.",
    ],
    reflectionPrompt: "What cycle are you in right now, and how would you move differently if you trusted that it will not remain forever?",
    integrationLine: "Meet your energy where it truly is today rather than where you think it ought to be.",
  },
  {
    slug: "cause-effect",
    meditationTitle: "Notice what each small act sets in motion.",
    breathCue: "Breathe low into the belly and let each exhale land fully.",
    focusLine: "Each line appears because another line prepared the way.",
    meditationBody: [
      "A life is shaped less by grand declarations than by repeated causes. A tone of voice, a habit of avoidance, a moment of care, a single patient action: all of these enter the stream and continue beyond the instant in which they began.",
      "Let the unfolding pattern remind you that nothing is isolated. This is not meant to frighten you. It is meant to return a sense of dignity to the smallest choices. Even one honest action can begin to reorder a field.",
    ],
    reflectionPrompt: "What small cause are you creating repeatedly, and what effect is it quietly building over time?",
    integrationLine: "Choose one modest, clean action today and treat it as a real beginning.",
  },
  {
    slug: "gender",
    meditationTitle: "Let receiving and directing work together.",
    breathCue: "Inhale as receiving, exhale as offering.",
    focusLine: "The pattern comes alive where structure and openness meet.",
    meditationBody: [
      "Some moments ask for shape, decision, and direction. Others ask for listening, waiting, and yielding. Difficulty arises when we cling to only one mode. Creation becomes fuller when firmness and receptivity support each other instead of competing.",
      "Watch the form balance its contrary movements. Let it teach you that wholeness is not one force winning over another. Wholeness is relationship. What you direct and what you receive belong to the same practice.",
    ],
    reflectionPrompt: "Where in your life do you need more receptive listening, and where do you need clearer direction?",
    integrationLine: "Practice one moment of listening before action and one moment of action after listening.",
  },
];

export const journeySessionIntro = {
  eyebrow: "Guided Ritual Session",
  title: "Principles in Motion",
  body:
    "Enter this page as you would enter a quiet room. Move one principle at a time. Let the geometry hold your gaze, let the words slow your attention, and let one clear insight travel with you when the session ends.",
  arrivalLine:
    "You do not need to understand everything before you begin. Breathe, soften the eyes, and start with the principle that is alive for you now.",
  completionTitle: "Carry the practice back into the day.",
  completionBody:
    "The point is not to remain in a beautiful atmosphere forever. The point is to return to ordinary life with one steadier breath, one clearer perception, and one action that feels more aligned than before.",
};
