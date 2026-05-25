import { domainExperts, type Expert } from "@/data/experts";
import { findReferenceByUrl } from "@/data/reference-projects";
import { plotData } from "@/data/project-context";
import type { ExpertDebateMessage, ExpertDebateResult, ExpertOpinion, IdealProjectResult } from "@/types/variant";
import type { ProjectVariant } from "@/types/variant";

function scoreForMirrorEW(hikoraRef: boolean): Record<string, { score: number; summary: string; recs: string[]; critical?: string }> {
  const hikoraNote = hikoraRef
    ? " Jak w katalogu ARCHON+ (Hikora 3) — lustrzane odbicie służy do „przymierzenia” na mapie działki; u Ciebie las zostaje na wschodzie działki."
    : "";
  return {
    landscape: {
      score: hikoraRef ? 7 : 6,
      summary: `Lustrzane odbicie przesuwa ogród na zachód — tracisz widok na las z salonu.${hikoraNote}`,
      recs: hikoraRef
        ? ["Użyj odbicia jak ARCHON: sprawdź obrys 1:500 na mapie", "Salon zostaw od wschodu (las)"]
        : ["Salon powinien zostać od wschodu", "Ogród kaskadowy przenieś na wschód"],
      critical: hikoraRef
        ? "Hikora ma taras od ogrodu — przy odbiciu Oazy taras E/S musi zostać po stronie lasu, nie drogi."
        : "Nie odbijaj bryły bez przeniesienia strefy dziennej — las zostaje na wschodzie działki.",
    },
    energy: {
      score: hikoraRef ? 8 : 7,
      summary: hikoraRef
        ? "Hikora EP ~67 kWh/m²/rok (gaz). Oaza z pompą ciepła + rekuperacją będzie lepsza niezależnie od odbicia."
        : "Garaż od wschodu = więcej słońca na północy domu, ale salon traci orientację pasywną.",
      recs: hikoraRef ? ["Porównaj EP po adaptacji", "Rekuperacja — przewaga nad Hikorą (grawitacja)"] : ["Przelicz PHPP po odbiciu", "HST przenieś na wschód działki (las)"],
    },
    urban: {
      score: 8,
      summary: hikoraRef
        ? "Działka Oazy (43,72×21,05 m) spełnia min. Hikory (17,6×21,4 m). Odległości od granic bez zmian — MPZP OK."
        : "Odległości od granic się nie zmieniają — MPZP OK.",
      recs: ["Sprawdź wypis MPZP", "Przyłącza z północy bez zmian"],
    },
    acoustic: {
      score: hikoraRef ? 7 : 8,
      summary: hikoraRef
        ? "Hikora: garaż od wejścia chroni strefę dzienną. Po odbiciu E↔W garaż od wschodu — dalej od drogi, ale zmienia układ pancerza."
        : "Garaż od wschodu = dalej od drogi zachodniej — cichszy salon, ale gorszy bufor od lasu.",
      recs: ["Ocena akustyczna po zmianie układu pomieszczeń"],
    },
    daylight: {
      score: hikoraRef ? 6 : 5,
      summary: hikoraRef
        ? "Hikora: salon+jadalnia 30,3 m² z kominkiem. Odbicie na działce Cieszyn: salon nie może patrzeć na drogę zamiast na las."
        : "Salon od zachodu traci poranne słońce i widok na las — regres dla strefy dziennej.",
      recs: ["Zamień funkcje E↔W wewnątrz bryły zamiast samego odbicia na działce", "Gabinet Hikory ≈ biuro Oazy — zachowaj wyjście na taras"],
      critical: "Odbicie bryły bez zamiany funkcji = salon patrzy na drogę.",
    },
    geo: { score: 7, summary: "Posadowienie bez zmian topograficznych. NMT wskazuje ok. 3 m różnicy poziomów na działce.", recs: ["Mapa do celów projektowych", "2-3 odwierty geotechniczne"] },
    interior: {
      score: hikoraRef ? 6 : 5,
      summary: hikoraRef
        ? "Hikora: otwarta strefa dzienna + gabinet z tarasem. Oaza: oś hol→salon→las — silniejsza niż w projekcie katalogowym."
        : "Tracisz oś hol→salon→las.",
      recs: ["Zachowaj oś widokową na wschód", "Spiżarnia przy kuchni — jak w Hikorze, OK"],
    },
    hvac: {
      score: hikoraRef ? 8 : 7,
      summary: hikoraRef
        ? "Hikora: wentylacja grawitacyjna. Oaza: rekuperacja + wieża W — wyższy standard."
        : "Kotłownia NW bez zmian względem działki.",
      recs: ["Wieża instalacyjna W zostaje", "Rekuperacja priorytet vs katalog ARCHON"],
    },
    garden: {
      score: hikoraRef ? 7 : 6,
      summary: hikoraRef
        ? "Hikora: narożny taras od ogrodu. Przy odbiciu zachowaj taras E/S Oazy przy lesie."
        : "Ogród od zachodu = cień budynku po południu.",
      recs: ["Trawnik przy tarasie wymaga przesunięcia", "Kaskada 3 poziomów — unikalna vs Hikora"],
    },
    cost: {
      score: hikoraRef ? 8 : 7,
      summary: hikoraRef
        ? "Hikora: koszt budowy ~355 tys. zł netto (I kw. 2026). Oaza większa — budżet wyższy, ale lustrzane odbicie = 0 zł (tylko adaptacja)."
        : "Brak dodatkowych kosztów — zmiana koncepcyjna.",
      recs: ["Unikaj kosztownych murków po złej stronie", "Adaptacja projektu — jak u ARCHON+"],
    },
  };
}

