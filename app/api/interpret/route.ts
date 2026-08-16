import { NextResponse } from "next/server";

import type { AiInterpretation } from "@/lib/interpretation";
import { searchCuratedDataset } from "@/lib/search-dataset";

const MAX_QUERY_LENGTH = 800;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const imageDataUrl = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/;

const interpretationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectedPhrase: { type: "string" },
    meaningTH: { type: "string" },
    meaningEN: { type: "string" },
    tone: { type: "array", items: { type: "string" } },
    context: { type: "string" },
    confidence: { type: "number" },
    detectedText: { type: ["string", "null"] },
    visualContext: { type: ["string", "null"] },
  },
  required: [
    "detectedPhrase",
    "meaningTH",
    "meaningEN",
    "tone",
    "context",
    "confidence",
    "detectedText",
    "visualContext",
  ],
};

export async function POST(request: Request) {
  let body: { query?: unknown; imageDataUrl?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid interpretation request." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const image = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";
  const imageMatch = imageDataUrl.exec(image);

  if (!query && !imageMatch) {
    return NextResponse.json({ error: "Add a phrase or a supported screenshot." }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "Keep the text under 800 characters." }, { status: 413 });
  }
  if (image && !imageMatch) {
    return NextResponse.json({ error: "Use a PNG, JPG, or WebP screenshot." }, { status: 415 });
  }
  if (imageMatch && base64ByteLength(imageMatch[2]) > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Keep the screenshot under 4 MB." }, { status: 413 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI fallback is not configured. Add OPENAI_API_KEY to enable it." }, { status: 503 });
  }

  const content: Array<Record<string, string>> = [
    {
      type: "input_text",
      text: [
        "You are the structured cultural-language decoder for VODS MEME.",
        "Explain internet English using the specific context, never invent a lesson or claim a phrase has a universal meaning when it depends on a reference.",
        "Return concise Thai and English meanings, 2-4 tone labels, and a context explanation.",
        "If an image is attached, read relevant visible text and visual cues.",
        `User text: ${query || "No text supplied. Interpret the screenshot."}`,
      ].join("\n"),
    },
  ];
  if (imageMatch) content.push({ type: "input_image", image_url: image, detail: "low" });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      input: [{ role: "user", content }],
      text: {
        format: {
          type: "json_schema",
          name: "internet_english_interpretation",
          strict: true,
          schema: interpretationSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI interpretation is unavailable right now. Please try again." }, { status: 502 });
  }

  const payload = await response.json() as { output_text?: unknown; output?: unknown };
  const interpretation = parseInterpretation(payload.output_text ?? extractOutputText(payload.output));
  if (!interpretation) {
    return NextResponse.json({ error: "AI returned an unusable interpretation. Please try again." }, { status: 502 });
  }

  const related = interpretation.confidence >= 0.55
    ? searchCuratedDataset(interpretation.detectedPhrase)
    : null;
  const result: AiInterpretation = {
    source: "AI",
    ...interpretation,
    relatedUnitId: related?.relatedUnitId ?? null,
    relatedExpressions: related?.relatedExpressions ?? [],
  };

  return NextResponse.json(result);
}

function base64ByteLength(value: string) {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return (value.length * 3) / 4 - padding;
}

function parseInterpretation(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    if (
      typeof parsed.detectedPhrase !== "string" ||
      typeof parsed.meaningTH !== "string" ||
      typeof parsed.meaningEN !== "string" ||
      typeof parsed.context !== "string" ||
      typeof parsed.confidence !== "number" ||
      !Array.isArray(parsed.tone) ||
      !parsed.tone.every((tone) => typeof tone === "string")
    ) return null;

    return {
      detectedPhrase: parsed.detectedPhrase,
      meaningTH: parsed.meaningTH,
      meaningEN: parsed.meaningEN,
      tone: parsed.tone,
      context: parsed.context,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      detectedText: typeof parsed.detectedText === "string" ? parsed.detectedText : undefined,
      visualContext: typeof parsed.visualContext === "string" ? parsed.visualContext : undefined,
    };
  } catch {
    return null;
  }
}

function extractOutputText(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  for (const item of value) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content && typeof content === "object" && "type" in content && content.type === "output_text" && "text" in content) return content.text;
    }
  }
  return undefined;
}
