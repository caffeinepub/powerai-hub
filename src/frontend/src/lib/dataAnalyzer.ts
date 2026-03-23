// ─── Local Data Analysis Engine ──────────────────────────────────────────────

export interface AnalysisResult {
  type: "text" | "numeric" | "mixed";
  stats: TextStats | NumericStats;
  sentiment: SentimentResult;
  themes: string[];
  summary: string;
}

export interface TextStats {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgWordLength: number;
  uniqueWords: number;
  topWords: Array<{ word: string; count: number }>;
  readingTime: string;
  longestWord: string;
}

export interface NumericStats {
  count: number;
  sum: number;
  average: number;
  median: number;
  min: number;
  max: number;
  range: number;
  stdDev: number;
  trend: "increasing" | "decreasing" | "stable" | "volatile";
  trendStrength: number;
}

export interface SentimentResult {
  score: number; // -1 to 1
  label: "positive" | "negative" | "neutral";
  positiveWords: string[];
  negativeWords: string[];
  confidence: number;
}

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "we",
  "they",
  "what",
  "which",
  "who",
  "how",
  "when",
  "where",
  "why",
  "not",
  "no",
  "so",
  "if",
  "as",
  "up",
  "out",
  "my",
  "your",
  "his",
  "her",
  "our",
  "their",
  "about",
  "into",
  "through",
  "more",
  "than",
  "then",
  "just",
  "all",
  "also",
  "very",
  "much",
]);

const POSITIVE_WORDS = new Set([
  "good",
  "great",
  "excellent",
  "amazing",
  "wonderful",
  "fantastic",
  "awesome",
  "positive",
  "best",
  "better",
  "love",
  "happy",
  "joy",
  "excited",
  "brilliant",
  "outstanding",
  "superior",
  "effective",
  "powerful",
  "successful",
  "perfect",
  "impressive",
  "innovative",
  "revolutionary",
  "beautiful",
  "helpful",
  "useful",
  "efficient",
  "strong",
  "clear",
  "smart",
  "intelligent",
  "creative",
  "reliable",
  "fast",
  "easy",
  "simple",
  "clean",
  "safe",
  "healthy",
  "fresh",
  "bright",
]);

const NEGATIVE_WORDS = new Set([
  "bad",
  "terrible",
  "awful",
  "poor",
  "worse",
  "worst",
  "hate",
  "sad",
  "angry",
  "negative",
  "failure",
  "failed",
  "broken",
  "wrong",
  "error",
  "problem",
  "issue",
  "difficult",
  "hard",
  "complex",
  "confusing",
  "slow",
  "expensive",
  "dangerous",
  "risky",
  "weak",
  "unclear",
  "unreliable",
  "inefficient",
  "boring",
  "dull",
  "limited",
  "missing",
  "lost",
  "dead",
  "dying",
  "crisis",
  "threat",
  "vulnerable",
  "toxic",
  "harmful",
  "corrupt",
  "flawed",
  "lack",
]);

const THEME_PATTERNS: Array<{ theme: string; keywords: string[] }> = [
  {
    theme: "Technology",
    keywords: [
      "tech",
      "software",
      "code",
      "data",
      "digital",
      "computer",
      "algorithm",
      "system",
      "network",
      "cloud",
      "ai",
      "machine",
    ],
  },
  {
    theme: "Business",
    keywords: [
      "company",
      "market",
      "revenue",
      "profit",
      "growth",
      "customer",
      "product",
      "strategy",
      "management",
      "team",
      "sales",
      "cost",
    ],
  },
  {
    theme: "Health",
    keywords: [
      "health",
      "medical",
      "patient",
      "doctor",
      "treatment",
      "disease",
      "body",
      "wellness",
      "fitness",
      "nutrition",
      "mental",
      "physical",
    ],
  },
  {
    theme: "Science",
    keywords: [
      "research",
      "study",
      "experiment",
      "theory",
      "evidence",
      "data",
      "analysis",
      "results",
      "method",
      "findings",
      "scientific",
      "discovery",
    ],
  },
  {
    theme: "Environment",
    keywords: [
      "climate",
      "environment",
      "sustainable",
      "energy",
      "carbon",
      "green",
      "nature",
      "ecosystem",
      "pollution",
      "biodiversity",
    ],
  },
  {
    theme: "Education",
    keywords: [
      "learn",
      "student",
      "school",
      "knowledge",
      "skill",
      "training",
      "education",
      "teaching",
      "understanding",
      "academic",
    ],
  },
  {
    theme: "Society",
    keywords: [
      "social",
      "community",
      "people",
      "culture",
      "society",
      "government",
      "policy",
      "rights",
      "equality",
      "justice",
      "public",
    ],
  },
  {
    theme: "Finance",
    keywords: [
      "money",
      "financial",
      "investment",
      "economic",
      "bank",
      "market",
      "fund",
      "price",
      "value",
      "asset",
      "income",
      "budget",
    ],
  },
];

function isNumericData(input: string): boolean {
  const lines = input
    .trim()
    .split(/[\n,\s]+/)
    .filter(Boolean);
  const numericCount = lines.filter(
    (token) => !Number.isNaN(Number.parseFloat(token)),
  ).length;
  return numericCount / lines.length > 0.6;
}

