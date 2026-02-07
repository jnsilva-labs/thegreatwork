import { GoogleGenAI, Type } from "@google/genai";
import { DrawnCard, Reading, SpreadDefinition } from "../types";

// NOTE: In a real production app, this call would likely happen via a backend proxy to protect the API key.
// For this demo, we assume the environment variable is available.

const SYSTEM_INSTRUCTION = `
You are a warm, psychologically grounded Tarot Guide using a Jungian and Alchemical lens. 
Your goal is to help the user understand themselves through the mirror of the cards.

TONE:
- Mystical but clear.
- Psychological, not predictive.
- Use metaphors of the alchemical laboratory (transmutation, distillation, calcination, coagulation).
- Avoid generic "good things are coming" phrases. Focus on internal dynamics and agency.

STRUCTURE & DEPTH:
1. Mirror Statement: A direct, piercing insight summarizing the reading's core theme.

2. Archetype & Shadow (CRITICAL SECTION): 
   - For simple spreads (1-3 cards): Explore the active conscious archetype and the hidden shadow aspect (what is repressed or projected).
   - For Celtic Cross: You MUST breakdown the dynamics by position. 
     * Contrast 'The Present' (Pos 1) with 'The Obstacle' (Pos 2) to define the central tension.
     * Analyze 'The Foundation' (Pos 3) as the subconscious/shadow origin.
     * Discuss how 'The Self' (Pos 7) is influencing the 'Outcome' (Pos 10).
     * DO NOT just list cards. Weave a narrative about the psyche's structure revealed by these positions.

3. Alchemical Phase: 
   - Identify the specific stage (Nigredo, Albedo, Citrinitas, Rubedo). 
   - EXPLAIN THE PROCESS: Don't just name it. Describe the chemical/spiritual operation occurring.
   - Example: "This is a moment of *Calcination*, where the heat of your current challenges is burning away ego attachments to reveal the essential ash..."

4. Practical Guidance: 3 specific, grounded actions (somatic, journal-based, or behavioral).
`;

interface GenerateInterpretationParams {
  question: string;
  intention: string;
  spread: SpreadDefinition;
  cards: DrawnCard[];
  apiKey: string;
}

export const generateInterpretation = async ({
  question,
  intention,
  spread,
  cards,
  apiKey
}: GenerateInterpretationParams) => {
  
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const cardDescriptions = cards.map(c => {
    const position = spread.positions.find(p => p.id === c.positionId);
    return `Position ${c.positionId} (${position?.name} - ${position?.description}): 
      Card: ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'}). 
      Traditional Meaning: ${c.isReversed ? c.meaningReversed : c.meaningUpright}. 
      Key Theme: ${c.keywords.join(', ')}.`;
  }).join('\n');

  // Specific instruction injection for Celtic Cross to ensure depth
  const specificInstruction = spread.id === 'celtic-cross' 
    ? "CRITICAL: In the Archetype & Shadow section, strictly analyze the INTERPLAY of the positions (e.g. Card 1 vs Card 2). Do not just list meanings."
    : "";

  const prompt = `
    The user has asked: "${question || 'What do I need to know right now?'}"
    Intention: "${intention}"
    Spread: ${spread.name}

    Here are the cards drawn:
    ${cardDescriptions}

    Interpret this reading. Be specific, warm, and insightful. ${specificInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mirrorStatement: { type: Type.STRING, description: "1-2 sentences engaging the user directly." },
            archetypeShadow: { type: Type.STRING, description: "Detailed psychological analysis. For Celtic Cross, explicitly reference spread positions." },
            alchemicalPhase: { type: Type.STRING, description: "The phase (Nigredo/etc) PLUS a detailed explanation of the alchemical operation." },
            practicalGuidance: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 simple, real-world actions." },
            journalPrompts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 deep questions to write about." },
            mantra: { type: Type.STRING, description: "A short, powerful affirmation." }
          },
          required: ["mirrorStatement", "archetypeShadow", "alchemicalPhase", "practicalGuidance", "journalPrompts", "mantra"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    throw error;
  }
};