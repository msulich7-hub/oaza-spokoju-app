import type { AgentAction } from "@/lib/agent-actions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: AgentAction[];
  isStreaming?: boolean;
}

export type ChatStreamEvent =
  | { type: "agentId"; agentId: string }
  | { type: "text"; text: string }
  | { type: "thinking"; text: string }
  | { type: "done"; status: string; result?: string }
  | { type: "error"; message: string };