function scoreForAdaptHikora(hikoraRef: boolean): Record<string, { score: number; summary: string; recs: string[]; critical?: string }> {
  return {
    landscape: {
      score: 9,
      summary: "Salon od wschodu zachowany — oś widokowa na las bez zmian. Ogród kaskadowy po wschodniej stronie działki.",
      recs: ["Taras E/S przy salonie", "Kaskada 3 poziomów w ogrodzie 19,92 m"],
    },
    energy: {
      score: 9,
      summary: "Bryła 14×10,84 m + rekuperacja + PC — lepsza niż Hikora (EP ~67, wentylacja grawitacyjna).",
      recs: ["PHPP po powiększeniu bryły", "HST od wschodu — kontrola zysków"],
    },
    urban: {
      score: 8,
      summary: "Powiększenie W–E do 14 m: ogród wschodni 19,92 m — nadal mieści się w działce. Odległość od północy 4 m zgodnie z regułą.",
      recs: ["Wypis MPZP przed finalizacją", "Obrys 1:500 na mapie do celów projektowych"],
    },
    acoustic: {
      score: 8,
      summary: "Garaż od zachodu = pancerz akustyczny. Gabinet od północy — ekran zieleni od domu 48R.",
      recs: ["Ściana N Rw 55 dB", "Bufor schodów między strefami"],
    },
    daylight: {
      score: 9,
      summary: "Salon HST na WSCHÓD — optymalne. Kuchnia południe. Gabinet północ — praca przy monitorze.",
      recs: ["Rolety południe na kuchnię", "HCL w biurze/gabinecie"],
      critical: hikoraRef ? undefined : undefined,
    },
    geo: {
      score: 7,
      summary: "NMT GUGiK: ok. 366,8-369,8 m n.p.m. Teren rośnie NW→SE, a rzędne trzeba potwierdzić geodezyjnie.",
      recs: ["2-3 odwierty geotechniczne", "Projekt odwodnienia po mapie 1:500"],
    },
    interior: {
      score: 9,
      summary: "Adaptacja Hikora: wiatrołap, spiżarnia, gabinet z tarasem, 2 garderoby — zachowana oś Japandi→las.",
      recs: ["Podłoga dębowa ciągła hol→salon", "Kominek opcjonalnie jak Hikora"],
    },
    hvac: {
      score: 9,
      summary: "Rekuperacja vs grawitacja Hikory — wyraźna przewaga. Kotłownia NW + wieża W.",
      recs: ["Projekt rekuperacji równoległy", "Piony wod-kan z północy"],
    },
    garden: {
      score: 9,
      summary: "Taras E/S przy salonie od lasu. Ogród 19,92 m — wystarczający na kaskadę i saunę.",
      recs: ["PsIV — poprawa gleby przed trawnikiem", "Sauna w głębi ogrodu E"],
    },
    cost: {
      score: 8,
      summary: hikoraRef
        ? "Hikora ~355 tys. zł netto; Oaza większa bryła + wyższy standard — budżet wyższy, ale adaptacja bez opłat za odbicie."
        : "Powiększenie bryły + rekuperacja — inwestycja w EP i komfort.",
      recs: ["Kosztorys po adaptacji układu", "Value engineering HST"],
    },
  };
}

