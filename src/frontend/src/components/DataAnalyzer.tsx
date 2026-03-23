import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDataInsights, useSaveDataInsight } from "@/hooks/useQueries";
import {
  type AnalysisResult,
  type NumericStats,
  type TextStats,
  analyzeData,
  formatInsightsForStorage,
} from "@/lib/dataAnalyzer";
import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Hash,
  Loader2,
  MessageSquare,
  Minus,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLACEHOLDER_TEXT = `Paste your text here for analysis...

Example data you can analyze:
• Article text or blog posts
• List of numbers: 45, 67, 23, 89, 54, 12, 78
• Product reviews or feedback
• Notes or reports`;

interface InsightCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  subValue?: string;
}

function InsightCard({
  icon,
  label,
  value,
  color,
  subValue,
}: InsightCardProps) {
  return (
    <div
      className={`bg-surface rounded-xl p-4 border transition-all hover:scale-[1.01] ${color}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="opacity-70">{icon}</div>
        {subValue && (
          <span className="text-[10px] font-mono text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
            {subValue}
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-foreground font-mono">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function SentimentBadge({ label, score }: { label: string; score: number }) {
  const config = {
    positive: {
      color: "bg-emerald/10 text-emerald border-emerald/30",
      emoji: "😊",
    },
    negative: {
      color: "bg-destructive/10 text-destructive border-destructive/30",
      emoji: "😟",
    },
    neutral: {
      color: "bg-muted text-muted-foreground border-border",
      emoji: "😐",
    },
  };
  const c = config[label as keyof typeof config] || config.neutral;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${c.color}`}
    >
      <span>{c.emoji}</span>
      <span className="capitalize">{label}</span>
      <span className="font-mono text-xs opacity-70">
        ({score > 0 ? "+" : ""}
        {score})
      </span>
    </div>
  );
}

