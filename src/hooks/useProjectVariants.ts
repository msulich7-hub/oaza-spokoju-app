"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProjectVariant } from "@/types/variant";
import { getBaselineVariant } from "@/lib/project-transforms";

import { sanitizeVariant } from "@/lib/plot-constraints";

const STORAGE_KEY = "oaza-spokoju-variants";
const ACTIVE_KEY = "oaza-spokoju-active-variant";

function loadVariants(): ProjectVariant[] {
  if (typeof window === "undefined") return [getBaselineVariant()];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [getBaselineVariant()];
    const parsed = JSON.parse(raw) as ProjectVariant[];
    if (!parsed.some((v) => v.isBaseline)) {
      return [getBaselineVariant(), ...parsed];
    }
    return parsed;
  } catch {
    return [getBaselineVariant()];
  }
}

export function useProjectVariants() {
  const [variants, setVariants] = useState<ProjectVariant[]>([]);
  const [activeId, setActiveId] = useState<string>("baseline");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadVariants();
    setVariants(loaded);
    const saved = localStorage.getItem(ACTIVE_KEY);
    if (saved && loaded.some((v) => v.id === saved)) {
      setActiveId(saved);
    } else {
      setActiveId("baseline");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
  }, [variants, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ACTIVE_KEY, activeId);
  }, [activeId, hydrated]);

  const activeVariant = variants.find((v) => v.id === activeId) ?? variants[0] ?? getBaselineVariant();

  const saveVariant = useCallback((variant: ProjectVariant) => {
    const clean = sanitizeVariant(variant);
    setVariants((prev) => {
      const idx = prev.findIndex((v) => v.id === clean.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...clean, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, clean];
    });
    setActiveId(clean.id);
  }, []);

  const deleteVariant = useCallback((id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id && !v.isBaseline));
    setActiveId("baseline");
  }, []);

  const updateActiveReviews = useCallback((reviews: ProjectVariant["expertReviews"]) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === activeId
          ? { ...v, expertReviews: reviews, updatedAt: new Date().toISOString() }
          : v,
      ),
    );
  }, [activeId]);

  const exportVariant = useCallback(() => {
    if (!activeVariant) return;
    const blob = new Blob([JSON.stringify(activeVariant, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${activeVariant.name.replace(/\s+/g, "-")}.json`;
    a.click();
  }, [activeVariant]);

  return {
    variants,
    activeVariant,
    activeId,
    setActiveId,
    saveVariant,
    deleteVariant,
    updateActiveReviews,
    exportVariant,
    hydrated,
  };
}
