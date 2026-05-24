import { NextRequest, NextResponse } from "next/server";
import { generateExpertReviews, averageScore } from "@/lib/expert-review";
import type { ProjectVariant } from "@/types/variant";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      variant: ProjectVariant;
      linkContext?: string;
    };

    if (!body.variant) {
      return NextResponse.json({ error: "Brak wariantu" }, { status: 400 });
    }

    const reviews = generateExpertReviews(body.variant, body.linkContext);
    const avg = averageScore(reviews);

    return NextResponse.json({ reviews, averageScore: avg });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Błąd recenzji" },
      { status: 500 },
    );
  }
}
