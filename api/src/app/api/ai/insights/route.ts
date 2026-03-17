import { NextRequest, NextResponse } from 'next/server';

type InsightResponse = {
  headline: string;
  recommendation: string;
  confidence: number;
};

function fallbackInsight(city: string): InsightResponse {
  return {
    headline: `${city}: Demand pressure expected in high-density emergency zones.`,
    recommendation:
      'Pre-position 1-2 ambulances near peak demand corridors and reserve ICU overflow capacity for the next 4 hours.',
    confidence: 81,
  };
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') || 'Indore';
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    return NextResponse.json(fallbackInsight(city));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are a hospital operations AI. Return concise JSON only with keys headline, recommendation, confidence (0-100).',
          },
          {
            role: 'user',
            content: `Generate city-level healthcare command-center insight for ${city}. Focus on ambulances, ICU demand, and immediate operational action.`,
          },
        ],
        response_format: {
          type: 'json_object',
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallbackInsight(city));
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(fallbackInsight(city));
    }

    const parsed = JSON.parse(raw) as Partial<InsightResponse>;

    return NextResponse.json({
      headline: parsed.headline || fallbackInsight(city).headline,
      recommendation: parsed.recommendation || fallbackInsight(city).recommendation,
      confidence:
        typeof parsed.confidence === 'number' && Number.isFinite(parsed.confidence)
          ? Math.max(0, Math.min(100, Math.round(parsed.confidence)))
          : fallbackInsight(city).confidence,
    });
  } catch {
    return NextResponse.json(fallbackInsight(city));
  }
}
