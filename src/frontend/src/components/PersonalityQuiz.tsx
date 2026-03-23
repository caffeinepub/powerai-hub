import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePersonalityResults, useSaveQuizResult } from "@/hooks/useQueries";
import {
  ARCHETYPES,
  type ArchetypeKey,
  QUIZ_QUESTIONS,
  calculatePersonalityType,
  generatePersonalityReport,
} from "@/lib/personalityQuiz";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Compass,
  Loader2,
  RotateCcw,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuizResult {
  archetypeKey: ArchetypeKey;
  answers: bigint[];
  report: string;
}

const ARCHETYPE_ICONS: Record<ArchetypeKey, React.ReactNode> = {
  visionary: <Compass className="w-8 h-8" />,
  analyst: <Brain className="w-8 h-8" />,
  connector: <Users className="w-8 h-8" />,
  achiever: <Zap className="w-8 h-8" />,
  explorer: <Star className="w-8 h-8" />,
};

const COLOR_MAP: Record<string, string> = {
  cyan: "neon-border-cyan text-cyan bg-cyan/10",
  magenta: "neon-border-magenta text-magenta bg-magenta/10",
  emerald: "neon-border-emerald text-emerald bg-emerald/10",
  amber: "neon-border-amber text-amber bg-amber/10",
};