function scoreForFamilyProgram(): Record<string, { score: number; summary: string; recs: string[]; critical?: string }> {
  return {
    landscape: {
      score: 9,
      summary: "Salon na południu z tarasem S+E — słońce i las; garaż od północy nie zjada ogrodu wschodniego.",
      recs: ["Taras L przy salonie", "Kaskada ogrodu za domem (E)", "Zieleń ekranująca od sąsiada 48R (N)"],
    },
    energy: {
      score: 8,
      summary: "Duże przeszklenie S+E wymaga rolet i okapów; kuchnia od północy = mniejsze zyski letnie — plus.",
      recs: ["PHPP z HST południe/wschód", "Rekuperacja", "Świetlik nad schodami"],
    },
    urban: {
      score: 8,
      summary: "Bryła 14×11 m, P=4 m, Poł=6,05 m — mieści się na działce 43,72×21,05 m.",
      recs: ["Obrys 1:500", "Wypis MPZP"],
    },
    acoustic: {
      score: 8,
      summary: "Garaż i kotłownia od północy oddzielają strefę techniczną od salonu; biuro na zachodzie przy drodze — ekran fasady.",
      recs: ["Ściana N Rw 55 dB (48R)", "Drzwi garażowe dobrej klasy"],
    },
    daylight: {
      score: 9,
      summary: "Salon południe+wschód — optymalny kompromis światła i widoku; dzieci zachód — popołudnie, master wschód — poranek i las.",
      recs: ["HST max. wschód, okna południowe nisko", "Rolety zewnętrzne S", "Gabinet W — nie przeszklenia pełne"],
    },
    geo: {
      score: 7,
      summary: "Posadowienie bez zmian; drenaż NW nadal krytyczny przy garażu od północy.",
      recs: ["Odwierty geotechniczne", "Opaska drenażowa N i W garażu"],
    },
    interior: {
      score: 9,
      summary: "Program zgodny z briefem inwestora: garaż 2-st. N, łazienka parter, master+bath+garderoba, dzieci W, sala fitness.",
      recs: ["Oś wejście→schody→salon→las", "Spiżarnia przy kuchni — opcjonalnie"],
    },
    hvac: {
      score: 8,
      summary: "Kotłownia przy garażu N — krótkie przyłącza z północy działki; wieża W możliwa.",
      recs: ["Projekt rekuperacji", "Cicha jednostka PC"],
    },
    garden: {
      score: 9,
      summary: "Taras L (S+E) przy salonie; ogród ~20 m na wschód bez kolizji z garażem.",
      recs: ["Taras 30–45 cm niżej progu HST", "Markiza lub pergola na południu"],
    },
    cost: {
      score: 7,
      summary: "Garaż 2-st. + duży salon = koszt; prostokąt 14×11 tańszy niż skomplikowany kwadrat.",
      recs: ["Kosztorys po zamrożeniu HST", "Value engineering elewacji W"],
    },
  };
}

function scoreBaseline(): Record<string, { score: number; summary: string; recs: string[]; critical?: string }> {
  return {
    landscape: { score: 7, summary: "Kaskada ogrodu ma sens przy ok. 3 m różnicy wysokości z NMT.", recs: ["Drenaż NW", "Płytkie tarasy"] },
    energy: { score: 8, summary: "Bryła 14×10,84 m — więcej powierzchni, HST do optymalizacji.", recs: ["PHPP po powiększeniu", "Rekuperacja"] },
    urban: { score: 8, summary: "4 m od północy i minimum 4 m od południa — lepsza pozycja formalna niż wcześniejszy wariant.", recs: ["Wypis MPZP", "Potwierdź linie zabudowy"] },
    acoustic: { score: 7, summary: "Pancerz zachodni OK, północ słaba.", recs: ["Ściana N Rw 55 dB"] },
    daylight: { score: 8, summary: "Dobry podział E/S/N.", recs: ["Rolety południe", "Biuro N — HCL"] },
    geo: { score: 7, summary: "NMT pokazuje umiarkowany spadek, ale grunt i woda wymagają badań.", recs: ["OT geotechniczne", "Odwodnienie"] },
    interior: { score: 9, summary: "Oś lasu — mocny punkt.", recs: ["Podłoga dębowa ciągła"] },
    hvac: { score: 7, summary: "Kotłownia NW ciasna.", recs: ["Wieża W", "Rekuperacja"] },
    garden: { score: 9, summary: "Taras E/S idealny.", recs: ["PsIV — poprawa gleby"] },
    cost: { score: 7, summary: "Przesuń budżet z HST na obudowę.", recs: ["Rekuperacja priorytet"] },
  };
}

