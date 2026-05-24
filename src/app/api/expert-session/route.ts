import { NextRequest, NextResponse } from "next/server";
import {
  averageScore,
  findIdealProject,
  generateExpertDebate,
  generateExpertReviews,
} from "@/lib/expert-review";
import type { ExpertSessionMode, ProjectVariant } from "@/types/variant";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      mode: ExpertSessionMode;
      variant?: ProjectVariant;
      variants?: ProjectVariant[];
      expertIds?: string[];
      linkContext?: string;
    };

    const expertIds = body.expertIds ?? [];

    if (body.mode === "ideal") {
      const variants = body.variants ?? (body.variant ? [body.variant] : []);
      if (variants.length === 0) {
        return NextResponse.json({ error: "Brak wariantów do analizy" }, { status: 400 });
      }
      const ideal = findIdealProject(variants, expertIds.length ? expertIds : undefined);
      return NextResponse.json({ mode: "ideal", ideal });
    }

    if (!body.variant) {
      return NextResponse.json({ error: "Brak wariantu" }, { status: 400 });
    }

    if (body.mode === "single") {
      if (expertIds.length !== 1) {
        return NextResponse.json({ error: "Wybierz dokładnie jednego eksperta" }, { status: 400 });
      }
      const reviews = generateExpertReviews(body.variant, body.linkContext, expertIds);
      return NextResponse.json({
        mode: "single",
        reviews,
        averageScore: averageScore(reviews),
      });
    }

    if (body.mode === "debate") {
      if (expertIds.length < 2) {
        return NextResponse.json({ error: "Debatę rozpocznij od co najmniej 2 ekspertów" }, { status: 400 });
      }
      const debate = generateExpertDebate(body.variant, expertIds, body.linkContext);
      const reviews = generateExpertReviews(body.variant, body.linkContext, expertIds);
      return NextResponse.json({
        mode: "debate",
        debate,
        reviews,
        averageScore: debate.averageScore,
      });
    }

    return NextResponse.json({ error: "Nieznany tryb sesji" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Błąd sesji ekspertów" },
      { status: 500 },
    );
  }
}
