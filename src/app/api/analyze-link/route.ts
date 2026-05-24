import { NextRequest, NextResponse } from "next/server";
import { detectTransformFromIntent } from "@/lib/project-transforms";
import { findReferenceByUrl } from "@/data/reference-projects";

const SUGGESTED = [
  "lustrzane odbicie bryły względem osi wschód-zachód",
  "lustrzane odbicie względem północ-południe",
  "przesunięcie budynku bliżej lasu",
  "zamiana strefy dziennej z garażem",
];

export async function POST(req: NextRequest) {
  try {
    const { url, intent } = (await req.json()) as { url?: string; intent?: string };

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Podaj poprawny URL (https://…)" }, { status: 400 });
    }

    const catalogRef = findReferenceByUrl(url);
    let title = catalogRef?.name ?? new URL(url).hostname;
    let description = catalogRef?.description ?? "";

    if (!catalogRef) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "OazaSpokojuBot/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch =
          html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
        if (titleMatch) title = titleMatch[1].trim().slice(0, 200);
        if (descMatch) description = descMatch[1].trim().slice(0, 500);
      } catch {
        description = "Nie udało się pobrać metadanych — użyj opisu ręcznego.";
      }
    }

    const combined = `${intent ?? ""} ${title} ${description} lustrzane odbicie`.toLowerCase();
    let transform = detectTransformFromIntent(combined);

    if (catalogRef?.mirrorAvailable && /lustrzan|odbici|mirror|flip/.test(combined)) {
      transform = intent?.toLowerCase().includes("adapt") || intent?.toLowerCase().includes("salon od lasu")
        ? "adapt-hikora"
        : "mirror-ew";
    }

    if (catalogRef?.id === "archon-hikora-3" && /adapt|salon od lasu|bez odbici|hikor/.test(combined)) {
      transform = "adapt-hikora";
    }

    return NextResponse.json({
      url,
      title,
      description,
      suggestedIntents: catalogRef?.mirrorAvailable
        ? [
            "adaptacja Hikora — salon od lasu (bez lustrzanego odbicia bryły)",
            "lustrzane odbicie bryły (jak w katalogu ARCHON+ — tylko test na mapie)",
          ]
        : SUGGESTED,
      detectedTransform: transform,
      intent: intent ?? "",
      referenceId: catalogRef?.id,
      reference: catalogRef ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Błąd analizy linku" },
      { status: 500 },
    );
  }
}