export function PersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<bigint[]>([]);
  const [selectedValue, setSelectedValue] = useState<bigint | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const { data: quizHistory, isLoading: historyLoading } =
    usePersonalityResults();
  const saveMutation = useSaveQuizResult();

  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = (currentQuestion / totalQuestions) * 100;
  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleOptionSelect = (value: bigint) => {
    setSelectedValue(value);
  };

  const handleNext = async () => {
    if (selectedValue === null) return;

    const newAnswers = [...answers, selectedValue];
    setAnswers(newAnswers);
    setSelectedValue(null);

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate result
      const archetypeKey = calculatePersonalityType(newAnswers);
      const report = generatePersonalityReport(archetypeKey);

      const quizResult: QuizResult = {
        archetypeKey,
        answers: newAnswers,
        report,
      };
      setResult(quizResult);

      // Save to backend
      try {
        await saveMutation.mutateAsync({
          answers: newAnswers,
          personalityType: archetypeKey,
          report,
        });
        toast.success("Personality profile saved!");
      } catch {
        toast.error("Failed to save result");
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedValue(null);
    setResult(null);
  };

  if (result) {
    const archetype = ARCHETYPES[result.archetypeKey];
    const colorClass = COLOR_MAP[archetype.color] || COLOR_MAP.cyan;
    const [bgClass, textClass] = [
      colorClass.split(" ")[2],
      colorClass.split(" ")[1],
    ];

    return (
      <div className="flex flex-col gap-5 animate-scale-in">
        {/* Result Card */}
        <div
          className={`rounded-2xl p-6 ${colorClass.split(" ").slice(0, 2).join(" ")} text-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${bgClass} mb-4 relative`}
          >
            <span className={textClass}>
              {ARCHETYPE_ICONS[result.archetypeKey]}
            </span>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Your Personality Type
          </p>
          <h3 className={`text-2xl font-bold mb-1 ${textClass}`}>
            {archetype.name}
          </h3>
          <p className="text-foreground/80 italic text-sm">
            "{archetype.tagline}"
          </p>
          <Badge
            className={`mt-3 ${bgClass} ${textClass} border-current/30 font-mono`}
          >
            {archetype.emoji} {archetype.key.toUpperCase()}
          </Badge>
        </div>

        {/* Report */}
        <div className="bg-surface rounded-xl p-5 border border-border space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider">
              Your Personality Report
            </p>
          </div>
          {result.report.split("\n\n").map((para) => (
            <p
              key={para.slice(0, 30)}
              className="text-sm text-foreground/90 leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Strengths & Growth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald" />
              <p className="text-xs text-emerald font-mono font-semibold uppercase tracking-wider">
                Strengths
              </p>
            </div>
            <ul className="space-y-2">
              {archetype.strengths.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="text-emerald mt-0.5">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-amber" />
              <p className="text-xs text-amber font-mono font-semibold uppercase tracking-wider">
                Growth Areas
              </p>
            </div>
            <ul className="space-y-2">
              {archetype.growthAreas.map((g) => (
                <li
                  key={g}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="text-amber mt-0.5">▸</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Career Matches */}
        <div className="bg-surface rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-3">
            Career Sweet Spots
          </p>
          <div className="flex flex-wrap gap-2">
            {archetype.careerMatches.map((career) => (
              <Badge
                key={career}
                className="bg-background text-foreground border-border font-mono text-xs"
              >
                {career}
              </Badge>
            ))}
          </div>
        </div>

        {/* Famous Examples */}
        <div className="bg-surface/50 rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-2">
            You Share This Type With
          </p>
          <div className="flex flex-wrap gap-2">
            {archetype.famousExamples.map((name) => (
              <span
                key={name}
                className="text-xs text-foreground/70 bg-background/50 px-2 py-1 rounded border border-border font-mono"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full border-border hover:border-cyan/50 hover:text-cyan transition-all gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>

        {/* History */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            onClick={() => setHistoryExpanded((prev) => !prev)}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="font-mono">
              Past Results ({quizHistory?.length ?? 0})
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
              {historyLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              )}
              {quizHistory?.length === 0 && (
                <p className="text-xs text-muted-foreground font-mono">
                  No past results
                </p>
              )}
              {quizHistory
                ?.slice()
                .reverse()
                .map((res) => {
                  const arch = ARCHETYPES[res.personalityType as ArchetypeKey];
                  return (
                    <div
                      key={String(res.id)}
                      className="bg-surface/50 rounded-lg p-3 border border-border text-xs"
                    >
                      <p className="text-cyan font-semibold font-mono">
                        {arch?.emoji} {arch?.name ?? res.personalityType}
                      </p>
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {res.report.slice(0, 120)}...
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-magenta/20 to-magenta/5 neon-border-magenta flex items-center justify-center">
          <Brain className="w-5 h-5 text-magenta" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Personality Quiz
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Discover your archetype
          </p>
        </div>
        <Badge className="ml-auto text-xs font-mono bg-magenta/10 text-magenta border-magenta/30">
          Q {currentQuestion + 1}/{totalQuestions}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-magenta">{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          className="h-1.5 bg-surface [&>div]:bg-magenta"
        />
        <div className="flex gap-0.5">
          {QUIZ_QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < currentQuestion
                  ? "bg-magenta"
                  : i === currentQuestion
                    ? "bg-magenta/50"
                    : "bg-surface"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="animate-slide-up" key={currentQuestion}>
        <p className="text-base font-semibold text-foreground mb-4 leading-relaxed">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => handleOptionSelect(option.value)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                selectedValue === option.value
                  ? "bg-magenta/10 border-magenta/60 shadow-glow-magenta"
                  : "bg-surface/50 border-border hover:border-magenta/30 hover:bg-magenta/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    selectedValue === option.value
                      ? "bg-magenta/20 border-magenta/60 text-magenta"
                      : "bg-surface border-border text-muted-foreground group-hover:border-magenta/30"
                  }`}
                >
                  {["A", "B", "C", "D"][question.options.indexOf(option)]}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    selectedValue === option.value
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion((prev) => prev - 1);
              setAnswers((prev) => prev.slice(0, -1));
              setSelectedValue(null);
            }
          }}
          disabled={currentQuestion === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedValue === null || saveMutation.isPending}
          className="bg-magenta/20 hover:bg-magenta/30 text-magenta border border-magenta/40 hover:border-magenta/60 gap-2"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentQuestion + 1 === totalQuestions ? (
            <>
              See My Type <Brain className="w-4 h-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
