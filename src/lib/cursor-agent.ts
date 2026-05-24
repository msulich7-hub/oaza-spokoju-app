import { Agent } from "@cursor/sdk";
import path from "path";
import { buildAgentSystemPrompt } from "./agent-prompt";

type AgentHandle = Awaited<ReturnType<typeof Agent.create>>;

const sessions = new Map<string, AgentHandle>();
const primedSessions = new Set<string>();

function getApiKey(): string {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key) {
    throw new Error("CURSOR_API_KEY is not set");
  }
  return key;
}

export async function getOrCreateAgent(agentId?: string): Promise<{
  agent: AgentHandle;
  agentId: string;
}> {
  if (agentId && sessions.has(agentId)) {
    return { agent: sessions.get(agentId)!, agentId };
  }

  const agent = await Agent.create({
    apiKey: getApiKey(),
    model: { id: "composer-2.5" },
    local: {
      cwd: path.join(process.cwd()),
      settingSources: [],
    },
  });

  sessions.set(agent.agentId, agent);
  return { agent, agentId: agent.agentId };
}

export async function sendMessage(
  agentId: string | undefined,
  userMessage: string,
): Promise<{ agentId: string; run: Awaited<ReturnType<AgentHandle["send"]>> }> {
  const { agent, agentId: resolvedId } = await getOrCreateAgent(agentId);

  let message = userMessage;
  if (!primedSessions.has(resolvedId)) {
    message = `${buildAgentSystemPrompt()}\n\n---\n\nPytanie użytkownika:\n${userMessage}`;
    primedSessions.add(resolvedId);
  }

  const run = await agent.send(message);
  return { agentId: resolvedId, run };
}