function analyzeText(input: string): TextStats {
  const words = input.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const sentences = input.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const wordFreq = new Map<string, number>();
  for (const word of words) {
    if (word.length > 2 && !STOPWORDS.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }

  const sortedWords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const uniqueWords = new Set(words).size;
  const avgWordLength =
    words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");
  const readingMinutes = Math.ceil(words.length / 200);
  const readingTime =
    readingMinutes < 1 ? "< 1 min read" : `${readingMinutes} min read`;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: Math.max(paragraphs.length, 1),
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    uniqueWords,
    topWords: sortedWords,
    readingTime,
    longestWord,
  };
}

function analyzeNumeric(input: string): NumericStats {
  const numbers = input
    .split(/[\n,\s]+/)
    .filter(Boolean)
    .map((t) => Number.parseFloat(t))
    .filter((n) => !Number.isNaN(n));

  if (numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      range: 0,
      stdDev: 0,
      trend: "stable",
      trendStrength: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  const variance =
    numbers.reduce((acc, n) => acc + (n - average) ** 2, 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Trend detection using linear regression slope
  const n = numbers.length;
  const xMean = (n - 1) / 2;
  const slope =
    numbers.reduce((acc, y, x) => acc + (x - xMean) * (y - average), 0) /
    numbers.reduce((acc, _, x) => acc + (x - xMean) ** 2, 0);
  const normalizedSlope = range > 0 ? slope / range : 0;

  let trend: NumericStats["trend"];
  if (stdDev / Math.abs(average || 1) > 0.3) {
    trend = "volatile";
  } else if (normalizedSlope > 0.05) {
    trend = "increasing";
  } else if (normalizedSlope < -0.05) {
    trend = "decreasing";
  } else {
    trend = "stable";
  }

  return {
    count: numbers.length,
    sum: Math.round(sum * 100) / 100,
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    min,
    max,
    range: Math.round(range * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    trend,
    trendStrength: Math.abs(Math.round(normalizedSlope * 100)),
  };
}

function analyzeSentiment(input: string): SentimentResult {
  const words = input.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const foundPositive = words.filter((w) => POSITIVE_WORDS.has(w));
  const foundNegative = words.filter((w) => NEGATIVE_WORDS.has(w));

  const posCount = foundPositive.length;
  const negCount = foundNegative.length;
  const total = posCount + negCount;

  let score = 0;
  let label: SentimentResult["label"] = "neutral";
  let confidence = 0.5;

  if (total > 0) {
    score = (posCount - negCount) / total;
    confidence = Math.min(0.95, 0.5 + (total / words.length) * 2);
    if (score > 0.1) label = "positive";
    else if (score < -0.1) label = "negative";
  }

  const uniquePos = [...new Set(foundPositive)].slice(0, 5);
  const uniqueNeg = [...new Set(foundNegative)].slice(0, 5);

  return {
    score: Math.round(score * 100) / 100,
    label,
    positiveWords: uniquePos,
    negativeWords: uniqueNeg,
    confidence: Math.round(confidence * 100) / 100,
  };
}

function extractThemes(input: string): string[] {
  const lower = input.toLowerCase();
  const themeScores = THEME_PATTERNS.map(({ theme, keywords }) => {
    const score = keywords.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0,
    );
    return { theme, score };
  });

  return themeScores
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((t) => t.theme);
}

export function analyzeData(input: string): AnalysisResult {
  const numeric = isNumericData(input);
  const sentiment = analyzeSentiment(input);
  const themes = extractThemes(input);

  if (numeric) {
    const stats = analyzeNumeric(input);
    const summary = `Analyzed ${stats.count} data points. Values range from ${stats.min} to ${stats.max} with an average of ${stats.average}. The data shows a ${stats.trend} trend.`;
    return {
      type: "numeric",
      stats,
      sentiment,
      themes: themes.length > 0 ? themes : ["Data Analysis"],
      summary,
    };
  }
  const stats = analyzeText(input);
  const dominantSentiment =
    sentiment.label === "positive"
      ? "positive tone"
      : sentiment.label === "negative"
        ? "negative tone"
        : "neutral tone";
  const summary = `Analyzed ${stats.wordCount} words across ${stats.sentenceCount} sentences. The text has a ${dominantSentiment} and covers ${themes.length > 0 ? themes.slice(0, 2).join(", ") : "general"} themes.`;
  return {
    type: "text",
    stats,
    sentiment,
    themes: themes.length > 0 ? themes : ["General Content"],
    summary,
  };
}

export function formatInsightsForStorage(result: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`Type: ${result.type.toUpperCase()}`);
  lines.push(`Summary: ${result.summary}`);
  lines.push(
    `Sentiment: ${result.sentiment.label} (score: ${result.sentiment.score})`,
  );
  lines.push(`Themes: ${result.themes.join(", ")}`);

  if (result.type === "numeric") {
    const s = result.stats as NumericStats;
    lines.push(
      `Count: ${s.count}, Sum: ${s.sum}, Avg: ${s.average}, Min: ${s.min}, Max: ${s.max}`,
    );
    lines.push(`Trend: ${s.trend}, Std Dev: ${s.stdDev}`);
  } else {
    const s = result.stats as TextStats;
    lines.push(
      `Words: ${s.wordCount}, Sentences: ${s.sentenceCount}, Unique: ${s.uniqueWords}`,
    );
    lines.push(
      `Top words: ${s.topWords
        .slice(0, 5)
        .map((w) => `${w.word}(${w.count})`)
        .join(", ")}`,
    );
  }

  return lines.join("\n");
}
