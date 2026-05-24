export type AgentActionName =
  | "showFloorPlan"
  | "showPlotMap"
  | "showTopography"
  | "showSatellite"
  | "show3D"
  | "highlightRoom";

export interface AgentAction {
  name: AgentActionName;
  params: Record<string, string>;
}

const ACTION_PATTERN = /\[\[ACTION:(\{[\s\S]*?\})\]\]/g;

export function parseAgentActions(text: string): {
  cleanText: string;
  actions: AgentAction[];
} {
  const actions: AgentAction[] = [];

  const cleanText = text.replace(ACTION_PATTERN, (_, json: string) => {
    try {
      const parsed = JSON.parse(json) as { name?: string; params?: Record<string, string> };
      if (
        parsed.name &&
        ["showFloorPlan", "showPlotMap", "showTopography", "showSatellite", "show3D", "highlightRoom"].includes(parsed.name)
      ) {
        actions.push({
          name: parsed.name as AgentActionName,
          params: parsed.params ?? {},
        });
      }
    } catch {
      // ignore malformed action blocks
    }
    return "";
  });

  return { cleanText: cleanText.trim(), actions };
}

export function stripActionBlocks(text: string): string {
  return text.replace(ACTION_PATTERN, "").trim();
}
