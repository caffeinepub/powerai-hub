// ─── Decision Tool Engine ──────────────────────────────────────────────────────

export interface DecisionStep {
  id: number;
  title: string;
  question: string;
  options: Array<{
    label: string;
    text: string;
    tags: string[];
  }>;
}

export interface DecisionProfile {
  steps: string[];
  answers: string[];
  recommendation: string;
}

export const DECISION_STEPS: DecisionStep[] = [
  {
    id: 1,
    title: "Career Orientation",
    question: "What best describes your primary career motivation?",
    options: [
      {
        label: "A",
        text: "Building something meaningful and lasting from scratch",
        tags: ["entrepreneurial", "creative", "independent"],
      },
      {
        label: "B",
        text: "Deep expertise and mastery in a specialized domain",
        tags: ["specialist", "technical", "academic"],
      },
      {
        label: "C",
        text: "Leading people and creating organizational impact",
        tags: ["leadership", "management", "people"],
      },
      {
        label: "D",
        text: "Stability, balance, and sustainable long-term growth",
        tags: ["stability", "work-life", "balanced"],
      },
    ],
  },
  {
    id: 2,
    title: "Work Style",
    question: "How do you perform at your best?",
    options: [
      {
        label: "A",
        text: "Independently, with full ownership and minimal oversight",
        tags: ["autonomous", "self-directed", "innovative"],
      },
      {
        label: "B",
        text: "In small, high-trust teams working on complex problems",
        tags: ["collaborative", "technical", "deep-work"],
      },
      {
        label: "C",
        text: "Leading cross-functional groups toward shared goals",
        tags: ["leadership", "strategic", "management"],
      },
      {
        label: "D",
        text: "Clear structure with defined responsibilities and processes",
        tags: ["structured", "process", "reliable"],
      },
    ],
  },
  {
    id: 3,
    title: "Core Strengths",
    question: "What is your most developed skill set?",
    options: [
      {
        label: "A",
        text: "Creative problem-solving and generating novel ideas",
        tags: ["creative", "innovation", "design"],
      },
      {
        label: "B",
        text: "Analytical reasoning, data, and systematic thinking",
        tags: ["analytical", "data", "engineering"],
      },
      {
        label: "C",
        text: "Communication, persuasion, and building relationships",
        tags: ["communication", "sales", "leadership"],
      },
      {
        label: "D",
        text: "Organization, execution, and operational efficiency",
        tags: ["execution", "operations", "management"],
      },
    ],
  },
  {
    id: 4,
    title: "Lifestyle Values",
    question: "What lifestyle outcome matters most to you?",
    options: [
      {
        label: "A",
        text: "Maximum impact and legacy — changing the world",
        tags: ["impact", "legacy", "ambitious"],
      },
      {
        label: "B",
        text: "Financial freedom and building wealth over time",
        tags: ["financial", "wealth", "investment"],
      },
      {
        label: "C",
        text: "Deep fulfillment, purpose, and meaningful contribution",
        tags: ["purpose", "fulfillment", "service"],
      },
      {
        label: "D",
        text: "Balance, flexibility, and quality time for what matters",
        tags: ["balance", "flexibility", "family"],
      },
    ],
  },
  {
    id: 5,
    title: "Growth Path",
    question: "How do you envision your next 10 years?",
    options: [
      {
        label: "A",
        text: "Founding or scaling my own venture or creative project",
        tags: ["founder", "startup", "self-employed"],
      },
      {
        label: "B",
        text: "Becoming a top expert, author, or thought leader",
        tags: ["expert", "author", "speaking"],
      },
      {
        label: "C",
        text: "Rising to senior leadership in a significant organization",
        tags: ["executive", "director", "VP"],
      },
      {
        label: "D",
        text: "Building skills and optionality for wherever life leads",
        tags: ["skills", "optionality", "generalist"],
      },
    ],
  },
];

type TagScore = Map<string, number>;

interface RecommendationData {
  title: string;
  subtitle: string;
  pathDescription: string;
  steps: string[];
  keyInsight: string;
  resources: string[];
}

