# 🚀 PROMPT STARTOWY DLA CURSORA

Poniżej znajduje się prompt, który wklejasz w Cursorze (Composer / Agent) aby wygenerować cały projekt.

---

## PROMPT (skopiuj poniżej):

```
Stwórz aplikację Next.js 15 (App Router, TypeScript, Tailwind CSS 4) z CopilotKit, która jest AI-powered dashboard do zarządzania projektem architektonicznym domu "Oaza Spokoju" w Cieszynie.

### Co ma robić aplikacja:
1. **Chat Panel (lewa kolumna ~350px)** — CopilotKit chat sidebar gdzie rozmawiam z AI agentem o projekcie. Agent zna wszystkie dane działki, budynku, topografię, przyłącza. Mówi po polsku.

2. **Visualization Panel (centrum)** — wyświetla interaktywne rzuty pięter w SVG, mapę topograficzną działki z rzędnymi, widok usytuowania budynku na działce. Agent może generować i modyfikować wizualizacje przez useCopilotAction.

3. **Info Panel (prawa kolumna ~300px)** — kluczowe dane projektu: wymiary działki, parametry budynku, odległości od granic, przyłącza. Collapsible sections.

### Stack technologiczny:
- Next.js 15 App Router + TypeScript
- CopilotKit (@copilotkit/react-core, @copilotkit/react-ui, @copilotkit/runtime)
- Anthropic Claude Sonnet 4 jako LLM (przez AnthropicAdapter z @copilotkit/runtime)
- Tailwind CSS 4
- SVG dla rzutów pięter

### Kluczowe wzorce CopilotKit:

**API Route** (src/app/api/copilotkit/route.ts):
- Użyj CopilotRuntime z AnthropicAdapter
- Model: claude-sonnet-4-20250514
- Klucz API z process.env.ANTHROPIC_API_KEY

**Kontekst projektu** (useCopilotReadable):
- Wstrzyknij pełny kontekst projektu (dane działki, budynku, topografia) jako readable state
- Plik z kontekstem: src/data/project-context.ts (już istnieje w projekcie)

**Akcje agenta** (useCopilotAction):
- "showFloorPlan" — wyświetl rzut parteru lub piętra w SVG
- "showPlotMap" — wyświetl mapę działki z usytuowaniem budynku
- "highlightRoom" — podświetl konkretne pomieszczenie na rzucie
- "showTopography" — wyświetl przekrój topograficzny

### Design:
- Styl Japandi — ciepłe drewno, stonowane zielenie, czyste linie
- Font: "DM Sans" (body) + "DM Serif Display" (headings) z Google Fonts
- Kolory: bg #F5F0EB, accent #2D5016 (forest green), text #3D3A36
- Dark mode support (ale domyślnie light)
- Responsive — na mobile chat pełnoekranowy z przełącznikiem na wizualizację

### Dane projektu (wbudowane w aplikację):
Działka: 43,72 × 21,05 m, Cieszyn
Budynek: 12,50 × 12,50 m kwadrat, 2 piętra, dach 42°
Odległości: W=9,80m N=3,00m S=7,21m E=18,58m
±0,00 = 368,45 m n.p.m.

Rzut parteru (pomieszczenia z przybliżonymi wymiarami):
- Garaż: SW, ~6,0 × 6,0 m
- Wiatrołap + Hol: W, ~3,0 × 4,0 m  
- Kotłownia: NW, ~3,0 × 3,0 m
- Biuro: N, ~4,0 × 3,0 m
- Łazienka gościnna: N, ~2,5 × 2,0 m
- Salon: NE+E, ~6,0 × 5,0 m
- Kuchnia+Jadalnia: SE+S, ~6,0 × 4,0 m
- Schody: centrum, ~3,0 × 3,0 m

Użyj pliku .cursorrules który jest w katalogu projektu — zawiera pełną architekturę i wzorce.

Zacznij od stworzenia:
1. Layout i routing (layout.tsx z CopilotKit provider)
2. API route dla CopilotKit
3. Dashboard z 3 panelami
4. Podstawowy rzut parteru w SVG z interaktywnymi pomieszczeniami
5. Integracja chat z kontekstem projektu
```

---

## PO WYGENEROWANIU — następne kroki:

1. Skopiuj `.env.local.example` do `.env.local` i wklej swój klucz Anthropic API
2. `npm install`
3. `npm run dev`
4. Otwórz http://localhost:7000
5. Zacznij rozmawiać z agentem po polsku o projekcie!

## Przykładowe pytania do agenta:
- "Pokaż mi rzut parteru"
- "Jaka jest odległość budynku od granicy północnej?"
- "Zaproponuj układ ogrodu kaskadowego na wschodzie"
- "Gdzie poprowadzić przyłącze kanalizacji?"
- "Jakie okna zastosować od strony lasu?"
