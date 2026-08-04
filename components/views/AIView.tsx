"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context/AppProvider";
import type { ChatMessage, LetterType, StateLaw } from "@/types";

const LETTER_TYPES: LetterType[] = [
  "deposit",
  "repairs",
  "habitability",
  "privacy",
  "retaliation",
];

const LETTER_LABELS: Record<LetterType, string> = {
  deposit: "Draft a deposit demand letter",
  repairs: "Draft a repair request letter",
  habitability: "Draft a habitability letter",
  privacy: "Draft a privacy / entry letter",
  retaliation: "Draft a formal notice letter",
};

type DisplayMessage = ChatMessage & { letterType?: LetterType | null };

function parseAssistantReply(raw: string): {
  content: string;
  letterType: LetterType | null;
} {
  const tagRe = /\[\[LETTER:(deposit|repairs|habitability|privacy|retaliation|none)\]\]/i;
  const match = raw.match(tagRe);
  let letterType: LetterType | null = null;
  if (match) {
    const key = match[1].toLowerCase();
    if (key !== "none" && LETTER_TYPES.includes(key as LetterType)) {
      letterType = key as LetterType;
    }
  }
  const content = raw
    .replace(tagRe, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { content, letterType };
}

/** Fallback if the model forgets the tag but the user clearly needs a letter. */
function inferLetterType(question: string, answer: string): LetterType | null {
  const text = `${question} ${answer}`.toLowerCase();
  if (
    /deposit|security deposit|withh[eo]ld/.test(text)
  ) {
    return "deposit";
  }
  if (/mold|pest|heat|no heat|uninhabitable|habitability|sewage|leak/.test(text)) {
    return "habitability";
  }
  if (/enter without|entered without|notice to enter|privacy|lockout/.test(text)) {
    return "privacy";
  }
  if (/retaliat|evict/.test(text) && /threat|notice|revenge|complain/.test(text)) {
    return "retaliation";
  }
  if (/repair|broken|fix|maintenance|won't fix|will not fix/.test(text)) {
    return "repairs";
  }
  if (/demand letter|written (demand|notice)|send a letter/.test(text)) {
    return "repairs";
  }
  return null;
}

/** Fallback if the summary API fails: tenant facts only, no advisor essay. */
function buildSituationFallback(messages: DisplayMessage[]): string {
  const userBits = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.trim())
    .filter(Boolean);
  if (!userBits.length) return "";
  const joined = userBits.join(" ");
  const max = 2000;
  return joined.length <= max ? joined : joined.slice(0, max - 1) + "…";
}

async function summarizeSituationForLetter(
  messages: DisplayMessage[],
  stateContext: StateLaw | null
): Promise<string> {
  const payload = messages.map(({ role, content }) => ({ role, content }));
  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "letter-situation",
        messages: payload,
        stateContext,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Summary failed");
    const text = (data.content?.[0]?.text as string | undefined)?.trim();
    if (text) return text;
  } catch {
    /* use fallback */
  }
  return buildSituationFallback(messages);
}

