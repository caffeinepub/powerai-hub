import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChatMessage,
  DataAnalysisInsight,
  DecisionToolRecommendation,
  PersonalityQuizResult,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Chat ───────────────────────────────────────────────────────────────────

export function useChatHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      message,
      response,
    }: { message: string; response: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveChatMessage(message, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });
}

// ─── Data Insights ───────────────────────────────────────────────────────────

export function useDataInsights() {
  const { actor, isFetching } = useActor();
  return useQuery<DataAnalysisInsight[]>({
    queryKey: ["dataInsights"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDataInsights();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveDataInsight() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      inputData,
      insights,
    }: { inputData: string; insights: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveDataInsight(inputData, insights);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataInsights"] });
    },
  });
}

// ─── Personality Quiz ─────────────────────────────────────────────────────────

export function usePersonalityResults() {
  const { actor, isFetching } = useActor();
  return useQuery<PersonalityQuizResult[]>({
    queryKey: ["personalityResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPersonalityResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveQuizResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      answers,
      personalityType,
      report,
    }: { answers: bigint[]; personalityType: string; report: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveQuizResult(answers, personalityType, report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalityResults"] });
    },
  });
}

// ─── Decision Tool ───────────────────────────────────────────────────────────

export function useRecommendations() {
  const { actor, isFetching } = useActor();
  return useQuery<DecisionToolRecommendation[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      steps,
      answers,
      recommendation,
    }: { steps: string[]; answers: string[]; recommendation: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveRecommendation(steps, answers, recommendation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}
