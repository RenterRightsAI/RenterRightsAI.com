import { NextResponse } from "next/server";
import type { StateLaw } from "@/types";

function buildSystemPrompt(law: StateLaw | null): string {
  const stateLine = law
    ? `The user is a renter in ${law.name}. Key ${law.name} laws: deposit must be returned in ${law.depositDays}, wrongful withholding penalty is ${law.depositMultiplier}, landlord entry notice required: ${law.noticeDays}, eviction notice: ${law.evictionNotice}, rent control: ${law.rentControl ? "YES — " + law.rcNote : "NO — " + law.rcNote}. ${law.extra}`
    : "The user has not specified their state. Provide general US renter rights information and note that state laws vary. Ask which state they are in when it materially changes the answer.";

  return `You are a knowledgeable, empathetic renter rights advisor. You help tenants understand their legal rights and options in plain, accessible language. You are not a lawyer and always remind users to seek legal counsel for serious matters. Be concise (2-4 short paragraphs maximum), specific, actionable, and warm. ${stateLine} Always prioritize the tenant's safety and wellbeing. If something is urgent (eviction, habitability emergency), say so clearly. Format responses in flowing prose, not bullet lists. When you know a relevant statute or code section for their state, name it naturally in the answer.

This product can generate landlord-ready letters. When a written demand / notice letter would help the user (repairs, deposits, privacy/entry, habitability, retaliation), say so in plain language and invite them to use the letter tool — but do not invent a clickable URL.

CRITICAL: On the final line of your reply, output exactly one machine tag (nothing else on that line):
[[LETTER:deposit]] — security deposit withheld / not returned / improper deductions
[[LETTER:repairs]] — ignored repair requests or maintenance failures
[[LETTER:habitability]] — mold, heat, pests, utilities, unsafe or unlivable conditions
[[LETTER:privacy]] — illegal entry, notice violations, harassment via entry
[[LETTER:retaliation]] — landlord retaliation, improper eviction pressure / threats where a formal notice helps
[[LETTER:none]] — advice only; no letter is appropriate yet

Use only those five letter types or none. Do not wrap the tag in backticks.`;
}

function buildSituationSummaryPrompt(law: StateLaw | null): string {
  const stateHint = law ? ` The tenant is in ${law.name}.` : "";
  return `You rewrite chat history into a short situation summary for a landlord demand-letter form.

Write 2–5 sentences in first person ("I…") describing only the tenant's factual situation and what they want (e.g. return of deposit, repairs completed).${stateHint}

Rules:
- Use only facts the tenant stated or clearly confirmed in the chat.
- Include concrete details when present: amounts, dates/timeline, what the landlord did or failed to do, notices already sent.
- Do NOT include legal advice, statute citations, next steps, or anything about AI/tools/letter generators.
- Do NOT invent facts. If a detail was not in the chat, omit it.
- Plain paragraph only — no bullets, no headings, no machine tags.`;
}

function formatChatForSummary(
  messages: { role: string; content: string }[]
): string {
  return messages
    .map((m) => {
      const who = m.role === "user" ? "Tenant" : "Advisor";
      return `${who}: ${m.content.trim()}`;
    })
    .join("\n\n");
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
    const body = await req.json();
    const { messages, stateContext, mode } = body as {
      messages: { role: string; content: string }[];
      stateContext?: StateLaw | null;
      mode?: string;
    };

    const isSituation = mode === "letter-situation";
    const system = isSituation
      ? buildSituationSummaryPrompt(stateContext ?? null)
      : buildSystemPrompt(stateContext ?? null);

    const anthropicMessages = isSituation
      ? [
          {
            role: "user",
            content: `Summarize this chat into the letter situation field:\n\n${formatChatForSummary(messages ?? [])}`,
          },
        ]
      : messages;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: isSituation ? 400 : 1000,
        system,
        messages: anthropicMessages,
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