export function AIView() {
  const {
    getStateLaw,
    aiPrefill,
    setAiPrefill,
    tryUseAi,
    incrementAiUsage,
    setLetterTypePrefill,
    setLetterDetailsPrefill,
    navigate,
  } = useApp();

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handingOff, setHandingOff] = useState(false);

  const law = getStateLaw();
  const welcome = law
    ? `Hi! I'm your renter rights advisor. I can see you're in ${law.name} — I'll tailor my answers to your state's specific laws, including the ${law.depositDays} deposit return rule, ${law.noticeDays} entry notice requirement, and ${law.rentControl ? "rent control protections" : "the absence of statewide rent control"}. What do you need help with?`
    : "Hi! I'm your renter rights advisor. Ask me anything — about repairs, deposits, evictions, lease terms, or what your landlord is or isn't allowed to do. If you've selected your state above, I'll tailor my answers to your local laws.";

  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  useEffect(() => {
    if (aiPrefill) {
      setInput(aiPrefill);
      setAiPrefill("");
    }
  }, [aiPrefill, setAiPrefill]);

  const goToLetter = async (type: LetterType) => {
    if (handingOff) return;
    setHandingOff(true);
    setLetterTypePrefill(type);
    try {
      const situation = await summarizeSituationForLetter(messages, law);
      setLetterDetailsPrefill(situation);
      navigate("/letter");
    } finally {
      setHandingOff(false);
    }
  };

  const sendAI = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q) return;
    if (!tryUseAi()) return;

    setInput("");
    incrementAiUsage();
    const userMsg: DisplayMessage = { role: "user", content: q };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const apiMessages = nextHistory.map(({ role, content }) => ({
        role,
        content,
      }));
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          stateContext: law,
        }),
      });
      const data = await resp.json();
      const raw =
        data.content?.[0]?.text ||
        data.error ||
        "Sorry, I had trouble responding. Please try again.";

      const parsed = parseAssistantReply(raw);
      const letterType =
        parsed.letterType ??
        (data.error ? null : inferLetterType(q, parsed.content));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: parsed.content,
          letterType,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
        },
      ]);
    }
    setLoading(false);
  };

  const askQuestion = (q: string) => {
    void sendAI(q);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">AI Advisor</div>
        <h1 className="page-title">Ask anything about your rental</h1>
        <p className="page-sub">
          Get plain-English answers about your rights, your landlord&apos;s obligations, and what to do
          next — based on your state&apos;s laws.
        </p>
      </div>

      <div className="callout callout-amber">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          This is AI-generated information, not legal advice. For evictions, lawsuits, or urgent
          situations, contact a tenant attorney or local legal aid organization.
        </div>
      </div>

      <div className="ai-panel">
        <div className="ai-messages" id="ai-messages">
          <div className="msg msg-ai">
            <div className="msg-avatar">AI</div>
            <div className="msg-bubble" id="ai-welcome">
              {welcome}
            </div>
          </div>
          {messages.map((m, i) => (
            <div className={`msg msg-${m.role === "user" ? "user" : "ai"}`} key={i}>
              <div className="msg-avatar">{m.role === "user" ? "You" : "AI"}</div>
              <div className="msg-bubble">
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                {m.role === "assistant" &&
                m.letterType &&
                i === lastAssistantIndex &&
                !loading ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 12 }}
                    disabled={handingOff}
                    onClick={() => void goToLetter(m.letterType!)}
                  >
                    {handingOff
                      ? "Preparing your situation…"
                      : `${LETTER_LABELS[m.letterType]} →`}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="msg msg-ai">
              <div className="msg-avatar">AI</div>
              <div className="msg-bubble">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="ai-input-row">
          <input
            type="text"
            id="ai-input"
            placeholder="e.g. How long does my landlord have to return my deposit?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void sendAI();
            }}
          />
          <button
            className="ai-send-btn"
            id="ai-send-btn"
            type="button"
            disabled={loading}
            onClick={() => void sendAI()}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send
          </button>
        </div>
      </div>

      <div className="sec-label">Common questions</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button
          className="btn btn-sm"
          type="button"
          onClick={() => askQuestion("Can my landlord enter my apartment without telling me?")}
        >
          Can my landlord enter without notice?
        </button>
        <button
          className="btn btn-sm"
          type="button"
          onClick={() =>
            askQuestion("My landlord hasn't returned my security deposit. What can I do?")
          }
        >
          Deposit not returned
        </button>
        <button className="btn btn-sm" type="button" onClick={() => askQuestion("Is my rent increase legal?")}>
          Is my rent increase legal?
        </button>
        <button
          className="btn btn-sm"
          type="button"
          onClick={() =>
            askQuestion("My landlord is threatening to evict me. What are my rights?")
          }
        >
          Eviction threat — my rights
        </button>
        <button
          className="btn btn-sm"
          type="button"
          onClick={() => askQuestion("There is mold in my apartment. What are my rights?")}
        >
          Mold in my apartment
        </button>
        <button
          className="btn btn-sm"
          type="button"
          onClick={() => askQuestion("My landlord refuses to fix the heat. What can I do?")}
        >
          Landlord won&apos;t fix heat
        </button>
      </div>
    </>
  );
}
