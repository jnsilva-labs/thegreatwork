export interface EbookPrinciple {
  number: string;
  numeral: string;
  title: string;
  corePhrase: string;
  meaning: string[];
  reflection: string;
  practice: string[];
  image?: {
    src: string;
    alt: string;
    caption: string;
    placement: "top-right" | "bottom-right" | "left-strip" | "motif" | "background";
  };
}

export interface EbookData {
  title: string;
  subtitle: string;
  coverQuote: string;
  welcome: {
    intro: string[];
    howToUse: string[];
    noteOnApproach: string[];
  };
  orientation: {
    body: string[];
    practicalWay: string[];
  };
  principles: EbookPrinciple[];
  practicePath: {
    intro: string;
    days: { day: number; principle: string; instruction: string }[];
    dailyFormat: string[];
    closing: string;
  };
  closing: {
    body: string[];
    links: { label: string; url: string }[];
    quote: string;
  };
}

const IMG = "/ebook/hermetic-principles";

export const ebookData: EbookData = {
  title: "7 Hermetic Principles\nStarter Guide",
  subtitle:
    "A clear beginner path into Hermetic thought, self-observation, and contemplative practice.",
  coverQuote: "Take one idea. Work with it. Return.",

  welcome: {
    intro: [
      "There comes a point when spiritual language becomes decorative.",
      "The words may sound profound. The symbols may look powerful. But nothing changes in the way you see, choose, or live.",
      "This guide is for the moment after that.",
      "The Hermetic principles can be used as a framework for attention. They help you examine your inner life, your habits, your reactions, your relationships, and the patterns that shape your experience.",
      "This is not a complete historical study of Hermeticism. It is a starter guide: a practical orientation that helps you begin with clarity.",
    ],
    howToUse: [
      "Read slowly.",
      "Do not try to master all seven principles in one sitting.",
      "Choose one principle that feels active in your life right now. Work with it for a few days. Journal what you notice. Let the principle become an instrument of observation rather than a quote to remember.",
    ],
    noteOnApproach: [
      "In this guide, the principles are presented in plain language and practical terms. Where helpful, they are connected to reflection and contemplative practice.",
      "Use them as lenses, not slogans.",
    ],
  },

  orientation: {
    body: [
      "The word Hermetic refers to a body of philosophical and spiritual teachings associated with Hermes Trismegistus, a figure situated at the crossroads of Greek and Egyptian wisdom traditions.",
      "Over time, Hermetic thought influenced alchemy, astrology, ritual philosophy, esoteric Christianity, Renaissance magic, and many later spiritual systems.",
      "For beginners, the important thing is simple:",
      "Hermetic philosophy asks you to study the relationship between mind, nature, pattern, and transformation.",
      "It is concerned with how reality is perceived, how consciousness shapes experience, and how inner work changes the way life is lived.",
    ],
    practicalWay: [
      "The seven principles are often presented as universal laws.",
      "You do not need to begin by arguing with that language, nor by blindly accepting it.",
      "Begin by treating each principle as a disciplined question:",
    ],
  },

  principles: [
    {
      number: "1",
      numeral: "I",
      title: "Mentalism",
      corePhrase: "The All is Mind.",
      meaning: [
        "Mentalism points to the role of consciousness in experience.",
        "It does not mean that you can think anything you want and force reality to obey. It means your perception, interpretation, and attention shape the world you are able to inhabit.",
        "Two people can live through the same event and emerge with different meanings, different memories, and different futures.",
        "Mind is not a minor detail in life. It is one of the primary fields of work.",
      ],
      reflection:
        "Where is my attention going every day? What kind of world is that attention producing inside me?",
      practice: [
        "For one day, notice the first interpretation your mind gives to events.",
        "Do not correct it immediately. Just record it.",
        "At the end of the day, review your notes and ask:",
        "Which interpretations were facts, and which were habits?",
      ],
      image: {
        src: `${IMG}/p04-splendor-solis-sun-rising.jpg`,
        alt: "Sun with human face rising over a city, from the Splendor Solis manuscript",
        caption: "Splendor Solis, BL Harley MS 3469 (1582), public domain",
        placement: "top-right",
      },
    },
    {
      number: "2",
      numeral: "II",
      title: "Correspondence",
      corePhrase: "As above, so below; as below, so above.",
      meaning: [
        "Correspondence points to pattern across levels.",
        "The same structures often repeat in different forms: in thought, in behavior, in relationships, in groups, in seasons of life.",
        "This principle invites symbolic thinking without abandoning discernment.",
        "If a pattern appears in your outer life, it may reflect something unfinished in your inner life. If your inner life becomes clearer, your outer choices often change.",
        "Correspondence is not a shortcut to magical certainty. It is a way of reading resonance.",
      ],
      reflection:
        "What pattern keeps repeating in my life, even when the setting changes?",
      practice: [
        "Choose one repeating tension (avoidance, overwork, conflict, indecision).",
        "Map where it appears: thoughts, routines, relationships, work.",
        "Look for the shared structure, not just the different stories.",
      ],
      image: {
        src: `${IMG}/p05-fludd-macrocosm.jpg`,
        alt: "Robert Fludd's macrocosm-microcosm diagram showing concentric celestial spheres",
        caption: "Utriusque Cosmi, Robert Fludd (1617), public domain",
        placement: "top-right",
      },
    },
    {
      number: "3",
      numeral: "III",
      title: "Vibration",
      corePhrase: "Nothing rests; everything moves.",
      meaning: [
        "Vibration points to movement, tone, and state.",
        "Your inner life has texture. Some days it is contracted, agitated, and noisy. Some days it is clear, steady, and receptive.",
        "This principle becomes useful when it moves from abstraction into self-observation.",
        "Instead of asking, \u201cHow do I become high-vibration?\u201d ask: What is the quality of my attention right now? What increases clarity? What scatters it?",
      ],
      reflection:
        "What practices change the quality of my inner state in a real way?",
      practice: [
        "Make two short lists:",
        "What lowers my clarity \u2014 doom-scrolling, rushed mornings, constant input.",
        "What restores my clarity \u2014 silence, walking, journaling, breathwork.",
        "Build one small rhythm around the second list.",
      ],
      image: {
        src: `${IMG}/p06-splendor-solis-peacock.jpg`,
        alt: "Peacock's tail iridescence in an alchemical flask, from the Splendor Solis",
        caption: "Splendor Solis, BL Harley MS 3469 (1582), public domain",
        placement: "left-strip",
      },
    },
    {
      number: "4",
      numeral: "IV",
      title: "Polarity",
      corePhrase:
        "Everything has poles; opposites are identical in nature, differing in degree.",
      meaning: [
        "Polarity helps you understand tension without getting trapped inside it.",
        "Many states that feel absolute are part of a spectrum: fear and courage, apathy and care, rigidity and discipline, fantasy and vision.",
        "This principle does not erase difference. It helps you work with degrees, movement, and transformation.",
        "In practice, polarity is a way to regain agency. If a state exists on a spectrum, it can be shifted.",
      ],
      reflection:
        "Where in my life am I treating a spectrum like a fixed identity?",
      practice: [
        "Choose one difficult state you know well.",
        "Name the opposite pole.",
        "Then ask: What is one step, not a complete transformation, that moves me one degree in that direction?",
      ],
      image: {
        src: `${IMG}/p07-splendor-solis-sol-luna.jpg`,
        alt: "Sol and Luna flanking the alchemical work, from the Splendor Solis",
        caption: "Splendor Solis, BL Harley MS 3469 (1582), public domain",
        placement: "bottom-right",
      },
    },
    {
      number: "5",
      numeral: "V",
      title: "Rhythm",
      corePhrase: "Everything flows, out and in; all things rise and fall.",
      meaning: [
        "Rhythm points to cycles.",
        "Energy moves. Mood moves. Motivation moves. Creative depth moves. So do confusion and clarity.",
        "This principle is powerful for beginners because it reduces self-judgment.",
        "Not every low season is failure. Not every high season is permanent.",
        "The work is to develop steadiness inside movement.",
      ],
      reflection:
        "What cycles do I keep misreading as personal failure?",
      practice: [
        "Track your energy, mood, or focus for seven days.",
        "Each evening, write one line:",
        "What was today\u2019s rhythm? What supported steadiness? What disrupted it?",
        "You are learning your tides.",
      ],
      image: {
        src: `${IMG}/p08-ouroboros-byzantine.jpg`,
        alt: "Ouroboros serpent eating its own tail, Byzantine alchemical manuscript",
        caption: "Byzantine alchemical manuscript (c. 1478), public domain",
        placement: "motif",
      },
    },
    {
      number: "6",
      numeral: "VI",
      title: "Cause and Effect",
      corePhrase:
        "Every cause has its effect; every effect has its cause.",
      meaning: [
        "Cause and Effect is a call to responsibility.",
        "It asks you to look beneath moods, outcomes, and repeated situations and study what produces them.",
        "In ordinary life, people often focus on effects: stress, conflict, exhaustion, confusion.",
        "Hermetic practice asks a harder question: What conditions am I repeating that make these outcomes likely?",
        "This is not blame. It is authorship.",
      ],
      reflection:
        "What recurring outcome in my life has an upstream pattern I have not named clearly?",
      practice: [
        "Choose one repeated outcome.",
        "Write a short chain: trigger \u2192 thought \u2192 reaction \u2192 action \u2192 result.",
        "Then adjust one link in the chain for one week and observe what changes.",
      ],
      image: {
        src: `${IMG}/p09-khunrath-laboratory.jpg`,
        alt: "The alchemist's laboratory with oratory, from Khunrath's Amphitheatrum Sapientiae Aeternae",
        caption: "Amphitheatrum Sapientiae Aeternae, H. Khunrath (1595), public domain",
        placement: "bottom-right",
      },
    },
    {
      number: "7",
      numeral: "VII",
      title: "Gender",
      corePhrase:
        "Gender is in everything; everything has its masculine and feminine principles.",
      meaning: [
        "This principle can be approached as complementary modes of energy and function: structure and receptivity, direction and gestation, form and flow, will and intuition.",
        "The point is not to stereotype people.",
        "The point is to notice imbalance in your way of living and working.",
        "Some people live in constant force and lose depth. Some live in constant receptivity and never act.",
        "Transformation often requires both.",
      ],
      reflection:
        "Where do I need more structure? Where do I need more receptivity?",
      practice: [
        "For one important area of life, divide a page into two columns:",
        "Structure (form, boundaries, decision, schedule)",
        "Receptivity (listening, reflection, incubation, intuition)",
        "List what is missing on each side. Choose one change that restores balance.",
      ],
      image: {
        src: `${IMG}/p10-splendor-solis-hermaphrodite.jpg`,
        alt: "The alchemical hermaphrodite (Rebis) standing on the moon, from the Splendor Solis",
        caption: "Splendor Solis, BL Harley MS 3469 (1582), public domain",
        placement: "left-strip",
      },
    },
  ],

  practicePath: {
    intro:
      "The easiest way to lose this material is to admire it. The easiest way to keep it is to practice it.",
    days: [
      { day: 1, principle: "Mentalism", instruction: "Observe your interpretations. Notice where thought becomes reality too quickly." },
      { day: 2, principle: "Correspondence", instruction: "Track one repeating pattern across inner and outer life." },
      { day: 3, principle: "Vibration", instruction: "Notice what scatters your attention and what restores clarity." },
      { day: 4, principle: "Polarity", instruction: "Move one degree along a spectrum you thought was fixed." },
      { day: 5, principle: "Rhythm", instruction: "Study your energy without judgment." },
      { day: 6, principle: "Cause and Effect", instruction: "Identify one chain that produces a repeated outcome." },
      { day: 7, principle: "Gender", instruction: "Restore balance between structure and receptivity." },
    ],
    dailyFormat: [
      "2 minutes of stillness",
      "5 minutes of journaling",
      "3 minutes reviewing one action for the day",
    ],
    closing: "Return to the same cycle next week. Depth comes through repetition.",
  },

  closing: {
    body: [
      "The seven principles are not only ideas to learn.",
      "They are instruments for self-study.",
      "If you use them with patience, they begin to change the quality of your attention. From there, choices become clearer. Patterns become easier to see. Practice becomes more grounded.",
      "That is a worthy beginning.",
    ],
    links: [
      { label: "Start here", url: "awarenessparadox.com/start-here" },
      { label: "Principles", url: "awarenessparadox.com/principles" },
      { label: "Astrology", url: "awarenessparadox.com/astrology" },
      { label: "Letters", url: "awarenessparadox.com/letters" },
    ],
    quote: "Take one idea. Work with it. Return.",
  },
};
