"use client";

import { useMemo, useState } from "react";
import { domainExperts, expertCategories, productPatterns2026, topDesignerExperts } from "@/data/experts";
import type {
  ExpertDebateResult,
  ExpertOpinion,
  ExpertSessionMode,
  IdealProjectResult,
} from "@/types/variant";

interface ExpertsPanelProps {
  reviews: ExpertOpinion[];
  averageScore: number;
  loading?: boolean;
  debate?: ExpertDebateResult | null;
  ideal?: IdealProjectResult | null;
  onExpertSession: (request: { mode: ExpertSessionMode; expertIds: string[] }) => void;
  onApplyIdealVariant?: (variantId: string) => void;
}

const MODE_LABELS: Record<ExpertSessionMode, string> = {
  single: "Jeden ekspert",
  debate: "Debata",
  ideal: "Idealny projekt",
};

function scoreColor(score: number): string {
  if (score >= 8) return "text-green-700 bg-green-100";
  if (score >= 6) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
}

function stanceLabel(stance: ExpertDebateResult["messages"][number]["stance"]): string {
  switch (stance) {
    case "agree":
      return "Zgoda";
    case "disagree":
      return "Sprzeciw";
    case "question":
      return "Pytanie";
    case "proposal":
      return "Kompromis";
  }
}

function stanceColor(stance: ExpertDebateResult["messages"][number]["stance"]): string {
  switch (stance) {
    case "agree":
      return "text-green-700 bg-green-50 border-green-200";
    case "disagree":
      return "text-red-700 bg-red-50 border-red-200";
    case "question":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "proposal":
      return "text-blue-700 bg-blue-50 border-blue-200";
  }
}