const RECOMMENDATION_MAP: Record<string, RecommendationData> = {
  entrepreneurial_founder: {
    title: "Founder / Entrepreneur",
    subtitle: "Build something the world hasn't seen yet",
    pathDescription:
      "Your profile strongly suggests an entrepreneurial path. You have the independent drive, creative problem-solving ability, and long-term vision needed to build something meaningful from scratch.",
    steps: [
      "Identify a problem you're obsessed with solving — not just interested in",
      "Validate the problem with 20+ potential customers before building anything",
      "Build a lean prototype (MVP) within 90 days",
      "Find co-founders whose strengths complement your gaps",
      "Learn the fundamentals of fundraising, product-market fit, and growth",
    ],
    keyInsight:
      "The biggest mistake founders make is building before validating. Your creativity is your edge — channel it into customer discovery first.",
    resources: [
      "The Lean Startup (Eric Ries)",
      "Zero to One (Peter Thiel)",
      "Y Combinator Startup Library",
    ],
  },
  specialist_technical: {
    title: "Deep Domain Expert",
    subtitle: "Become the person everyone calls first",
    pathDescription:
      "Your profile points toward becoming a world-class specialist. Your analytical depth and drive for mastery make you suited for the expert track — becoming the definitive authority in your field.",
    steps: [
      "Choose a domain at the intersection of your skills, passion, and market demand",
      "Commit to 10,000 focused hours of deliberate practice and learning",
      "Start publishing your thinking — blogs, papers, conference talks",
      "Build a network of peers at the frontier of your field",
      "Create and teach others — nothing accelerates mastery like teaching",
    ],
    keyInsight:
      "Expertise compounds dramatically. The difference between top 10% and top 1% in any field is often just focused, consistent effort over 3-5 more years.",
    resources: [
      "Deep Work (Cal Newport)",
      "Range (David Epstein)",
      "The Art of Learning (Josh Waitzkin)",
    ],
  },
  leadership_executive: {
    title: "Leadership / Executive Track",
    subtitle: "Multiply your impact through others",
    pathDescription:
      "Your profile indicates exceptional leadership potential. You are energized by people, communication, and organizational leverage. Your path is to multiply your impact through building and leading high-performing teams.",
    steps: [
      "Actively seek roles that give you people management responsibility early",
      "Invest heavily in executive communication — writing, speaking, and executive presence",
      "Find a senior mentor or executive coach before you need one",
      "Develop your strategic thinking — learn to operate 3-5 years ahead",
      "Build a strong personal board of directors with diverse perspectives",
    ],
    keyInsight:
      "The transition from individual contributor to leader requires a complete identity shift. Your output becomes others' output — measure yourself by your team's performance.",
    resources: [
      "High Output Management (Andy Grove)",
      "Leaders Eat Last (Simon Sinek)",
      "The Hard Thing About Hard Things (Ben Horowitz)",
    ],
  },
  balanced_generalist: {
    title: "Strategic Generalist",
    subtitle: "Build optionality through varied excellence",
    pathDescription:
      "Your profile suggests the powerful generalist path — someone who builds broad skills and relationships, can operate effectively in many contexts, and creates unique value at intersections.",
    steps: [
      "Develop T-shaped skills: broad general competence with 1-2 deep specialties",
      "Actively seek cross-functional roles that give exposure to multiple domains",
      "Build a diverse network across industries, functions, and geographies",
      "Practice articulating your transferable skills in different contexts",
      "Invest in financial literacy and building multiple income streams",
    ],
    keyInsight:
      "In a world of increasing specialization, generalists who can synthesize and connect are more valuable than ever. Your breadth is a feature, not a bug.",
    resources: [
      "Range (David Epstein)",
      "The 4-Hour Work Week (Tim Ferriss)",
      "I Will Teach You To Be Rich (Ramit Sethi)",
    ],
  },
};

function scoreProfile(answers: string[]): TagScore {
  const scores = new Map<string, number>();

  for (const answer of answers) {
    for (const step of DECISION_STEPS) {
      const option = step.options.find((o) => o.text === answer);
      if (option) {
        for (const tag of option.tags) {
          scores.set(tag, (scores.get(tag) || 0) + 1);
        }
      }
    }
  }

  return scores;
}

function selectRecommendation(scores: TagScore): RecommendationData {
  const entrepreneurial =
    (scores.get("entrepreneurial") || 0) +
    (scores.get("founder") || 0) +
    (scores.get("independent") || 0);
  const specialist =
    (scores.get("specialist") || 0) +
    (scores.get("technical") || 0) +
    (scores.get("academic") || 0) +
    (scores.get("expert") || 0);
  const leadership =
    (scores.get("leadership") || 0) +
    (scores.get("management") || 0) +
    (scores.get("executive") || 0);
  const balanced =
    (scores.get("stability") || 0) +
    (scores.get("balance") || 0) +
    (scores.get("generalist") || 0);

  const maxScore = Math.max(entrepreneurial, specialist, leadership, balanced);

  if (maxScore === entrepreneurial)
    return RECOMMENDATION_MAP.entrepreneurial_founder;
  if (maxScore === specialist) return RECOMMENDATION_MAP.specialist_technical;
  if (maxScore === leadership) return RECOMMENDATION_MAP.leadership_executive;
  return RECOMMENDATION_MAP.balanced_generalist;
}

export function generateRecommendation(answers: string[]): {
  recommendation: string;
  steps: string[];
  title: string;
  subtitle: string;
  keyInsight: string;
} {
  const scores = scoreProfile(answers);
  const rec = selectRecommendation(scores);

  const fullRecommendation = `${rec.title}: ${rec.subtitle}\n\n${rec.pathDescription}\n\nKey Insight: ${rec.keyInsight}\n\nRecommended Resources: ${rec.resources.join(", ")}`;

  return {
    recommendation: fullRecommendation,
    steps: rec.steps,
    title: rec.title,
    subtitle: rec.subtitle,
    keyInsight: rec.keyInsight,
  };
}
