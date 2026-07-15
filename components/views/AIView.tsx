"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context/AppProvider";
import type { ChatMessage } from "@/types";

export function AIView() {
  const {
    getStateLaw,
    aiPrefill,
    setAiPrefill,
    tryUseAi,
    incrementAiUsage,
    showToast,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const law = getStateLaw();
  const welcome = law
    ? `Hi! I'm your renter rights advisor. I can see you're in ${law.name} — I'll tailor my answers to your state's specific laws, including the ${law.depositDays} deposit return rule, ${law.noticeDays} entry notice requirement, and ${law.rentControl ? "rent control protections" : "the absence of statewide rent control"}. What do you need help with?`
    : "Hi! I'm your renter rights advisor. Ask me anything — about repairs, deposits, evictions, lease terms, or what your landlord is or isn't allowed to do. If you've selected your state above, I'll tailor my answers to your local laws.";

  useEffect(() => {
    if (aiPrefill) {
      setInput(aiPrefill);
      setAiPrefill("");
    }
  }, [aiPrefill, setAiPrefill]);

  const sendAI = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q) return;
    if (!tryUseAi()) return;

    setInput("");
    incrementAiUsage();
    const userMsg: ChatMessage = { role: "user", content: q };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory,
          stateContext: law,
        }),
      });
      const data = await resp.json();
      const answer =
        data.content?.[0]?.text ||
        data.error ||
        "Sorry, I had trouble responding. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
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
              <div className="msg-bubble">{m.content}</div>
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