export function ExpertsPanel({
  reviews,
  averageScore,
  loading,
  debate,
  ideal,
  onExpertSession,
  onApplyIdealVariant,
}: ExpertsPanelProps) {
  const [mode, setMode] = useState<ExpertSessionMode>("single");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Wszyscy");

  const reviewMap = new Map(reviews.map((r) => [r.expertId, r]));
  const expertMap = new Map(domainExperts.map((expert) => [expert.id, expert]));

  const filteredExperts = useMemo(
    () =>
      activeCategory === "Wszyscy"
        ? domainExperts
        : domainExperts.filter((expert) => expert.category === activeCategory),
    [activeCategory],
  );

  const groupedExperts = useMemo(() => {
    const groups = new Map<string, typeof domainExperts>();
    filteredExperts.forEach((expert) => {
      groups.set(expert.category, [...(groups.get(expert.category) ?? []), expert]);
    });
    return Array.from(groups.entries());
  }, [filteredExperts]);

  const toggleExpert = (expertId: string) => {
    if (mode === "single") {
      setSelectedIds([expertId]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId],
    );
  };

  const canSubmit =
    mode === "single"
      ? selectedIds.length === 1
      : mode === "debate"
        ? selectedIds.length >= 2
        : true;

  const actionLabel =
    mode === "single"
      ? loading
        ? "Pytam eksperta…"
        : selectedIds.length === 1
          ? "Poproś o opinię"
          : "Wybierz eksperta"
      : mode === "debate"
        ? loading
          ? "Trwa debata…"
          : selectedIds.length >= 2
            ? `Debatuj (${selectedIds.length})`
            : "Wybierz min. 2 ekspertów"
        : loading
          ? "Szukam idealnego…"
          : selectedIds.length > 0
            ? `Szukaj z panelem (${selectedIds.length})`
            : "Znajdź idealny projekt";

  const modeHint =
    mode === "single"
      ? "Kliknij jednego eksperta — tylko on odpowie na aktywny wariant."
      : mode === "debate"
        ? "Zaznacz kilku ekspertów — zobaczysz wymianę zdań i werdykt panelu."
        : "Opcjonalnie zaznacz panel doradczy — bez wyboru użyjemy domyślnego zespołu liderów.";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h2 className="font-serif text-sm text-accent">Panel ekspertów</h2>
        <p className="mt-1 text-xs text-text-muted">
          {domainExperts.length} ekspertów · {topDesignerExperts.length} person top projektantów
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1">
          {(Object.keys(MODE_LABELS) as ExpertSessionMode[]).map((sessionMode) => (
            <button
              key={sessionMode}
              type="button"
              onClick={() => {
                setMode(sessionMode);
                setSelectedIds([]);
              }}
              className={`rounded-lg border px-2 py-1.5 text-[10px] font-medium ${
                mode === sessionMode
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-bg text-text-muted hover:text-text"
              }`}
            >
              {MODE_LABELS[sessionMode]}
            </button>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-text-muted">{modeHint}</p>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onExpertSession({ mode, expertIds: selectedIds })}
            disabled={loading || !canSubmit}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {actionLabel}
          </button>
          {reviews.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor(averageScore)}`}>
              Średnia: {averageScore}/10
            </span>
          )}
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[10px] text-text-muted underline"
            >
              Wyczyść ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {["Wszyscy", ...expertCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-2 py-1 text-[10px] ${
                activeCategory === category
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-bg text-text-muted hover:text-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3">
        {ideal && (
          <section className="rounded-lg border border-accent/40 bg-accent/5 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-accent">Rekomendowany projekt</p>
                <p className="mt-1 text-sm font-serif text-text">{ideal.recommendedVariantName}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor(ideal.score)}`}>
                {ideal.score}/10
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text">{ideal.rationale}</p>
            <div className="mt-2 space-y-1">
              {ideal.rankings.map((entry) => (
                <div key={entry.variantId} className="flex items-center justify-between text-[10px]">
                  <span className={entry.variantId === ideal.recommendedVariantId ? "font-semibold text-text" : "text-text-muted"}>
                    {entry.variantName}
                  </span>
                  <span className={scoreColor(entry.score)}>{entry.score}/10</span>
                </div>
              ))}
            </div>
            {ideal.alternatives.length > 0 && (
              <p className="mt-2 text-[10px] text-text-muted">
                Alternatywa: <strong>{ideal.alternatives[0].variantName}</strong> — {ideal.alternatives[0].when}
              </p>
            )}
            <ul className="mt-2 space-y-0.5">
              {ideal.nextSteps.map((step) => (
                <li key={step} className="text-[10px] text-text-muted before:content-['→_']">
                  {step}
                </li>
              ))}
            </ul>
            {onApplyIdealVariant && (
              <button
                type="button"
                onClick={() => onApplyIdealVariant(ideal.recommendedVariantId)}
                className="mt-3 rounded-lg border border-accent bg-bg px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10"
              >
                Otwórz rekomendowany wariant
              </button>
            )}
          </section>
        )}

        {debate && (
          <section className="rounded-lg border border-border bg-bg-panel p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-accent">Debata ekspertów</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${scoreColor(debate.averageScore)}`}>
                {debate.averageScore}/10
              </span>
            </div>
            {debate.consensus && (
              <p className="mt-2 text-[10px] text-green-700">{debate.consensus}</p>
            )}
            <div className="mt-3 space-y-2">
              {debate.messages.map((message, index) => {
                const expert = expertMap.get(message.expertId);
                return (
                  <div
                    key={`${message.expertId}-${index}`}
                    className={`rounded-md border px-2 py-2 ${stanceColor(message.stance)}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold">
                        {expert?.emoji} {expert?.name}
                      </p>
                      <span className="text-[9px] uppercase tracking-wide">{stanceLabel(message.stance)}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed">{message.text}</p>
                  </div>
                );
              })}
            </div>
            {debate.disagreements.length > 0 && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2">
                <p className="text-[10px] font-semibold text-red-700">Spory</p>
                {debate.disagreements.map((item) => (
                  <p key={item} className="mt-1 text-[10px] text-red-700">
                    ⚠ {item}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs font-medium text-text">{debate.verdict}</p>
          </section>
        )}

        {groupedExperts.map(([category, experts]) => (
          <section key={category} className="space-y-2">
            <div className="sticky top-0 z-10 rounded-md border border-border bg-bg-panel/95 px-2 py-1 text-[10px] font-semibold text-accent backdrop-blur">
              {category} · {experts.length}
            </div>
            {experts.map((expert) => {
              const review = reviewMap.get(expert.id);
              const isSelected = selectedIds.includes(expert.id);
              const selectable = true;

              return (
                <button
                  key={expert.id}
                  type="button"
                  onClick={() => selectable && toggleExpert(expert.id)}
                  disabled={!selectable}
                  className={`w-full rounded-lg border bg-bg p-3 text-left transition ${
                    isSelected
                      ? "border-accent ring-1 ring-accent/30"
                      : expert.tier === "designer"
                        ? "border-accent/40 shadow-sm"
                        : "border-border"
                  } ${selectable ? "hover:border-accent/60 cursor-pointer" : "cursor-default"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {selectable && (
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] ${
                            isSelected ? "border-accent bg-accent text-white" : "border-border"
                          }`}
                        >
                          {mode === "single" ? (isSelected ? "●" : "") : isSelected ? "✓" : ""}
                        </span>
                      )}
                      <span className="text-lg">{expert.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-text">{expert.name}</p>
                        <p className="text-[10px] text-text-muted">{expert.role}</p>
                        {expert.signature && (
                          <p className="mt-0.5 text-[9px] italic text-text-muted">
                            „{expert.signature}”
                          </p>
                        )}
                      </div>
                    </div>
                    {review && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor(review.score)}`}>
                        {review.score}
                      </span>
                    )}
                  </div>
                  {review ? (
                    <>
                      <p className="mt-2 text-xs text-text leading-relaxed">{review.summary}</p>
                      {review.criticalChange && (
                        <p className="mt-1 text-xs font-medium text-red-700">⚠ {review.criticalChange}</p>
                      )}
                      <ul className="mt-2 space-y-0.5">
                        {review.recommendations.map((rec) => (
                          <li key={rec} className="text-[10px] text-text-muted before:content-['•_']">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-2 text-[10px] italic text-text-muted">
                      {mode === "ideal"
                        ? "Opcjonalnie dodaj do panelu szukającego idealnego projektu."
                        : mode === "debate"
                          ? "Zaznacz, aby wziął udział w debacie."
                          : "Kliknij, aby poprosić tylko tego eksperta o opinię."}
                    </p>
                  )}
                </button>
              );
            })}
          </section>
        ))}

        <details className="rounded-lg border border-dashed border-border bg-bg-panel p-3">
          <summary className="cursor-pointer text-xs font-medium text-accent">
            10 wzorców UX 2026 (Figma AI, Houzz Pro, Morpholio…)
          </summary>
          <ul className="mt-2 space-y-1">
            {productPatterns2026.map((p) => (
              <li key={p} className="text-[10px] text-text-muted before:content-['✓_']">
                {p}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
