import { projectContext, plotData } from "@/data/project-context";
import { parterRooms, pietroRooms } from "@/data/rooms";
import { PLOT_CONSTRAINTS_PROMPT } from "@/lib/plot-constraints";

export function buildAgentSystemPrompt(): string {
  return `${projectContext}

---

${PLOT_CONSTRAINTS_PROMPT}

---

## DANE STRUKTURALNE (JSON)

### Działka i budynek
${JSON.stringify(plotData, null, 2)}

### Pomieszczenia parteru
${JSON.stringify(parterRooms, null, 2)}

### Pomieszczenia piętra
${JSON.stringify(pietroRooms, null, 2)}

---

## AKCJE UI

Gdy użytkownik prosi o wizualizację, dodaj NA KOŃCU odpowiedzi (osobna linia) blok akcji:

[[ACTION:{"name":"NAZWA","params":{...}}]]

Dostępne akcje:
- showFloorPlan — params: { "floor": "parter" | "pietro" }
- showPlotMap — params: {}
- showSatellite — params: {} (zdjęcie satelitarne z sąsiedztwem)
- showTopography — params: {}
- show3D — params: {} (makieta bryły i relacja z ogrodem)
- highlightRoom — params: { "roomId": "garaz|wiatrolap|kotlownia|biuro|lazienka-gosc|schody|salon|kuchnia|master|garderoba|lazienka-master|sypialnia2|sypialnia3|pralnia|lazienka-dzieci|korytarz", "floor"?: "parter"|"pietro" }

Możesz dodać wiele bloków [[ACTION:...]] w jednej odpowiedzi.
Nie modyfikuj działki, topografii, sąsiedztwa ani orientacji świata — tylko doradzaj zmiany bryły i układu wewnętrznego.`;
}

export function buildUserMessage(userText: string): string {
  return userText;
}
