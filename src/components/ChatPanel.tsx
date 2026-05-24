"use client";

import { useCallback, useRef, useState } from "react";
import { parseAgentActions } from "@/lib/agent-actions";
import type { AgentAction } from "@/lib/agent-actions";
import type { ChatMessage, ChatStreamEvent } from "@/types/chat";

const INITIAL_MESSAGE =
  "Cześć Marcin! Jestem asystentem projektu Oaza Spokoju. Znam wymiary działki, układ pomieszczeń i topografię terenu.\n\nWpisz pytanie poniżej albo kliknij jedną z podpowiedzi.";

const QUICK_PROMPTS = [
  "Pokaż rzut parteru",
  "Mapa działki",
  "Topografia terenu",
  "Odległość od północy",
];

interface ChatPanelProps {
  onAction?: (action: AgentAction) => void;
  onShowVisualization?: () => void;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatPanel({ onAction, onShowVisualization }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState("");
  const agentIdRef = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const executeActions = useCallback(
    (actions: AgentAction[]) => {
      if (actions.length === 0) return;
      onShowVisualization?.();
      for (const action of actions) {
        onAction?.(action);
      }
    },
    [onAction, onShowVisualization],
  );

  const sendMessage = useCallback(async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: createId(), role: "user", content: text };
    const assistantId = createId();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "", isStreaming: true },
    ]);
    setInput("");
    setIsLoading(true);
    setThinking("");
    scrollToBottom();

    let accumulated = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agentId: agentIdRef.current,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6)) as ChatStreamEvent;

          if (payload.type === "agentId") {
            agentIdRef.current = payload.agentId;
          } else if (payload.type === "text") {
            accumulated += payload.text;
            const { cleanText } = parseAgentActions(accumulated);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: cleanText, isStreaming: true } : m,
              ),
            );
            scrollToBottom();
          } else if (payload.type === "thinking") {
            setThinking(payload.text.slice(-120));
          } else if (payload.type === "done") {
            const { cleanText, actions } = parseAgentActions(
              payload.result ?? accumulated,
            );
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: cleanText, actions, isStreaming: false }
                  : m,
              ),
            );
            executeActions(actions);
          } else if (payload.type === "error") {
            throw new Error(payload.message);
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Błąd połączenia";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ ${message}`, isStreaming: false }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
      setThinking("");
      scrollToBottom();
    }
  }, [input, isLoading, executeActions, scrollToBottom]);

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-border bg-bg-panel">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-serif text-lg text-accent">Oaza Spokoju</h2>
        <p className="text-xs text-text-muted">
          Asystent architektoniczny · Cieszyn, dz. 4/5
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-bg text-text border border-border"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.isStreaming && (
                <span className="mt-1 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              )}
              {msg.actions && msg.actions.length > 0 && (
                <p className="mt-2 text-xs text-accent">
                  Wywołano: {msg.actions.map((a) => a.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <p className="text-xs italic text-text-muted">Myślę… {thinking}</p>
        )}
      </div>

      <form
        className="shrink-0 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage();
        }}
      >
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => void sendMessage(prompt)}
              className="rounded-full border border-border bg-bg px-2.5 py-1 text-xs text-text hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Zapytaj o projekt..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Wyślij
          </button>
        </div>
      </form>
    </div>
  );
}
