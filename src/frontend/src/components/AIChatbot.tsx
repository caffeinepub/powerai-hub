import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatHistory, useSaveChatMessage } from "@/hooks/useQueries";
import { generateChatResponse } from "@/lib/chatEngine";
import { Bot, Clock, Loader2, MessageSquare, Send, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

const TIMING = {
  typing: 800,
  typingVariance: 600,
};

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hello! I'm PowerAI, your intelligent assistant. I can discuss technology, science, health, finance, philosophy, and much more. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: chatHistory, isLoading: historyLoading } = useChatHistory();
  const saveMutation = useSaveChatMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = TIMING.typing + Math.random() * TIMING.typingVariance;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response = generateChatResponse(trimmed);
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);

    try {
      await saveMutation.mutateAsync({ message: trimmed, response });
    } catch {
      toast.error("Failed to save message to history");
    }
  }, [input, isTyping, saveMutation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-cyan/5 neon-border-cyan flex items-center justify-center">
          <Bot className="w-5 h-5 text-cyan" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Chatbot</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald animate-glow-pulse" />
            <span className="text-xs text-muted-foreground font-mono">
              Online · Ready to assist
            </span>
          </div>
        </div>
        <Badge className="ml-auto text-xs font-mono bg-cyan/10 text-cyan border-cyan/30">
          Topic-Aware AI
        </Badge>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea
          className="h-full"
          ref={scrollRef as React.RefObject<HTMLDivElement>}
        >
          <div className="flex flex-col gap-4 pr-2 pb-4">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    msg.role === "ai"
                      ? "bg-cyan/10 border border-cyan/30"
                      : "bg-magenta/10 border border-magenta/30"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="w-4 h-4 text-cyan" />
                  ) : (
                    <User className="w-4 h-4 text-magenta" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-surface neon-border-cyan text-foreground"
                        : "bg-magenta/15 border border-magenta/30 text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-8 h-8 rounded-lg shrink-0 bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan" />
                </div>
                <div className="px-4 py-3 rounded-xl bg-surface neon-border-cyan">
                  <div className="flex items-center gap-1.5 h-5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-cyan animate-typing-dot"
                        style={{ animationDelay: `${i * 0.16}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="flex-1 bg-surface border-border focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 font-mono text-sm placeholder:text-muted-foreground/60"
          disabled={isTyping}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan/40 hover:border-cyan/60 transition-all gap-2"
          size="icon"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* History */}
      <div className="border-t border-border pt-3">
        <button
          type="button"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
          onClick={() => setHistoryExpanded((prev) => !prev)}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">
            Recent History ({chatHistory?.length ?? 0})
          </span>
          <span className="ml-auto">{historyExpanded ? "▲" : "▼"}</span>
        </button>

        {historyExpanded && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {historyLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading history...
              </div>
            )}
            {chatHistory && chatHistory.length === 0 && (
              <p className="text-xs text-muted-foreground font-mono">
                No saved conversations yet
              </p>
            )}
            {chatHistory
              ?.slice()
              .reverse()
              .slice(0, 5)
              .map((msg) => (
                <div
                  key={String(msg.id)}
                  className="text-xs bg-surface/50 rounded p-2 border border-border"
                >
                  <p className="text-magenta font-mono truncate">
                    You: {msg.message}
                  </p>
                  <p className="text-muted-foreground mt-1 truncate">
                    AI: {msg.response}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
