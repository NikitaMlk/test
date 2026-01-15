import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.AI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, tone } = await req.json();
    const userPrompt = `Respond in a ${tone} tone.\n\nUser message: ${message}`;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!tone) {
      return NextResponse.json(
        { error: "Tone is required" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: userPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "No response from AI";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
