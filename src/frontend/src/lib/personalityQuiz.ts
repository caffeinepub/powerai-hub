// ─── Personality Quiz Engine ─────────────────────────────────────────────────

export type ArchetypeKey =
  | "visionary"
  | "analyst"
  | "connector"
  | "achiever"
  | "explorer";

export interface QuizQuestion {
  id: number;
  question: string;
  options: Array<{
    text: string;
    archetype: ArchetypeKey;
    value: bigint;
  }>;
}

export interface PersonalityArchetype {
  key: ArchetypeKey;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  famousExamples: string[];
  careerMatches: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When faced with a complex problem, your first instinct is to:",
    options: [
      {
        text: "Imagine multiple future scenarios and possibilities",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Break it down into components and analyze each part",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Talk it through with others and gather perspectives",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Create an action plan and start executing immediately",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 2,
    question: "In a group project, you naturally take the role of:",
    options: [
      {
        text: "The innovator who generates big ideas",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "The researcher who provides data and analysis",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "The facilitator who keeps the team aligned",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "The driver who pushes for results and deadlines",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 3,
    question: "Your ideal weekend involves:",
    options: [
      {
        text: "Exploring a new place or trying something entirely new",
        archetype: "explorer",
        value: 5n,
      },
      {
        text: "Diving deep into a book, documentary, or complex project",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Spending meaningful time with friends and family",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Working toward a personal goal or skill development",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 4,
    question: "When making important decisions, you primarily rely on:",
    options: [
      {
        text: "Your intuition and vision of what could be",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Data, evidence, and logical reasoning",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Advice and input from trusted people in your life",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Clear criteria for measurable outcomes",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 5,
    question: "What drives you most in your work and life?",
    options: [
      {
        text: "Creating something new that didn't exist before",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Understanding how and why things work",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Building deep connections and helping others",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Achieving goals and reaching new levels of mastery",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 6,
    question: "How do you handle uncertainty and ambiguity?",
    options: [
      {
        text: "I find it exciting — uncertainty is where innovation lives",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "I research to reduce unknowns as much as possible",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "I lean on others and navigate it collaboratively",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "I set a direction and adjust as I go forward",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 7,
    question: "Your approach to learning something new is:",
    options: [
      {
        text: "See the big picture first, then fill in details",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Go deep from the start — I want to understand fully",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Learn through conversations, teaching, and sharing",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Try it in practice and learn by doing",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 8,
    question: "When you're at your best, people would describe you as:",
    options: [
      {
        text: "Inspiring and full of original ideas",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Thorough, precise, and insightful",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Warm, empathetic, and deeply understanding",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Focused, resilient, and results-oriented",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 9,
    question: "Your relationship with rules and conventions is:",
    options: [
      {
        text: "Rules are just starting points — I love breaking paradigms",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "Rules exist for good reasons; I understand them before questioning",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "Rules matter when they serve relationships and community",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "Rules are tools — I follow or change them based on results",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
  {
    id: 10,
    question: "Your long-term vision for yourself is:",
    options: [
      {
        text: "To create something that changes how people think or live",
        archetype: "visionary",
        value: 1n,
      },
      {
        text: "To become a leading expert and thought leader in my domain",
        archetype: "analyst",
        value: 2n,
      },
      {
        text: "To build a meaningful community and lift others up",
        archetype: "connector",
        value: 3n,
      },
      {
        text: "To reach the top of my field and leave a lasting legacy",
        archetype: "achiever",
        value: 4n,
      },
    ],
  },
];

export const ARCHETYPES: Record<ArchetypeKey, PersonalityArchetype> = {
  visionary: {
    key: "visionary",
    name: "The Visionary",
    tagline: "You see what others can't yet imagine",
    emoji: "🔭",
    color: "cyan",
    description:
      "You are driven by possibility and the ability to envision futures that don't yet exist. Your mind naturally operates at the horizon, connecting disparate ideas into compelling wholes.",
    strengths: [
      "Original, creative thinking",
      "Ability to inspire and energize others",
      "Pattern recognition across domains",
      "Strategic long-range planning",
      "Comfort with ambiguity and change",
    ],
    growthAreas: [
      "Following through on execution",
      "Patience with incremental progress",
      "Grounding ideas in practical constraints",
      "Listening without jumping ahead",
    ],
    famousExamples: ["Elon Musk", "Steve Jobs", "Nikola Tesla", "Marie Curie"],
    careerMatches: [
      "Entrepreneur",
      "Creative Director",
      "Futurist",
      "Product Innovator",
      "Researcher",
    ],
  },
  analyst: {
    key: "analyst",
    name: "The Analyst",
    tagline: "You find truth in the details others overlook",
    emoji: "🔬",
    color: "emerald",
    description:
      "You are driven by the pursuit of understanding. Your mind is a precision instrument that finds signal in noise, builds models from data, and delivers insights of unusual depth and accuracy.",
    strengths: [
      "Deep, systematic thinking",
      "Exceptional accuracy and attention to detail",
      "Evidence-based decision making",
      "Ability to master complex domains",
      "Intellectual rigor and critical thinking",
    ],
    growthAreas: [
      "Making decisions with incomplete information",
      "Translating insights into relatable communication",
      "Acting before perfect clarity",
      "Embracing the emotional dimensions of decisions",
    ],
    famousExamples: [
      "Isaac Newton",
      "Warren Buffett",
      "Ada Lovelace",
      "Bill Gates",
    ],
    careerMatches: [
      "Data Scientist",
      "Research Scientist",
      "Financial Analyst",
      "Engineer",
      "Strategy Consultant",
    ],
  },
  connector: {
    key: "connector",
    name: "The Connector",
    tagline: "Your superpower is making people feel seen",
    emoji: "🌐",
    color: "magenta",
    description:
      "You are driven by human connection and the belief that the best things in life are built together. Your emotional intelligence is extraordinary — you understand people at a level others can only aspire to.",
    strengths: [
      "Deep emotional intelligence",
      "Building trust and loyalty",
      "Collaborative leadership",
      "Communication and storytelling",
      "Creating cohesive, motivated communities",
    ],
    growthAreas: [
      "Setting firm boundaries",
      "Prioritizing your own needs",
      "Making unpopular decisions",
      "Avoiding over-commitment to please others",
    ],
    famousExamples: [
      "Oprah Winfrey",
      "Nelson Mandela",
      "Brené Brown",
      "Desmond Tutu",
    ],
    careerMatches: [
      "People Operations",
      "Executive Coach",
      "Nonprofit Leader",
      "Therapist",
      "Community Builder",
    ],
  },
  achiever: {
    key: "achiever",
    name: "The Achiever",
    tagline: "You turn ambition into reality, relentlessly",
    emoji: "⚡",
    color: "amber",
    description:
      "You are driven by results and the satisfaction of reaching new heights. Your capacity for sustained, focused effort is remarkable — when you set a goal, the world rearranges itself to accommodate your will.",
    strengths: [
      "Extraordinary goal-setting and execution",
      "Resilience under pressure",
      "High standards and accountability",
      "Ability to motivate and drive teams",
      "Turning obstacles into fuel",
    ],
    growthAreas: [
      "Slowing down to celebrate wins",
      "Avoiding burnout cycles",
      "Valuing process over outcome",
      "Delegating without losing control",
    ],
    famousExamples: [
      "Serena Williams",
      "Indra Nooyi",
      "Michael Jordan",
      "Jeff Bezos",
    ],
    careerMatches: [
      "Executive Leader",
      "Athlete",
      "Sales Director",
      "Founder/CEO",
      "Investment Banker",
    ],
  },
  explorer: {
    key: "explorer",
    name: "The Explorer",
    tagline: "You thrive where the map runs out",
    emoji: "🧭",
    color: "cyan",
    description:
      "You are driven by discovery and the joy of encountering the unknown. Your capacity for wonder is your greatest gift — you approach life with the curiosity of a scientist and the courage of an adventurer.",
    strengths: [
      "Adaptability and resilience to change",
      "Cross-domain learning and connection",
      "Courage to step into uncertainty",
      "Openness to radically different perspectives",
      "Finding opportunity in disruption",
    ],
    growthAreas: [
      "Building consistency and routine",
      "Deepening expertise in one area",
      "Completing long-term projects",
      "Staying present vs. seeking novelty",
    ],
    famousExamples: [
      "Marco Polo",
      "Richard Feynman",
      "Amelia Earhart",
      "Charles Darwin",
    ],
    careerMatches: [
      "Travel Writer",
      "Anthropologist",
      "UX Researcher",
      "Venture Capitalist",
      "Innovation Consultant",
    ],
  },
};

export function calculatePersonalityType(answers: bigint[]): ArchetypeKey {
  const counts: Record<ArchetypeKey, number> = {
    visionary: 0,
    analyst: 0,
    connector: 0,
    achiever: 0,
    explorer: 0,
  };

  for (const val of answers) {
    if (val === 1n) counts.visionary++;
    else if (val === 2n) counts.analyst++;
    else if (val === 3n) counts.connector++;
    else if (val === 4n) counts.achiever++;
    else if (val === 5n) counts.explorer++;
  }

  return Object.entries(counts).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0] as ArchetypeKey;
}

export function generatePersonalityReport(archetypeKey: ArchetypeKey): string {
  const a = ARCHETYPES[archetypeKey];

  const para1 = `You are ${a.name} — ${a.tagline.toLowerCase()}. ${a.description} People like you have always been essential: ${a.famousExamples.slice(0, 2).join(" and ")} shared your archetype, channeling these same core drives into world-changing work.`;

  const para2 = `Your most powerful strengths center on ${a.strengths[0].toLowerCase()} and ${a.strengths[1].toLowerCase()}. These gifts show up consistently in how you process challenges, engage with others, and approach your most meaningful work. When these strengths operate in alignment with your values, you enter states of extraordinary performance that others struggle to replicate.`;

  const para3 = `Your growth frontier lies in ${a.growthAreas[0].toLowerCase()} and ${a.growthAreas[1].toLowerCase()}. These aren't weaknesses to be ashamed of — they're the natural counterweight to your greatest strengths. The ${a.name} archetype who addresses these growth areas becomes something rare: someone who has the vision and the execution, the depth and the humanity. Your career sweet spots include roles like ${a.careerMatches.slice(0, 3).join(", ")}, where your natural profile creates outsized impact.`;

  return `${para1}\n\n${para2}\n\n${para3}`;
}