function fallbackReviewForExpert(
  expert: Expert,
  variant: ProjectVariant,
): { score: number; summary: string; recs: string[]; critical?: string } {
  const isHikora = variant.transform === "adapt-hikora";
  const focus = expert.focus.slice(0, 3).join(", ");
  const variantName = isHikora ? "adaptacji Hikory" : "wariantu Oazy";

  if (expert.tier === "designer") {
    return {
      score: isHikora ? 8 : 7,
      summary: `${expert.name} patrzy na ${variantName} przez pryzmat: ${expert.signature}. Najważniejsze jest, aby mocna idea domu nie przegrała z przypadkowym detalem.`,
      recs: [
        `Sprawdź decyzję przez filtr: ${focus}`,
        "Zostaw jedną dominującą oś widokową i wycisz resztę gestów",
        "Render ma pokazywać atmosferę, nie tylko rzut techniczny",
      ],
    };
  }

  switch (expert.category) {
    case "Architektura":
      return {
        score: isHikora ? 8 : 7,
        summary: `Architektonicznie ${variantName} wymaga pilnowania proporcji bryły, rytmu okien i relacji garaż-wejście-salon.`,
        recs: ["Porównaj elewacje N/S/E/W", "Zrób widok od wjazdu i od ogrodu", `Dopilnuj: ${focus}`],
      };
    case "Teren":
      return {
        score: 7,
        summary: "Działka ma potwierdzony EGiB i NMT, ale decyzje fundamentowe muszą wyjść z mapy 1:500 i badań gruntu.",
        recs: ["Nie projektuj rzędnych z samego Google Maps", "Zleć 2-3 odwierty", `Zweryfikuj: ${focus}`],
        critical: "NMT nie daje dokładności centymetrowej do projektu budowlanego.",
      };
    case "Energia":
      return {
        score: isHikora ? 9 : 8,
        summary: "Największe ryzyko energetyczne to duże przeszklenia bez strategii cienia, rekuperacji i akumulacji.",
        recs: ["Policz przegrzewanie letnie", "Zgraj PV z dachem", `Doprecyzuj: ${focus}`],
      };
    case "Prawo":
      return {
        score: 8,
        summary: "Formalnie kluczowe są odległości 4 m, linie zabudowy, MPZP i zgodność z aktualnym wyrysem.",
        recs: ["Wypis/wyrys MPZP", "Potwierdź granice EGiB", `Sprawdź: ${focus}`],
      };
    case "Budżet":
      return {
        score: 7,
        summary: "Budżet trzeba chronić przed kosztownymi detalami: duże HST, murki, niestandardowy dach i mokre przeróbki.",
        recs: ["Oznacz elementy premium", "Zrób wariant value engineering", `Kontroluj: ${focus}`],
      };
    case "Wnętrza":
      return {
        score: isHikora ? 9 : 8,
        summary: "Układ wnętrz powinien wspierać codzienny rytuał: wejście, kuchnia, salon, taras i strefa nocna bez konfliktów.",
        recs: ["Zrób ścieżki dnia powszedniego", "Sprawdź przechowywanie", `Dopracuj: ${focus}`],
      };
    case "Komfort":
      return {
        score: 8,
        summary: "Komfort zależy od prywatności, światła, akustyki i mikroklimatu, nie tylko od metrażu.",
        recs: ["Zaznacz osie widokowe i osie sąsiadów", "Dodaj rolety/cień", `Zweryfikuj: ${focus}`],
      };
    case "Strategia":
      return {
        score: 8,
        summary: "Najlepszy wariant powinien dawać jasną decyzję: co jest stałe, co można zmieniać i co wymaga fachowca.",
        recs: ["Porównuj warianty obok siebie", "Zapisz założenia i ryzyka", `Oceń: ${focus}`],
      };
    case "Technika":
    default:
      return {
        score: 7,
        summary: `Technicznie ${variantName} wymaga sprawdzenia wykonawczości, serwisu i kolizji między branżami.`,
        recs: ["Koordynacja architekt-konstruktor-instalacje", "Nie odkładaj pionów na koniec", `Sprawdź: ${focus}`],
      };
  }
}

