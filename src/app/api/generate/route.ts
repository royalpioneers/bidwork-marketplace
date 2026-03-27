import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { prompt, size, quality, style } = await req.json();

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "El prompt es requerido." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "API key de OpenAI no configurada." }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt.trim(),
    n: 1,
    size: size ?? "1024x1024",
    quality: quality ?? "standard",
    style: style ?? "vivid",
    response_format: "url",
  });

  const imageUrl = response.data?.[0]?.url;
  const revisedPrompt = response.data?.[0]?.revised_prompt;

  return NextResponse.json({ imageUrl, revisedPrompt });
}
