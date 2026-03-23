import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    id: bigint;
    message: string;
    response: string;
}
export interface PersonalityQuizResult {
    id: bigint;
    report: string;
    answers: Array<bigint>;
    personalityType: string;
}
export interface DecisionToolRecommendation {
    id: bigint;
    answers: Array<string>;
    steps: Array<string>;
    recommendation: string;
}
export interface DataAnalysisInsight {
    id: bigint;
    insights: string;
    inputData: string;
}
export interface backendInterface {
    getChatHistory(): Promise<Array<ChatMessage>>;
    getDataInsights(): Promise<Array<DataAnalysisInsight>>;
    getPersonalityResults(): Promise<Array<PersonalityQuizResult>>;
    getRecommendations(): Promise<Array<DecisionToolRecommendation>>;
    saveChatMessage(message: string, response: string): Promise<bigint>;
    saveDataInsight(inputData: string, insights: string): Promise<bigint>;
    saveQuizResult(answers: Array<bigint>, personalityType: string, report: string): Promise<bigint>;
    saveRecommendation(steps: Array<string>, answers: Array<string>, recommendation: string): Promise<bigint>;
}