function buildReviewForExpert(
  expert: Expert,
  variant: ProjectVariant,
  scores: Record<string, { score: number; summary: string; recs: string[]; critical?: string }>,
  linkContext?: string,
): ExpertOpinion {
  const data = scores[expert.id] ?? fallbackReviewForExpert(expert, variant);
  let summary = data.summary;
  if (linkContext) {
    summary += ` Referencja: ${linkContext.slice(0, 120)}…`;
  }
  if (variant.intent && variant.intent !== "baseline") {
    summary = `[${variant.intent}] ${summary}`;
  }
  return {
    expertId: expert.id,
    score: data.score,
    summary,
    recommendations: data.recs,
    criticalChange: data.critical,
  };
}

function resolveScores(variant: ProjectVariant) {
  const hikoraRef = variant.referenceLinks.some(
    (l) => findReferenceByUrl(l.url)?.id === "archon-hikora-3",
  );

  return variant.transform === "family-program" ? scoreForFamilyProgram() :
    variant.transform === "adapt-hikora" ? scoreForAdaptHikora(hikoraRef) :
    variant.transform === "mirror-ew" ? scoreForMirrorEW(hikoraRef) :
    variant.transform === "mirror-ns" ? scoreForMirrorEW(hikoraRef) :
    scoreBaseline();
}

export function generateExpertReviews(
  variant: ProjectVariant,
  linkContext?: string,
  expertIds?: string[],
): ExpertOpinion[] {
  const scores = resolveScores(variant);
  const experts = expertIds?.length
    ? domainExperts.filter((expert) => expertIds.includes(expert.id))
    : domainExperts;

  return experts.map((expert) => buildReviewForExpert(expert, variant, scores, linkContext));
}

const DEFAULT_IDEAL_PANEL = [
  "interior",
  "landscape",
  "energy",
  "urban",
  "daylight",
  "investor-ux",
  "ando",
];

function stanceForScore(score: number): ExpertDebateMessage["stance"] {
  if (score >= 8) return "agree";
  if (score >= 6) return "question";
  return "disagree";
}

export function generateExpertDebate(
  variant: ProjectVariant,
  expertIds: string[],
  linkContext?: string,
): ExpertDebateResult {
  const uniqueIds = [...new Set(expertIds)];
  const experts = domainExperts.filter((expert) => uniqueIds.includes(expert.id));
  const reviews = generateExpertReviews(variant, linkContext, uniqueIds);
  const reviewMap = new Map(reviews.map((review) => [review.expertId, review]));
  const messages: ExpertDebateMessage[] = [];

  for (const expert of experts) {
    const review = reviewMap.get(expert.id);
    if (!review) continue;
    messages.push({
      expertId: expert.id,
      stance: stanceForScore(review.score),
      text: review.summary,
    });
  }

  const lowScorers = reviews.filter((review) => review.score < 7);
  const highScorers = reviews.filter((review) => review.score >= 8);

  if (lowScorers.length > 0 && highScorers.length > 0) {
    const challenger = lowScorers[0];
    const supporter = highScorers[0];
    const challengerExpert = domainExperts.find((expert) => expert.id === challenger.expertId);
    const supporterExpert = domainExperts.find((expert) => expert.id === supporter.expertId);
    if (challengerExpert && supporterExpert) {
      messages.push({
        expertId: challenger.expertId,
        stance: "disagree",
        text: challenger.criticalChange
          ? `Nie zgadzam się z optymizmem ${supporterExpert.name}: ${challenger.criticalChange}`
          : `Widzę ryzyko, którego ${supporterExpert.name} nie uwzględnia: ${challenger.recommendations[0]}`,
      });
      messages.push({
        expertId: supporter.expertId,
        stance: "proposal",
        text: `Proponuję kompromis: ${supporter.recommendations[0]}. Przy tym wariancie nadal wychodzi ${supporter.score}/10.`,
      });
    }
  }

  if (experts.length >= 3) {
    const mid = reviews.find((review) => review.score >= 6 && review.score < 8);
    if (mid) {
      messages.push({
        expertId: mid.expertId,
        stance: "question",
        text: `Zanim zatwierdzimy wariant, musimy odpowiedzieć: ${mid.recommendations[0]}?`,
      });
    }
  }

  const avg = averageScore(reviews);
  const disagreements = reviews
    .filter((review) => review.criticalChange)
    .map((review) => review.criticalChange as string);

  const consensus =
    highScorers.length >= Math.ceil(experts.length / 2)
      ? `Wspólny mianownik: ${highScorers
          .slice(0, 3)
          .map((review) => domainExperts.find((expert) => expert.id === review.expertId)?.focus[0])
          .filter(Boolean)
          .join(", ")}.`
      : undefined;

  const verdict =
    avg >= 8
      ? "Debatę wygrywa wariant — panel rekomenduje go z drobnymi poprawkami."
      : avg >= 6
        ? "Debatę kończymy bez pełnej zgody — wariant ma sens, ale wymaga korekt przed decyzją."
        : "Debatę wygrywają sceptycy — wróć do baseline albo innej transformacji.";

  return {
    expertIds: uniqueIds,
    messages,
    consensus,
    disagreements,
    verdict,
    averageScore: avg,
  };
}

