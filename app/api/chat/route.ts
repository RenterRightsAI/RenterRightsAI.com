import { NextResponse } from "next/server";
import type { StateLaw } from "@/types";

function buildSystemPrompt(law: StateLaw | null): string {
  const stateLine = law
    ? `The user is a renter in ${law.name}. Key ${law.name} laws: deposit must be returned in ${law.depositDays}, wrongful withholding penalty is ${law.depositMultiplier}, landlord entry notice required: ${law.noticeDays}, eviction notice: ${law.evictionNotice}, rent control: ${law.rentControl ? "YES — " + law.rcNote : "NO — " + law.rcNote}. ${law.extra}`
    : "The user has not specified their state. Provide general US renter rights information and note that state laws vary.";

  return `You are a knowledgeable, empathetic renter rights advisor. You help tenants understand their legal rights and options in plain, accessible language. You are not a lawyer and always remind users to seek legal counsel for serious matters. Be concise (2-4 short paragraphs maximum), specific, actionable, and warm. ${stateLine} Always prioritize the tenant's safety and wellbeing. If something is urgent (eviction, habitability emergency), say so clearly. Format responses in flowing prose, not bullet lists.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const { messages, stateContext } = await req.json();
    const system = buildSystemPrompt(stateContext ?? null);

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json(
        { error: data.error?.message || "AI request failed" },
        { status: resp.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
