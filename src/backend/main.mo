import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  // Data Types
  type ChatMessage = {
    id : Nat;
    message : Text;
    response : Text;
  };

  type PersonalityQuizResult = {
    id : Nat;
    answers : [Nat];
    personalityType : Text;
    report : Text;
  };

  type DataAnalysisInsight = {
    id : Nat;
    inputData : Text;
    insights : Text;
  };

  type DecisionToolRecommendation = {
    id : Nat;
    steps : [Text];
    answers : [Text];
    recommendation : Text;
  };

  // Storage
  let chatHistories = Map.empty<Principal, List.List<(Nat, ChatMessage)>>();
  let personalityResults = Map.empty<Principal, List.List<(Nat, PersonalityQuizResult)>>();
  let dataInsights = Map.empty<Principal, List.List<(Nat, DataAnalysisInsight)>>();
  let decisionRecommendations = Map.empty<Principal, List.List<(Nat, DecisionToolRecommendation)>>();

  var nextChatId = 0;
  var nextQuizId = 0;
  var nextInsightId = 0;
  var nextRecommendationId = 0;

  // Chatbot Functions
  public shared ({ caller }) func saveChatMessage(message : Text, response : Text) : async Nat {
    let chatMessage : ChatMessage = {
      id = nextChatId;
      message;
      response;
    };
    nextChatId += 1;

    let userChats = switch (chatHistories.get(caller)) {
      case (?chats) { chats };
      case (null) {
        let newList = List.empty<(Nat, ChatMessage)>();
        newList;
      };
    };

    userChats.add((chatMessage.id, chatMessage));
    chatHistories.add(caller, userChats);
    chatMessage.id;
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    switch (chatHistories.get(caller)) {
      case (?chats) { chats.values().toArray().map(func((_, chat)) { chat }) };
      case (null) { Runtime.trap("No chat history found") };
    };
  };

  // Personality Quiz Functions
  public shared ({ caller }) func saveQuizResult(answers : [Nat], personalityType : Text, report : Text) : async Nat {
    let result : PersonalityQuizResult = {
      id = nextQuizId;
      answers;
      personalityType;
      report;
    };
    nextQuizId += 1;

    let userResults = switch (personalityResults.get(caller)) {
      case (?results) { results };
      case (null) {
        let newList = List.empty<(Nat, PersonalityQuizResult)>();
        newList;
      };
    };

    userResults.add((result.id, result));
    personalityResults.add(caller, userResults);
    result.id;
  };

  public query ({ caller }) func getPersonalityResults() : async [PersonalityQuizResult] {
    switch (personalityResults.get(caller)) {
      case (?results) { results.values().toArray().map(func((_, result)) { result }) };
      case (null) { Runtime.trap("No results found") };
    };
  };

  // Data Analysis Functions
  public shared ({ caller }) func saveDataInsight(inputData : Text, insights : Text) : async Nat {
    let insight : DataAnalysisInsight = {
      id = nextInsightId;
      inputData;
      insights;
    };
    nextInsightId += 1;

    let userInsights = switch (dataInsights.get(caller)) {
      case (?insights) { insights };
      case (null) {
        let newList = List.empty<(Nat, DataAnalysisInsight)>();
        newList;
      };
    };

    userInsights.add((insight.id, insight));
    dataInsights.add(caller, userInsights);
    insight.id;
  };

  public query ({ caller }) func getDataInsights() : async [DataAnalysisInsight] {
    switch (dataInsights.get(caller)) {
      case (?insights) { insights.values().toArray().map(func((_, insight)) { insight }) };
      case (null) { Runtime.trap("No insights found") };
    };
  };

  // Decision Tool Functions
  public shared ({ caller }) func saveRecommendation(steps : [Text], answers : [Text], recommendation : Text) : async Nat {
    let rec : DecisionToolRecommendation = {
      id = nextRecommendationId;
      steps;
      answers;
      recommendation;
    };
    nextRecommendationId += 1;

    let userRecs = switch (decisionRecommendations.get(caller)) {
      case (?recs) { recs };
      case (null) {
        let newList = List.empty<(Nat, DecisionToolRecommendation)>();
        newList;
      };
    };

    userRecs.add((rec.id, rec));
    decisionRecommendations.add(caller, userRecs);
    rec.id;
  };

  public query ({ caller }) func getRecommendations() : async [DecisionToolRecommendation] {
    switch (decisionRecommendations.get(caller)) {
      case (?recs) { recs.values().toArray().map(func((_, rec)) { rec }) };
      case (null) { Runtime.trap("No recommendations found") };
    };
  };
};