function idealRationale(variant: ProjectVariant, score: number): string {
  switch (variant.transform) {
    case "family-program":
      return `Program rodzinny (${score}/10): garaż 2-st. od północy, salon na południu z tarasem S+E, master na wschodzie — dopasowany do briefu inwestora i działki.`;
    case "adapt-hikora":
      return `Adaptacja Hikory zbiera ${score}/10, bo zachowuje salon od lasu, spełnia odległości 4 m i daje najlepszy balans funkcji vs formalności.`;
    case "mirror-ew":
      return `Lustrzane odbicie ma ${score}/10 — szybki test koncepcji, ale panel często traci oś widokową na las. Dobre tylko jako wariant porównawczy.`;
    case "mirror-ns":
      return `Odbicie N–S (${score}/10) rzadko wygrywa na tej działce — sprawdź je głównie jako ćwiczenie, nie jako docelowy dom.`;
    default:
      return `Baseline Oazy (${score}/10) to bezpieczny punkt wyjścia: powiększona bryła 14×10,84 m, odległości zgodne z regułą 4 m i silna oś hol→salon→las.`;
  }
}

function idealAlternativeWhen(variant: ProjectVariant): string {
  switch (variant.transform) {
    case "family-program":
      return "Gdy priorytetem jest Twój układ: garaż północ, salon południe, dzieci zachód, master wschód.";
    case "adapt-hikora":
      return "Gdy chcesz maksimum funkcji katalogowej i salon od lasu bez odbicia bryły.";
    case "mirror-ew":
      return "Gdy chcesz szybko przetestować odwrócony układ bez zmiany programu.";
    case "mirror-ns":
      return "Gdy interesuje Cię alternatywna orientacja bryły względem spadku terenu.";
    default:
      return "Gdy chcesz najprostszy, najbardziej przewidywalny wariant startowy.";
  }
}

export function findIdealProject(
  variants: ProjectVariant[],
  expertIds?: string[],
): IdealProjectResult {
  const panelIds = expertIds?.length ? expertIds : DEFAULT_IDEAL_PANEL;
  const ranked = variants
    .map((variant) => {
      const reviews = generateExpertReviews(variant, undefined, panelIds);
      return {
        variant,
        reviews,
        score: averageScore(reviews),
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];

  return {
    recommendedVariantId: best.variant.id,
    recommendedVariantName: best.variant.name,
    score: best.score,
    rationale: idealRationale(best.variant, best.score),
    expertSummaries: best.reviews.map((review) => ({
      expertId: review.expertId,
      pick: review.summary.slice(0, 140),
      score: review.score,
    })),
    alternatives: second
      ? [
          {
            variantId: second.variant.id,
            variantName: second.variant.name,
            when: idealAlternativeWhen(second.variant),
          },
        ]
      : [],
    nextSteps: [
      "Otwórz rekomendowany wariant i sprawdź mapę działki + satelitę.",
      "Poproś 2–3 kluczowych ekspertów o debatę nad finalnym układem.",
      "Zapisz wariant JSON i przekaż architektowi lokalnemu w Cieszynie.",
    ],
    rankings: ranked.map((entry) => ({
      variantId: entry.variant.id,
      variantName: entry.variant.name,
      score: entry.score,
    })),
  };
}

export function averageScore(reviews: ExpertOpinion[]): number {
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.score, 0) / reviews.length) * 10) / 10;
}

export function buildVariantSummary(variant: ProjectVariant): string {
  const s = variant.setbacks ?? plotData.building.setbacks;
  return `${variant.name}: transform=${variant.transform}, W=${s.west}m N=${s.north}m S=${s.south}m E=${s.east}m`;
}
