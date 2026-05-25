"use client";

import { useState } from "react";
import type { ReferenceProject } from "@/data/reference-projects";
import { HIKORA_3_URL } from "@/data/reference-projects";
import type { ProjectVariant, ReferenceLink, TransformType } from "@/types/variant";
import {
  createVariantFromIntent,
  createFamilyProgramVariant,
  createHikoraAdaptVariant,
  detectTransformFromIntent,
} from "@/lib/project-transforms";
import { ReferenceCompareCard } from "./ReferenceCompareCard";

interface VariantsPanelProps {
  variants: ProjectVariant[];
  activeId: string;
  onSelect: (id: string) => void;
  onSave: (variant: ProjectVariant) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onBuilt?: () => void;
}

export function VariantsPanel({
  variants,
  activeId,
  onSelect,
  onSave,
  onDelete,
  onExport,
  onBuilt,
}: VariantsPanelProps) {
  const [url, setUrl] = useState("");
  const [intent, setIntent] = useState("");
  const [name, setName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [linkPreview, setLinkPreview] = useState<{ title: string; description: string } | null>(null);
  const [detectedTransform, setDetectedTransform] = useState<TransformType>("none");
  const [reference, setReference] = useState<ReferenceProject | null>(null);

  async function analyzeLink() {
    if (!url.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), intent: intent.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLinkPreview({ title: data.title, description: data.description });
      setDetectedTransform(data.detectedTransform ?? "none");
      setReference(data.reference ?? null);
      if (!intent && data.suggestedIntents?.[0]) {
        setIntent(data.suggestedIntents[0]);
      }
    } catch (e) {
      setLinkPreview({
        title: "Błąd",
        description: e instanceof Error ? e.message : "Nie udało się przeanalizować",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  function loadHikoraExample() {
    setUrl(HIKORA_3_URL);
    setIntent("lustrzane odbicie bryły względem osi wschód-zachód");
    setName("Hikora 3 → Oaza (lustrzane odbicie)");
    setLinkPreview(null);
    setReference(null);
    setDetectedTransform("mirror-ew");
  }

  async function buildAndSave() {
    let transform: TransformType = detectedTransform;
    if (transform === "none") {
      transform = detectTransformFromIntent(intent || linkPreview?.description || "");
    }

    const links: ReferenceLink[] = url.trim()
      ? [{
          url: url.trim(),
          title: linkPreview?.title ?? reference?.name,
          description: linkPreview?.description ?? reference?.description,
          fetchedAt: new Date().toISOString(),
        }]
      : [];

    const variantName = name.trim() || `Wariant ${variants.length}`;
    const variant = createVariantFromIntent(
      variantName,
      intent || "Nowy wariant",
      transform,
      links,
    );
    onSave(variant);
    setName("");
    setUrl("");
    setIntent("");
    setLinkPreview(null);
    setReference(null);
    setDetectedTransform("none");
    onBuilt?.();
  }

  const transformLabel: Record<string, string> = {
    none: "Bez transformacji",
    "mirror-ew": "Lustrzane odbicie E↔W",
    "mirror-ns": "Lustrzane odbicie N↔S",
    "adapt-hikora": "Adaptacja Hikora — salon od lasu",
    "family-program": "Program rodzinny — garaż N, salon S/E",
  };

  function loadFamilyProgram() {
    const v = createFamilyProgramVariant();
    onSave(v);
    onBuilt?.();
  }

  function loadHikoraAdapt() {
    const v = createHikoraAdaptVariant();
    onSave(v);
    onBuilt?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h2 className="font-serif text-sm text-accent">Warianty projektu</h2>
        <p className="text-xs text-text-muted">Link + intencja → buduj → zapisz</p>
        <p className="mt-1 text-[10px] text-text-muted">
          🔒 Działka, strony świata, topo i sąsiedztwo są stałe — zmienia się tylko bryła i układ.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-4">
        <button
          type="button"
          onClick={loadFamilyProgram}
          className="w-full rounded-lg border-2 border-accent bg-accent/15 px-3 py-2 text-left text-xs hover:bg-accent/20"
        >
          <span className="font-medium text-accent">Program rodzinny — Twój brief</span>
          <span className="mt-0.5 block text-[10px] text-text-muted">
            Garaż 2-st. północ · kuchnia+salon S/E · taras L · dzieci W · master E
          </span>
        </button>

        <button
          type="button"
          onClick={loadHikoraAdapt}
          className="w-full rounded-lg border border-accent bg-accent/10 px-3 py-2 text-left text-xs hover:bg-accent/15"
        >
          <span className="font-medium text-accent">Adaptacja Hikora — salon od lasu</span>
          <span className="mt-0.5 block text-[10px] text-text-muted">
            Bryła 14×10,84 m · wiatrołap · spiżarnia · gabinet · bez odbicia bryły
          </span>
        </button>

        <button
          type="button"
          onClick={loadHikoraExample}
          className="w-full rounded-lg border border-dashed border-accent/50 bg-accent/5 px-3 py-2 text-left text-xs hover:bg-accent/10"
        >
          <span className="font-medium text-accent">Przykład: ARCHON Dom pod hikorą 3</span>
          <span className="mt-0.5 block text-[10px] text-text-muted">
            Wkleja link + „lustrzane odbicie” — jak na stronie Archon+
          </span>
        </button>

        <section className="rounded-lg border border-border bg-bg p-3 space-y-2">
          <label className="block text-xs font-medium text-text">
            Link do projektu (ARCHON, Pinterest, Houzz…)
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.archon.pl/projekty-domow/…"
            className="w-full rounded border border-border bg-bg-panel px-2 py-1.5 text-xs"
          />
          <label className="block text-xs font-medium text-text">
            Intencja (np. „lustrzane odbicie bryły”)
          </label>
          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="lustrzane odbicie, przesunięcie na las, zamiana stref…"
            rows={2}
            className="w-full rounded border border-border bg-bg-panel px-2 py-1.5 text-xs resize-none"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nazwa wariantu (opcjonalnie)"
            className="w-full rounded border border-border bg-bg-panel px-2 py-1.5 text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={analyzeLink}
              disabled={!url.trim() || analyzing}
              className="rounded border border-border px-2 py-1 text-xs hover:border-accent disabled:opacity-50"
            >
              {analyzing ? "Pobieram…" : "Analizuj link"}
            </button>
            <button
              type="button"
              onClick={buildAndSave}
              className="rounded bg-accent px-2 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Zbuduj i zapisz wariant
            </button>
          </div>
          {linkPreview && (
            <div className="rounded bg-bg-panel p-2 text-[10px] text-text-muted">
              <p className="font-medium text-text">{linkPreview.title}</p>
              <p className="mt-1">{linkPreview.description.slice(0, 200)}</p>
              <p className="mt-1 text-accent">
                Wykryta transformacja: {transformLabel[detectedTransform] ?? detectedTransform}
              </p>
            </div>
          )}
          {reference && (
            <ReferenceCompareCard
              reference={reference}
              transformLabel={transformLabel[detectedTransform]}
            />
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text">Zapisane projekty</h3>
            <button
              type="button"
              onClick={onExport}
              className="text-[10px] text-accent hover:underline"
            >
              Eksport JSON
            </button>
          </div>
          <ul className="space-y-2">
            {variants.map((v) => (
              <li
                key={v.id}
                className={`rounded-lg border p-2 cursor-pointer transition-colors ${
                  v.id === activeId
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg hover:border-accent/50"
                }`}
                onClick={() => onSelect(v.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(v.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-text">{v.name}</p>
                    <p className="text-[10px] text-text-muted">{v.intent.slice(0, 60)}</p>
                    {v.transform !== "none" && (
                      <span className="mt-1 inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[9px] text-accent">
                        {transformLabel[v.transform]}
                      </span>
                    )}
                  </div>
                  {!v.isBaseline && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(v.id);
                      }}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  )}
                </div>
                {v.referenceLinks[0]?.title && (
                  <p className="mt-1 text-[10px] text-text-muted truncate">
                    Ref: {v.referenceLinks[0].title}
                  </p>
                )}
                {v.expertReviews && v.expertReviews.length > 0 && (
                  <p className="mt-1 text-[10px] text-text-muted">
                    Recenzje: {v.expertReviews.length} ekspertów
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