export function DataAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const { data: insights, isLoading: insightsLoading } = useDataInsights();
  const saveMutation = useSaveDataInsight();

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter some data to analyze");
      return;
    }
    setIsAnalyzing(true);
    // Simulate processing time for UX
    await new Promise((r) => setTimeout(r, 600));
    const analysisResult = analyzeData(input);
    setResult(analysisResult);
    setIsAnalyzing(false);

    const insightsText = formatInsightsForStorage(analysisResult);
    try {
      await saveMutation.mutateAsync({
        inputData: input.slice(0, 500),
        insights: insightsText,
      });
      toast.success("Analysis saved!");
    } catch {
      toast.error("Failed to save analysis");
    }
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "increasing")
      return <TrendingUp className="w-4 h-4 text-emerald" />;
    if (trend === "decreasing")
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald/20 to-emerald/5 neon-border-emerald flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-emerald" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            AI Data Analyzer
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Text, numbers, sentiment & themes
          </p>
        </div>
        <Badge className="ml-auto text-xs font-mono bg-emerald/10 text-emerald border-emerald/30">
          Multi-Mode
        </Badge>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          className="min-h-36 bg-surface border-border focus:border-emerald/50 focus:ring-1 focus:ring-emerald/30 font-mono text-sm resize-none placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">
            {input.length > 0
              ? `${input.length} chars`
              : "Paste text or numbers"}
          </span>
          <Button
            onClick={handleAnalyze}
            disabled={!input.trim() || isAnalyzing}
            className="bg-emerald/20 hover:bg-emerald/30 text-emerald border border-emerald/40 hover:border-emerald/60 gap-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-scale-in">
          {/* Summary */}
          <div className="bg-surface rounded-xl p-4 neon-border-emerald">
            <p className="text-xs text-emerald font-mono font-semibold uppercase tracking-wider mb-2">
              Analysis Summary
            </p>
            <p className="text-sm text-foreground">{result.summary}</p>
            <div className="flex items-center gap-3 mt-3">
              <Badge className="text-xs font-mono bg-emerald/10 text-emerald border-emerald/30">
                {result.type.toUpperCase()} DATA
              </Badge>
              <SentimentBadge
                label={result.sentiment.label}
                score={result.sentiment.score}
              />
            </div>
          </div>

          {/* Stats Grid */}
          {result.type === "text" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InsightCard
                icon={<Hash className="w-4 h-4 text-cyan" />}
                label="Words"
                value={(result.stats as TextStats).wordCount}
                color="neon-border-cyan"
              />
              <InsightCard
                icon={<BookOpen className="w-4 h-4 text-magenta" />}
                label="Sentences"
                value={(result.stats as TextStats).sentenceCount}
                color="neon-border-magenta"
                subValue={(result.stats as TextStats).readingTime}
              />
              <InsightCard
                icon={<MessageSquare className="w-4 h-4 text-amber" />}
                label="Unique Words"
                value={(result.stats as TextStats).uniqueWords}
                color="neon-border-amber"
              />
              <InsightCard
                icon={<Activity className="w-4 h-4 text-emerald" />}
                label="Avg Words/Sentence"
                value={(result.stats as TextStats).avgWordsPerSentence}
                color="neon-border-emerald"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InsightCard
                icon={<Hash className="w-4 h-4 text-cyan" />}
                label="Count"
                value={(result.stats as NumericStats).count}
                color="neon-border-cyan"
              />
              <InsightCard
                icon={<Activity className="w-4 h-4 text-emerald" />}
                label="Average"
                value={(result.stats as NumericStats).average}
                color="neon-border-emerald"
                subValue={`Σ ${(result.stats as NumericStats).sum}`}
              />
              <InsightCard
                icon={<TrendingUp className="w-4 h-4 text-magenta" />}
                label="Range"
                value={`${(result.stats as NumericStats).min}–${(result.stats as NumericStats).max}`}
                color="neon-border-magenta"
              />
              <InsightCard
                icon={<BarChart3 className="w-4 h-4 text-amber" />}
                label="Std Deviation"
                value={(result.stats as NumericStats).stdDev}
                color="neon-border-amber"
                subValue={`Median: ${(result.stats as NumericStats).median}`}
              />
            </div>
          )}

          {/* Trend (numeric only) */}
          {result.type === "numeric" && (
            <div className="bg-surface rounded-xl p-4 border border-border flex items-center gap-3">
              <TrendIcon trend={(result.stats as NumericStats).trend} />
              <div>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {(result.stats as NumericStats).trend} Trend
                </p>
                <p className="text-xs text-muted-foreground">
                  Trend strength: {(result.stats as NumericStats).trendStrength}
                  %
                </p>
              </div>
            </div>
          )}

          {/* Top Words (text only) */}
          {result.type === "text" &&
            (result.stats as TextStats).topWords.length > 0 && (
              <div className="bg-surface rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-3">
                  Top Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {(result.stats as TextStats).topWords.map((w) => (
                    <span
                      key={w.word}
                      className="text-xs px-2.5 py-1 bg-cyan/10 text-cyan border border-cyan/30 rounded-full font-mono"
                    >
                      {w.word} <span className="opacity-60">×{w.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Sentiment Keywords */}
          {(result.sentiment.positiveWords.length > 0 ||
            result.sentiment.negativeWords.length > 0) && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-3">
                Sentiment Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {result.sentiment.positiveWords.map((w) => (
                  <span
                    key={`pos-${w}`}
                    className="text-xs px-2.5 py-1 bg-emerald/10 text-emerald border border-emerald/30 rounded-full font-mono"
                  >
                    +{w}
                  </span>
                ))}
                {result.sentiment.negativeWords.map((w) => (
                  <span
                    key={`neg-${w}`}
                    className="text-xs px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/30 rounded-full font-mono"
                  >
                    -{w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Themes */}
          {result.themes.length > 0 && (
            <div className="bg-surface rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-magenta" />
                <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider">
                  Key Themes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.themes.map((theme) => (
                  <Badge
                    key={theme}
                    className="bg-magenta/10 text-magenta border-magenta/30 font-mono"
                  >
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="border-t border-border pt-3">
        <button
          type="button"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
          onClick={() => setHistoryExpanded((prev) => !prev)}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="font-mono">
            Past Analyses ({insights?.length ?? 0})
          </span>
          <span className="ml-auto">
            {historyExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {historyExpanded && (
          <div className="mt-3 space-y-2 max-h-52 overflow-y-auto">
            {insightsLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading...
              </div>
            )}
            {insights?.length === 0 && (
              <p className="text-xs text-muted-foreground font-mono">
                No past analyses
              </p>
            )}
            {insights
              ?.slice()
              .reverse()
              .map((ins) => (
                <div
                  key={String(ins.id)}
                  className="bg-surface/50 rounded-lg p-3 border border-border text-xs"
                >
                  <p className="text-emerald font-mono truncate">
                    Input: {ins.inputData.slice(0, 60)}...
                  </p>
                  <p className="text-muted-foreground mt-1 whitespace-pre-line line-clamp-3">
                    {ins.insights}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
