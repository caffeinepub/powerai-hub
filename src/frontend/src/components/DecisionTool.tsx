import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRecommendations, useSaveRecommendation } from "@/hooks/useQueries";
import { DECISION_STEPS, generateRecommendation } from "@/lib/decisionEngine";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Lightbulb,
  ListChecks,
  Loader2,
  Target,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type StepAnswer = string;

interface RecommendationResult {
  title: string;
  subtitle: string;
  recommendation: string;
  steps: string[];
  keyInsight: string;
  answers: string[];
}

export function DecisionTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<StepAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const { data: recommendations, isLoading: recsLoading } =
    useRecommendations();
  const saveMutation = useSaveRecommendation();

  const totalSteps = DECISION_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;
  const step = DECISION_STEPS[currentStep];

  const handleOptionSelect = (optionText: string) => {
    setSelectedOption(optionText);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentStep + 1 < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Generate recommendation
      const rec = generateRecommendation(newAnswers);
      const recResult: RecommendationResult = {
        ...rec,
        answers: newAnswers,
      };
      setResult(recResult);

      // Save to backend
      try {
        await saveMutation.mutateAsync({
          steps: rec.steps,
          answers: newAnswers,
          recommendation: rec.recommendation,
        });
        toast.success("Recommendation saved!");
      } catch {
        toast.error("Failed to save recommendation");
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setSelectedOption(null);
    setResult(null);
  };

  if (result) {
    return (
      <div className="flex flex-col gap-5 animate-scale-in">
        {/* Result Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber/10 neon-border-amber mb-4">
            <Target className="w-8 h-8 text-amber" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{result.title}</h3>
          <p className="text-muted-foreground mt-1">{result.subtitle}</p>
        </div>

        {/* Key Insight */}
        <div className="bg-surface rounded-xl p-4 neon-border-cyan">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-cyan mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-cyan font-mono font-semibold uppercase tracking-wider mb-1">
                Key Insight
              </p>
              <p className="text-sm text-foreground">{result.keyInsight}</p>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-emerald" />
            <p className="text-sm font-semibold text-foreground">
              Your Action Plan
            </p>
          </div>
          <ol className="space-y-2">
            {result.steps.map((stepItem, i) => (
              <li
                key={stepItem.slice(0, 20)}
                className="flex items-start gap-3 text-sm"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-emerald/10 border border-emerald/30 text-emerald text-xs flex items-center justify-center font-mono font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{stepItem}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Your Answers Summary */}
        <div className="bg-surface/50 rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-2">
            Your Profile Answers
          </p>
          {result.answers.map((ans, i) => (
            <div
              key={`${DECISION_STEPS[i]?.id ?? i}-${ans.slice(0, 8)}`}
              className="flex items-start gap-2 text-xs py-1.5 border-b border-border/50 last:border-0"
            >
              <span className="text-muted-foreground/60 font-mono w-24 shrink-0">
                {DECISION_STEPS[i]?.title}:
              </span>
              <span className="text-foreground">{ans}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full border-border hover:border-cyan/50 hover:text-cyan transition-all"
        >
          Take Assessment Again
        </Button>

        {/* Past Recommendations */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            onClick={() => setHistoryExpanded((prev) => !prev)}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span className="font-mono">
              Past Recommendations ({recommendations?.length ?? 0})
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
              {recsLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              )}
              {recommendations?.length === 0 && (
                <p className="text-xs text-muted-foreground font-mono">
                  No past recommendations
                </p>
              )}
              {recommendations
                ?.slice()
                .reverse()
                .map((rec) => (
                  <div
                    key={String(rec.id)}
                    className="bg-surface/50 rounded-lg p-3 border border-border text-xs"
                  >
                    <p className="text-amber font-semibold truncate">
                      {rec.recommendation.split("\n")[0]}
                    </p>
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {rec.recommendation.split("\n")[2]}
                    </p>
                  </div>
                ))}
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber/20 to-amber/5 neon-border-amber flex items-center justify-center">
          <Target className="w-5 h-5 text-amber" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            AI Decision Tool
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Personalized path recommendation
          </p>
        </div>
        <Badge className="ml-auto text-xs font-mono bg-amber/10 text-amber border-amber/30">
          Step {currentStep + 1}/{totalSteps}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted-foreground">{step.title}</span>
          <span className="text-amber">{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          className="h-1.5 bg-surface [&>div]:bg-amber"
        />
        <div className="flex gap-1">
          {DECISION_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < currentStep
                  ? "bg-amber"
                  : i === currentStep
                    ? "bg-amber/50"
                    : "bg-surface"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="animate-slide-up" key={currentStep}>
        <p className="text-base font-semibold text-foreground mb-4 leading-relaxed">
          {step.question}
        </p>

        <div className="space-y-3">
          {step.options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleOptionSelect(option.text)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                selectedOption === option.text
                  ? "bg-amber/10 border-amber/60 shadow-glow-amber"
                  : "bg-surface/50 border-border hover:border-amber/30 hover:bg-amber/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    selectedOption === option.text
                      ? "bg-amber/20 border-amber/60 text-amber"
                      : "bg-surface border-border text-muted-foreground group-hover:border-amber/30"
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`text-sm transition-colors ${
                    selectedOption === option.text
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {option.text}
                </span>
                {selectedOption === option.text && (
                  <CheckCircle className="w-4 h-4 text-amber ml-auto shrink-0 mt-0.5" />
                )}
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
            if (currentStep > 0) {
              setCurrentStep((prev) => prev - 1);
              setAnswers((prev) => prev.slice(0, -1));
              setSelectedOption(null);
            }
          }}
          disabled={currentStep === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedOption || saveMutation.isPending}
          className="bg-amber/20 hover:bg-amber/30 text-amber border border-amber/40 hover:border-amber/60 gap-2"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentStep + 1 === totalSteps ? (
            <>
              Get Recommendation <Target className="w-4 h-4" />
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
